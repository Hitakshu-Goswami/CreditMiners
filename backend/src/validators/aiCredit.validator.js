const { param } = require("express-validator");

const loanIdValidator = [
  param("loanId")
    .isUUID()
    .withMessage("Invalid loan ID."),
];

module.exports = {
  loanIdValidator,
};