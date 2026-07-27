const { body, query } = require("express-validator");

class AIRiskProfileValidator {
  startAssessment() {
    return [];
  }

  getQuestions() {
    return [
      query("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),
    ];
  }

  submitAnswer() {
    return [
      body("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),

      body("questionId")
        .trim()
        .notEmpty()
        .withMessage("Question ID is required.")
        .isUUID()
        .withMessage("Invalid question ID."),

      body("answer")
        .exists()
        .withMessage("Answer is required."),
    ];
  }

  completeAssessment() {
    return [
      body("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),
    ];
  }

  getLatestProfile() {
    return [];
  }

  getHistory() {
    return [];
  }

  getPersona() {
    return [];
  }

  getExplanation() {
    return [
      query("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),
    ];
  }
}

module.exports = new AIRiskProfileValidator();