const User = require("../models/User");
const Article = require("../models/Article");
const Comment = require("../models/Comment");
const {AppError} = require("../utils/AppError");

const isOwnerOfComment = async(req,res,next) =>{
   
    const requsterUser = await User.findById(req.session.user._id);
    if(requsterUser.role === "admin"){
      return next();
    }

   
     const { commentId } = req.params;
    const targetComment = await Comment.findById(commentId);
    if (
      !targetComment ||
      targetComment.user.toString() !== req.session.user._id
    ) {
      return next(new AppError("you are not the owner of this comment.", 403));
    }   
    next();
}


module.exports = { isOwnerOfComment };