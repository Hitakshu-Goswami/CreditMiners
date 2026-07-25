const { validationResult } = require("express-validator");

const asyncHandler = require("../middleware/async.middleware");
const response = require("../utils/response");
const BadRequestError = require("../errors/BadRequestError");

const aiCreditService = require("../services/aiCredit.service");

const validateRequest = (req) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequestError(
      errors.array().map((error) => error.msg).join(", ")
    );
  }
};

const analyzeLoan = asyncHandler(async (req, res) => {
  validateRequest(req);

  const result = await aiCreditService.analyzeLoan(
    req.user.id,
    req.params.loanId
  );

  response.success(
    res,
    "AI credit analysis completed successfully.",
    result
  );
});

const getLoanAnalysis = asyncHandler(async (req, res) => {
  validateRequest(req);

  const result = await aiCreditService.getAnalysis(
    req.user.id,
    req.params.loanId
  );

  response.success(
    res,
    "AI credit analysis fetched successfully.",
    result
  );
});

module.exports = {
  analyzeLoan,
  getLoanAnalysis,
};