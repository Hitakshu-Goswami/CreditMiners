const express = require("express");

const router = express.Router();

const {
    authenticate
} = require("../middleware/auth.middleware");

const assessmentLifecycleController = require("../controllers/assessmentLifecycle.controller");

const assessmentLifecycleValidator = require("../validators/assessmentLifecycle.validator");

router.use(authenticate);

router.post(
  "/assessment-lifecycle/start",
  assessmentLifecycleValidator.startAssessment(),
  assessmentLifecycleController.startAssessment
);

router.get(
  "/assessment-lifecycle/:sessionId/resume",
  assessmentLifecycleValidator.resumeAssessment(),
  assessmentLifecycleController.resumeAssessment
);

router.post(
  "/assessment-lifecycle/:sessionId/restart",
  assessmentLifecycleValidator.restartAssessment(),
  assessmentLifecycleController.restartAssessment
);

router.post(
  "/assessment-lifecycle/:sessionId/complete",
  assessmentLifecycleValidator.completeAssessment(),
  assessmentLifecycleController.completeAssessment
);

router.post(
  "/assessment-lifecycle/:sessionId/archive",
  assessmentLifecycleValidator.archiveAssessment(),
  assessmentLifecycleController.archiveAssessment
);

router.post(
  "/assessment-lifecycle/:sessionId/restore",
  assessmentLifecycleValidator.restoreAssessment(),
  assessmentLifecycleController.restoreAssessment
);

router.get(
  "/assessment-lifecycle/history",
  assessmentLifecycleValidator.getAssessmentHistory(),
  assessmentLifecycleController.getAssessmentHistory
);

router.get(
  "/assessment-lifecycle/compare/:currentSessionId/:previousSessionId",
  assessmentLifecycleValidator.compareAssessments(),
  assessmentLifecycleController.compareAssessments
);

router.get(
  "/assessment-lifecycle/version",
  assessmentLifecycleValidator.getVersionInformation(),
  assessmentLifecycleController.getVersionInformation
);

router.get(
  "/assessment-lifecycle/current",
  assessmentLifecycleValidator.getCurrentAssessment(),
  assessmentLifecycleController.getCurrentAssessment
);

router.get(
  "/assessment-lifecycle/latest-completed",
  assessmentLifecycleValidator.getLatestCompletedAssessment(),
  assessmentLifecycleController.getLatestCompletedAssessment
);

module.exports = router;