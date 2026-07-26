const { validationResult } = require("express-validator");

const asyncHandler = require("../middleware/async.middleware");
const response = require("../utils/response");
const BadRequestError = require("../errors/BadRequestError");

const aiCreditService = require("../services/aiCredit.service");

const validateRequest = (req) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequestError(
      errors.array().map((error) => error.msg).join(", ")
    );
  }
};

const analyzeLoan = asyncHandler(async (req, res) => {
  validateRequest(req);

  const result = await aiCreditService.analyzeLoan(
    req.user.id,
    req.params.loanId
  );

  response.success(
    res,
    "AI credit analysis completed successfully.",
    result
  );
});

const generateCreditScore = asyncHandler(async (req, res) => {
  validateRequest(req);

  const result = await aiCreditService.generateCreditScore(
    req.user.id,
    req.body
  );

  response.success(
    res,
    "Explainable credit score generated successfully.",
    result,
    201
  );
});

const getCreditAssessment = asyncHandler(async (req, res) => {
  validateRequest(req);

  const result = await aiCreditService.getCreditAssessment(
    req.user.id,
    req.params.id
  );

  response.success(
    res,
    "Credit assessment fetched successfully.",
    result
  );
});

const getCreditHistory = asyncHandler(async (req, res) => {
  validateRequest(req);

  const result = await aiCreditService.getCreditHistory(
    req.user.id,
    req.query
  );

  response.success(
    res,
    "Credit assessment history fetched successfully.",
    result
  );
});

const getLatestCreditAssessment = asyncHandler(async (req, res) => {
  const result = await aiCreditService.getLatestCreditAssessment(req.user.id);

  response.success(
    res,
    "Latest credit assessment fetched successfully.",
    result
  );
});

const getCreditFactors = asyncHandler(async (req, res) => {
  const result = await aiCreditService.getAssessmentSection(req.user.id, "factors");

  response.success(res, "Credit factors fetched successfully.", result);
});

const getImprovementPlan = asyncHandler(async (req, res) => {
  const result = await aiCreditService.getAssessmentSection(req.user.id, "improvementPlan");

  response.success(res, "Credit improvement plan fetched successfully.", result);
});

const getConfidence = asyncHandler(async (req, res) => {
  const result = await aiCreditService.getAssessmentSection(req.user.id, "confidence");

  response.success(res, "Credit confidence fetched successfully.", result);
});

const getExplanation = asyncHandler(async (req, res) => {
  const result = await aiCreditService.getAssessmentSection(req.user.id, "explanation");

  response.success(res, "Credit explanation fetched successfully.", result);
});

const getLoanAnalysis = asyncHandler(async (req, res) => {
  validateRequest(req);

  const result = await aiCreditService.getAnalysis(
    req.user.id,
    req.params.loanId
  );

  response.success(
    res,
    "AI credit analysis fetched successfully.",
    result
  );
});

module.exports = {
  analyzeLoan,
  generateCreditScore,
  getConfidence,
  getCreditAssessment,
  getCreditFactors,
  getCreditHistory,
  getExplanation,
  getImprovementPlan,
  getLatestCreditAssessment,
  getLoanAnalysis,
};
