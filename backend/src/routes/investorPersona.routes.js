const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authenticate");

const investorPersonaController = require("../controllers/investorPersona.controller");

const investorPersonaValidator = require("../validators/investorPersona.validator");

router.use(authenticate);

router.get(
  "/investor-persona/:sessionId",
  investorPersonaValidator.generatePersona(),
  investorPersonaController.generatePersona
);

router.get(
  "/investor-persona/:sessionId/summary",
  investorPersonaValidator.getPersonaSummary(),
  investorPersonaController.getPersonaSummary
);

router.get(
  "/investor-persona/:sessionId/recommendations",
  investorPersonaValidator.getRecommendations(),
  investorPersonaController.getRecommendations
);

router.get(
  "/investor-persona/:sessionId/products",
  investorPersonaValidator.getSuitableProducts(),
  investorPersonaController.getSuitableProducts
);

module.exports = router;