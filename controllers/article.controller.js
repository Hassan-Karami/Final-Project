const Article = require("../models/Article");
const {checkIfFileExists} = require("../services/checkFileExistance");
const { AppError } = require("../utils/AppError");
const sharp = require("sharp");
const { asyncHandler } = require("../utils/async-handler");
const { join } = require("node:path");
const fs = require("fs/promises");
const {multerUpload,} = require("../utils/multer-settings");

const getAllArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({}).populate(
      "author",
      "_id firstName lastName username"
    );
    res.status(200).json(articles);
  } catch (error) {
    console.log(error);
    next(new AppError("internal error", 500));
  }
};


const articleThumbnailDefault = "default-article-thumbnail.jpeg";

const uploadArticleImages = multerUpload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

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

const allMyArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({
      author: req.session.user._id,
    });
    res.status(200).send(articles);
  } catch (error) {
    console.log(error);
    next(new AppError("internal error", 500));
  }
};

const getArticleById = asyncHandler(async (req, res, next) => {
  const articleId = req.params.id;
  const targetArticle = await Article.findById(articleId).populate("author");
  res.status(200).json(targetArticle);
});

const updateArticle = asyncHandler(async (req, res, next) => {
  const updateBody = {};
  const articleId = req.params.id;
  const targetArticle = await Article.findById(articleId);
  const { title, content } = req.body;
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
      fs.unlink(oldThumbnailPath);
    }
  }
  //update images
  if (!!req.files.images && req.files.images.length > 0) {
    const newImagesName = await resizeArticleImages(articleId, req.files);
    updateBody.images = newImagesName;
    for (let image of targetArticle.images) {
      await fs.unlink(
        join(__dirname, `../public/images/articles/images/${image}`)
      );
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
 

  await Article.findByIdAndDelete(articleId);
  res.status(200).send({ message: `article with id ${articleId} deleted successfully` });
});

const logReq = asyncHandler(async (req, res, next) => {
  // console.log(req.body);
  console.log("111111111111111111111111111111111111111111111111111111111");
  console.log(req.files);
  next();
});

module.exports = {
  getAllArticles,
  uploadArticleImages,
  createArticle,
  allMyArticles,
  getArticleById,
  updateArticle,
  deleteArticleById,
  logReq,
};
