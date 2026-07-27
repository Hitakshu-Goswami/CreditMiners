const { validationResult } = require("express-validator");

const asyncHandler = require("../middleware/asyncHandler");

const response = require("../utils/response");

const ExplainabilityService = require("../services/explainability.service");

class ExplainabilityController {
  generateExplanations = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.params;

    const explanations =
      await ExplainabilityService.generateExplanations(sessionId);

    return response.success(
      res,
      "Explainability report generated successfully.",
      explanations
    );
  });

  getRiskExplanation = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.params;

    const explanation =
      await ExplainabilityService.getRiskExplanation(sessionId);

    return response.success(
      res,
      "Risk explanation retrieved successfully.",
      explanation
    );
  });

  getPersonaExplanation = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.params;

    const explanation =
      await ExplainabilityService.getPersonaExplanation(sessionId);

    return response.success(
      res,
      "Investor persona explanation retrieved successfully.",
      explanation
    );
  });

  getGoalExplanation = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.params;

    const explanation =
      await ExplainabilityService.getGoalExplanation(sessionId);

    return response.success(
      res,
      "Goal explanation retrieved successfully.",
      explanation
    );
  });

  getConfidenceExplanation = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.params;

    const explanation =
      await ExplainabilityService.getConfidenceExplanation(sessionId);

    return response.success(
      res,
      "Confidence explanation retrieved successfully.",
      explanation
    );
  });

  getRecommendationExplanation = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.params;

    const explanation =
      await ExplainabilityService.getRecommendationExplanation(sessionId);

    return response.success(
      res,
      "Recommendation explanation retrieved successfully.",
      explanation
    );
  });
}

module.exports = new ExplainabilityController();