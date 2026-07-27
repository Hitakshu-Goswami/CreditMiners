const { param } = require("express-validator");

const {
  GOAL_PRIORITY,
  GOAL_CATEGORIES,
  GOAL_HORIZON,
} = require("../constants/goalExtraction.constants");

class GoalExtractionValidator {
  extractGoals() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),
    ];
  }

  getGoalSummary() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),
    ];
  }

  getGoalsByPriority() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),

      param("priority")
        .trim()
        .notEmpty()
        .withMessage("Priority is required.")
        .isIn(Object.values(GOAL_PRIORITY))
        .withMessage("Invalid goal priority."),
    ];
  }

  getGoalsByCategory() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),

      param("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required.")
        .isIn(Object.values(GOAL_CATEGORIES))
        .withMessage("Invalid goal category."),
    ];
  }

  getGoalsByHorizon() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),

      param("horizon")
        .trim()
        .notEmpty()
        .withMessage("Horizon is required.")
        .isIn(Object.values(GOAL_HORIZON))
        .withMessage("Invalid goal horizon."),
    ];
  }
}

module.exports = new GoalExtractionValidator();