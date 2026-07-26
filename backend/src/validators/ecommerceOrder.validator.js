const { body, param, query } = require("express-validator");

// -----------------------------------------------------------------------------
// Enums
// -----------------------------------------------------------------------------

const ORDER_STATUSES = [
  "DELIVERED",
  "RETURNED",
  "CANCELLED",
  "REFUNDED",
  "PENDING",
  "SHIPPED",
];

const PAYMENT_METHODS = [
  "CASH",
  "UPI",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "NET_BANKING",
  "WALLET",
  "EMI",
  "BANK_TRANSFER",
  "CHEQUE",
  "OTHER",
];

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const amountValidator = (field = "amount", optional = false) => {
  let validator = body(field);

  if (optional) validator = validator.optional();

  return validator
    .isFloat({ gt: 0 })
    .withMessage(`${field} must be greater than 0.`)
    .custom((value) => {
      const decimal = String(value).split(".");

      if (decimal[1] && decimal[1].length > 2) {
        throw new Error(
          `${field} can have at most 2 decimal places.`
        );
      }

      return true;
    });
};

const uuidParamValidator = (field) => [
  param(field)
    .isUUID()
    .withMessage(`${field} must be a valid UUID.`),
];

// -----------------------------------------------------------------------------
// Create
// -----------------------------------------------------------------------------

const createEcommerceOrderValidator = [
  body("platform")
    .trim()
    .notEmpty()
    .withMessage("platform is required.")
    .isLength({ max: 100 })
    .withMessage("platform cannot exceed 100 characters."),

  body("orderId")
    .optional()
    .trim()
    .isLength({ max: 100 }),

  body("orderDate")
    .isISO8601()
    .withMessage("orderDate must be a valid ISO date."),

  amountValidator(),

  body("status")
    .optional()
    .isIn(ORDER_STATUSES)
    .withMessage(
      `status must be one of: ${ORDER_STATUSES.join(", ")}`
    ),

  body("paymentMode")
    .isIn(PAYMENT_METHODS)
    .withMessage(
      `paymentMode must be one of: ${PAYMENT_METHODS.join(", ")}`
    ),

  body("itemCount")
    .optional()
    .isInt({ min: 1 })
    .withMessage("itemCount must be at least 1."),

  body("isReturned")
    .optional()
    .isBoolean(),

  body("isRefunded")
    .optional()
    .isBoolean(),

  body("transactionId")
    .optional()
    .isUUID()
    .withMessage("transactionId must be a valid UUID."),

  body("merchantId")
    .optional()
    .isUUID()
    .withMessage("merchantId must be a valid UUID."),

  body("categoryId")
    .optional()
    .isUUID()
    .withMessage("categoryId must be a valid UUID."),

  body("importId")
    .optional()
    .isUUID()
    .withMessage("importId must be a valid UUID."),
];

// -----------------------------------------------------------------------------
// Update
// -----------------------------------------------------------------------------

const updateEcommerceOrderValidator = [
  body("platform")
    .optional()
    .trim()
    .isLength({ max: 100 }),

  body("orderId")
    .optional()
    .trim()
    .isLength({ max: 100 }),

  body("orderDate")
    .optional()
    .isISO8601(),

  amountValidator("amount", true),

  body("status")
    .optional()
    .isIn(ORDER_STATUSES),

  body("paymentMode")
    .optional()
    .isIn(PAYMENT_METHODS),

  body("itemCount")
    .optional()
    .isInt({ min: 1 }),

  body("isReturned")
    .optional()
    .isBoolean(),

  body("isRefunded")
    .optional()
    .isBoolean(),

  body("transactionId")
    .optional()
    .isUUID(),

  body("merchantId")
    .optional()
    .isUUID(),

  body("categoryId")
    .optional()
    .isUUID(),

  body("importId")
    .optional()
    .isUUID(),
];

// -----------------------------------------------------------------------------
// ID
// -----------------------------------------------------------------------------

const ecommerceOrderIdValidator =
  uuidParamValidator("id");

// -----------------------------------------------------------------------------
// List
// -----------------------------------------------------------------------------

const listEcommerceOrdersValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .toInt(),

  query("platform")
    .optional()
    .trim(),

  query("status")
    .optional()
    .isIn(ORDER_STATUSES),

  query("paymentMode")
    .optional()
    .isIn(PAYMENT_METHODS),

  query("isReturned")
    .optional()
    .isBoolean(),

  query("isRefunded")
    .optional()
    .isBoolean(),

  query("startDate")
    .optional()
    .isISO8601(),

  query("endDate")
    .optional()
    .isISO8601(),

  query("minAmount")
    .optional()
    .isFloat({ gt: 0 }),

  query("maxAmount")
    .optional()
    .isFloat({ gt: 0 }),

  query("search")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }),

  query("sortBy")
    .optional()
    .isIn([
      "orderDate",
      "amount",
      "createdAt",
      "itemCount",
      "platform",
    ]),

  query("order")
    .optional()
    .isIn(["asc", "desc"]),
];

module.exports = {
  createEcommerceOrderValidator,
  updateEcommerceOrderValidator,
  ecommerceOrderIdValidator,
  listEcommerceOrdersValidator,
};