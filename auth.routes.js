const express = require("express");
const router = express.Router();

const {
  authLimiter,
} = require("../middleware/rateLimit.middleware");

const {
  authenticate,
} = require("../middleware/auth.middleware");

const {
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
} = require("../controllers/auth.controller");

const {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
  verifyEmailValidator,
  resendVerificationValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
  sessionIdValidator,
} = require("../validators/auth.validator");

/* ---------- Authentication ---------- */

router.post(
  "/register",
  authLimiter,
  registerValidator,
  register
);

router.post(
  "/login",
  authLimiter,
  loginValidator,
  login
);

router.post(
  "/refresh",
  authLimiter,
  refreshTokenValidator,
  refresh
);

router.post(
  "/logout",
  authenticate,
  logout
);

router.post(
  "/change-password",
  authenticate,
  changePasswordValidator,
  changePassword
);

/* ---------- Email Verification ---------- */

router.get(
  "/verify-email",
  verifyEmailValidator,
  verifyEmail
);

router.post(
  "/resend-verification",
  authLimiter,
  resendVerificationValidator,
  resendVerification
);

/* ---------- Password Reset ---------- */

router.post(
  "/forgot-password",
  authLimiter,
  forgotPasswordValidator,
  forgotPassword
);

router.post(
  "/reset-password",
  authLimiter,
  resetPasswordValidator,
  resetPassword
);

/* ---------- Session Management ---------- */

router.get(
  "/sessions",
  authenticate,
  getSessions
);

router.delete(
  "/sessions/:sessionId",
  authenticate,
  sessionIdValidator,
  logoutSession
);

router.delete(
  "/sessions",
  authenticate,
  logoutAllSessions
);

module.exports = router;