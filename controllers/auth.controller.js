const mongoose = require("mongoose");
const User = require("../models/User");
const { AppError } = require("../utils/AppError");
const path = require("path");
const { isValidObjectId } = require("../validations/ObjectIdValidation");

//LOGIN user
const loginUser = async (req, res, next) => {
  try {
    if(!!req.session.user){
        return next(new AppError("You are loggedIn now, logout first", 400 ));
    }
    const { username, password } = req.body;
    targetUser = await User.findOne({ username: req.body.username });
    if (!targetUser) {
      return next(new AppError("username or password is not matched", 404));
    }
    const isMatch = await targetUser.validatePassword(req.body.password);
    if (!isMatch) {
      return next(new AppError("username or password is not matched", 404));
    }
    req.session.user = { _id: targetUser._id, avatar: targetUser.avatar, role: targetUser.role };
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
      return next(new AppError("You are not logged in,login first", 401));
    }
    res.status(200).send(req.session.user);
  } catch (error) {
    console.log(error);
    next(new AppError("internal error(check session fd)", 500));
  }
};

//signup User
const  signupUser = async (req,res,next)=>{
    if (!!req.session.user) {
      return next(new AppError("You are loggedIn, logout first", 400));
    }
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



module.exports = {
  loginUser,
  logOutUser,
  checkSession,
  signupUser,
};