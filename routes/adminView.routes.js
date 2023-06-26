const express = require("express");
const router = express();
const path = require("path");
const { isLoggedIn } = require("../middlewares/user.session");
const { restrictTo } = require("../middlewares/user.ac");



// default page
router.use("/",(req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/admin_users.html"));
});


module.exports = router;