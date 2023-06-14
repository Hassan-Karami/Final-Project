const Article = require("../models/Article");
const { paginate } = require("../utils/pagination");
const { checkIfFileExists } = require("../services/checkFileExistance");
const { AppError } = require("../utils/AppError");
const sharp = require("sharp");
const { asyncHandler } = require("../utils/async-handler");
const { join } = require("node:path");
const fs = require("fs/promises");
const { multerUpload } = require("../utils/multer-settings");
const Comment = require("../models/Comment");


//DELETE Article
const deleteArticleById = asyncHandler(async (articleId) => {

  const targetArticle = await Article.findById(articleId);
  //delete thumbnail
  const thumbnailFilePath = join(
    __dirname,
    `../public/images/articles/thumbnails/${targetArticle.thumbnail}`
  );
  const thumbnailFileExist = await checkIfFileExists(thumbnailFilePath);
  console.log("thumbnail exist result is: ");
  console.log(thumbnailFileExist);
  if (thumbnailFileExist) {
    await fs.unlink(thumbnailFilePath);
  };
  console.log("images exist result is: ");
  //delete images
  if(!!targetArticle.images && targetArticle.images.length>0) {
     for (let image of targetArticle.images) {
       const imagePath = join(
         __dirname,
         `../public/images/articles/images/${image}`
       );
       const imageFileExist = await checkIfFileExists(imagePath);
       console.log(imageFileExist);
       if (imageFileExist) {
         await fs.unlink(imagePath);
       }
     }
  }
  //delete comments under the article
  await Comment.deleteMany({article : articleId});
  
  await Article.findByIdAndDelete(articleId);
  console.log(`article with id ${articleId} deleted successfully`);;
});



module.exports = { deleteArticleById };