const Joi = require("joi");

//Create Comment Validation Schema
const createCommentValidationSchema = Joi.object({
  content: Joi.string().required().trim(),
});
