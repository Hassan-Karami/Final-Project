const mongoose = require("mongoose");
const User = require("../models/User");
const { AppError } = require("../utils/AppError");
const { userAvatarUpload } = require("../utils/multer-settings");
const fs = require("fs/promises");
const path = require("path");

//GET all bloggers
const getAllUsers = async (req, res, next) => {
  try {
    const usersList = await User.find({},{password:0,__v:0});
    res.status(200).send(usersList);
  } catch (error) {
    console.log(error);
    next(new AppError("internal Error", 500));
  }
};

//GET single user
const getSingleUser = async (req, res, next) => {
  try {
    const targetUser = await User.findById(req.params.id, { password: 0 });
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


//signup User
const  signupUser = async (req,res,next)=>{
    const userSignupBody = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      role: "blogger",
      gender: req.body.gender,
      phone_number: req.body.phone_number,
      username: req.body.username,
      password: req.body.password,
      avatar: "/images/defaultProfileImage.png",
    };
    try {
      const newUser = await User.create(userSignupBody);
      res.status(201).send(newUser);
    } catch (error) {
      console.log(error);
      next(new AppError("internal error", 500));
    }
}

//DELETE user
const deleteUser = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const deletedUser = await User.findByIdAndDelete(req.params.id, {
      new: true,
    });
    if (!deletedUser) {
      return next(new AppError("user not found", 404));
    }
    res.status(200).send(deletedUser);
  } catch (error) {
    console.log(error);
    next(new AppError("internal Error", 500));
  }
};

//UPDATE user
const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
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

//LOGIN user
const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    targetUser = await User.findOne({ username: req.body.username });
    if (!targetUser) {
      return next(new AppError("username or password is not matched", 404));
    }
    const isMatch = await targetUser.validatePassword(req.body.password);
    if (!isMatch) {
      return next(new AppError("username or password is not matched", 404));
    }
    req.session.user = { _id: targetUser._id, avatar: targetUser.avatar };
    console.log(req.session.user);
    res.status(200).send(req.session.user);
  } catch (error) {
    next(new AppError("internal error", 500));
  }
};

//LOGOUT user
const logOutUser = (req, res, next) => {

  req.session.destroy();
  res.status(200).send({ message: "logout successfull" });
};

//check session
const checkSession = (req, res, next) => {
  try {
    if (!req.session.user) {
      return next(new AppError("You are not logged in", 500));
    }
    res.status(200).send(req.session.user);
  } catch (error) {
    next(new AppError("internal error(check session fd)", 500));
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
    if(!(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(new_password))){
      return next(new AppError("Password must have at least 8 characters containing at least 1 letter and 1 digit.",400))
    }
    await User.findByIdAndUpdate(userId,{password: new_password});
    res.status(200).send("password updated successfully");
    
}

//Upload Avatar
const uploadAvatar = async (req, res, next) => {
  const uploadUserAvatar = userAvatarUpload.single("avatar");

  uploadUserAvatar(req, res, async (err) => {
    console.log(req.body);
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
        {
          avatar: "/images/userAvatars/" + req.file.filename,
        },
        { new: true }
      );

      req.session.user.avatar = user.avatar;

      // return res.json(user);
      res.redirect("http://localhost:9000/dashboard");
    } catch (err) {
      console.log(err);
      next(new AppError("server Error", 500));
    }
  });
};

const bulkUpload = (req, res, next) => {
  const uploadUserAvatar = userAvatarUpload.array("gallery");

  uploadUserAvatar(req, res, async (err) => {
    if (err) {
      if (err.message) {
        console.log(err.message);
        return next(new AppError(err?.message, 400));
      }
      console.log(err);
      return next(new AppError("server error", 500));
    }

    console.log(req.file);
    console.log(req.files);

    res.json({
      file: req.file,
      files: req.files,
    });
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
  getAllUsers,
  createUser,
  getSingleUser,
  deleteUser,
  updateUser,
  loginUser,
  logOutUser,
  checkSession,
  bulkUpload,
  uploadAvatar,
  updateUserPasssword,
  signupUser,
};
