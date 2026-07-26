const { body, param, query } = require("express-validator");

// ---------------------------------------------------------------------------
// Enum mirrors – kept in sync with Prisma schema enums
// ---------------------------------------------------------------------------

const TRANSACTION_TYPES = ["INCOME", "EXPENSE", "TRANSFER", "INVESTMENT"];

const PAYMENT_METHODS = [
  "CASH",
  "UPI",
  "CARD",
  "NET_BANKING",
  "BANK_TRANSFER",
  "WALLET",
];

const FINANCIAL_SOURCES = [
  "MANUAL",
  "CSV",
  "ACCOUNT_AGGREGATOR",
  "BANK_STATEMENT",
  "UTILITY_PROVIDER",
  "RECHARGE_PROVIDER",
  "ECOMMERCE_PLATFORM",
];

// ---------------------------------------------------------------------------
// Reusable fragments
// ---------------------------------------------------------------------------

const amountRule = (fieldName = "amount", optional = false) => {
  let rule = body(fieldName);
  if (optional) rule = rule.optional();
  return rule
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a positive number.")
    .custom((value) => {
      // Validate max 2 decimal places (Decimal(18,2))
      const parts = String(value).split(".");
      if (parts[1] && parts[1].length > 2) {
        throw new Error("Amount must have at most 2 decimal places.");
      }
      return true;
    });
};

const uuidParamRule = (paramName) => [
  param(paramName)
    .isUUID()
    .withMessage(`Invalid ${paramName}. Must be a valid UUID.`),
];

// ---------------------------------------------------------------------------
// Create Transaction Validator
// ---------------------------------------------------------------------------

const createTransactionValidator = [
  amountRule("amount"),

  body("transactionType")
    .isIn(TRANSACTION_TYPES)
    .withMessage(
      `Transaction type must be one of: ${TRANSACTION_TYPES.join(", ")}.`
    ),

  body("paymentMethod")
    .isIn(PAYMENT_METHODS)
    .withMessage(
      `Payment method must be one of: ${PAYMENT_METHODS.join(", ")}.`
    ),

  body("categoryId")
    .isUUID()
    .withMessage("categoryId must be a valid UUID."),

  body("transactionDate")
    .isISO8601()
    .withMessage("transactionDate must be a valid ISO 8601 date."),

  // Optional fields --------------------------------------------------------

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters."),

  body("merchant")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Merchant name must be between 1 and 200 characters."),

  body("merchantId")
    .optional()
    .isUUID()
    .withMessage("merchantId must be a valid UUID."),

  body("categoryRefId")
    .optional()
    .isUUID()
    .withMessage("categoryRefId must be a valid UUID."),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Location cannot exceed 300 characters."),

  body("referenceNumber")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Reference number cannot exceed 100 characters."),

  body("isRecurring")
    .optional()
    .isBoolean()
    .withMessage("isRecurring must be a boolean."),

  body("receiptUrl")
    .optional()
    .isURL()
    .withMessage("receiptUrl must be a valid URL."),

  body("tagIds")
    .optional()
    .isArray()
    .withMessage("tagIds must be an array."),

  body("tagIds.*")
    .optional()
    .isUUID()
    .withMessage("Each tagId must be a valid UUID."),
];

// ---------------------------------------------------------------------------
// Update Transaction Validator
// ---------------------------------------------------------------------------

const updateTransactionValidator = [
  amountRule("amount", true),

  body("transactionType")
    .optional()
    .isIn(TRANSACTION_TYPES)
    .withMessage(
      `Transaction type must be one of: ${TRANSACTION_TYPES.join(", ")}.`
    ),

  body("paymentMethod")
    .optional()
    .isIn(PAYMENT_METHODS)
    .withMessage(
      `Payment method must be one of: ${PAYMENT_METHODS.join(", ")}.`
    ),

  body("categoryId")
    .optional()
    .isUUID()
    .withMessage("categoryId must be a valid UUID."),

  body("transactionDate")
    .optional()
    .isISO8601()
    .withMessage("transactionDate must be a valid ISO 8601 date."),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters."),

  body("merchant")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Merchant name must be between 1 and 200 characters."),

  body("merchantId")
    .optional()
    .isUUID()
    .withMessage("merchantId must be a valid UUID."),

  body("categoryRefId")
    .optional()
    .isUUID()
    .withMessage("categoryRefId must be a valid UUID."),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Location cannot exceed 300 characters."),

  body("referenceNumber")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Reference number cannot exceed 100 characters."),

  body("isRecurring")
    .optional()
    .isBoolean()
    .withMessage("isRecurring must be a boolean."),

  body("receiptUrl")
    .optional()
    .isURL()
    .withMessage("receiptUrl must be a valid URL."),

  body("tagIds")
    .optional()
    .isArray()
    .withMessage("tagIds must be an array."),

  body("tagIds.*")
    .optional()
    .isUUID()
    .withMessage("Each tagId must be a valid UUID."),
];

// ---------------------------------------------------------------------------
// Transaction ID Param Validator
// ---------------------------------------------------------------------------

const transactionIdValidator = uuidParamRule("id");

// ---------------------------------------------------------------------------
// List Transactions Query Validator
// ---------------------------------------------------------------------------

const listTransactionsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Page must be a positive integer."),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .toInt()
    .withMessage("Limit must be between 1 and 100."),

  query("type")
    .optional()
    .isIn(TRANSACTION_TYPES)
    .withMessage(
      `Type must be one of: ${TRANSACTION_TYPES.join(", ")}.`
    ),

  query("paymentMethod")
    .optional()
    .isIn(PAYMENT_METHODS)
    .withMessage(
      `Payment method must be one of: ${PAYMENT_METHODS.join(", ")}.`
    ),

  query("categoryId")
    .optional()
    .isUUID()
    .withMessage("categoryId must be a valid UUID."),

  query("categoryRefId")
    .optional()
    .isUUID()
    .withMessage("categoryRefId must be a valid UUID."),

  query("merchantId")
    .optional()
    .isUUID()
    .withMessage("merchantId must be a valid UUID."),

  query("source")
    .optional()
    .isIn(FINANCIAL_SOURCES)
    .withMessage(
      `Source must be one of: ${FINANCIAL_SOURCES.join(", ")}.`
    ),

  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("startDate must be a valid ISO 8601 date."),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("endDate must be a valid ISO 8601 date."),

  query("minAmount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("minAmount must be a positive number."),

  query("maxAmount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("maxAmount must be a positive number."),

  query("search")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search must be between 1 and 100 characters."),

  query("sortBy")
    .optional()
    .isIn(["date", "amount", "createdAt"])
    .withMessage("sortBy must be one of: date, amount, createdAt."),

  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("order must be either asc or desc."),
];

module.exports = {
  createTransactionValidator,
  updateTransactionValidator,
  transactionIdValidator,
  listTransactionsValidator,
};
