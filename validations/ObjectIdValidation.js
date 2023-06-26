const { ObjectId } = require("mongodb");
const {AppError} = require("../utils/AppError")

function isValidObjectId(id) {
  if(id.length !== 24){
    return false;
  }
  return ObjectId.isValid(id);
}

module.exports = {isValidObjectId}