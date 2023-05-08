const mongoose = require("mongoose");
const User = require("../models/User");
const {AppError} = require("../utils/AppError");


const updateUserValidation = async (req,res,next)=>{
    const id= req.params.id?.trim();
    //id validation
    if(!id) next(new AppError("id is not valid(empty id)",400));
    //not found validation
    const targetUser = await User.findById(id);
    if(!targetUser) next(new AppError("user not found",404));
    console.log(req.body);
    const { firstName, lastName, username, role, gender } = req.body;
    //firstname validation
    if(!!firstName) {
      
        if(!firstName?.trim()) next(new AppError("firstname is required",400));
        if(typeof firstName !== "string") next(new AppError("firstname must be string",400));
        if(firstName?.trim().length<3 || firstName.length>30) next(new AppError("firstname length must be betweeb 3 and 30",400));
    }
    //lastName validation
     if (!!lastName) {
       if (!lastName?.trim()) next(new AppError("lastName is required",400));
       if (typeof lastName !== "string")
         next(new AppError("lastName must be string",400));
       if (lastName.length < 3 || lastName.length > 30)
         next(new AppError("lastName length must be betweeb 3 and 30",400));
     }
     
     //username validation
     if(!!username){
        if (!username?.trim()) next(new AppError("username is required",400));
        if (typeof username !== "string")
          next(new AppError("username must be string",400));
        if (username.length < 3 || username.length > 30)
          next(new AppError("username length must be betweeb 3 and 30",400));
        const duplicateUser = await User.findOne({username:req.body.username});
        if(duplicateUser) next(new AppError("this username already exist",409));
     }

    //gender validation
    if(!!gender){
        const validGenderInput = ["male","female","not_set"];
        if(!validGenderInput.includes(gender)) next(new AppError("non valid gender input",400))
    }
    //role validation
    if(!!role){
        const roleValidateInput = ["admin","blogger"];
        if(!roleValidateInput.includes(role)) next(new AppError("non valid role input",400));
    }
    next();
}


module.exports = { updateUserValidation };