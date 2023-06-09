const express = require("express");
const router = express();

const {
  getAllArticles,
  createArticle,
  uploadArticleImages,
  allMyArticles,
  getArticleById,
  updateArticle,
  deleteArticleById,
  getCommentsOfAnArticle,
} = require("../controllers/article.controller");

const {
  createArticleValidationSchema,
  updateArticleValidationSchema,
} = require("../validations/article-validation");

const {validator} = require("../validations/validator");
const { isLoggedIn } = require("../middlewares/user.session");
const {isOwnerOfArticle} = require("../middlewares/isOwnerOfArticle")


router.get("/me", isLoggedIn, allMyArticles);
router.get("/:id",getArticleById)
router.get("/:id/comments", getCommentsOfAnArticle);
router.get("/",getAllArticles);
router.post("/",isLoggedIn,uploadArticleImages,validator(createArticleValidationSchema),createArticle
);
router.patch("/:id",isLoggedIn,isOwnerOfArticle,uploadArticleImages,validator(updateArticleValidationSchema), updateArticle);
router.delete("/:id",isLoggedIn, isOwnerOfArticle, deleteArticleById);


module.exports = router;