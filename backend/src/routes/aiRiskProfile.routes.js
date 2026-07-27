const express = require("express");

const router = express.Router();

const {
    authenticate
} = require("../middleware/auth.middleware");

const aiRiskProfileController = require("../controllers/aiRiskProfile.controller");
const aiRiskProfileValidator = require("../validators/aiRiskProfile.validator");

router.use(authenticate);

/**
 * Assessment Lifecycle
 */
router.post(
  "/start",
  aiRiskProfileValidator.startAssessment(),
  aiRiskProfileController.startAssessment
);

router.get(
  "/questions",
  aiRiskProfileValidator.getQuestions(),
  aiRiskProfileController.getQuestions
);

router.post(
  "/answer",
  aiRiskProfileValidator.submitAnswer(),
  aiRiskProfileController.submitAnswer
);

router.post(
  "/complete",
  aiRiskProfileValidator.completeAssessment(),
  aiRiskProfileController.completeAssessment
);

/**
 * Assessment Results
 */
router.get(
  "/latest",
  aiRiskProfileValidator.getLatestProfile(),
  aiRiskProfileController.getLatestProfile
);

router.get(
  "/history",
  aiRiskProfileValidator.getHistory(),
  aiRiskProfileController.getHistory
);

router.get(
  "/persona",
  aiRiskProfileValidator.getPersona(),
  aiRiskProfileController.getPersona
);

router.get(
  "/explanation",
  aiRiskProfileValidator.getExplanation(),
  aiRiskProfileController.getExplanation
);

module.exports = router;