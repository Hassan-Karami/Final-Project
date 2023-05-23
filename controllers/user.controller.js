const mongoose = require("mongoose");
const User = require("../models/User");
const { AppError } = require("../utils/AppError");
const path = require("path");

//GET all users
const getAllUsers = async (req, res, next) => {
  try {
    const usersList = await User.find({},{password:0,__v:0});
    res.status(200).send(usersList);
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





module.exports = {
  getAllUsers,
  createUser,
};
