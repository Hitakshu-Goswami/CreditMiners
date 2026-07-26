const { validationResult } = require("express-validator");

const asyncHandler = require("../middleware/async.middleware");

const response = require("../utils/response");

const BadRequestError = require("../errors/BadRequestError");

const utilityBillService = require("../services/utilityBill.service");

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
// POST /api/financial/utility-bills
// ---------------------------------------------------------------------------

const createUtilityBill = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "Utility bill created successfully.",
    await utilityBillService.createUtilityBill(
      req.user.id,
      req.body,
      contextFrom(req)
    ),
    201
  );
});

// ---------------------------------------------------------------------------
// GET /api/financial/utility-bills
// ---------------------------------------------------------------------------

const listUtilityBills = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "Utility bills fetched successfully.",
    await utilityBillService.listUtilityBills(
      req.user.id,
      req.query
    )
  );
});

// ---------------------------------------------------------------------------
// GET /api/financial/utility-bills/:id
// ---------------------------------------------------------------------------

const getUtilityBill = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "Utility bill fetched successfully.",
    await utilityBillService.getUtilityBill(
      req.user.id,
      req.params.id
    )
  );
});

// ---------------------------------------------------------------------------
// PATCH /api/financial/utility-bills/:id
// ---------------------------------------------------------------------------

const updateUtilityBill = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "Utility bill updated successfully.",
    await utilityBillService.updateUtilityBill(
      req.user.id,
      req.params.id,
      req.body,
      contextFrom(req)
    )
  );
});

// ---------------------------------------------------------------------------
// DELETE /api/financial/utility-bills/:id
// ---------------------------------------------------------------------------

const deleteUtilityBill = asyncHandler(async (req, res) => {
  validateRequest(req);

  await utilityBillService.deleteUtilityBill(
    req.user.id,
    req.params.id,
    contextFrom(req)
  );

  response.success(
    res,
    "Utility bill deleted successfully."
  );
});

// ---------------------------------------------------------------------------
// GET /api/financial/utility-bills/statistics
// ---------------------------------------------------------------------------

const getUtilityBillStatistics = asyncHandler(async (req, res) => {
  response.success(
    res,
    "Utility bill statistics fetched successfully.",
    await utilityBillService.getUtilityBillStatistics(
      req.user.id
    )
  );
});

module.exports = {
  createUtilityBill,
  listUtilityBills,
  getUtilityBill,
  updateUtilityBill,
  deleteUtilityBill,
  getUtilityBillStatistics,
};