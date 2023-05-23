const express = require("express");
const router = express();
const { isLoggedIn } = require("../middlewares/user.session");
const {
  loginUser,
  logOutUser,
  checkSession,
  signupUser,
} = require("../controllers/auth.controller");
const {loginValidationSchema,signupValidationSchema} = require("../validations/auth-validation");
const {validator} = require("../validations/validator");






router.post("/login",validator(loginValidationSchema), loginUser);
router.get("/logout", isLoggedIn,logOutUser);
router.post("/signup",validator(signupValidationSchema),signupUser);
router.get("/check_session", checkSession);

module.exports= router;