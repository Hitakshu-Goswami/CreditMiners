const { validationResult } = require("express-validator");

const asyncHandler = require("../middleware/asyncHandler");

const response = require("../utils/response");

const AssessmentLifecycleService = require("../services/assessmentLifecycle.service");

class AssessmentLifecycleController {
  startAssessment = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const userId = req.user.id;

    const assessment =
      await AssessmentLifecycleService.startAssessment(
        userId,
        req.body
      );

    return response.success(
      res,
      "Assessment started successfully.",
      assessment
    );
  });

  resumeAssessment = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.params;

    const assessment =
      await AssessmentLifecycleService.resumeAssessment(
        sessionId
      );

    return response.success(
      res,
      "Assessment resumed successfully.",
      assessment
    );
  });

  restartAssessment = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.params;

    const assessment =
      await AssessmentLifecycleService.restartAssessment(
        sessionId
      );

    return response.success(
      res,
      "Assessment restarted successfully.",
      assessment
    );
  });

  completeAssessment = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.params;

    const assessment =
      await AssessmentLifecycleService.completeAssessment(
        sessionId
      );

    return response.success(
      res,
      "Assessment completed successfully.",
      assessment
    );
  });

  archiveAssessment = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.params;

    const assessment =
      await AssessmentLifecycleService.archiveAssessment(
        sessionId
      );

    return response.success(
      res,
      "Assessment archived successfully.",
      assessment
    );
  });

  restoreAssessment = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.params;

    const assessment =
      await AssessmentLifecycleService.restoreAssessment(
        sessionId
      );

    return response.success(
      res,
      "Assessment restored successfully.",
      assessment
    );
  });

  getAssessmentHistory = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const userId = req.user.id;

    const history =
      await AssessmentLifecycleService.getAssessmentHistory(
        userId
      );

    return response.success(
      res,
      "Assessment history retrieved successfully.",
      history
    );
  });

  compareAssessments = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { currentSessionId, previousSessionId } =
      req.params;

    const comparison =
      await AssessmentLifecycleService.compareAssessments(
        currentSessionId,
        previousSessionId
      );

    return response.success(
      res,
      "Assessment comparison retrieved successfully.",
      comparison
    );
  });

  getVersionInformation = asyncHandler(async (req, res) => {
    const version =
      await AssessmentLifecycleService.getVersionInformation();

    return response.success(
      res,
      "Assessment version information retrieved successfully.",
      version
    );
  });

  getCurrentAssessment = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const assessment =
      await AssessmentLifecycleService.getCurrentAssessment(
        userId
      );

    return response.success(
      res,
      "Current assessment retrieved successfully.",
      assessment
    );
  });

  getLatestCompletedAssessment = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const assessment =
      await AssessmentLifecycleService.getLatestCompletedAssessment(
        userId
      );

    return response.success(
      res,
      "Latest completed assessment retrieved successfully.",
      assessment
    );
  });
}

module.exports =
  new AssessmentLifecycleController();