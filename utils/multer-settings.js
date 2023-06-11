const multer = require("multer");
const path = require("path");
const {AppError} = require("../utils/AppError")



//Avatar Storage
const avaterStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/userAvatars");
  },
  filename: function (req, file, cb) {
    if (file.originalname === "grant.png")
      cb(new Error("Bad file name!"), null);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//config Avatar Upload
const userAvatarUpload = multer({
  storage: avaterStorage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"), false);
    }
  },
  limits: {
    files: 10,
    fileSize: 1 * 1024 * 1024,
  },
});

//multer storage
const multerStorage = multer.memoryStorage();

//multer filter
const multerFilter = (req, file, cb) => {
  file.mimetype.startsWith("image")
    ? cb(null, true)
    : cb(new AppError("not an image format, upload image only", 400), false);
};

//multer config
const multerUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});






module.exports = {
  userAvatarUpload,
  multerUpload,
};
