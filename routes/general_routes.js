const express = require("express");
const router = express();
const api_routes = require("./api_routes");
const rendering_routes = require("./rendering_routes");

router.use("/api",api_routes)

router.use("/", rendering_routes);

module.exports= router;