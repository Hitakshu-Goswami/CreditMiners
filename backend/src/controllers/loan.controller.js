const { validationResult } = require("express-validator");
const asyncHandler = require("../middleware/async.middleware");
const response = require("../utils/response");
const BadRequestError = require("../errors/BadRequestError");
const loanService = require("../services/loan.service");

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

const createLoan = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "Loan request created successfully.",
    await loanService.createLoan(req.user.id, req.body, contextFrom(req)),
    201
  );
});

const listMyLoans = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "Loan requests fetched successfully.",
    await loanService.listMyLoans(req.user.id, req.query)
  );
});

const getMyLoan = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "Loan request fetched successfully.",
    await loanService.getMyLoan(req.user.id, req.params.loanId)
  );
});

const updateLoan = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "Loan request updated successfully.",
    await loanService.updateLoan(
      req.user.id,
      req.params.loanId,
      req.body,
      contextFrom(req)
    )
  );
});

const deleteDraftLoan = asyncHandler(async (req, res) => {
  validateRequest(req);

  await loanService.deleteDraftLoan(
    req.user.id,
    req.params.loanId,
    contextFrom(req)
  );

  response.success(res, "Loan request deleted successfully.");
});

const publishLoan = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "Loan request published successfully.",
    await loanService.publishLoan(
      req.user.id,
      req.params.loanId,
      contextFrom(req)
    )
  );
});

const closeLoan = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "Loan request closed successfully.",
    await loanService.closeLoan(
      req.user.id,
      req.params.loanId,
      contextFrom(req)
    )
  );
});

const listPublishedLoans = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "Loan requests fetched successfully.",
    await loanService.listPublishedLoans(req.query)
  );
});

const getPublishedLoan = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "Loan request fetched successfully.",
    await loanService.getPublishedLoan(req.params.loanId)
  );
});

const getLoanStatistics = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "Loan statistics fetched successfully.",
    await loanService.getLoanStatistics(req.user.id)
  );
});

const getTrendingLoans = asyncHandler(async (req, res) => {
  const loans = await loanService.getTrendingLoans(req.query.limit);

  response.success(res, loans);
});

const getRecommendedLoans = asyncHandler(async (req, res) => {
  const loans = await loanService.getRecommendedLoans(req.query.limit);

  response.success(res, loans);
});

const getFeaturedLoans = asyncHandler(async (req, res) => {
  const loans = await loanService.getFeaturedLoans(req.query.limit);

  response.success(res, loans);
});

module.exports = {
  createLoan,
  listMyLoans,
  getMyLoan,
  updateLoan,
  deleteDraftLoan,
  publishLoan,
  closeLoan,
  listPublishedLoans,
  getPublishedLoan,
  getLoanStatistics,
  getTrendingLoans,
getRecommendedLoans,
getFeaturedLoans,
};
