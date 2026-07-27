const { validationResult } = require("express-validator");

const investorPersonaService = require("../services/investorPersona.service");

const asyncHandler = require("../middleware/asyncHandler");

const response = require("../utils/response");

class InvestorPersonaController {
  generatePersona = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(
        res,
        errors.array()
      );
    }

    const { sessionId } = req.params;

    const result =
      await investorPersonaService.generatePersona(
        sessionId
      );

    return response.success(
      res,
      "Investor persona generated successfully.",
      result
    );
  });

  getPersonaSummary = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(
        res,
        errors.array()
      );
    }

    const { sessionId } = req.params;

    const result =
      await investorPersonaService.getPersonaSummary(
        sessionId
      );

    return response.success(
      res,
      "Investor persona summary retrieved successfully.",
      result
    );
  });

  getRecommendations = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(
        res,
        errors.array()
      );
    }

    const { sessionId } = req.params;

    const result =
      await investorPersonaService.getRecommendations(
        sessionId
      );

    return response.success(
      res,
      "Investment recommendations retrieved successfully.",
      result
    );
  });

  getSuitableProducts = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(
        res,
        errors.array()
      );
    }

    const { sessionId } = req.params;

    const result =
      await investorPersonaService.getSuitableProducts(
        sessionId
      );

    return response.success(
      res,
      "Suitable investment products retrieved successfully.",
      result
    );
  });
}

module.exports = new InvestorPersonaController();