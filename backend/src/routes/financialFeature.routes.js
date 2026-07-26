const express = require("express");

const { authenticate } = require("../middleware/auth.middleware");
const financialFeatureController = require("../controllers/financialFeature.controller");

const {
  computeFeaturesValidator,
  jobIdValidator,
  listFeaturesValidator,
  listRunsValidator,
  runIdValidator,
} = require("../validators/financialFeature.validator");

const router = express.Router();

router.use(authenticate);

router.post(
  "/compute",
  computeFeaturesValidator,
  financialFeatureController.computeFeatures
);

router.get(
  "/documentation",
  financialFeatureController.getDocumentation
);

router.get(
  "/jobs/:jobId",
  jobIdValidator,
  financialFeatureController.getJob
);

router.get(
  "/",
  listFeaturesValidator,
  financialFeatureController.listFeatures
);

router.get(
  "/summary",
  financialFeatureController.getSummary
);

router.get(
  "/runs",
  listRunsValidator,
  financialFeatureController.listRuns
);

router.get(
  "/runs/:runId",
  runIdValidator,
  financialFeatureController.getRun
);

module.exports = router;
