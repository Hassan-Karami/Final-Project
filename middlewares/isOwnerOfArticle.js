const User = require("../models/User");
const Article = require("../models/Article");
const {AppError} = require("../utils/AppError");

const isOwnerOfArticle = async(req,res,next) =>{
    const articleId = req.params.id;
    const requsterUser = await User.findById(req.session.user._id);

    const targetArticle = await Article.findById(articleId);
    if(!!targetArticle && requsterUser.role === "admin"){
      return next();
    }
    if (
      !targetArticle ||
      targetArticle.author.toString() !== req.session.user._id
    ) {
      return next(new AppError("you are not the owner of this article.", 403));
    }   
    next();
}


module.exports = {isOwnerOfArticle};