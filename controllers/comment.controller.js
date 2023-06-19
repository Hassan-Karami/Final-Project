const { asyncHandler } = require("../utils/async-handler")
const { paginate } = require("../utils/pagination");
const Article = require("../models/Article");
const Comment = require("../models/Comment");
const {checkIfFileExists} = require("../services/checkFileExistance");
const { AppError } = require("../utils/AppError");

//CREATE comment
const createComment = asyncHandler(async (req,res,next) =>{
  
    const { content, articleId } = req.body;
    const targetArticle = await Article.findById(articleId);
    console.log(req.body);
    //check if article exists
    if(!targetArticle){
       return next(new AppError("Article not found", 404))
    } 
    const newComment = await Comment.create({content , article: articleId , user : req.session.user._id});
    
    await Article.findByIdAndUpdate(articleId, {
      $push: { comments: newComment._id },
    });
    res.status(201).send(newComment);
})

//GET comment by id
const getCommentById = asyncHandler(async (req, res, next) => {
 const {commentId} = req.params; 
 const targetComment = await Comment.findById(commentId);
 res.status(200).send(targetComment)
});

//GET all comments
const getAllComments = asyncHandler(async (req, res, next) => {
  let {page , limit} = req.query;
  if (!limit) limit = 3;
  if (!page) page = 1;
  let query = Comment.find()
    .populate("article", " _id title ")
    .populate("user", "_id firstName lastName");
    const total = await Comment.countDocuments();
    const pages = Math.ceil(total / limit || 1);
    const comments = await paginate(query, page, limit);
   
    res.status(200).json({ total: total, pages: pages, data: comments });

});

//GET all my comments
const getAllMyComments = asyncHandler(async (req, res, next) => {
 const userId = req.session.user._id;
 let comments = await Comment.find({ user: userId });
 res.status(200).send(comments);
});

//Update comment
const updateComment = asyncHandler(async (req, res, next) => {
 const {commentId} = req.params;
 const {content} = req.body;
 const updatedComment = await Comment.findByIdAndUpdate(
  commentId,
   { $set: { content } },
   { new: true }
 );
 res.status(200).send(updatedComment);
});

//Delete comment
const deleteComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;
  await Comment.findByIdAndDelete(commentId);
  res
    .status(200)
    .send({ message: `comment with id ${commentId} deleted successfully` });
});





module.exports = {
  createComment,
  getAllComments,
  getCommentById,
  getAllMyComments,
  updateComment,
  deleteComment,
};