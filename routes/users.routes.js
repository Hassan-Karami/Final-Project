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
} = require("../controllers/user");

router.get("/", isLoggedIn, getAllUsers);
router.get("/:id", isLoggedIn, getSingleUser);
router.post("/", createUser);
router.delete("/:id", isLoggedIn, deleteUser);
router.patch("/:id",isLoggedIn,updateUserValidation, updateUser);
router.put("/:id/password", isLoggedIn, updateUserPasssword);





module.exports = router;