const Article = require("../models/Article")
const {AppError}= require("../utils/AppError");


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









module.exports={getAllArticles,createArticle};