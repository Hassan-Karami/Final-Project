const { AppError } = require('../utils/AppError');

const validator = validationSchema => {
	return (req, res, next) => {
		const { error } = validationSchema.validate(req.body);

		if (!!error){
			console.log(error);
			return next(new AppError(error.message, 400));
		}

		next();
	};
};

module.exports = { validator };
