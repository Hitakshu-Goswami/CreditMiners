const { validationResult } = require("express-validator");

const asyncHandler = require("../middleware/async.middleware");
const BadRequestError = require("../errors/BadRequestError");
const financialFeatureService = require("../services/financialFeature.service");
const response = require("../utils/response");

const validateRequest = (req) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequestError(
      errors.array().map((error) => error.msg).join(", ")
    );
  }
};

const contextFrom = (req) => ({
  ipAddress: req.ip,
  userAgent: req.headers["user-agent"],
});

const computeFeatures = asyncHandler(async (req, res) => {
  validateRequest(req);

  if (req.body.async === true) {
    const job = financialFeatureService.enqueueFeatureComputation(
      req.user.id,
      req.body,
      contextFrom(req)
    );

    return response.success(
      res,
      "Financial feature computation queued successfully.",
      job,
      202
    );
  }

  const result = await financialFeatureService.computeFeatures(
    req.user.id,
    req.body,
    contextFrom(req)
  );

  return response.success(
    res,
    "Financial features computed successfully.",
    result,
    req.body.persist === false ? 200 : 201
  );
});

const getDocumentation = asyncHandler(async (req, res) => {
  const result = financialFeatureService.getFeatureDocumentation();

  return response.success(
    res,
    "Financial feature documentation fetched successfully.",
    result
  );
});

const getJob = asyncHandler(async (req, res) => {
  validateRequest(req);

  const result = financialFeatureService.getFeatureJob(
    req.user.id,
    req.params.jobId
  );

  return response.success(
    res,
    "Financial feature job fetched successfully.",
    result
  );
});

const listFeatures = asyncHandler(async (req, res) => {
  validateRequest(req);

  const result = await financialFeatureService.listFeatures(
    req.user.id,
    req.query
  );

  return response.success(
    res,
    "Financial features fetched successfully.",
    result
  );
});

const getSummary = asyncHandler(async (req, res) => {
  const result = await financialFeatureService.getSummary(req.user.id);

  return response.success(
    res,
    "Financial feature summary fetched successfully.",
    result
  );
});

const listRuns = asyncHandler(async (req, res) => {
  validateRequest(req);

  const runs = await financialFeatureService.listRuns(
    req.user.id,
    req.query
  );

  return response.success(
    res,
    "Financial feature runs fetched successfully.",
    runs
  );
});

const getRun = asyncHandler(async (req, res) => {
  validateRequest(req);

  const result = await financialFeatureService.getRun(
    req.user.id,
    req.params.runId
  );

  return response.success(
    res,
    "Financial feature run fetched successfully.",
    result
  );
});

module.exports = {
  computeFeatures,
  getDocumentation,
  getJob,
  getRun,
  getSummary,
  listFeatures,
  listRuns,
};
