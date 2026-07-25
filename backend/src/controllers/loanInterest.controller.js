const asyncHandler = require("../middleware/async.middleware");
const response = require("../utils/response");

const loanInterestService = require("../services/loanInterest.service");

exports.createInterest = asyncHandler(async (req, res) => {
  const result = await loanInterestService.createInterest(
    req.user.id,
    req.params.loanId,
    req.body
  );

  response.success(res, result, "Interest submitted.");
});

exports.getLoanInterests = asyncHandler(async (req, res) => {
  const result = await loanInterestService.getLoanInterests(
    req.user.id,
    req.params.loanId
  );

  response.success(res, result);
});

exports.acceptInterest = asyncHandler(async (req, res) => {
  const result = await loanInterestService.acceptInterest(
    req.user.id,
    req.params.interestId
  );

  response.success(res, result, "Interest accepted.");
});

exports.rejectInterest = asyncHandler(async (req, res) => {
  const result = await loanInterestService.rejectInterest(
    req.user.id,
    req.params.interestId
  );

  response.success(res, result, "Interest rejected.");
});

exports.withdrawInterest = asyncHandler(async (req, res) => {
  await loanInterestService.withdrawInterest(
    req.user.id,
    req.params.interestId
  );

  response.success(res, null, "Interest withdrawn.");
});