const { body, param } = require("express-validator");

const uuidMessage = "A valid session ID is required.";

const sessionIdValidation = [
  param("id")
    .isUUID()
    .withMessage(uuidMessage),
];

const questionKeyValidation = [
  param("questionKey")
    .trim()
    .notEmpty()
    .withMessage("Question key is required.")
    .isLength({ max: 100 })
    .withMessage(
      "Question key cannot exceed 100 characters."
    ),
];

const answerValidation = [
  body("answer")
    .exists({
      checkNull: true,
    })
    .withMessage("Answer is required."),
];

module.exports = {
  startAssessment: [],

  getCurrentAssessment: [],

  getHistory: [],

  getAssessment: [
    ...sessionIdValidation,
  ],

  completeAssessment: [
    ...sessionIdValidation,
  ],

  cancelAssessment: [
    ...sessionIdValidation,
  ],

  resumeAssessment: [
    ...sessionIdValidation,
  ],

  getProgress: [
    ...sessionIdValidation,
  ],

  getAnswers: [
    ...sessionIdValidation,
  ],

  saveAnswer: [
    ...sessionIdValidation,

    body("questionKey")
      .trim()
      .notEmpty()
      .withMessage("Question key is required.")
      .isLength({ max: 100 })
      .withMessage(
        "Question key cannot exceed 100 characters."
      ),

    ...answerValidation,
  ],

  updateAnswer: [
    ...sessionIdValidation,

    ...questionKeyValidation,

    ...answerValidation,
  ],

  deleteAnswer: [
    ...sessionIdValidation,

    ...questionKeyValidation,
  ],
};
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