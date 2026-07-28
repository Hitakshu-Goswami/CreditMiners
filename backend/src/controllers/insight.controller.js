const { validationResult } = require("express-validator");

const asyncHandler = require("../middleware/async.middleware");
const BadRequestError = require("../errors/BadRequestError");
const insightService = require("../services/insight.service");
const response = require("../utils/response");

const validateRequest = (req) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequestError(
      errors.array().map((error) => error.msg).join(", ")
    );
  }
};

const listInsights = asyncHandler(async (req, res) => {
  validateRequest(req);

  const result = await insightService.getInsights(req.user.id, req.query);

  return response.success(
    res,
    "Explainable insights fetched successfully.",
    result
  );
});

const getInsight = asyncHandler(async (req, res) => {
  validateRequest(req);

  const result = await insightService.getInsightById(
    req.user.id,
    req.params.id
  );

  return response.success(
    res,
    "Explainable insight fetched successfully.",
    result
  );
});

const getInsightInputContract = asyncHandler(async (req, res) => {
  const result = await insightService.getInsightInputContract(req.user.id);

  return response.success(
    res,
    "Insight input contract fetched successfully.",
    result
  );
});

module.exports = {
  getInsight,
  getInsightInputContract,
  listInsights,
};
