const express = require("express");
const router = express();
const {
  getAllArticles,
  createArticle,
  uploadThumbnail,
} = require("../controllers/article.controller");


router.get("/",getAllArticles);
router.post("/",createArticle);

router.post("/thumbnail", uploadThumbnail);



module.exports = router;