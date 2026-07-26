const { body, param, query } = require("express-validator");

const createMerchantValidator = [

  body("name")
    .trim()
    .notEmpty()
    .isLength({ max: 100 }),

  body("code")
    .optional()
    .trim()
    .isLength({ max: 100 }),

  body("category")
    .optional()
    .trim()
    .isLength({ max: 100 }),

  body("logoUrl")
    .optional()
    .isURL(),

  body("website")
    .optional()
    .isURL(),

  body("isVerified")
    .optional()
    .isBoolean(),

];

const updateMerchantValidator = [

  body("name")
    .optional()
    .trim()
    .isLength({ max: 100 }),

  body("code")
    .optional()
    .trim()
    .isLength({ max: 100 }),

  body("category")
    .optional()
    .trim()
    .isLength({ max: 100 }),

  body("logoUrl")
    .optional()
    .isURL(),

  body("website")
    .optional()
    .isURL(),

  body("isVerified")
    .optional()
    .isBoolean(),

];

const merchantIdValidator = [

  param("id")
    .isUUID()
    .withMessage("Invalid merchant id."),

];

const listMerchantsValidator = [

  query("page")
    .optional()
    .isInt({ min: 1 })
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .toInt(),

  query("category")
    .optional()
    .trim(),

  query("isVerified")
    .optional()
    .isBoolean(),

  query("search")
    .optional()
    .trim(),

  query("sortBy")
    .optional()
    .isIn([
      "name",
      "category",
      "createdAt",
      "updatedAt",
      "isVerified",
    ]),

  query("order")
    .optional()
    .isIn([
      "asc",
      "desc",
    ]),

];

module.exports = {
  createMerchantValidator,
  updateMerchantValidator,
  merchantIdValidator,
  listMerchantsValidator,
};