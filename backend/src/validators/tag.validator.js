const { body, param, query } = require("express-validator");

const createTagValidator = [

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 100 }),

  body("color")
    .optional()
    .trim()
    .isLength({ max: 50 }),

];

const updateTagValidator = [

  body("name")
    .optional()
    .trim()
    .isLength({ max: 100 }),

  body("color")
    .optional()
    .trim()
    .isLength({ max: 50 }),

];

const tagIdValidator = [

  param("id")
    .isUUID()
    .withMessage("Invalid tag id."),

];

const listTagsValidator = [

  query("page")
    .optional()
    .isInt({ min: 1 })
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .toInt(),

  query("search")
    .optional()
    .trim(),

  query("sortBy")
    .optional()
    .isIn([
      "name",
      "color",
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

  createTagValidator,

  updateTagValidator,

  tagIdValidator,

  listTagsValidator,

};