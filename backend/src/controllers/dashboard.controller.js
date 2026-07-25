const asyncHandler = require("../middleware/async.middleware");
const response = require("../utils/response");
const dashboardService = require("../services/dashboard.service");

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