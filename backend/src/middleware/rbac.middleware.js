const ForbiddenError = require("../errors/ForbiddenError");

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          "You are not authorized to access this resource."
        )
      );
    }

    next();
  };
};

module.exports = {
  authorizeRole,
};