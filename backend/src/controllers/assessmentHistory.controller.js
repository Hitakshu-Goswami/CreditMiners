const { validationResult } = require("express-validator");

const asyncHandler = require("../middleware/asyncHandler");

const response = require("../utils/response");

const assessmentHistoryService = require("../services/assessmentHistory.service");

class AssessmentHistoryController {
  createSnapshot = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { sessionId } = req.params;

    const snapshot =
      await assessmentHistoryService.createSnapshot(
        sessionId
      );

    return response.success(
      res,
      "Assessment snapshot created successfully.",
      snapshot
    );
  });

  getLatestSnapshot = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const snapshot =
      await assessmentHistoryService.getLatestSnapshot(
        userId
      );

    return response.success(
      res,
      "Latest assessment snapshot retrieved successfully.",
      snapshot
    );
  });

  getHistory = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const history =
      await assessmentHistoryService.getHistory(
        userId
      );

    return response.success(
      res,
      "Assessment history retrieved successfully.",
      history
    );
  });

  compareSnapshots = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { latestId, previousId } = req.params;

    const comparison =
      await assessmentHistoryService.compareSnapshots(
        latestId,
        previousId
      );

    return response.success(
      res,
      "Assessment comparison retrieved successfully.",
      comparison
    );
  });

  deleteSnapshot = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    const { snapshotId } = req.params;

    await assessmentHistoryService.deleteSnapshot(
      snapshotId
    );

    return response.success(
      res,
      "Assessment snapshot deleted successfully."
    );
  });
}

module.exports =
  new AssessmentHistoryController();