const { validationResult } = require("express-validator");

const asyncHandler = require("../middleware/async.middleware");
const BadRequestError = require("../errors/BadRequestError");
const reportService = require("../services/report.service");
const response = require("../utils/response");

const validateRequest = (req) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequestError(
      errors.array().map((error) => error.msg).join(", ")
    );
  }
};

const listMonthlyReports = asyncHandler(async (req, res) => {
  validateRequest(req);

  const reports = await reportService.listMonthlyReports(
    req.user.id,
    req.query
  );

  return response.success(
    res,
    "Monthly financial reports fetched successfully.",
    reports
  );
});

const generateMonthlyReport = asyncHandler(async (req, res) => {
  validateRequest(req);

  const report = await reportService.generateMonthlyReport(
    req.user.id,
    req.body
  );

  return response.success(
    res,
    "Monthly financial report generated successfully.",
    report,
    201
  );
});

module.exports = {
  generateMonthlyReport,
  listMonthlyReports,
};
