const env = require("./env");

module.exports = {
  accessSecret: env.JWT_ACCESS_SECRET,
  refreshSecret: env.JWT_REFRESH_SECRET,

  accessExpiry: env.ACCESS_TOKEN_EXPIRY,
  refreshExpiry: env.REFRESH_TOKEN_EXPIRY,
};