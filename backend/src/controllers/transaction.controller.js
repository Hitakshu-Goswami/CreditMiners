const { validationResult } = require("express-validator");
const asyncHandler = require("../middleware/async.middleware");
const response = require("../utils/response");
const BadRequestError = require("../errors/BadRequestError");
const transactionService = require("../services/transaction.service");

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
// POST /api/financial/transactions
// ---------------------------------------------------------------------------

const createTransaction = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "Transaction created successfully.",
    await transactionService.createTransaction(
      req.user.id,
      req.body,
      contextFrom(req)
    ),
    201
  );
});

// ---------------------------------------------------------------------------
// GET /api/financial/transactions
// ---------------------------------------------------------------------------

const listTransactions = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "Transactions fetched successfully.",
    await transactionService.listTransactions(req.user.id, req.query)
  );
});

// ---------------------------------------------------------------------------
// GET /api/financial/transactions/:id
// ---------------------------------------------------------------------------

const getTransaction = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "Transaction fetched successfully.",
    await transactionService.getTransaction(req.user.id, req.params.id)
  );
});

// ---------------------------------------------------------------------------
// PATCH /api/financial/transactions/:id
// ---------------------------------------------------------------------------

const updateTransaction = asyncHandler(async (req, res) => {
  validateRequest(req);

  response.success(
    res,
    "Transaction updated successfully.",
    await transactionService.updateTransaction(
      req.user.id,
      req.params.id,
      req.body,
      contextFrom(req)
    )
  );
});

// ---------------------------------------------------------------------------
// DELETE /api/financial/transactions/:id
// ---------------------------------------------------------------------------

const deleteTransaction = asyncHandler(async (req, res) => {
  validateRequest(req);

  await transactionService.deleteTransaction(
    req.user.id,
    req.params.id,
    contextFrom(req)
  );

  response.success(res, "Transaction deleted successfully.");
});

module.exports = {
  createTransaction,
  listTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
};
