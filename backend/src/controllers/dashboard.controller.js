const asyncHandler = require("../middleware/async.middleware");
const response = require("../utils/response");
const dashboardService = require("../services/dashboard.service");
const insightService = require("../services/insight.service");

exports.getBorrowerDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getBorrowerDashboard(req.user.id);

  return response.success(
    res,
    "Borrower dashboard fetched successfully.",
    data
  );
});

exports.getInvestorDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getInvestorDashboard(req.user.id);

  return response.success(
    res,
    "Investor dashboard fetched successfully.",
    data
  );
});

exports.getMarketplaceDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getMarketplaceDashboard();

  return response.success(
    res,
    "Marketplace dashboard fetched successfully.",
    data
  );
});

exports.getFinancialHealthDashboard = asyncHandler(async (req, res) => {
  const data = await insightService.getFinancialHealthDashboard(req.user.id);

  return response.success(
    res,
    "Financial health dashboard fetched successfully.",
    data
  );
});

exports.getCreditDashboard = asyncHandler(async (req, res) => {
  const data = await insightService.getCreditDashboard(req.user.id);

  return response.success(
    res,
    "Credit explainability dashboard fetched successfully.",
    data
  );
});

exports.getFinancialHabitTrends = asyncHandler(async (req, res) => {
  const data = await insightService.getTrends(req.user.id);

  return response.success(
    res,
    "Financial habit trends fetched successfully.",
    data
  );
});

exports.getImprovementTimeline = asyncHandler(async (req, res) => {
  const data = await insightService.getTimeline(req.user.id);

  return response.success(
    res,
    "Improvement timeline fetched successfully.",
    data
  );
});
