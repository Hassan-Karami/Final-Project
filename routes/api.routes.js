const express = require("express");
const router = express();
const usersRoutes = require("./users.routes");
const authRoutes = require("./auth.routes.js");
const accountRoutes = require("./account.routes");
const articleRoutes = require("./article.routes");
const commentRoutes = require("./comment.routes");

const { updateUserValidation } = require("../validations/account_validation");

router.use("/users", usersRoutes);
router.use("/auth", authRoutes);
router.use("/account", accountRoutes);
router.use("/articles",articleRoutes);
router.use("/comments", commentRoutes);

module.exports = router;
