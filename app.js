var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose")
const general_routes = require("./routes/general_routes")
const { errorHandler } = require("./services/Error_Handler");
const AppError = require('./utils/AppError');
const session = require("express-session");
app.use(express.static(path.join(__dirname, "public")));
mongoose.connect("mongodb://127.0.0.1:27017/Weblog").then(() => {
  console.log("DB is connected..");
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//config express-session
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: "mySecrectKeyForAuthProject",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

app.use((req, res, next) => {
  console.log(req.session);
  next();
});



app.use("/", general_routes);
app.use(errorHandler);



module.exports = app;
