const { validationResult } = require("express-validator");

const questionService = require("../services/question.service");

const asyncHandler = require("../middleware/asyncHandler");

const response = require("../utils/response");

class QuestionController {
  getAllQuestions = asyncHandler(async (req, res) => {
    const data = await questionService.getAllQuestions(
      req.query.version
    );

    return response.success(
      res,
      200,
      "Questions fetched successfully.",
      data
    );
  });

  getQuestionByKey = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(
        res,
        errors.array()
      );
    }

    const data = await questionService.getQuestionByKey(
      req.params.key,
      req.query.version
    );

    return response.success(
      res,
      200,
      "Question fetched successfully.",
      data
    );
  });

  getQuestionsBySection = asyncHandler(
    async (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return response.validationError(
          res,
          errors.array()
        );
      }

      const data =
        await questionService.getQuestionsBySection(
          req.params.section,
          req.query.version
        );

      return response.success(
        res,
        200,
        "Questions fetched successfully.",
        data
      );
    }
  );

  getQuestionsByCategory = asyncHandler(
    async (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return response.validationError(
          res,
          errors.array()
        );
      }

      const data =
        await questionService.getQuestionsByCategory(
          req.params.category,
          req.query.version
        );

      return response.success(
        res,
        200,
        "Questions fetched successfully.",
        data
      );
    }
  );

  getCurrentQuestion = asyncHandler(
    async (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return response.validationError(
          res,
          errors.array()
        );
      }

      const data =
        await questionService.getCurrentQuestion(
          req.user.id,
          req.params.sessionId
        );

      return response.success(
        res,
        200,
        "Current question fetched successfully.",
        data
      );
    }
  );

  getNextQuestion = asyncHandler(
    async (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return response.validationError(
          res,
          errors.array()
        );
      }

      const data =
        await questionService.getNextQuestion(
          req.user.id,
          req.params.sessionId
        );

      return response.success(
        res,
        200,
        "Next question fetched successfully.",
        data
      );
    }
  );

  validateAnswer = asyncHandler(
    async (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return response.validationError(
          res,
          errors.array()
        );
      }

      const data =
        await questionService.validateAnswer(
          req.body.questionKey,
          req.body.answer,
          req.body.version
        );

      return response.success(
        res,
        200,
        "Answer validated successfully.",
        data
      );
    }
  );
}

module.exports = new QuestionController();