const express = require("express");

const router = express.Router();

const {
    authenticate
} = require("../middleware/auth.middleware");

const explainabilityController = require("../controllers/explainability.controller");

const explainabilityValidator = require("../validators/explainability.validator");

router.use(authenticate);

router.get(
  "/explainability/:sessionId",
  explainabilityValidator.generateExplanations(),
  explainabilityController.generateExplanations
);

router.get(
  "/explainability/:sessionId/risk",
  explainabilityValidator.getRiskExplanation(),
  explainabilityController.getRiskExplanation
);

router.get(
  "/explainability/:sessionId/persona",
  explainabilityValidator.getPersonaExplanation(),
  explainabilityController.getPersonaExplanation
);

router.get(
  "/explainability/:sessionId/goals",
  explainabilityValidator.getGoalExplanation(),
  explainabilityController.getGoalExplanation
);

router.get(
  "/explainability/:sessionId/confidence",
  explainabilityValidator.getConfidenceExplanation(),
  explainabilityController.getConfidenceExplanation
);

router.get(
  "/explainability/:sessionId/recommendations",
  explainabilityValidator.getRecommendationExplanation(),
  explainabilityController.getRecommendationExplanation
);

module.exports = router;