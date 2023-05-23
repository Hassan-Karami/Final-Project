const express = require("express");
const router = express();
const { isLoggedIn } = require("../middlewares/user.session");
const { updateUserValidation,changePasswordUserAccountValidationSchema } = require("../validations/account_validation");

const {validator} = require("../validations/validator");

const {
  getAccount,
  deleteUser,
  updateUser,
  uploadAvatar,
  updateUserPasssword,
} = require("../controllers/account.controller");

router.get("/", isLoggedIn, getAccount);
router.delete("/", isLoggedIn, deleteUser);
router.patch("/", isLoggedIn, updateUserValidation, updateUser);
router.put("/password", isLoggedIn,validator(changePasswordUserAccountValidationSchema), updateUserPasssword);
router.post("/uploadAvatar", isLoggedIn, uploadAvatar);

module.exports = router;
