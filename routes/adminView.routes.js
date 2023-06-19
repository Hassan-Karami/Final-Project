const express = require("express");
const router = express();
const path = require("path");










// default page
router.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/admin_users.html"));
});


module.exports = router;