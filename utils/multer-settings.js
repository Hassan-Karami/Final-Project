const multer = require("multer");


const avaterStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/userAvatars');
    },
    filename: function (req, file, cb) {
        if (file.originalname === "grant.png") cb(new Error("Bad file name!"), null);
        cb(null, Date.now() + "-" + file.originalname)
    }
});

const userAvatarUpload = multer({ 
    storage: avaterStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
        } else {
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'), false);
        }
    },
    limits: {
        files: 10,
        fileSize: 1 * 1024 * 1024
    }
 });




 const galleryStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/userGallery');
    },
    filename: function (req, file, cb) {
        if (file.originalname === "grant.png") cb(new Error("Bad file name!"), null);
        cb(null, Date.now() + "-" + file.originalname)
    }
});

const galleryUpload = multer({ 
    storage: galleryStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
        } else {
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'), false);
        }
    },
    limits: {
        files: 10,
        fileSize: 1 * 1024 * 1024
    }
 });




 module.exports = {
    userAvatarUpload,
    galleryUpload
 }