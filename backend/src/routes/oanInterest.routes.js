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

router.post(
  "/loans/:loanId/interests",
  loanIdValidator,
  createInterestValidator,
  controller.createInterest
);

router.get(
  "/my-loans/:loanId/interests",
  loanIdValidator,
  controller.getLoanInterests
);

router.patch(
  "/interests/:interestId/accept",
  interestIdValidator,
  controller.acceptInterest
);

router.patch(
  "/interests/:interestId/reject",
  interestIdValidator,
  controller.rejectInterest
);

router.delete(
  "/interests/:interestId",
  interestIdValidator,
  controller.withdrawInterest
);

module.exports = router;