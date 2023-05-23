const { AppError } = require("../utils/AppError");
const User = require("../models/User");


const restrictTo = (...roles) => {
  try {
    return async (req, res, next) => {
      const  userId  = req.session.user._id;
      const { role } = await User.findById(userId);

      if (!roles.includes(role)) {
        return next(
          new AppError("you do not have permission to perform this action", 403)
        );
      }

      next();
    };
  } catch (error) {
    console.log(error);
    next(new AppError("internal error", 500));
  }
};

module.exports = {restrictTo};