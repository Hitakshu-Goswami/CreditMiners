const express = require("express");

const router = express.Router();

const { authenticate } = require("../middleware/auth.middleware");

const aiCreditController = require("../controllers/aiCredit.controller");

const {
  assessmentIdValidator,
  creditHistoryValidator,
  creditScoreValidator,
  loanIdValidator,
} = require("../validators/aiCredit.validator");

router.use(authenticate);

router.post(
  "/ai/credit-score",
  creditScoreValidator,
  aiCreditController.generateCreditScore
);

router.get(
  "/ai/credit-score/history",
  creditHistoryValidator,
  aiCreditController.getCreditHistory
);

router.get(
  "/ai/credit-score/latest",
  aiCreditController.getLatestCreditAssessment
);

router.get(
  "/ai/credit-score/factors",
  aiCreditController.getCreditFactors
);

router.get(
  "/ai/credit-score/improvement-plan",
  aiCreditController.getImprovementPlan
);

router.get(
  "/ai/credit-score/confidence",
  aiCreditController.getConfidence
);

router.get(
  "/ai/credit-score/explanation",
  aiCreditController.getExplanation
);

router.get(
  "/ai/credit-score/:id",
  assessmentIdValidator,
  aiCreditController.getCreditAssessment
);

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
