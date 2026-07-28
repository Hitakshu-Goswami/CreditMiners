const { body, query } = require("express-validator");

const reportMonthPattern = /^\d{4}-(0[1-9]|1[0-2])$/;

const listMonthlyReportsValidator = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 36 })
    .withMessage("Limit must be between 1 and 36."),
];

const generateMonthlyReportValidator = [
  body("reportMonth")
    .optional()
    .matches(reportMonthPattern)
    .withMessage("reportMonth must use YYYY-MM format."),
];

module.exports = {
  generateMonthlyReportValidator,
  listMonthlyReportsValidator,
};
