const { body, param } = require("express-validator");

class AnswerValidationValidator {
  validateAnswer() {
    return [
      body("questionKey")
        .trim()
        .notEmpty()
        .withMessage("Question key is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage(
          "Question key must be between 2 and 100 characters."
        ),

      body("answer")
        .exists()
        .withMessage("Answer is required."),
    ];
  }

  validateMultipleAnswers() {
    return [
      body("answers")
        .isArray({ min: 1 })
        .withMessage(
          "Answers must be a non-empty array."
        ),

      body("answers.*.questionKey")
        .trim()
        .notEmpty()
        .withMessage("Question key is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage(
          "Question key must be between 2 and 100 characters."
        ),

      body("answers.*.answer")
        .exists()
        .withMessage("Answer is required."),
    ];
  }

  normalizeAnswer() {
    return [
      body("questionKey")
        .trim()
        .notEmpty()
        .withMessage("Question key is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage(
          "Question key must be between 2 and 100 characters."
        ),

      body("answer")
        .exists()
        .withMessage("Answer is required."),
    ];
  }

  getQuestionValidationRules() {
    return [
      param("questionKey")
        .trim()
        .notEmpty()
        .withMessage("Question key is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage(
          "Question key must be between 2 and 100 characters."
        ),
    ];
  }

  validateAssessmentAnswers() {
    return [
      body("answers")
        .isObject()
        .withMessage(
          "Answers must be an object."
        ),
    ];
  }
}

module.exports =
  new AnswerValidationValidator();