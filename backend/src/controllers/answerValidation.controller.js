const { validationResult } = require("express-validator");

const answerValidationService = require("../services/answerValidation.service");

const asyncHandler = require("../middleware/asyncHandler");

const response = require("../utils/response");

class AnswerValidationController {
  validateAnswer = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(
        res,
        errors.array()
      );
    }

    const data =
      await answerValidationService.validateAnswer(
        req.body.questionKey,
        req.body.answer
      );

    return response.success(
      res,
      200,
      "Answer validated successfully.",
      data
    );
  });

  validateMultipleAnswers = asyncHandler(
    async (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return response.validationError(
          res,
          errors.array()
        );
      }

      const data =
        await answerValidationService.validateMultipleAnswers(
          req.body.answers
        );

      return response.success(
        res,
        200,
        "Answers validated successfully.",
        data
      );
    }
  );

  normalizeAnswer = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(
        res,
        errors.array()
      );
    }

    const data =
      await answerValidationService.normalizeAnswer(
        req.body.questionKey,
        req.body.answer
      );

    return response.success(
      res,
      200,
      "Answer normalized successfully.",
      data
    );
  });

  getQuestionValidationRules = asyncHandler(
    async (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return response.validationError(
          res,
          errors.array()
        );
      }

      const data =
        await answerValidationService.getQuestionValidationRules(
          req.params.questionKey
        );

      return response.success(
        res,
        200,
        "Validation rules fetched successfully.",
        data
      );
    }
  );

  validateAssessmentAnswers = asyncHandler(
    async (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return response.validationError(
          res,
          errors.array()
        );
      }

      const data =
        await answerValidationService.validateAssessmentAnswers(
          req.body.answers
        );

      return response.success(
        res,
        200,
        "Assessment answers validated successfully.",
        data
      );
    }
  );
}

module.exports =
  new AnswerValidationController();