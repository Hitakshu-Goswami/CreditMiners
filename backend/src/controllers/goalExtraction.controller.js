const { validationResult } = require("express-validator");

const goalExtractionService = require("../services/goalExtraction.service");

const asyncHandler = require("../middleware/asyncHandler");

const response = require("../utils/response");

class GoalExtractionController {
  extractGoals = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(
        res,
        errors.array()
      );
    }

    const { sessionId } = req.params;

    const result =
      await goalExtractionService.extractGoals(
        sessionId
      );

    return response.success(
      res,
      "Goals extracted successfully.",
      result
    );
  });

  getGoalSummary = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(
        res,
        errors.array()
      );
    }

    const { sessionId } = req.params;

    const result =
      await goalExtractionService.getGoalSummary(
        sessionId
      );

    return response.success(
      res,
      "Goal summary retrieved successfully.",
      result
    );
  });

  getGoalsByPriority = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(
        res,
        errors.array()
      );
    }

    const { sessionId, priority } = req.params;

    const result =
      await goalExtractionService.getGoalsByPriority(
        sessionId,
        priority
      );

    return response.success(
      res,
      "Goals retrieved successfully.",
      result
    );
  });

  getGoalsByCategory = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(
        res,
        errors.array()
      );
    }

    const { sessionId, category } = req.params;

    const result =
      await goalExtractionService.getGoalsByCategory(
        sessionId,
        category
      );

    return response.success(
      res,
      "Goals retrieved successfully.",
      result
    );
  });

  getGoalsByHorizon = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(
        res,
        errors.array()
      );
    }

    const { sessionId, horizon } = req.params;

    const result =
      await goalExtractionService.getGoalsByHorizon(
        sessionId,
        horizon
      );

    return response.success(
      res,
      "Goals retrieved successfully.",
      result
    );
  });
}

module.exports =
  new GoalExtractionController();