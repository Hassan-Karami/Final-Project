const mongoose = require("mongoose");
const User = require("../models/User");
const Article = require("../models/Article");
const Comment = require("../models/Comment");
const { userAvatarUpload } = require("../utils/multer-settings");
const { checkIfFileExists } = require("../services/checkFileExistance");
const { AppError } = require("../utils/AppError");
const { paginate } = require("../utils/pagination");
const {articleRemover} = require("../services/article.services");
const fs = require("fs/promises");
const path = require("path");
const { isValidObjectId } = require("../validations/ObjectIdValidation");



//GET all users
const getAllUsers = async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    if (!limit) limit = 3;
    if (!page) page = 1;
    const query = User.find({role:{$ne: "admin"}}, { password: 0, __v: 0 }).sort({
      registration_date: -1,
    });
    const total = await User.countDocuments(query);
    const pages = Math.ceil(total / limit || 1);
    const usersList = await paginate(query, page, limit);
    res.status(200).send({ total: total, pages: pages, data: usersList });
    
  } catch (error) {
    console.log(error);
    next(new AppError("internal Error", 500));
  }
};

//Get user by userId
const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if(!isValidObjectId(userId)){
      return next(new AppError("user id is not valid",400));
    }
    const targetUser = await User.findById(userId, {
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



//CREATE user
const createUser = async (req, res, next) => {
  const userCreationBody = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    role: req.body.role,
    gender: req.body.gender,
    phone_number: req.body.phone_number,
    username: req.body.username,
    password: req.body.password,
    avatar: "/images/defaultProfileImage.png",
  };
  try {
    const newUser = await User.create(userCreationBody);
    res.status(201).send(newUser);
  } catch (error) {
    console.log(error);
    next(new AppError("internal error", 500));
  }
};




//DELETE user BY UserId
const deleteUserById = async (req, res, next) => {
  try {
    const {userId} = req.params;
     if (!isValidObjectId(userId)) {
       return next(new AppError("user id is not valid", 400));
     }
    const targetUser = await User.findById(userId);
    //check articles and remove them if exist
    const userArticles = await Article.find({author: userId});
    console.log(userArticles);
    //delete articles of user
    if (userArticles && userArticles.length > 0) {
      for (let i = 0; i < userArticles.length; i++) {
        articleRemover(userArticles[i]._id);
      }
    }

    // //delete all comments of the user
    await Comment.deleteMany({ user: userId });

    const deletedUser = await User.findByIdAndDelete(userId, {
      new: true,
    });
    if (!deletedUser) {
      return next(new AppError("user not found", 404));
    }
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
    res.status(200).send(deletedUser);
  } catch (error) {
    console.log(error);
    next(new AppError("internal Error", 500));
  }
};


//UPDATE user info By userId
const updateUserById = async (req, res, next) => {
  try {
    const {userId} = req.params;
     if (!isValidObjectId(userId)) {
       return next(new AppError("user id is not valid", 400));
     }
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


//updateUserPassword by userId
const updateUserPassswordById = async (req, res, next) => {

  const {userId} = req.params;
   if (!isValidObjectId(userId)) {
     return next(new AppError("user id is not valid", 400));
   }
  const targetUser = await User.findById(userId);
  const { current_password, new_password } = req.body;
  if (!current_password?.trim() || !new_password?.trim()) {
    return next(
      new AppError("password update fields are not allowed to be empty", 400)
    );
  }

  const isMatch = await targetUser.validatePassword(req.body.current_password);
  if (!isMatch) {
    return next(new AppError("current password is not correct", 404));
  }

  await User.findByIdAndUpdate(userId, { password: new_password });
  res.status(200).send({ message: "password updated successfully" });
};


//Upload Avatar By UserId
const uploadAvatarById = async (req, res, next) => {
  const uploadUserAvatar = userAvatarUpload.single("avatar");
  const {userId} = req.params;
   if (!isValidObjectId(userId)) {
     return next(new AppError("user id is not valid", 400));
   }
  const targetUser = await User.findById(userId);

  uploadUserAvatar(req, res, async (err) => {
    if (err) {
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
          await fs.unlink(
            path.join(__dirname, "../public", targetUser.avatar)
          );
          console.log("file exist");
        } else {
          console.log("file doesnt existttt");
        }
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { avatar: "/images/userAvatars/" + req.file.filename },
        { new: true }
      );

      // return res.json(user);
      res.redirect("http://localhost:9000/dashboard");
    } catch (err) {
      console.log(err);
      next(new AppError("server Error", 500));
    }
  });
};











module.exports = {
  getAllUsers,
  createUser,
  deleteUserById,
  getUserById,
  updateUserById,
  updateUserPassswordById,
  uploadAvatarById,
};
