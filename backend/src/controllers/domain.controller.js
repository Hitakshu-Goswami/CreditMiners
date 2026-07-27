    const { validationResult } = require("express-validator");

const domainService = require("../services/domain.service");

const asyncHandler = require("../middleware/asyncHandler");

const response = require("../utils/response");

class DomainController {
  getAssessmentProfile = asyncHandler(
    async (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return response.validationError(
          res,
          errors.array()
        );
      }

      const data =
        await domainService.getAssessmentProfile(
          req.user.id,
          req.params.sessionId
        );

      return response.success(
        res,
        200,
        "Assessment profile fetched successfully.",
        data
      );
    }
  );

  getDomainProfile = asyncHandler(
    async (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return response.validationError(
          res,
          errors.array()
        );
      }

      const data =
        await domainService.getDomainProfile(
          req.user.id,
          req.params.sessionId,
          req.params.domainKey
        );

      return response.success(
        res,
        200,
        "Domain profile fetched successfully.",
        data
      );
    }
  );

  getAllDomains = asyncHandler(
    async (req, res) => {
      const data =
        await domainService.getAllDomains();

      return response.success(
        res,
        200,
        "Assessment domains fetched successfully.",
        data
      );
    }
  );

  getDomain = asyncHandler(
    async (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return response.validationError(
          res,
          errors.array()
        );
      }

      const data =
        await domainService.getDomain(
          req.params.domainKey
        );

      return response.success(
        res,
        200,
        "Assessment domain fetched successfully.",
        data
      );
    }
  );
}

module.exports =
  new DomainController();