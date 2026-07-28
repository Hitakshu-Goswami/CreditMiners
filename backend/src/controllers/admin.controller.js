const { validationResult } = require("express-validator");

const asyncHandler = require("../middleware/async.middleware");
const BadRequestError = require("../errors/BadRequestError");
const adminService = require("../services/admin.service");
const response = require("../utils/response");

const validateRequest = (req) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequestError(
      errors.array().map((error) => error.msg).join(", ")
    );
  }
};

const getDashboard = asyncHandler(async (req, res) => {
  const result = await adminService.getDashboard();

  return response.success(
    res,
    "Admin dashboard fetched successfully.",
    result
  );
});

const getDatasets = asyncHandler(async (req, res) => {
  const result = adminService.getDatasetAnalytics();

  return response.success(
    res,
    "Dataset analytics fetched successfully.",
    result
  );
});

const getModels = asyncHandler(async (req, res) => {
  const result = await adminService.getModelMonitoring();

  return response.success(
    res,
    "AI model monitoring fetched successfully.",
    result
  );
});

const getFeatureStatistics = asyncHandler(async (req, res) => {
  const result = await adminService.getFeatureStatistics();

  return response.success(
    res,
    "Feature statistics fetched successfully.",
    result
  );
});

const getRiskDistribution = asyncHandler(async (req, res) => {
  const result = await adminService.getRiskDistribution();

  return response.success(
    res,
    "Risk distribution fetched successfully.",
    result
  );
});

const getApiMetrics = asyncHandler(async (req, res) => {
  const result = adminService.getApiMetrics();

  return response.success(
    res,
    "API metrics fetched successfully.",
    result
  );
});

const getAuditLogs = asyncHandler(async (req, res) => {
  validateRequest(req);

  const result = await adminService.getAuditLogs(req.query);

  return response.success(
    res,
    "Admin audit logs fetched successfully.",
    result
  );
});

const getSystemAnalytics = asyncHandler(async (req, res) => {
  const result = await adminService.getSystemAnalytics();

  return response.success(
    res,
    "System analytics fetched successfully.",
    result
  );
});

module.exports = {
  getApiMetrics,
  getAuditLogs,
  getDashboard,
  getDatasets,
  getFeatureStatistics,
  getModels,
  getRiskDistribution,
  getSystemAnalytics,
};
