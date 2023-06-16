const express = require("express");
const router = express();
const api_routes = require("./api.routes");
const rendering_routes = require("./view.routes");
const admin_view_routes = require("./adminView.routes")

router.use("/api",api_routes)
router.use("/admin", admin_view_routes);
router.use("/", rendering_routes);



module.exports= router;