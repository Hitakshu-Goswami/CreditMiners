const { validationResult } = require("express-validator");

const asyncHandler = require("../middleware/async.middleware");

const response = require("../utils/response");

const BadRequestError = require("../errors/BadRequestError");

const mobileRechargeService = require("../services/mobileRecharge.service");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// POST /api/financial/mobile-recharges
// ---------------------------------------------------------------------------

const createMobileRecharge = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "Mobile recharge created successfully.",
    await mobileRechargeService.createMobileRecharge(
      req.user.id,
      req.body,
      contextFrom(req)
    ),
    201
  );
});

// ---------------------------------------------------------------------------
// GET /api/financial/mobile-recharges
// ---------------------------------------------------------------------------

const listMobileRecharges = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "Mobile recharges fetched successfully.",
    await mobileRechargeService.listMobileRecharges(
      req.user.id,
      req.query
    )
  );
});

// ---------------------------------------------------------------------------
// GET /api/financial/mobile-recharges/:id
// ---------------------------------------------------------------------------

const getMobileRecharge = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "Mobile recharge fetched successfully.",
    await mobileRechargeService.getMobileRecharge(
      req.user.id,
      req.params.id
    )
  );
});

// ---------------------------------------------------------------------------
// PATCH /api/financial/mobile-recharges/:id
// ---------------------------------------------------------------------------

const updateMobileRecharge = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "Mobile recharge updated successfully.",
    await mobileRechargeService.updateMobileRecharge(
      req.user.id,
      req.params.id,
      req.body,
      contextFrom(req)
    )
  );
});

// ---------------------------------------------------------------------------
// DELETE /api/financial/mobile-recharges/:id
// ---------------------------------------------------------------------------

const deleteMobileRecharge = asyncHandler(async (req, res) => {
  validateRequest(req);

  await mobileRechargeService.deleteMobileRecharge(
    req.user.id,
    req.params.id,
    contextFrom(req)
  );

  response.success(
    res,
    "Mobile recharge deleted successfully."
  );
});

// ---------------------------------------------------------------------------
// GET /api/financial/mobile-recharges/statistics
// ---------------------------------------------------------------------------

const getMobileRechargeStatistics = asyncHandler(async (req, res) => {
  response.success(
    res,
    "Mobile recharge statistics fetched successfully.",
    await mobileRechargeService.getMobileRechargeStatistics(
      req.user.id
    )
  );
});

module.exports = {
  createMobileRecharge,
  listMobileRecharges,
  getMobileRecharge,
  updateMobileRecharge,
  deleteMobileRecharge,
  getMobileRechargeStatistics,
};