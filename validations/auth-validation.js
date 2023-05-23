const Joi = require('joi');
const phoneNumberRegex = /^(\+98|0)?9\d{9}$/;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)/;

const signupValidationSchema = Joi.object({
	firstName: Joi.string().min(3).max(30).trim().required(),
	lastName: Joi.string().min(3).max(30).trim().required(),
	gender: Joi.string().valid('male', 'female', 'not_set').trim().lowercase(),
	username: Joi.string().min(3).max(30).trim().lowercase().required(),
	password: Joi.string().min(8).pattern(passwordRegex).required(),
	phone_number : Joi.string().pattern(phoneNumberRegex).required()
});

const loginValidationSchema = Joi.object({
	username: Joi.string().trim().lowercase().required(),
	password: Joi.string().required()
});

module.exports = { signupValidationSchema, loginValidationSchema };
