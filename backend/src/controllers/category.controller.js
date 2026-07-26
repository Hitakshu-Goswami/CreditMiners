const { validationResult } = require("express-validator");

const asyncHandler = require("../middleware/async.middleware");

const response = require("../utils/response");

const BadRequestError = require("../errors/BadRequestError");

const categoryService = require("../services/category.service");

const validateRequest = (req) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequestError(
      errors.array().map(e => e.msg).join(", ")
    );
  }

};

const contextFrom = (req) => ({
  ipAddress: req.ip,
  userAgent: req.headers["user-agent"],
});

exports.createCategory = asyncHandler(async (req, res) => {

  validateRequest(req);

  response.success(
    res,
    "Category created successfully.",
    await categoryService.createCategory(
      req.body,
      contextFrom(req)
    ),
    201
  );

});

exports.listCategories = asyncHandler(async (req, res) => {

  validateRequest(req);

  response.success(
    res,
    "Categories fetched successfully.",
    await categoryService.listCategories(req.query)
  );

});

exports.getCategory = asyncHandler(async (req, res) => {

  validateRequest(req);

  response.success(
    res,
    "Category fetched successfully.",
    await categoryService.getCategory(req.params.id)
  );

});

exports.updateCategory = asyncHandler(async (req, res) => {

  validateRequest(req);

  response.success(
    res,
    "Category updated successfully.",
    await categoryService.updateCategory(
      req.params.id,
      req.body,
      contextFrom(req)
    )
  );

});

exports.deleteCategory = asyncHandler(async (req, res) => {

  validateRequest(req);

  await categoryService.deleteCategory(
    req.params.id,
    contextFrom(req)
  );

  response.success(
    res,
    "Category deleted successfully."
  );

});

exports.getCategoryStatistics = asyncHandler(async (req, res) => {

  response.success(
    res,
    "Category statistics fetched successfully.",
    await categoryService.getCategoryStatistics()
  );

});