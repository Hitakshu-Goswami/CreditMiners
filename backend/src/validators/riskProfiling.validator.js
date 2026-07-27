const { param } = require("express-validator");

const {
  RISK_DIMENSIONS,
} = require("../constants/riskProfiling.constants");

class RiskProfilingValidator {
  generateRiskProfile() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),
    ];
  }

  getOverallRisk() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),
    ];
  }

  getRiskDimension() {
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
        .withMessage("Risk dimension is required.")
        .isIn(
          Object.values(RISK_DIMENSIONS).filter(
            (dimension) =>
              dimension !== RISK_DIMENSIONS.OVERALL
          )
        )
        .withMessage("Invalid risk dimension."),
    ];
  }
}

module.exports =
  new RiskProfilingValidator();