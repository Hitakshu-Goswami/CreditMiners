const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authenticate");

const goalExtractionController = require("../controllers/goalExtraction.controller");

const goalExtractionValidator = require("../validators/goalExtraction.validator");

router.use(authenticate);

router.get(
  "/goal-extraction/:sessionId",
  goalExtractionValidator.extractGoals(),
  goalExtractionController.extractGoals
);

router.get(
  "/goal-extraction/:sessionId/summary",
  goalExtractionValidator.getGoalSummary(),
  goalExtractionController.getGoalSummary
);

router.get(
  "/goal-extraction/:sessionId/priority/:priority",
  goalExtractionValidator.getGoalsByPriority(),
  goalExtractionController.getGoalsByPriority
);

router.get(
  "/goal-extraction/:sessionId/category/:category",
  goalExtractionValidator.getGoalsByCategory(),
  goalExtractionController.getGoalsByCategory
);

router.get(
  "/goal-extraction/:sessionId/horizon/:horizon",
  goalExtractionValidator.getGoalsByHorizon(),
  goalExtractionController.getGoalsByHorizon
);

module.exports = router;