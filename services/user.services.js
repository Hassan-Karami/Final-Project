const mongoose = require("mongoose");
const User = require("../models/User");
const { AppError } = require("../utils/AppError");
const { userAvatarUpload } = require("../utils/multer-settings");
const fs = require("fs/promises");
const path = require("path");



//GET single user
const getAccount = async (userId) => {
  try {

    const targetUser = await User.findById(userId, {
      password: 0,
    }).populate("articles");
    if (!targetUser) {
          req.session.destroy();
          return next(new AppError("user not found", 404));
        }
    return targetUser;
  } catch (error) {
    console.log(error);
    next(new AppError("internal Error", 500));
  }
};

//to do :import delete articleByid and delete commmetsByid and use them in deleteUser


//DELETE user
const deleteUser = async (userId) => {
  try {
    const targetUser = await User.findById(userId);
    // delete current avatar
    if (
      targetUser.avatar &&
      targetUser.avatar !== "/images/defaultProfileImage.png"
    ) {
      const filePath = path.join(
        __dirname,
        "../public",
        targetUser.avatar
      );

      const fileExists = await checkIfFileExists(filePath);
      if (fileExists) {
        await fs.unlink(filePath);
      }
    }

    const deletedUser = await User.findByIdAndDelete(userId, {
      new: true,
    });

    return "successful";
  } catch (error) {
    console.log(error);
  }
};

//UPDATE user
const updateUser = async (userId) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
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