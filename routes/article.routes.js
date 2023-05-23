const express = require("express");
const router = express();
const {getAllArticles,createArticle} = require("../controllers/article.controller");


router.get("/",getAllArticles);
router.post("/",createArticle);












module.exports = router;