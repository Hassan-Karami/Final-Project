const express = require("express");
const router = express();
const { isLoggedIn } = require("../middlewares/user.session");
const { updateUserValidation } = require("../validations/users_validation");
const {
  getAllUsers,
  createUser,
  getSingleUser,
  deleteUser,
  updateUser,
  loginUser,
  logOutUser,
  checkSession,
  uploadAvatar,
  bulkUpload,
  updateUserPasssword,
  signupUser,
} = require("../controllers/user");




router.post("/login", loginUser);
router.get("/logout", isLoggedIn,logOutUser);
router.post("/signup",signupUser)

module.exports= router;