const { validationResult } = require("express-validator");

const riskProfilingService = require("../services/riskProfiling.service");

const asyncHandler = require("../middleware/asyncHandler");

const response = require("../utils/response");

class RiskProfilingController {
  generateRiskProfile = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(
        res,
        errors.array()
      );
    }

    const { sessionId } = req.params;

    const result =
      await riskProfilingService.generateRiskProfile(
        sessionId
      );

    return response.success(
      res,
      "Risk profile generated successfully.",
      result
    );
  });

  getOverallRisk = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(
        res,
        errors.array()
      );
    }

    const { sessionId } = req.params;

    const result =
      await riskProfilingService.getOverallRisk(
        sessionId
      );

    return response.success(
      res,
      "Overall risk retrieved successfully.",
      result
    );
  });

  getRiskDimension = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(
        res,
        errors.array()
      );
    }

    const { sessionId, dimension } = req.params;

    const result =
      await riskProfilingService.getRiskDimension(
        sessionId,
        dimension
      );

    return response.success(
      res,
      "Risk dimension retrieved successfully.",
      result
    );
  });
}

module.exports = new RiskProfilingController();