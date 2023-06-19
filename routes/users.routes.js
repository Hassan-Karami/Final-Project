const express = require("express");
const router = express();
const { isLoggedIn } = require("../middlewares/user.session");
const {restrictTo}=require("../middlewares/user.ac");
const {
  updateUserValidation,
  changePasswordUserAccountValidationSchema,
} = require("../validations/account_validation");

const { validator } = require("../validations/validator");



const {
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  updateUserPassswordById,
  uploadAvatarById,
} = require("../controllers/user.controller");

router.get("/:userId", isLoggedIn, restrictTo("admin"), getUserById);
//remember to add login and restrict 
router.get("/",isLoggedIn , restrictTo("admin"), getAllUsers); 
router.delete("/:userId",isLoggedIn , restrictTo("admin") ,deleteUserById);
router.patch("/:userId",isLoggedIn , restrictTo("admin"), updateUserById);
router.put(
  "/password/:userId",isLoggedIn,restrictTo("admin"),
  validator(changePasswordUserAccountValidationSchema),
  updateUserPassswordById
);

router.post("/uploadAvatar/:userId",isLoggedIn,restrictTo("admin"),uploadAvatarById);



module.exports = router;
