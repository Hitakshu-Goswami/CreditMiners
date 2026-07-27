const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authenticate");

const riskProfilingController = require("../controllers/riskProfiling.controller");

const riskProfilingValidator = require("../validators/riskProfiling.validator");

router.use(authenticate);

router.get(
  "/risk-profile/:sessionId",
  riskProfilingValidator.generateRiskProfile(),
  riskProfilingController.generateRiskProfile
);

router.get(
  "/risk-profile/:sessionId/overall",
  riskProfilingValidator.getOverallRisk(),
  riskProfilingController.getOverallRisk
);

router.get(
  "/risk-profile/:sessionId/dimension/:dimension",
  riskProfilingValidator.getRiskDimension(),
  riskProfilingController.getRiskDimension
);

module.exports = router;