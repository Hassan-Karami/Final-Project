const express = require("express");
const router = express();
const usersRoutes = require("./users.routes");
const authRoutes = require("./auth.routes.js")
const { isLoggedIn } = require("../middlewares/user.session");
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



const { updateUserValidation } = require("../validations/users_validation");


router.use("/users",usersRoutes);
router.use("/auth",authRoutes)




// router.post("/auth/signup");
router.get("/check_session", checkSession);

//avatar
router.post("/uploadAvatar",isLoggedIn,uploadAvatar);

//password update 


module.exports = router;




