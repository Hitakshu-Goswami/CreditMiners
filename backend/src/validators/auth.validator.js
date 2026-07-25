const { body, query, param } = require("express-validator");

const registerValidator = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required."),

  body("email")
    .isEmail()
    .withMessage("Valid email is required.")
    .normalizeEmail(),

  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number."),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain a lowercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain a number.")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain a special character."),
];

const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required."),
];

const refreshTokenValidator = [
  body("refreshToken")
    .notEmpty()
    .withMessage("Refresh token is required."),
];

const verifyEmailValidator = [
  query("token")
    .notEmpty()
    .withMessage("Verification token is required."),
];

const resendVerificationValidator = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required.")
    .normalizeEmail(),
];

const forgotPasswordValidator = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required.")
    .normalizeEmail(),
];

const resetPasswordValidator = [
  body("token")
    .notEmpty()
    .withMessage("Reset token is required."),

  body("password")
    .isLength({ min: 8 })
    .withMessage(
      "Password must be at least 8 characters."
    )
    .matches(/[A-Z]/)
    .withMessage(
      "Password must contain an uppercase letter."
    )
    .matches(/[a-z]/)
    .withMessage(
      "Password must contain a lowercase letter."
    )
    .matches(/[0-9]/)
    .withMessage(
      "Password must contain a number."
    )
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage(
      "Password must contain a special character."
    ),
];

const changePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required."),

  body("newPassword")
    .isLength({ min: 8 })
    .withMessage(
      "Password must be at least 8 characters."
    )
    .matches(/[A-Z]/)
    .withMessage(
      "Password must contain an uppercase letter."
    )
    .matches(/[a-z]/)
    .withMessage(
      "Password must contain a lowercase letter."
    )
    .matches(/[0-9]/)
    .withMessage(
      "Password must contain a number."
    )
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage(
      "Password must contain a special character."
    ),
];

const sessionIdValidator = [
  param("sessionId")
    .isUUID()
    .withMessage("Invalid session ID."),
];

module.exports = {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
  verifyEmailValidator,
  resendVerificationValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
  sessionIdValidator,
};