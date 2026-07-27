const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authenticate");

const confidenceController = require("../controllers/confidence.controller");

const confidenceValidator = require("../validators/confidence.validator");

router.use(authenticate);

router.get(
  "/confidence/:sessionId",
  confidenceValidator.generateConfidence(),
  confidenceController.generateConfidence
);

router.get(
  "/confidence/:sessionId/overall",
  confidenceValidator.getOverallConfidence(),
  confidenceController.getOverallConfidence
);

router.get(
  "/confidence/:sessionId/summary",
  confidenceValidator.getConfidenceSummary(),
  confidenceController.getConfidenceSummary
);

router.get(
  "/confidence/:sessionId/dimension/:dimension",
  confidenceValidator.getConfidenceDimension(),
  confidenceController.getConfidenceDimension
);

module.exports = router;