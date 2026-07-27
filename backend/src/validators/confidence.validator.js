const { param } = require("express-validator");

const {
  CONFIDENCE_DIMENSIONS,
} = require("../constants/confidence.constants");

class ConfidenceValidator {
  generateConfidence() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),
    ];
  }

  getOverallConfidence() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),
    ];
  }

  getConfidenceDimension() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),

      param("dimension")
        .trim()
        .notEmpty()
        .withMessage("Confidence dimension is required.")
        .isIn(Object.values(CONFIDENCE_DIMENSIONS))
        .withMessage(
          `Dimension must be one of: ${Object.values(
            CONFIDENCE_DIMENSIONS
          ).join(", ")}`
        ),
    ];
  }

  getConfidenceSummary() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),
    ];
  }
}

module.exports = new ConfidenceValidator();