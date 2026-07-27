    const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authenticate");

const recommendationPreparationController = require("../controllers/recommendationPreparation.controller");

const recommendationPreparationValidator = require("../validators/recommendationPreparation.validator");

router.use(authenticate);

router.get(
  "/recommendation-preparation/:sessionId",
  recommendationPreparationValidator.generateRecommendationProfile(),
  recommendationPreparationController.generateRecommendationProfile
);

router.get(
  "/recommendation-preparation/:sessionId/asset-allocation",
  recommendationPreparationValidator.getAssetAllocation(),
  recommendationPreparationController.getAssetAllocation
);

router.get(
  "/recommendation-preparation/:sessionId/investment-categories",
  recommendationPreparationValidator.getInvestmentCategories(),
  recommendationPreparationController.getInvestmentCategories
);

router.get(
  "/recommendation-preparation/:sessionId/liquidity-preference",
  recommendationPreparationValidator.getLiquidityPreference(),
  recommendationPreparationController.getLiquidityPreference
);

router.get(
  "/recommendation-preparation/:sessionId/investment-frequency",
  recommendationPreparationValidator.getInvestmentFrequency(),
  recommendationPreparationController.getInvestmentFrequency
);

router.get(
  "/recommendation-preparation/:sessionId/goal-priorities",
  recommendationPreparationValidator.getGoalPriorities(),
  recommendationPreparationController.getGoalPriorities
);

module.exports = router;