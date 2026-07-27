const { param } = require("express-validator");

class AssessmentHistoryValidator {
  createSnapshot() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),
    ];
  }

  getLatestSnapshot() {
    return [];
  }

  getHistory() {
    return [];
  }

  compareSnapshots() {
    return [
      param("latestId")
        .trim()
        .notEmpty()
        .withMessage("Latest snapshot ID is required.")
        .isUUID()
        .withMessage("Invalid latest snapshot ID."),

      param("previousId")
        .trim()
        .notEmpty()
        .withMessage("Previous snapshot ID is required.")
        .isUUID()
        .withMessage("Invalid previous snapshot ID."),
    ];
  }

  deleteSnapshot() {
    return [
      param("snapshotId")
        .trim()
        .notEmpty()
        .withMessage("Snapshot ID is required.")
        .isUUID()
        .withMessage("Invalid snapshot ID."),
    ];
  }
}

module.exports = new AssessmentHistoryValidator();