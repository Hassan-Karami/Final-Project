const Article = require("../models/Article")
const {AppError}= require("../utils/AppError");
const {
  articleThumbnailUpload, userAvatarUpload,
} = require("../utils/multer-settings");




const getAllArticles= async (req,res,next)=>{
    try{
        const articles = await Article.find({}).populate("author","_id firstName lastName username");
        res.status(200).json(articles);
    }catch(error){
        console.log(error);
        next(new AppError('internal error',500));
    }

}

const createArticle= async (req,res,next)=>{
    try{
        const articleBody = {
            title:req.body.title,
            content:req.body.content,
            author:req.body.author,
            thumbnail:req.body.thumbnail,
            outline: req.body.outline,
            images: req.body.images,
        }
        const newArticle = await Article.create(articleBody);
        res.status(201).json(newArticle);
    }catch(error){
        console.log(error);
        next(new AppError('internal error',500));
    }
}



//Upload thumbnail
const uploadThumbnail = async (req, res, next) => {
  const uploadArticeThumbnail = articleThumbnailUpload.single("thumbnail");

  uploadArticeThumbnail(req, res, async (err) => {
    if (err) {
      if (err.message) {
        console.log(err.message);
        return next(new AppError(err?.message, 400));
      }
      return next(new AppError("server error!", 500));
    }

    if (!req.file) return res.status(400).send("File not send!");
    next();
  });
};


 

module.exports = {
  getAllArticles,
  createArticle,
  uploadThumbnail,
};