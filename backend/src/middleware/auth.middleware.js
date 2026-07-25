const jwt = require("jsonwebtoken");

const prisma = require("../config/prisma");
const jwtConfig = require("../config/jwt");

const response = require("../utils/response");
const UnauthorizedError = require("../errors/UnauthorizedError");
const ForbiddenError = require("../errors/ForbiddenError");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authentication required.");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, jwtConfig.accessSecret);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      include: {
        role: true,
      },
    });

    if (!user) {
     throw new UnauthorizedError("User not found.");
    }

    if (!user.isActive) {
   throw new ForbiddenError("Account is inactive.");
    }

    req.user = user;

    next();
  } catch (error) {
   next(new UnauthorizedError("Invalid or expired token."));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return response.error(res, "Authentication required.", 401);
    }

    if (!roles.includes(req.user.role.name)) {
    throw new ForbiddenError("Access denied.");
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};