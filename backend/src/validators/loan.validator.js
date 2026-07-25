const { body, param, query } = require("express-validator");

const LOAN_STATUS = [
  "DRAFT",
  "PUBLISHED",
  "FUNDED",
  "CLOSED",
  "CANCELLED",
];

const LOAN_CATEGORY = [
  "PERSONAL",
  "EDUCATION",
  "BUSINESS",
  "MEDICAL",
  "AGRICULTURE",
  "HOME",
  "VEHICLE",
  "EMERGENCY",
  "OTHER",
];

const LOAN_PURPOSE = [
  "PERSONAL",
  "EDUCATION",
  "BUSINESS",
  "MEDICAL",
  "AGRICULTURE",
  "HOME_RENOVATION",
  "VEHICLE",
  "DEBT_CONSOLIDATION",
  "EMERGENCY",
  "OTHER",
];

const createLoanValidator = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 120 })
    .withMessage("Title must be between 5 and 120 characters."),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters."),

  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than zero."),

  body("durationMonths")
    .isInt({ min: 1, max: 360 })
    .withMessage("Duration must be between 1 and 360 months."),

  body("category")
    .isIn(LOAN_CATEGORY)
    .withMessage("Invalid loan category."),

  body("purpose")
    .isIn(LOAN_PURPOSE)
    .withMessage("Invalid loan purpose."),

  body("requiredFundingDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("requiredFundingDate must be a valid date."),

    body("interestRate")
  .optional()
  .isFloat({ min: 0, max: 100 })
  .withMessage("Interest rate must be between 0 and 100"),

body("minimumInvestment")
  .optional()
  .isFloat({ min: 0 })
  .withMessage("Minimum investment must be greater than or equal to 0"),

body("fundingDeadline")
  .optional()
  .isISO8601()
  .withMessage("Funding deadline must be a valid date"),

body("expiryDate")
  .optional()
  .isISO8601()
  .withMessage("Expiry date must be a valid date"),

body("country")
  .optional()
  .trim()
  .isLength({ max: 100 }),

body("state")
  .optional()
  .trim()
  .isLength({ max: 100 }),

body("city")
  .optional()
  .trim()
  .isLength({ max: 100 }),

body("latitude")
  .optional()
  .isFloat({ min: -90, max: 90 })
  .withMessage("Latitude must be between -90 and 90"),

body("longitude")
  .optional()
  .isFloat({ min: -180, max: 180 })
  .withMessage("Longitude must be between -180 and 180"),

  body("collateralType")
  .optional()
  .isIn([
    "NONE",
    "PROPERTY",
    "VEHICLE",
    "GOLD",
    "BUSINESS",
    "MACHINERY",
    "INVENTORY",
    "OTHER",
  ])
  .withMessage("Invalid collateral type."),

body("collateralValue")
  .optional()
  .isFloat({ min: 0 })
  .withMessage("Collateral value must be greater than or equal to 0."),

body("collateralDescription")
  .optional()
  .trim()
  .isLength({ max: 2000 })
  .withMessage("Collateral description cannot exceed 2000 characters."),
];



const updateLoanValidator = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 5, max: 120 }),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 }),

  body("amount")
    .optional()
    .isFloat({ gt: 0 }),

  body("durationMonths")
    .optional()
    .isInt({ min: 1, max: 360 }),

  body("category")
    .optional()
    .isIn(LOAN_CATEGORY),

  body("purpose")
    .optional()
    .isIn(LOAN_PURPOSE),

  body("requiredFundingDate")
    .optional()
    .isISO8601()
    .toDate(),
    body("collateralType")
  .optional()
  .isIn([
    "NONE",
    "PROPERTY",
    "VEHICLE",
    "GOLD",
    "BUSINESS",
    "MACHINERY",
    "INVENTORY",
    "OTHER",
  ])
  .withMessage("Invalid collateral type."),

body("collateralValue")
  .optional()
  .isFloat({ min: 0 })
  .withMessage("Collateral value must be greater than or equal to 0."),

body("collateralDescription")
  .optional()
  .trim()
  .isLength({ max: 2000 })
  .withMessage("Collateral description cannot exceed 2000 characters."),
];

const loanIdValidator = [
  param("loanId")
    .isUUID()
    .withMessage("Invalid loan ID."),
];

const listLoansValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .toInt(),

  query("status")
    .optional()
    .isIn(LOAN_STATUS),

  query("category")
    .optional()
    .isIn(LOAN_CATEGORY),

  query("search")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }),
];

module.exports = {
  createLoanValidator,
  updateLoanValidator,
  loanIdValidator,
  listLoansValidator,
};