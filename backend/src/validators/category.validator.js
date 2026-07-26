const { body, param, query } = require("express-validator");

const createCategoryValidator = [

  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required.")
    .isLength({ max: 100 }),

  body("slug")
    .optional()
    .trim()
    .isLength({ max: 100 }),

  body("description")
    .optional()
    .trim(),

  body("icon")
    .optional()
    .trim()
    .isLength({ max: 255 }),

  body("color")
    .optional()
    .trim()
    .isLength({ max: 50 }),

  body("parentId")
    .optional()
    .isUUID()
    .withMessage("parentId must be a valid UUID."),
];

const updateCategoryValidator = [

  body("name")
    .optional()
    .trim()
    .isLength({ max: 100 }),

  body("slug")
    .optional()
    .trim()
    .isLength({ max: 100 }),

  body("description")
    .optional()
    .trim(),

  body("icon")
    .optional()
    .trim()
    .isLength({ max: 255 }),

  body("color")
    .optional()
    .trim()
    .isLength({ max: 50 }),

  body("parentId")
    .optional()
    .isUUID(),
];

const categoryIdValidator = [

  param("id")
    .isUUID()
    .withMessage("Invalid category id."),
];

const listCategoriesValidator = [

  query("page")
    .optional()
    .isInt({ min: 1 })
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .toInt(),

  query("parentId")
    .optional()
    .isUUID(),

  query("rootOnly")
    .optional()
    .isBoolean(),

  query("search")
    .optional()
    .trim(),

  query("sortBy")
    .optional()
    .isIn([
      "name",
      "createdAt",
      "updatedAt",
    ]),

  query("order")
    .optional()
    .isIn([
      "asc",
      "desc",
    ]),
];

module.exports = {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
  listCategoriesValidator,
};