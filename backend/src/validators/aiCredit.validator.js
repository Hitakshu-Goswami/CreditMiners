const { body, param, query } = require("express-validator");

const loanIdValidator = [
  param("loanId")
    .isUUID()
    .withMessage("Invalid loan ID."),
];

const creditScoreValidator = [
  body("featureVersion")
    .optional()
    .trim()
    .isLength({ min: 3, max: 80 })
    .withMessage("Feature version must be between 3 and 80 characters."),

  body("windowMonths")
    .optional()
    .isInt({ min: 1, max: 24 })
    .withMessage("windowMonths must be between 1 and 24."),

  body("computeIfMissing")
    .optional()
    .isBoolean()
    .withMessage("computeIfMissing must be a boolean."),

  body("assessmentType")
    .optional()
    .isIn(["INITIAL", "MONTHLY", "ON_DEMAND", "SIMULATION"])
    .withMessage("Invalid assessment type."),
];

const assessmentIdValidator = [
  param("id")
    .isUUID()
    .withMessage("Invalid credit assessment ID."),
];

const creditHistoryValidator = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100."),
];

module.exports = {
  assessmentIdValidator,
  creditHistoryValidator,
  creditScoreValidator,
  loanIdValidator,
};
