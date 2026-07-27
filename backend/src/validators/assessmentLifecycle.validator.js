const { body, param } = require("express-validator");

class AssessmentLifecycleValidator {
  startAssessment() {
    return [
      body("assessmentType")
        .trim()
        .notEmpty()
        .withMessage("Assessment type is required.")
        .isIn([
          "INITIAL",
          "PERIODIC",
          "ANNUAL",
          "REASSESSMENT",
        ])
        .withMessage("Invalid assessment type."),
    ];
  }

  resumeAssessment() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),
    ];
  }

  restartAssessment() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),
    ];
  }

  completeAssessment() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),
    ];
  }

  archiveAssessment() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),
    ];
  }

  restoreAssessment() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),
    ];
  }

  getAssessmentHistory() {
    return [];
  }

  compareAssessments() {
    return [
      param("currentSessionId")
        .trim()
        .notEmpty()
        .withMessage("Current session ID is required.")
        .isUUID()
        .withMessage("Invalid current session ID."),

      param("previousSessionId")
        .trim()
        .notEmpty()
        .withMessage("Previous session ID is required.")
        .isUUID()
        .withMessage("Invalid previous session ID."),
    ];
  }

  getVersionInformation() {
    return [];
  }

  getCurrentAssessment() {
    return [];
  }

  getLatestCompletedAssessment() {
    return [];
  }
}

module.exports = new AssessmentLifecycleValidator();