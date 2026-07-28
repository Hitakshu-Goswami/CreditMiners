const { param, query } = require("express-validator");

const listInsightsValidator = [
  query("severity")
    .optional()
    .isIn(["INFO", "LOW", "MEDIUM", "HIGH", "info", "low", "medium", "high"])
    .withMessage("Severity must be INFO, LOW, MEDIUM, or HIGH."),

  query("category")
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Category must be between 2 and 80 characters."),
];

const insightIdValidator = [
  param("id")
    .trim()
    .isLength({ min: 3, max: 120 })
    .withMessage("Invalid insight ID."),
];

module.exports = {
  insightIdValidator,
  listInsightsValidator,
};
