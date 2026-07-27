const express = require("express");

const router = express.Router();

const riskAssessmentController = require("../controllers/riskAssessment.controller");

const riskAssessmentValidator = require("../validators/riskAssessment.validator");

const authenticate = require("../middleware/authenticate");

/*
|--------------------------------------------------------------------------
| Risk Assessment Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/risk-assessment/start",
  authenticate,
  riskAssessmentValidator.startAssessment,
  riskAssessmentController.startAssessment
);

router.get(
  "/risk-assessment/current",
  authenticate,
  riskAssessmentValidator.getCurrentAssessment,
  riskAssessmentController.getCurrentAssessment
);

router.get(
  "/risk-assessment/history",
  authenticate,
  riskAssessmentValidator.getHistory,
  riskAssessmentController.getHistory
);

router.get(
  "/risk-assessment/:id",
  authenticate,
  riskAssessmentValidator.getAssessment,
  riskAssessmentController.getAssessment
);

router.post(
  "/risk-assessment/:id/complete",
  authenticate,
  riskAssessmentValidator.completeAssessment,
  riskAssessmentController.completeAssessment
);

router.post(
  "/risk-assessment/:id/cancel",
  authenticate,
  riskAssessmentValidator.cancelAssessment,
  riskAssessmentController.cancelAssessment
);

router.post(
  "/risk-assessment/:id/resume",
  authenticate,
  riskAssessmentValidator.resumeAssessment,
  riskAssessmentController.resumeAssessment
);

router.get(
  "/risk-assessment/:id/progress",
  authenticate,
  riskAssessmentValidator.getProgress,
  riskAssessmentController.getProgress
);

router.get(
  "/risk-assessment/:id/answers",
  authenticate,
  riskAssessmentValidator.getAnswers,
  riskAssessmentController.getAnswers
);

router.post(
  "/risk-assessment/:id/answers",
  authenticate,
  riskAssessmentValidator.saveAnswer,
  riskAssessmentController.saveAnswer
);

router.put(
  "/risk-assessment/:id/answers/:questionKey",
  authenticate,
  riskAssessmentValidator.updateAnswer,
  riskAssessmentController.updateAnswer
);

router.delete(
  "/risk-assessment/:id/answers/:questionKey",
  authenticate,
  riskAssessmentValidator.deleteAnswer,
  riskAssessmentController.deleteAnswer
);

module.exports = router;