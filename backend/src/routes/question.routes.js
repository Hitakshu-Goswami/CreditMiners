const express = require("express");

const router = express.Router();

const questionController = require("../controllers/question.controller");

const questionValidator = require("../validators/question.validator");
const {
    authenticate
} = require("../middleware/auth.middleware");

/*
|--------------------------------------------------------------------------
| Question Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/questions",
  authenticate,
  questionValidator.getAllQuestions,
  questionController.getAllQuestions
);

router.get(
  "/questions/:key",
  authenticate,
  questionValidator.getQuestionByKey,
  questionController.getQuestionByKey
);

router.get(
  "/questions/section/:section",
  authenticate,
  questionValidator.getQuestionsBySection,
  questionController.getQuestionsBySection
);

router.get(
  "/questions/category/:category",
  authenticate,
  questionValidator.getQuestionsByCategory,
  questionController.getQuestionsByCategory
);

router.get(
  "/questions/current/:sessionId",
  authenticate,
  questionValidator.getCurrentQuestion,
  questionController.getCurrentQuestion
);

router.get(
  "/questions/next/:sessionId",
  authenticate,
  questionValidator.getNextQuestion,
  questionController.getNextQuestion
);

router.post(
  "/questions/validate",
  authenticate,
  questionValidator.validateAnswer,
  questionController.validateAnswer
);

module.exports = router;