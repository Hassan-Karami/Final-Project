const mongoose = require("mongoose");
const User = require("../models/User");
const {AppError} = require("../utils/AppError");


//GET all bloggers
const getAllUsers = async(req, res, next) => {
  try {
    const usersList = await User.find();
    res.send(usersList);
  } catch (error) {
    console.log(error);
    next(new AppError("internal Error",500))
  }
};

//GET single user
const getSingleUser = async (req, res, next) => {
  try {
    const targetUser = await User.findById(req.params.id,{password: 0});
    res.send(targetUser);
  } catch (error) {
    console.log(error);
    next(new AppError("internal Error", 500));
  }
};

//CREATE user
const createUser = async(req,res,next)=>{
  const userCreationBody = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    role: req.body.role,
    gender: req.body.gender,
    phone_number: req.body.phone_number,
    username: req.body.username,
    password: req.body.password,
  };
  try {
    const newUser = await User.create(userCreationBody);
    res.send(newUser);
    
  } catch (error) {
    console.log(error);
    next(new AppError("internal error",500))
  }

}


//DELETE user
const deleteUser = async(req,res,next)=>{
   try {
    console.log(req.params.id);
    const deletedUser = await User.findByIdAndDelete(req.params.id,{new: true});
    if(!deletedUser){
      return next(new AppError("user not found",404));
    } 
    res.status(200).send(deletedUser)
  } catch (error) {
    console.log(error);
    next(new AppError("internal Error", 500));
  }
}

//UPDATE user
const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new:true});
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
const loginUser = async (req,res,next)=>{
  try {
    const { username, password } = req.body;
    targetUser = await User.findOne({username:req.body.username});
    if(!targetUser){
      return next(new AppError("user not found",404));
    }
    const isMatch = await targetUser.validatePassword(req.body.password);
    if(!isMatch) {
      return next(new AppError("user not found",404))
    }
    req.session.user = targetUser;
    console.log("user sat on session");
    res.status(200).send(targetUser);
  } catch (error) {
    next(new AppError("internal error",500))
  }
}

//LOGOUT user
const logOutUser = (req, res, next) => {
  console.log("before destroy session(logout button)");
  req.session.destroy();
};

//dashboard api
const checkSessionForDashboard= (req,res,next)=>{
  try {
    if (!req.session.user) {
      return next(new AppError("You are not logged in", 500));
    }
    res.status(200).send(req.session.user);
  } catch (error) {
    next(new AppError("internal error(check session fd)"));
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
  checkSessionForDashboard,
};