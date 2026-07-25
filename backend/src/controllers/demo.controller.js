const asyncHandler = require("../middleware/async.middleware");
const response = require("../utils/response");
const signalsService = require("../services/signals.service");
const investmentService = require("../services/investment.service");
const NotFoundError = require("../errors/NotFoundError");

const getSummary = asyncHandler(async (req, res) => {
  response.success(res, "Demo summary fetched successfully.", signalsService.getSummary());
});

const getProfiles = asyncHandler(async (req, res) => {
  response.success(res, "Sample profiles fetched successfully.", signalsService.getProfiles());
});

const getAssessment = asyncHandler(async (req, res) => {
  const assessment = signalsService.scoreUser(req.params.userId);

  if (!assessment) {
    throw new NotFoundError("Sample user profile not found.");
  }

  response.success(res, "Credit assessment generated successfully.", assessment);
});

const scoreProfile = asyncHandler(async (req, res) => {
  const assessment = signalsService.scoreUser(req.body.userId);

  if (!assessment) {
    throw new NotFoundError("Sample user profile not found.");
  }

  response.success(res, "Credit score generated successfully.", assessment);
});

const getInvestmentQuestions = asyncHandler(async (req, res) => {
  response.success(res, "Investment assessment questions fetched successfully.", investmentService.QUESTIONS);
});

const assessInvestmentRisk = asyncHandler(async (req, res) => {
  response.success(
    res,
    "Investment risk profile generated successfully.",
    investmentService.assessRiskProfile(req.body.answers)
  );
});

module.exports = {
  getSummary,
  getProfiles,
  getAssessment,
  scoreProfile,
  getInvestmentQuestions,
  assessInvestmentRisk,
};
