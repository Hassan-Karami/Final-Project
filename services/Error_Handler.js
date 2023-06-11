const { AppError } = require("../utils/AppError");
const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.code).send({ message: err.message });
  }
  console.log(err);
  return res.status(404).send({ message: "Not Found" });
};

module.exports = { errorHandler };
