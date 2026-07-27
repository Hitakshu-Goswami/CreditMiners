const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authenticate");

const domainController = require("../controllers/domain.controller");

const domainValidator = require("../validators/domain.validator");

router.use(authenticate);

router.get(
  "/domains",
  domainValidator.getAllDomains(),
  domainController.getAllDomains
);

router.get(
  "/domains/:domainKey",
  domainValidator.getDomain(),
  domainController.getDomain
);

router.get(
  "/domains/profile/:sessionId",
  domainValidator.getAssessmentProfile(),
  domainController.getAssessmentProfile
);

router.get(
  "/domains/profile/:sessionId/:domainKey",
  domainValidator.getDomainProfile(),
  domainController.getDomainProfile
);

module.exports = router;