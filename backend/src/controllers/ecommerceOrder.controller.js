const { validationResult } = require("express-validator");

const asyncHandler = require("../middleware/async.middleware");

const response = require("../utils/response");

const BadRequestError = require("../errors/BadRequestError");

const ecommerceOrderService = require("../services/ecommerceOrder.service");

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const validateRequest = (req) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequestError(
      errors.array().map((e) => e.msg).join(", ")
    );
  }
};

const contextFrom = (req) => ({
  ipAddress: req.ip,
  userAgent: req.headers["user-agent"],
});

// -----------------------------------------------------------------------------
// CRUD
// -----------------------------------------------------------------------------

const createEcommerceOrder = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "E-commerce order created successfully.",
    await ecommerceOrderService.createEcommerceOrder(
      req.user.id,
      req.body,
      contextFrom(req)
    ),
    201
  );
});

const listEcommerceOrders = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "E-commerce orders fetched successfully.",
    await ecommerceOrderService.listEcommerceOrders(
      req.user.id,
      req.query
    )
  );
});

const getEcommerceOrder = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "E-commerce order fetched successfully.",
    await ecommerceOrderService.getEcommerceOrder(
      req.user.id,
      req.params.id
    )
  );
});

const updateEcommerceOrder = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "E-commerce order updated successfully.",
    await ecommerceOrderService.updateEcommerceOrder(
      req.user.id,
      req.params.id,
      req.body,
      contextFrom(req)
    )
  );
});

const deleteEcommerceOrder = asyncHandler(async (req, res) => {
  validateRequest(req);

  await ecommerceOrderService.deleteEcommerceOrder(
    req.user.id,
    req.params.id,
    contextFrom(req)
  );

  response.success(
    res,
    "E-commerce order deleted successfully."
  );
});

const getEcommerceOrderStatistics = asyncHandler(async (req, res) => {
  response.success(
    res,
    "E-commerce statistics fetched successfully.",
    await ecommerceOrderService.getEcommerceOrderStatistics(
      req.user.id
    )
  );
});

module.exports = {
  createEcommerceOrder,
  listEcommerceOrders,
  getEcommerceOrder,
  updateEcommerceOrder,
  deleteEcommerceOrder,
  getEcommerceOrderStatistics,
};