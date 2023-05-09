const express = require("express");
const router = express();
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
  bulkUpload
} = require("../controllers/user");

const { updateUserValidation } = require("../validations/users_validation");

router.get("/users",getAllUsers);
router.get("/users/:id", getSingleUser);
router.post("/users", createUser);
router.delete("/users/:id",deleteUser)
router.patch("/users/:id",updateUserValidation, updateUser);


router.post("/auth/login", loginUser);
router.get("/logout", logOutUser);

router.get("/check_session", checkSession);

//avatar
router.post("/uploadAvatar",uploadAvatar);

module.exports = router;