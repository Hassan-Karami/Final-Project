const express = require("express");
const router = express();
const path = require("path");
const { isLoggedIn } = require("../middlewares/user.session");
const { restrictTo } = require("../middlewares/user.ac");



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

//my_articles
router.get("/my_articles", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/my_articles.html"));
})

//my_articles
router.get("/article_details/:id",(req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/article_details.html"));
})

//create_article
router.get("/create_article",(req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/create-article.html"));
})


//update_article
router.get("/update_article/:id",(req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/update-article.html"));
})






// default page
router.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/home.html"));
});

module.exports = router;
