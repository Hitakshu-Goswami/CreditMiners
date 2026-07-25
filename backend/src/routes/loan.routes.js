const express = require("express");

const { authenticate } = require("../middleware/auth.middleware");

const loanController = require("../controllers/loan.controller");

const {
  createLoanValidator,
  updateLoanValidator,
  loanIdValidator,
  listLoansValidator,
} = require("../validators/loan.validator");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
router.get(
  "/marketplace/trending",
  loanController.getTrendingLoans
);

router.get(
  "/marketplace/recommended",
  loanController.getRecommendedLoans
);

router.get(
  "/marketplace/featured",
  loanController.getFeaturedLoans
);

router.get(
  "/",
  listLoansValidator,
  loanController.listPublishedLoans
);

router.get(
  "/:loanId",
  loanIdValidator,
  loanController.getPublishedLoan
);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

router.use(authenticate);

router.post(
  "/",
  createLoanValidator,
  loanController.createLoan
);

router.get(
  "/me",
  listLoansValidator,
  loanController.listMyLoans
);

router.get(
  "/me/statistics",
  loanController.getLoanStatistics
);

router.get(
  "/me/:loanId",
  loanIdValidator,
  loanController.getMyLoan
);

router.patch(
  "/:loanId",
  [...loanIdValidator, ...updateLoanValidator],
  loanController.updateLoan
);

router.delete(
  "/:loanId",
  loanIdValidator,
  loanController.deleteDraftLoan
);

router.post(
  "/:loanId/publish",
  loanIdValidator,
  loanController.publishLoan
);

router.post(
  "/:loanId/close",
  loanIdValidator,
  loanController.closeLoan
);

module.exports = router;