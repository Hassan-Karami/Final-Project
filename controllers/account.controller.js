const mongoose = require("mongoose");
const User = require("../models/User");
const { AppError } = require("../utils/AppError");
const { userAvatarUpload } = require("../utils/multer-settings");
const fs = require("fs/promises");
const path = require("path");


//GET single user
const getAccount = async (req, res, next) => {
  try {

    const targetUser = await User.findById(req.session.user._id, {
      password: 0,
    }).populate("articles");
    if (!targetUser) {
          req.session.destroy();
          return next(new AppError("user not found", 404));
        }
    res.status(200).send(targetUser);
  } catch (error) {
    console.log(error);
    next(new AppError("internal Error", 500));
  }
};


//DELETE user
const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.session.user._id, {
      new: true,
    });
    if (!deletedUser) {
      return next(new AppError("user not found", 404));
    }
    // delete current avatar
    if (
      req.session.user.avatar &&
      req.session.user.avatar !== "/images/defaultProfileImage.png"
    ) {
      const filePath = path.join(
        __dirname,
        "../public",
        req.session.user.avatar
      );
      const fileExists = await checkIfFileExists(filePath);
      if (fileExists) {
        await fs.unlink(
          path.join(__dirname, "../public", req.session.user.avatar)
        );
      } 
    }
    req.session.destroy();
    res.status(200).send(deletedUser);
  } catch (error) {
    console.log(error);
    next(new AppError("internal Error", 500));
  }
};

//UPDATE user
const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.session.user._id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return next(new AppError("user not found", 404));
    }
    res.status(200).send(updatedUser);
  } catch (error) {
    console.log(error);
    next(new AppError("internal Error", 500));
  }
};

//updateUserPassword
const updateUserPasssword = async (req,res,next)=>{
  const userId= req.session.user._id;
  const targetUser = await User.findById(userId);
  const {current_password,new_password}= req.body;
  if(!current_password?.trim() || !new_password?.trim()){
    return next(new AppError("password update fields are not allowed to be empty",400))
  }
   const isMatch = await targetUser.validatePassword(req.body.current_password);
    if (!isMatch) {
      return next(new AppError("current password is not correct", 404));
    }

    await User.findByIdAndUpdate(userId,{password: new_password});
    res.status(200).send({message: "password updated successfully"});
}

//Upload Avatar
const uploadAvatar = async (req, res, next) => {
  const uploadUserAvatar = userAvatarUpload.single("avatar");

  uploadUserAvatar(req, res, async (err) => {

    if (err) {
      //delete if save with error
      // if (req.file) await fs.unlink(path.join(__dirname, "../public", req.file.filename))
      if (err.message) {
        console.log(err.message);
        return next(new AppError(err?.message, 400));
      }
      return next(new AppError("server error!", 500));
    }

    if (!req.file) return res.status(400).send("File not send!");
    console.log(req.file);

    try {
      // delete old avatar
      if (
        req.session.user.avatar &&
        req.session.user.avatar !== "/images/defaultProfileImage.png"
      ) {
        const filePath = path.join(
          __dirname,
          "../public",
          req.session.user.avatar
        );
        const fileExists = await checkIfFileExists(filePath);
        if (fileExists) {
          await fs.unlink(
            path.join(__dirname, "../public", req.session.user.avatar)
          );
          console.log("file exist");
        }
        
       else {
        console.log("file doesnt existttt");
      }
    }

    const user = await User.findByIdAndUpdate(
      req.session.user._id,
      { avatar: "/images/userAvatars/" + req.file.filename },
      { new: true }
    );

      
  
      req.session.user.avatar =user.avatar;

      // return res.json(user);
      res.redirect("http://localhost:9000/dashboard");
    } catch (err) {
      console.log(err);
      next(new AppError("server Error", 500));
    }
  });
};


async function checkIfFileExists(filePath) {
  try {
    await fs.stat(filePath);
    return true; // File exists
  } catch (error) {
    if (error.code === "ENOENT") {
      return false; // File does not exist
    } else {
      console.log(error);
      res.status(500).send("server error");
    }
  }
}





module.exports = {
  getAccount,
  deleteUser,
  updateUser,
  uploadAvatar,
  updateUserPasssword,
  
};