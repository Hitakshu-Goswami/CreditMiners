const express = require("express");

const router = express.Router();

const { authenticate } = require("../middleware/auth.middleware");

const aiCreditController = require("../controllers/aiCredit.controller");

const {
  loanIdValidator,
} = require("../validators/aiCredit.validator");

router.use(authenticate);

router.post(
  "/loans/:loanId/ai/analyze",
  loanIdValidator,
  aiCreditController.analyzeLoan
);

router.get(
  "/loans/:loanId/ai",
  loanIdValidator,
  aiCreditController.getLoanAnalysis
);

module.exports = router;