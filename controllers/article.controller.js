const mongoose = require("mongoose");
const Article = require("../models/Article");
const {paginate} = require("../utils/pagination")
const {checkIfFileExists} = require("../services/checkFileExistance");
const { AppError } = require("../utils/AppError");
const sharp = require("sharp");
const { asyncHandler } = require("../utils/async-handler");
const { join } = require("node:path");
const fs = require("fs/promises");
const {multerUpload,} = require("../utils/multer-settings");
const Comment = require("../models/Comment");
const { isValidObjectId } = require("../validations/ObjectIdValidation");



//CREATE article
const createArticle = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const userId = req.session.user._id;
  const { title, content } = req.body;
  const description = content.substring(0, 20) + "...";

  const article = await Article.create({
    title,
    description,
    content,
    author: userId,
  });

  const articleThumbnail = await resizeArticleThumbnail(article._id, req.files);
  const articleImages = await resizeArticleImages(article._id, req.files);

  article.thumbnail = articleThumbnail ?? articleThumbnailDefault;
  article.images = articleImages;
  await article.save({ validateBeforeSave: false });

  res.status(201).json({
    status: "success",
    data: { article },
  });
});

//GET all articles
const getAllArticles = async (req, res, next) => {
  let {page , limit} = req.query;
  if(!limit) limit = 3;
  if(!page) page = 1;
  let query;
  
  try {
    const searchText = req.query.search;
    if(!!searchText){
        query = Article.find({title: {$regex: searchText, $options:"i"}})
        .populate("author", "_id firstName lastName username")
        .populate("comments", "_id firstName lastName avatar")
        .sort({ registration_date: -1 }); 
    }
    else{
        query = Article.find({})
        .populate("author", "_id firstName lastName username")
        .populate("comments", "_id firstName lastName avatar")
        .sort({ registration_date: -1 });
    }
     
   const total = await Article.countDocuments(query);
   const pages = Math.ceil(total/limit || 1);
  const articles = await paginate(query, page,limit);
    res.status(200).json({total: total ,pages: pages , data: articles});
  } catch (error) {
    console.log(error);
    next(new AppError("internal error", 500));
  }
};


//GET all my articles
const allMyArticles = async (req, res, next) => {
   let { page, limit } = req.query;
   if (!limit) limit = 3;
   if (!page) page = 1;
  try {
    const query = Article.find({
      author: req.session.user._id,
    }).sort({ registration_date: -1 });
    const total = await Article.countDocuments();
    const pages = Math.ceil(total / limit || 1);
    const articles = await paginate (query,page, limit)
    res.status(200).send({ total: total, pages: pages, data: articles });
  } catch (error) {
    console.log(error);
    next(new AppError("internal error", 500));
  }
};

//GET article by id
const getArticleById = asyncHandler(async (req, res, next) => {
  const articleId = req.params.id;
   if (!isValidObjectId(articleId)) {
     return next(new AppError("article id is not valid", 400));
   }
  const targetArticle = await Article.findById(articleId).populate("author").populate("comments","_id");
  res.status(200).json(targetArticle);
});

//UPDATE article
const updateArticle = asyncHandler(async (req, res, next) => {
  const updateBody = {};
  const articleId = req.params.id;
   if (!isValidObjectId(articleId)) {
     return next(new AppError("article id is not valid", 400));
   }
  
  const targetArticle = await Article.findById(articleId);
  const { title, content } = req.body;
  console.log("req.files is:");
  console.log(req.files);
  //update thumbnail
  if (req.files) {
    if (!!req.files.thumbnail) {
      const newThumbnailName = await resizeArticleThumbnail(
        articleId,
        req.files
      );
      updateBody.thumbnail = newThumbnailName;
      oldThumbnailPath = join(
        __dirname,
        `../public/images/articles/thumbnails/${targetArticle.thumbnail}`
      );
      const isExisted = await checkIfFileExists(oldThumbnailPath);
      if(!!isExisted){fs.unlink(oldThumbnailPath);}
      
    }
  }
  //update images
  if (!!req.files.images && req.files.images.length > 0) {
    const newImagesName = await resizeArticleImages(articleId, req.files);
    updateBody.images = newImagesName;
    //delete old images
    for (let image of targetArticle.images) {
      const oldImageFilePath = join( __dirname,`../public/images/articles/images/${image}`);
      //check if this path is existed now?
      const isExisted = await checkIfFileExists(oldImageFilePath);
      if(!!isExisted){
        await fs.unlink(oldImageFilePath);}
     ;
    }
  }
  //update body info
  if (!!title) updateBody.title = title;
  if (!!content) {
    updateBody.content = content;
    updateBody.description = content.substring(0, 20) + "...";
  }
  const newArticle = await Article.findByIdAndUpdate(articleId, updateBody);
  res.status(200).send(newArticle);
});


//DELETE Article
const deleteArticleById = asyncHandler(async (req, res, next) => {
  const articleId = req.params.id;
   if (!isValidObjectId(articleId)) {
     return next(new AppError("article id is not valid", 400));
   }
  const targetArticle = await Article.findById(articleId);
  //delete thumbnail
  const thumbnailFilePath = join(
    __dirname,
    `../public/images/articles/thumbnails/${targetArticle.thumbnail}`
  );
  const thumbnailFileExist = await checkIfFileExists(thumbnailFilePath);
  console.log("thumbnail exist result is: ");
  console.log(thumbnailFileExist);
  if (thumbnailFileExist) {
    await fs.unlink(thumbnailFilePath);
  };
  console.log("images exist result is: ");
  //delete images
  if(!!targetArticle.images && targetArticle.images.length>0) {
     for (let image of targetArticle.images) {
       const imagePath = join(
         __dirname,
         `../public/images/articles/images/${image}`
       );
       const imageFileExist = await checkIfFileExists(imagePath);
       console.log(imageFileExist);
       if (imageFileExist) {
         await fs.unlink(imagePath);
       }
     }
  }
  //delete comments under the article
  await Comment.deleteMany({article : articleId});
  
  await Article.findByIdAndDelete(articleId);
  res.status(200).send({ message: `article with id ${articleId} deleted successfully` });
});


//Get Comments of an article by articleId
const getCommentsOfAnArticle = asyncHandler(async (req, res, next) => {
  const articleId = req.params.id;
   const targetArticle = await Article.findById(articleId);
   if(!targetArticle){
     return next(new AppError(`article with id ${articleId} doesnt exist`,404))
    }
  const comments = await Comment.find({
    article: articleId,
  }).populate({ path: "user", select: "-password" });
  res.status(200).json(comments);
}); 



//parse thumbnail and images fields by multer 
const articleThumbnailDefault = "default-article-thumbnail.jpeg";
const uploadArticleImages = multerUpload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);


//Resize Article thumbnai by Sharp 
const resizeArticleThumbnail = async (articleId, files) => {
  const { thumbnail = [] } = files;

  if (!thumbnail.length) return null;
  //make thumbname name(just text) that will stores in database
  const articleThumbnailFilename = `articles-${articleId}-${Date.now()}.jpeg`;
  //resize and format thumbnail and store its file
  await sharp(thumbnail[0].buffer)
    .resize(1200, 800)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(
      join(
        __dirname,
        `../public/images/articles/thumbnails/${articleThumbnailFilename}`
      )
    );

  return articleThumbnailFilename;
};



//Resize Article Image by Sharp
const resizeArticleImages = async (articleId, files) => {
  const { images = [] } = files;

  if (!images.length) return images;

  const articleImagesFilenames = await Promise.all(
    images.map(async (image, index) => {
      const imageFilename = `articles-${articleId}-${Date.now()}-${
        index + 1
      }.jpeg`;

      await sharp(image.buffer)
        .resize(1000, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(
          join(__dirname, `../public/images/articles/images/${imageFilename}`)
        );

      return imageFilename;
    })
  );

  return articleImagesFilenames;
};

module.exports = {
  getAllArticles,
  uploadArticleImages,
  createArticle,
  allMyArticles,
  getArticleById,
  updateArticle,
  deleteArticleById,
  getCommentsOfAnArticle,
};
