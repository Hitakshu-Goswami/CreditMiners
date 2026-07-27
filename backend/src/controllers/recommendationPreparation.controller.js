const { validationResult } = require("express-validator");

const asyncHandler = require("../middleware/asyncHandler");

const response = require("../utils/response");

const RecommendationPreparationService = require("../services/recommendationPreparation.service");

class RecommendationPreparationController {
  generateRecommendationProfile = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.params;

    const recommendationProfile =
      await RecommendationPreparationService.generateRecommendationProfile(
        sessionId
      );

    return response.success(
      res,
      "Recommendation preparation profile generated successfully.",
      recommendationProfile
    );
  });

  getAssetAllocation = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.params;

    const assetAllocation =
      await RecommendationPreparationService.getAssetAllocation(
        sessionId
      );

    return response.success(
      res,
      "Asset allocation retrieved successfully.",
      assetAllocation
    );
  });

  getInvestmentCategories = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.params;

    const investmentCategories =
      await RecommendationPreparationService.getInvestmentCategories(
        sessionId
      );

    return response.success(
      res,
      "Investment categories retrieved successfully.",
      investmentCategories
    );
  });

  getLiquidityPreference = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.params;

    const liquidityPreference =
      await RecommendationPreparationService.getLiquidityPreference(
        sessionId
      );

    return response.success(
      res,
      "Liquidity preference retrieved successfully.",
      liquidityPreference
    );
  });

  getInvestmentFrequency = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.params;

    const investmentFrequency =
      await RecommendationPreparationService.getInvestmentFrequency(
        sessionId
      );

    return response.success(
      res,
      "Investment frequency retrieved successfully.",
      investmentFrequency
    );
  });

  getGoalPriorities = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.params;

    const goalPriorities =
      await RecommendationPreparationService.getGoalPriorities(
        sessionId
      );

    return response.success(
      res,
      "Goal priorities retrieved successfully.",
      goalPriorities
    );
  });
}

module.exports = new RecommendationPreparationController();