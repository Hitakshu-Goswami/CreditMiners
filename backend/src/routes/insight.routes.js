const express = require("express");

const { authenticate } = require("../middleware/auth.middleware");
const insightController = require("../controllers/insight.controller");
const {
  insightIdValidator,
  listInsightsValidator,
} = require("../validators/insight.validator");

const router = express.Router();

router.use(authenticate);

router.get(
  "/insights/input-contract",
  insightController.getInsightInputContract
);

router.get(
  "/insights",
  listInsightsValidator,
  insightController.listInsights
);

router.get(
  "/insights/:id",
  insightIdValidator,
  insightController.getInsight
);

module.exports = router;
