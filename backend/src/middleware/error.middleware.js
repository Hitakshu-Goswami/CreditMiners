const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const response = {
    success: false,
    message: err.message || "Internal Server Error",
  };

  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }
const logger = require("../utils/logger");
logger.error(err);
  res.status(statusCode).json(response);
};

module.exports = errorHandler;