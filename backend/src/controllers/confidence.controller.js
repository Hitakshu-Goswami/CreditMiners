const { validationResult } = require("express-validator");

const asyncHandler = require("../middleware/asyncHandler");

const response = require("../utils/response");

const ConfidenceService = require("../services/confidence.service");

class ConfidenceController {
  generateConfidence = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.params;

    const confidence =
      await ConfidenceService.generateConfidence(sessionId);

    return response.success(
      res,
      "Assessment confidence generated successfully.",
      confidence
    );
  });

  getOverallConfidence = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.params;

    const overallConfidence =
      await ConfidenceService.getOverallConfidence(sessionId);

    return response.success(
      res,
      "Overall confidence retrieved successfully.",
      overallConfidence
    );
  });

  getConfidenceDimension = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId, dimension } = req.params;

    const confidenceDimension =
      await ConfidenceService.getConfidenceDimension(
        sessionId,
        dimension
      );

    return response.success(
      res,
      "Confidence dimension retrieved successfully.",
      confidenceDimension
    );
  });

  getConfidenceSummary = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.params;

    const summary =
      await ConfidenceService.getConfidenceSummary(sessionId);

    return response.success(
      res,
      "Confidence summary retrieved successfully.",
      summary
    );
  });
}

module.exports = new ConfidenceController();