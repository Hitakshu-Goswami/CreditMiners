const { body, param, query } = require("express-validator");

// ---------------------------------------------------------------------------
// Enum mirrors (keep in sync with Prisma)
// ---------------------------------------------------------------------------

const UTILITY_TYPES = [
  "ELECTRICITY",
  "WATER",
  "GAS",
  "INTERNET",
  "MOBILE_POSTPAID",
  "OTHER",
];

const BILL_STATUSES = [
  "PAID",
  "PARTIAL",
  "MISSED",
  "PENDING",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const amountRule = (field, optional = false) => {
  let rule = body(field);

  if (optional) {
    rule = rule.optional();
  }

  return rule
    .isFloat({ min: 0 })
    .withMessage(`${field} must be a valid positive amount.`)
    .custom((value) => {
      const parts = String(value).split(".");

      if (parts[1] && parts[1].length > 2) {
        throw new Error(`${field} can have at most 2 decimal places.`);
      }

      return true;
    });
};

const uuidParamRule = (name) => [
  param(name)
    .isUUID()
    .withMessage(`Invalid ${name}. Must be a valid UUID.`),
];

// YYYY-MM
const billMonthValidator = (field = "billMonth", optional = false) => {
  let rule = body(field);

  if (optional) {
    rule = rule.optional();
  }

  return rule.custom((value) => {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) {
      throw new Error("billMonth must be in YYYY-MM format.");
    }

    return true;
  });
};

// ---------------------------------------------------------------------------
// Shared cross-field validation
// ---------------------------------------------------------------------------

const crossFieldValidation = body().custom((_, { req }) => {
  const {
    amountDue,
    amountPaid,
    billDate,
    dueDate,
    paidDate,
  } = req.body;

  if (
    amountDue !== undefined &&
    amountPaid !== undefined &&
    Number(amountPaid) > Number(amountDue)
  ) {
    throw new Error("amountPaid cannot exceed amountDue.");
  }

  if (
    billDate &&
    paidDate &&
    new Date(paidDate) < new Date(billDate)
  ) {
    throw new Error("paidDate cannot be before billDate.");
  }

  if (
    billDate &&
    dueDate &&
    new Date(dueDate) < new Date(billDate)
  ) {
    throw new Error("dueDate cannot be before billDate.");
  }

  return true;
});

// ---------------------------------------------------------------------------
// Create Validator
// ---------------------------------------------------------------------------

const createUtilityBillValidator = [
  body("utilityType")
    .isIn(UTILITY_TYPES)
    .withMessage(
      `utilityType must be one of: ${UTILITY_TYPES.join(", ")}.`
    ),

  body("providerName")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage(
      "providerName must be between 1 and 200 characters."
    ),

  billMonthValidator(),

  body("dueDate")
    .isISO8601()
    .withMessage("dueDate must be a valid ISO 8601 date."),

  body("billDate")
    .optional()
    .isISO8601()
    .withMessage("billDate must be a valid ISO 8601 date."),

  body("paidDate")
    .optional()
    .isISO8601()
    .withMessage("paidDate must be a valid ISO 8601 date."),

  amountRule("amountDue"),

  amountRule("amountPaid", true),

  body("accountNumber")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage(
      "accountNumber cannot exceed 100 characters."
    ),

  body("billNumber")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage(
      "billNumber cannot exceed 100 characters."
    ),

  body("transactionId")
    .optional()
    .isUUID()
    .withMessage("transactionId must be a valid UUID."),

  body("importId")
    .optional()
    .isUUID()
    .withMessage("importId must be a valid UUID."),

  body("receiptUrl")
    .optional()
    .isURL()
    .withMessage("receiptUrl must be a valid URL."),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("notes cannot exceed 1000 characters."),

  crossFieldValidation,
];

// ---------------------------------------------------------------------------
// Update Validator
// ---------------------------------------------------------------------------

const updateUtilityBillValidator = [
  body("utilityType")
    .optional()
    .isIn(UTILITY_TYPES)
    .withMessage(
      `utilityType must be one of: ${UTILITY_TYPES.join(", ")}.`
    ),

  body("providerName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage(
      "providerName must be between 1 and 200 characters."
    ),

  billMonthValidator("billMonth", true),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("dueDate must be a valid ISO 8601 date."),

  body("billDate")
    .optional()
    .isISO8601()
    .withMessage("billDate must be a valid ISO 8601 date."),

  body("paidDate")
    .optional()
    .isISO8601()
    .withMessage("paidDate must be a valid ISO 8601 date."),

  amountRule("amountDue", true),

  amountRule("amountPaid", true),

  body("accountNumber")
    .optional()
    .trim()
    .isLength({ max: 100 }),

  body("billNumber")
    .optional()
    .trim()
    .isLength({ max: 100 }),

  body("transactionId")
    .optional()
    .isUUID()
    .withMessage("transactionId must be a valid UUID."),

  body("importId")
    .optional()
    .isUUID()
    .withMessage("importId must be a valid UUID."),

  body("receiptUrl")
    .optional()
    .isURL()
    .withMessage("receiptUrl must be a valid URL."),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 1000 }),

  crossFieldValidation,
];

// ---------------------------------------------------------------------------
// Param Validator
// ---------------------------------------------------------------------------

const utilityBillIdValidator = uuidParamRule("id");

// ---------------------------------------------------------------------------
// List Validator
// ---------------------------------------------------------------------------

const listUtilityBillsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .toInt(),

  query("utilityType")
    .optional()
    .isIn(UTILITY_TYPES),

  query("status")
    .optional()
    .isIn(BILL_STATUSES),

  query("billMonth")
    .optional()
    .matches(/^\d{4}-(0[1-9]|1[0-2])$/)
    .withMessage("billMonth must be YYYY-MM."),

  query("provider")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 }),

  query("startDate")
    .optional()
    .isISO8601(),

  query("endDate")
    .optional()
    .isISO8601(),

  query("minAmount")
    .optional()
    .isFloat({ min: 0 }),

  query("maxAmount")
    .optional()
    .isFloat({ min: 0 }),

  query("search")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }),

  query("sortBy")
    .optional()
    .isIn([
      "dueDate",
      "billDate",
      "amountDue",
      "createdAt",
    ]),

  query("order")
    .optional()
    .isIn(["asc", "desc"]),
];

module.exports = {
  createUtilityBillValidator,
  updateUtilityBillValidator,
  utilityBillIdValidator,
  listUtilityBillsValidator,
};