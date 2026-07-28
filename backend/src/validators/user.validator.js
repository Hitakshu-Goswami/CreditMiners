const { body, param, query } = require("express-validator");

const EMPLOYMENT_TYPES = ["STUDENT", "EMPLOYED", "SELF_EMPLOYED", "FREELANCER", "BUSINESS_OWNER", "UNEMPLOYED", "RETIRED"];
const GENDERS = ["MALE", "FEMALE", "NON_BINARY", "PREFER_NOT_TO_SAY"];
const EDUCATION_LEVELS = ["HIGH_SCHOOL", "DIPLOMA", "BACHELORS", "MASTERS", "DOCTORATE", "OTHER", "PREFER_NOT_TO_SAY"];
const INCOME_FREQUENCIES = ["WEEKLY", "BIWEEKLY", "MONTHLY", "QUARTERLY", "ANNUALLY", "IRREGULAR"];
const SAVINGS_HABITS = ["NONE", "OCCASIONAL", "REGULAR", "AUTOMATED"];
const GOAL_PRIORITIES = ["LOW", "MEDIUM", "HIGH"];
const GOAL_STATUSES = ["ACTIVE", "COMPLETED", "PAUSED", "CANCELLED"];
const ADMIN_ASSIGNABLE_ROLES = ["SUPER_ADMIN", "ADMIN", "AI_ANALYST", "SUPPORT", "AUDITOR", "USER"];

const optionalText = (field, max = 100) => body(field).optional().trim().isLength({ min: 1, max }).withMessage(`${field} must be between 1 and ${max} characters.`);
const optionalMoney = (field) => body(field).optional().isFloat({ min: 0, max: 1000000000 }).withMessage(`${field} must be a non-negative amount.`);

const updateProfileValidator = [
  optionalText("fullName", 120),
  body("dateOfBirth").optional().isISO8601().toDate().withMessage("dateOfBirth must be a valid ISO date."),
  body("gender").optional().isIn(GENDERS).withMessage("Invalid gender."),
  body("education").optional().isIn(EDUCATION_LEVELS).withMessage("Invalid education level."),
  optionalText("city", 100),
  optionalText("state", 100),
  optionalText("country", 100),
];

const profileImageValidator = [
  body("profileImage")
    .isURL({ protocols: ["https"], require_protocol: true })
    .withMessage("profileImage must be an HTTPS URL."),
];

const financialProfileValidator = [
  optionalText("occupation", 120),
  body("employmentType").optional().isIn(EMPLOYMENT_TYPES).withMessage("Invalid employment type."),
  optionalMoney("monthlyIncome"),
  body("incomeFrequency").optional().isIn(INCOME_FREQUENCIES).withMessage("Invalid income frequency."),
  optionalMoney("monthlyExpenses"),
  body("savingsHabit").optional().isIn(SAVINGS_HABITS).withMessage("Invalid savings habit."),
  optionalMoney("existingInvestments"),
  optionalMoney("existingLiabilities"),
  optionalMoney("emergencyFund"),
  body("dependents").optional().isInt({ min: 0, max: 50 }).toInt().withMessage("dependents must be a non-negative integer."),
  optionalText("preferredCurrency", 3).isUppercase().withMessage("preferredCurrency must be an uppercase ISO currency code."),
  body("notes").optional().trim().isLength({ max: 2000 }).withMessage("notes cannot exceed 2000 characters."),
];

const preferencesValidator = [
  body("language").optional().matches(/^[a-z]{2}(-[A-Z]{2})?$/).withMessage("language must be a valid locale tag."),
  body("theme").optional().isIn(["LIGHT", "DARK", "SYSTEM"]).withMessage("Invalid theme."),
  body("notificationPreferences").optional().isObject().withMessage("notificationPreferences must be an object."),
  body("privacyPreferences").optional().isObject().withMessage("privacyPreferences must be an object."),
];

const changeEmailValidator = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required."),
  body("currentPassword").notEmpty().withMessage("Current password is required."),
];

const changePhoneValidator = [
  body("phone").isMobilePhone().withMessage("Invalid phone number."),
  body("currentPassword").notEmpty().withMessage("Current password is required."),
];

const tokenValidator = [query("token").notEmpty().withMessage("Verification token is required.")];

const goalCreateValidator = [
  body("title").trim().isLength({ min: 1, max: 120 }).withMessage("title is required and cannot exceed 120 characters."),
  body("description").optional().trim().isLength({ max: 1000 }).withMessage("description cannot exceed 1000 characters."),
  body("targetAmount").isFloat({ gt: 0, max: 1000000000 }).withMessage("targetAmount must be greater than zero."),
  optionalMoney("currentAmount"),
  body("targetDate").optional().isISO8601().toDate().withMessage("targetDate must be a valid ISO date."),
  body("priority").optional().isIn(GOAL_PRIORITIES).withMessage("Invalid goal priority."),
];

const goalUpdateValidator = [
  body("title").optional().trim().isLength({ min: 1, max: 120 }).withMessage("title cannot exceed 120 characters."),
  body("description").optional().trim().isLength({ max: 1000 }).withMessage("description cannot exceed 1000 characters."),
  body("targetAmount").optional().isFloat({ gt: 0, max: 1000000000 }).withMessage("targetAmount must be greater than zero."),
  optionalMoney("currentAmount"),
  body("targetDate").optional({ nullable: true }).isISO8601().toDate().withMessage("targetDate must be a valid ISO date."),
  body("priority").optional().isIn(GOAL_PRIORITIES).withMessage("Invalid goal priority."),
  body("status").optional().isIn(GOAL_STATUSES).withMessage("Invalid goal status."),
];

const goalIdValidator = [param("goalId").isUUID().withMessage("Invalid goal ID.")];
const userIdValidator = [param("userId").isUUID().withMessage("Invalid user ID.")];

const adminListValidator = [
  query("page").optional().isInt({ min: 1 }).toInt().withMessage("page must be a positive integer."),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt().withMessage("limit must be between 1 and 100."),
  query("status").optional().isIn(["ACTIVE", "SUSPENDED", "BANNED", "DELETED"]).withMessage("Invalid user status."),
  query("role").optional().isIn(ADMIN_ASSIGNABLE_ROLES).withMessage("Invalid role."),
  query("emailVerified").optional().isBoolean().withMessage("emailVerified must be boolean."),
  query("phoneVerified").optional().isBoolean().withMessage("phoneVerified must be boolean."),
  query("includeDeleted").optional().isBoolean().withMessage("includeDeleted must be boolean."),
  query("search").optional().trim().isLength({ min: 1, max: 120 }).withMessage("search must be between 1 and 120 characters."),
];

const roleValidator = [body("role").isIn(ADMIN_ASSIGNABLE_ROLES).withMessage("Invalid role.")];

module.exports = {
  updateProfileValidator,
  profileImageValidator,
  financialProfileValidator,
  preferencesValidator,
  changeEmailValidator,
  changePhoneValidator,
  tokenValidator,
  goalCreateValidator,
  goalUpdateValidator,
  goalIdValidator,
  userIdValidator,
  adminListValidator,
  roleValidator,
};
