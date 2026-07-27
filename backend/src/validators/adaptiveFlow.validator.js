const { param } = require("express-validator");

class AdaptiveFlowValidator {
  getFlowSummary() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),
    ];
  }

  getNextQuestion() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),
    ];
  }

  getVisibleQuestions() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),
    ];
  }

  getRemainingQuestions() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),
    ];
  }

  calculateProgress() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),
    ];
  }

  predictCompletion() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),
    ];
  }

  getQuestionStatus() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),

      param("questionKey")
        .trim()
        .notEmpty()
        .withMessage("Question key is required.")
        .isLength({
          min: 2,
          max: 100,
        })
        .withMessage(
          "Question key must be between 2 and 100 characters."
        ),
    ];
  }
}

module.exports = new AdaptiveFlowValidator();