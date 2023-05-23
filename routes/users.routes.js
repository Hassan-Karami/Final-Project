const express = require("express");
const router = express();
const { isLoggedIn } = require("../middlewares/user.session");
const {restrictTo}=require("../middlewares/user.ac");


const {
  getAllUsers,
} = require("../controllers/user.controller");

router.get("/", isLoggedIn,restrictTo("admin"), getAllUsers);

module.exports = router;
