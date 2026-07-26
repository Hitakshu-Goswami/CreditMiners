const { body, param, query } = require("express-validator");

// ---------------------------------------------------------------------------
// Enum mirrors
// ---------------------------------------------------------------------------

const RECHARGE_PROVIDERS = [
  "AIRTEL",
  "JIO",
  "VI",
  "BSNL",
  "OTHER",
];

const RECHARGE_STATUSES = [
  "SUCCESS",
  "FAILED",
  "PENDING",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const amountRule = (field = "amount", optional = false) => {
  let rule = body(field);

  if (optional) {
    rule = rule.optional();
  }

  return rule
    .isFloat({ gt: 0 })
    .withMessage(`${field} must be greater than 0.`)
    .custom((value) => {
      const parts = String(value).split(".");

      if (parts[1] && parts[1].length > 2) {
        throw new Error(
          `${field} can contain at most 2 decimal places.`
        );
      }

      return true;
    });
};

const uuidParamRule = (paramName) => [
  param(paramName)
    .isUUID()
    .withMessage(
      `Invalid ${paramName}. Must be a valid UUID.`
    ),
];

// ---------------------------------------------------------------------------
// Create Validator
// ---------------------------------------------------------------------------

const createMobileRechargeValidator = [
  body("provider")
    .isIn(RECHARGE_PROVIDERS)
    .withMessage(
      `provider must be one of: ${RECHARGE_PROVIDERS.join(", ")}.`
    ),

  amountRule("amount"),

  body("rechargeDate")
    .isISO8601()
    .withMessage(
      "rechargeDate must be a valid ISO 8601 date."
    ),

  body("status")
    .optional()
    .isIn(RECHARGE_STATUSES)
    .withMessage(
      `status must be one of: ${RECHARGE_STATUSES.join(", ")}.`
    ),

  body("mobileNumber")
    .optional()
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage(
      "mobileNumber must be between 8 and 20 characters."
    ),

  body("validityDays")
    .optional()
    .isInt({ min: 1, max: 3650 })
    .withMessage(
      "validityDays must be between 1 and 3650."
    ),

  body("isEmergencyRecharge")
    .optional()
    .isBoolean()
    .withMessage(
      "isEmergencyRecharge must be a boolean."
    ),

  body("planType")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage(
      "planType cannot exceed 100 characters."
    ),

  body("referenceNumber")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage(
      "referenceNumber cannot exceed 100 characters."
    ),

  body("transactionId")
    .optional()
    .isUUID()
    .withMessage(
      "transactionId must be a valid UUID."
    ),

  body("importId")
    .optional()
    .isUUID()
    .withMessage(
      "importId must be a valid UUID."
    ),
];

// ---------------------------------------------------------------------------
// Update Validator
// ---------------------------------------------------------------------------

const updateMobileRechargeValidator = [
  body("provider")
    .optional()
    .isIn(RECHARGE_PROVIDERS)
    .withMessage(
      `provider must be one of: ${RECHARGE_PROVIDERS.join(", ")}.`
    ),

  amountRule("amount", true),

  body("rechargeDate")
    .optional()
    .isISO8601()
    .withMessage(
      "rechargeDate must be a valid ISO 8601 date."
    ),

  body("status")
    .optional()
    .isIn(RECHARGE_STATUSES)
    .withMessage(
      `status must be one of: ${RECHARGE_STATUSES.join(", ")}.`
    ),

  body("mobileNumber")
    .optional()
    .trim()
    .isLength({ min: 8, max: 20 }),

  body("validityDays")
    .optional()
    .isInt({ min: 1, max: 3650 }),

  body("isEmergencyRecharge")
    .optional()
    .isBoolean(),

  body("planType")
    .optional()
    .trim()
    .isLength({ max: 100 }),

  body("referenceNumber")
    .optional()
    .trim()
    .isLength({ max: 100 }),

  body("transactionId")
    .optional()
    .isUUID()
    .withMessage(
      "transactionId must be a valid UUID."
    ),

  body("importId")
    .optional()
    .isUUID()
    .withMessage(
      "importId must be a valid UUID."
    ),
];

// ---------------------------------------------------------------------------
// ID Validator
// ---------------------------------------------------------------------------

const mobileRechargeIdValidator =
  uuidParamRule("id");

// ---------------------------------------------------------------------------
// List Validator
// ---------------------------------------------------------------------------

const listMobileRechargesValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .toInt(),

  query("provider")
    .optional()
    .isIn(RECHARGE_PROVIDERS),

  query("status")
    .optional()
    .isIn(RECHARGE_STATUSES),

  query("mobileNumber")
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 }),

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
      "rechargeDate",
      "amount",
      "createdAt",
    ]),

  query("order")
    .optional()
    .isIn(["asc", "desc"]),
];

module.exports = {
  createMobileRechargeValidator,
  updateMobileRechargeValidator,
  mobileRechargeIdValidator,
  listMobileRechargesValidator,
};