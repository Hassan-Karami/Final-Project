const express = require("express");
const router = express();
const {
  createComment,
  getAllComments,
  getCommentById,
  getAllMyComments,
  updateComment,
  deleteComment,
} = require("../controllers/comment.controller");

const {isOwnerOfComment} = require("../middlewares/isOwnerOfComment")

const { isLoggedIn } = require("../middlewares/user.session");

router.get("/me", isLoggedIn, getAllMyComments);

router.get("/:commentId", getCommentById);

router.get("/", getAllComments);

router.post("/", isLoggedIn,createComment);

router.patch("/:commentId",isLoggedIn, isOwnerOfComment ,updateComment);

router.delete("/:commentId", isLoggedIn, isOwnerOfComment, deleteComment);









module.exports = router;
