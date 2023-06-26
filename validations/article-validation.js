const Joi = require('joi');

//Create Article Validation Schema
const createArticleValidationSchema = Joi.object({
	title: Joi.string().min(3).max(40).required().trim(),
	content: Joi.string().required().trim()
});

//Update Article Validation Schema
const updateArticleValidationSchema = Joi.object({
  title: Joi.string().min(3).max(40).trim(),
  content: Joi.string().trim(),
});





module.exports = {
  createArticleValidationSchema,
  updateArticleValidationSchema,
};

