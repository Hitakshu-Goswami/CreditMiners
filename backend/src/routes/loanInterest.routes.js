const express = require("express");

const router = express.Router();

const { authenticate } = require("../middleware/auth.middleware");

const controller = require("../controllers/loanInterest.controller");

const {
  loanIdValidator,
  interestIdValidator,
  createInterestValidator,
} = require("../validators/loanInterest.validator");

router.use(authenticate);

// Investor expresses interest
router.post(
  "/loans/:loanId/interests",
  loanIdValidator,
  createInterestValidator,
  controller.createInterest
);

// Borrower views all interests for a loan
router.get(
  "/my-loans/:loanId/interests",
  loanIdValidator,
  controller.getLoanInterests
);

// Borrower accepts an investor
router.patch(
  "/interests/:interestId/accept",
  interestIdValidator,
  controller.acceptInterest
);

// Borrower rejects an investor
router.patch(
  "/interests/:interestId/reject",
  interestIdValidator,
  controller.rejectInterest
);

// Investor withdraws interest
router.delete(
  "/interests/:interestId",
  interestIdValidator,
  controller.withdrawInterest
);

module.exports = router;