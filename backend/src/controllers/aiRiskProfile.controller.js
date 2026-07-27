const { validationResult } = require("express-validator");

const asyncHandler = require("../middleware/asyncHandler");
const response = require("../utils/response");

const aiRiskProfileService = require("../services/aiRiskProfile.service");

class AIRiskProfileController {
  startAssessment = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const session = await aiRiskProfileService.startAssessment(
      req.user.id
    );

    return response.success(
      res,
      "Assessment started successfully.",
      session
    );
  });

  getQuestions = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.query;

    const questions =
      await aiRiskProfileService.getQuestions(sessionId);

    return response.success(
      res,
      "Questions retrieved successfully.",
      questions
    );
  });

  submitAnswer = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.body;

    const result =
      await aiRiskProfileService.submitAnswer(
        sessionId,
        req.body
      );

    return response.success(
      res,
      "Answer submitted successfully.",
      result
    );
  });

  completeAssessment = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.body;

    const result =
      await aiRiskProfileService.completeAssessment(
        sessionId
      );

    return response.success(
      res,
      "Assessment completed successfully.",
      result
    );
  });

  getLatestProfile = asyncHandler(async (req, res) => {
    const profile =
      await aiRiskProfileService.getLatestProfile(
        req.user.id
      );

    return response.success(
      res,
      "Latest profile retrieved successfully.",
      profile
    );
  });

  getHistory = asyncHandler(async (req, res) => {
    const history =
      await aiRiskProfileService.getHistory(
        req.user.id
      );

    return response.success(
      res,
      "Assessment history retrieved successfully.",
      history
    );
  });

  getPersona = asyncHandler(async (req, res) => {
    const persona =
      await aiRiskProfileService.getPersona(
        req.user.id
      );

    return response.success(
      res,
      "Investor persona retrieved successfully.",
      persona
    );
  });

  getExplanation = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.query;

    const explanation =
      await aiRiskProfileService.getExplanation(
        sessionId
      );

    return response.success(
      res,
      "Assessment explanation retrieved successfully.",
      explanation
    );
  });
}

module.exports = new AIRiskProfileController();