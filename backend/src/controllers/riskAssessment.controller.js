const { validationResult } = require("express-validator");

const riskAssessmentService = require("../services/riskAssessment.service");

const asyncHandler = require("../middleware/asyncHandler");

const response = require("../utils/response");

class RiskAssessmentController {
  startAssessment = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(
        res,
        errors.array()
      );
    }

    const data =
      await riskAssessmentService.startAssessment(
        req.user.id
      );

    return response.success(
      res,
      201,
      "Risk assessment started successfully.",
      data
    );
  });

  getCurrentAssessment = asyncHandler(
    async (req, res) => {
      const data =
        await riskAssessmentService.getCurrentAssessment(
          req.user.id
        );

      return response.success(
        res,
        200,
        "Current assessment fetched successfully.",
        data
      );
    }
  );

  getAssessment = asyncHandler(
    async (req, res) => {
      const data =
        await riskAssessmentService.getAssessment(
          req.user.id,
          req.params.id
        );

      return response.success(
        res,
        200,
        "Assessment fetched successfully.",
        data
      );
    }
  );

  getHistory = asyncHandler(async (req, res) => {
    const data =
      await riskAssessmentService.getHistory(
        req.user.id
      );

    return response.success(
      res,
      200,
      "Assessment history fetched successfully.",
      data
    );
  });

  completeAssessment = asyncHandler(
    async (req, res) => {
      const data =
        await riskAssessmentService.completeAssessment(
          req.user.id,
          req.params.id
        );

      return response.success(
        res,
        200,
        "Assessment completed successfully.",
        data
      );
    }
  );

  cancelAssessment = asyncHandler(
    async (req, res) => {
      const data =
        await riskAssessmentService.cancelAssessment(
          req.user.id,
          req.params.id
        );

      return response.success(
        res,
        200,
        "Assessment cancelled successfully.",
        data
      );
    }
  );

  saveAnswer = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(
        res,
        errors.array()
      );
    }

    const data =
      await riskAssessmentService.saveAnswer(
        req.user.id,
        req.params.id,
        req.body.questionKey,
        req.body.answer
      );

    return response.success(
      res,
      200,
      "Answer saved successfully.",
      data
    );
  });

  updateAnswer = asyncHandler(
    async (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return response.validationError(
          res,
          errors.array()
        );
      }

      const data =
        await riskAssessmentService.updateAnswer(
          req.user.id,
          req.params.id,
          req.params.questionKey,
          req.body.answer
        );

      return response.success(
        res,
        200,
        "Answer updated successfully.",
        data
      );
    }
  );

  deleteAnswer = asyncHandler(
    async (req, res) => {
      const data =
        await riskAssessmentService.deleteAnswer(
          req.user.id,
          req.params.id,
          req.params.questionKey
        );

      return response.success(
        res,
        200,
        "Answer deleted successfully.",
        data
      );
    }
  );

  getAnswers = asyncHandler(async (req, res) => {
    const data =
      await riskAssessmentService.getAnswers(
        req.user.id,
        req.params.id
      );

    return response.success(
      res,
      200,
      "Answers fetched successfully.",
      data
    );
  });

  getProgress = asyncHandler(
    async (req, res) => {
      const data =
        await riskAssessmentService.getProgress(
          req.user.id,
          req.params.id
        );

      return response.success(
        res,
        200,
        "Assessment progress fetched successfully.",
        data
      );
    }
  );

  resumeAssessment = asyncHandler(
    async (req, res) => {
      const data =
        await riskAssessmentService.resumeAssessment(
          req.user.id,
          req.params.id
        );

      return response.success(
        res,
        200,
        "Assessment resumed successfully.",
        data
      );
    }
  );
}

module.exports = new RiskAssessmentController();