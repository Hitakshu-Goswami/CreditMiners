const { body, param } = require("express-validator");

const loanIdValidator = [
  param("loanId")
    .isUUID()
    .withMessage("Invalid loan ID."),
];

const interestIdValidator = [
  param("interestId")
    .isUUID()
    .withMessage("Invalid interest ID."),
];

const createInterestValidator = [
  body("amountOffered")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Invalid amount offered."),

  body("message")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Message cannot exceed 1000 characters."),
];

module.exports = {
  loanIdValidator,
  interestIdValidator,
  createInterestValidator,
};