const { validationResult } = require("express-validator");

const asyncHandler = require("../middleware/async.middleware");

const response = require("../utils/response");

const BadRequestError = require("../errors/BadRequestError");

const tagService = require("../services/tag.service");

const validateRequest = (req) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    throw new BadRequestError(

      errors.array().map(error => error.msg).join(", ")

    );

  }

};

const contextFrom = (req) => ({

  ipAddress: req.ip,

  userAgent: req.headers["user-agent"],

});

exports.createTag = asyncHandler(async (req, res) => {

  validateRequest(req);

  const tag =
    await tagService.createTag(
      req.body,
      contextFrom(req)
    );

  response.success(
    res,
    "Tag created successfully.",
    tag,
    201
  );

});

exports.listTags = asyncHandler(async (req, res) => {

  validateRequest(req);

  const tags =
    await tagService.listTags(req.query);

  response.success(
    res,
    "Tags fetched successfully.",
    tags
  );

});

exports.getTag = asyncHandler(async (req, res) => {

  validateRequest(req);

  const tag =
    await tagService.getTag(req.params.id);

  response.success(
    res,
    "Tag fetched successfully.",
    tag
  );

});

exports.updateTag = asyncHandler(async (req, res) => {

  validateRequest(req);

  const tag =
    await tagService.updateTag(
      req.params.id,
      req.body,
      contextFrom(req)
    );

  response.success(
    res,
    "Tag updated successfully.",
    tag
  );

});

exports.deleteTag = asyncHandler(async (req, res) => {

  validateRequest(req);

  await tagService.deleteTag(
    req.params.id,
    contextFrom(req)
  );

  response.success(
    res,
    "Tag deleted successfully."
  );

});

exports.getTagStatistics = asyncHandler(async (req, res) => {

  const statistics =
    await tagService.getTagStatistics();

  response.success(
    res,
    "Tag statistics fetched successfully.",
    statistics
  );

});