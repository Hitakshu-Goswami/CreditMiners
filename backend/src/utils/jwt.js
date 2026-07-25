const jwt = require("jsonwebtoken");
const config = require("../config/jwt");

const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.accessSecret, {
    expiresIn: config.accessExpiry,
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.refreshSecret, {
    expiresIn: config.refreshExpiry,
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, config.accessSecret);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.refreshSecret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};