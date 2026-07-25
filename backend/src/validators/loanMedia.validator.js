const { param, body } = require("express-validator");

const loanIdValidator = [
  param("loanId")
    .isUUID()
    .withMessage("Invalid loan ID."),
];

const mediaIdValidator = [
  param("mediaId")
    .isUUID()
    .withMessage("Invalid media ID."),
];

const uploadMediaValidator = [
  body("mediaType")
    .isIn(["IMAGE", "DOCUMENT"])
    .withMessage("Invalid media type."),

  body("documentType")
    .optional()
    .isIn([
      "ID_PROOF",
      "ADDRESS_PROOF",
      "BANK_STATEMENT",
      "SALARY_SLIP",
      "BUSINESS_PROOF",
      "COLLATERAL_PROOF",
      "OTHER",
    ])
    .withMessage("Invalid document type."),
];

module.exports = {
  loanIdValidator,
  mediaIdValidator,
  uploadMediaValidator,
};