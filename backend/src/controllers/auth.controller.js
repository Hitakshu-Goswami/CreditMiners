const { validationResult } = require("express-validator");

const authService = require("../services/auth.service");
const response = require("../utils/response");

const BadRequestError = require("../errors/BadRequestError");

const asyncHandler = require("../middleware/async.middleware");

const validateRequest = (req) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequestError(
      errors.array().map((error) => error.msg).join(", ")
    );
  }
};

const register = asyncHandler(async (req, res) => {
  validateRequest(req);

  const result = await authService.register(
  req.body,
  req.headers["user-agent"]
);

  return response.success(
    res,
    "User registered successfully.",
    result,
    201
  );
});

const login = asyncHandler(async (req, res) => {
  validateRequest(req);

 const result = await authService.login(
  req.body,
  req.headers["user-agent"]
);

  return response.success(
    res,
    "Login successful.",
    result
  );
});

const refresh = asyncHandler(async (req, res) => {
  validateRequest(req);

const result = await authService.refresh(
  req.body.refreshToken,
  req.headers["user-agent"]
);
  return response.success(
    res,
    "Token refreshed successfully.",
    result
  );
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.body.refreshToken);

  return response.success(
    res,
    "Logged out successfully."
  );
});

const verifyEmail = asyncHandler(async (req, res) => {
  const result = await authService.verifyEmail(
    req.query.token
  );

  return response.success(
    res,
    result.message
  );
});

const resendVerification = asyncHandler(async (req, res) => {
  validateRequest(req);

  const result = await authService.resendVerification(
    req.body.email
  );

  return response.success(
    res,
    result.message
  );
});

const forgotPassword = asyncHandler(async (req, res) => {
  validateRequest(req);

  const result =
    await authService.forgotPassword(
      req.body.email
    );

  return response.success(
    res,
    result.message
  );
});

const resetPassword = asyncHandler(async (req, res) => {
  validateRequest(req);

  const result =
    await authService.resetPassword(
      req.body.token,
      req.body.password
    );

  return response.success(
    res,
    result.message
  );
});

const changePassword = asyncHandler(async (req, res) => {
  validateRequest(req);

  const result =
    await authService.changePassword(
      req.user.id,
      req.body.currentPassword,
      req.body.newPassword
    );

  return response.success(
    res,
    result.message
  );
});

const getSessions = asyncHandler(async (req, res) => {
  const sessions = await authService.getSessions(req.user.id);

  return response.success(
    res,
    "Sessions fetched successfully.",
    sessions
  );
});

const logoutSession = asyncHandler(async (req, res) => {
  const result = await authService.logoutSession(
    req.user.id,
    req.params.sessionId
  );

  return response.success(
    res,
    result.message
  );
});

const logoutAllSessions = asyncHandler(async (req, res) => {
  const result = await authService.logoutAllSessions(
    req.user.id
  );

  return response.success(
    res,
    result.message
  );
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
    changePassword,
    getSessions,
logoutSession,
logoutAllSessions,
};