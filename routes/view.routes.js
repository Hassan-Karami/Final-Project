const express = require("express");
const router = express();
const path = require("path");

router.use("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/signUp.html"));
});

router.use("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/login.html"));
});

router.use("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/dashboard.html"));
});

//update Password
router.get("/:id/password", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/updatePassword.html"));
});



// default page
router.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = router;
