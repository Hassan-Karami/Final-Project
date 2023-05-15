const { AppError } = require("../utils/AppError")
const isLoggedIn =(req,res,next)=>{
    if(req.session.user){
        return next();
    }
    next(new AppError("you are not logged in",401));
}

module.exports = {isLoggedIn};