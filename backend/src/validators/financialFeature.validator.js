const { body, param, query } = require("express-validator");

const computeFeaturesValidator = [
  body("windowMonths")
    .optional()
    .isInt({ min: 1, max: 24 })
    .withMessage("windowMonths must be between 1 and 24."),

  body("version")
    .optional()
    .trim()
    .isLength({ min: 3, max: 80 })
    .withMessage("Version must be between 3 and 80 characters."),

  body("windowEnd")
    .optional()
    .isISO8601()
    .withMessage("windowEnd must be a valid ISO date."),

  body("persist")
    .optional()
    .isBoolean()
    .withMessage("persist must be a boolean."),

  body("async")
    .optional()
    .isBoolean()
    .withMessage("async must be a boolean."),
];

const listFeaturesValidator = [
  query("group")
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Feature group must be between 2 and 80 characters."),

  query("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage("Feature name must be between 2 and 120 characters."),

  query("version")
    .optional()
    .trim()
    .isLength({ min: 3, max: 80 })
    .withMessage("Version must be between 3 and 80 characters."),

  query("latestOnly")
    .optional()
    .isBoolean()
    .withMessage("latestOnly must be a boolean."),
];

const listRunsValidator = [
  query("version")
    .optional()
    .trim()
    .isLength({ min: 3, max: 80 })
    .withMessage("Version must be between 3 and 80 characters."),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100."),
];

const runIdValidator = [
  param("runId")
    .isUUID()
    .withMessage("Invalid feature run ID."),
];

const jobIdValidator = [
  param("jobId")
    .isUUID()
    .withMessage("Invalid feature job ID."),
];

module.exports = {
  computeFeaturesValidator,
  jobIdValidator,
  listFeaturesValidator,
  listRunsValidator,
  runIdValidator,
};
