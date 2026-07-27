const express = require("express");

const router = express.Router();

const {
    authenticate
} = require("../middleware/auth.middleware");

const assessmentHistoryController = require("../controllers/assessmentHistory.controller");

const assessmentHistoryValidator = require("../validators/assessmentHistory.validator");

router.use(authenticate);

router.post(
  "/assessment-history/:sessionId/snapshot",
  assessmentHistoryValidator.createSnapshot(),
  assessmentHistoryController.createSnapshot
);

router.get(
  "/assessment-history/latest",
  assessmentHistoryValidator.getLatestSnapshot(),
  assessmentHistoryController.getLatestSnapshot
);

router.get(
  "/assessment-history",
  assessmentHistoryValidator.getHistory(),
  assessmentHistoryController.getHistory
);

router.get(
  "/assessment-history/compare/:latestId/:previousId",
  assessmentHistoryValidator.compareSnapshots(),
  assessmentHistoryController.compareSnapshots
);

router.delete(
  "/assessment-history/:snapshotId",
  assessmentHistoryValidator.deleteSnapshot(),
  assessmentHistoryController.deleteSnapshot
);

module.exports = router;