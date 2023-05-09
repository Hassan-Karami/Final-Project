const mongoose = require("mongoose");
const User = require("../models/User");
const {AppError} = require("../utils/AppError");



const updateUserValidation = async (req,res,next)=>{
  

   try {
     const id = req.params.id?.trim();
     //id validation
     if (!id){ return next(new AppError("id is not valid(empty id)", 400));}
     //not found validation
     const targetUser = await User.findById(id);
     if (!targetUser){ return next(new AppError("user not found", 404));} 
     const { firstName, lastName, username, role, gender } = req.body;
     const keys = Object.keys(req.body);
     //firstname validation
     console.log(req.body);
   if(keys.includes("firstName")){
    
        if (!firstName?.trim()){return next(new AppError("firstname is required", 400));}
          
        if (typeof firstName !== "string"){return next(new AppError("firstname must be string", 400)); }
          
        if (firstName?.trim().length < 3 || firstName.length > 30){
          return next(
            new AppError("firstname length must be betweeb 3 and 30", 400)
          );
        }
          
   }
     
     //lastName validation
       if (!lastName?.trim()){
         return next(new AppError("lastName is required", 400));
       } 
       if (typeof lastName !== "string"){
         return next(new AppError("lastName must be string", 400));
       }
         
       if (lastName.length < 3 || lastName.length > 30){
         return next(
           new AppError("lastName length must be betweeb 3 and 30", 400)
         );
       }
         
     

     //username validation
       if (!username?.trim()){
         return next(new AppError("username is required", 400));
       } 
       if (typeof username !== "string"){
         return next(new AppError("username must be string", 400));
       }
         
       if (username.length < 3 || username.length > 30){
         return next(
           new AppError("username length must be betweeb 3 and 30", 400)
         );
       }
         
       const duplicateUser = await User.findOne({
         _id: { $ne: new mongoose.Types.ObjectId(id) },
         username: req.body.username,
       });
       if (duplicateUser){
         return next(new AppError("this username already exists", 400));
       }
         
     
     //gender validation
       const validGenderInput = ["male", "female", "not_set"];
       if (!validGenderInput.includes(gender)){
         return next(new AppError("non valid gener input", 400));
       }
     
     //role validation
       const roleValidateInput = ["admin", "blogger"];
          if (!roleValidateInput.includes(role)){return next(new AppError("non valid role input", 400));}
         
     next();
    
   } catch (error) {
      console.log(error?.message);
      next(new AppError("internal error(update validation catch error)",500))
   }
}


module.exports = { updateUserValidation };