const { param, query } = require("express-validator");

const uuidQuery = (field) =>
  query(field)
    .optional()
    .isUUID()
    .withMessage(`${field} must be a valid UUID.`);

const paginationValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .toInt()
    .withMessage("page must be a positive integer."),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 200 })
    .toInt()
    .withMessage("limit must be between 1 and 200."),
];

const auditLogValidator = [
  ...paginationValidator,
  uuidQuery("actorUserId"),
  query("actorRole")
    .optional()
    .trim()
    .isLength({ min: 2, max: 40 })
    .withMessage("actorRole must be between 2 and 40 characters."),
  query("action")
    .optional()
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage("action must be between 2 and 120 characters."),
  query("entityType")
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("entityType must be between 2 and 80 characters."),
  query("from")
    .optional()
    .isISO8601()
    .withMessage("from must be a valid ISO date."),
  query("to")
    .optional()
    .isISO8601()
    .withMessage("to must be a valid ISO date."),
];

const idValidator = [
  param("id")
    .isUUID()
    .withMessage("Invalid ID."),
];

module.exports = {
  auditLogValidator,
  idValidator,
  paginationValidator,
};
