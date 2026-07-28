const express = require("express");

const router = express.Router();

const { authenticate } = require("../middleware/auth.middleware");

const dashboardController = require("../controllers/dashboard.controller");

router.use(authenticate);

// Phase 9: Explainability and Insights Dashboards
router.get(
  "/dashboard/financial-health",
  dashboardController.getFinancialHealthDashboard
);

router.get(
  "/dashboard/credit",
  dashboardController.getCreditDashboard
);

router.get(
  "/dashboard/trends",
  dashboardController.getFinancialHabitTrends
);

router.get(
  "/dashboard/timeline",
  dashboardController.getImprovementTimeline
);

// Borrower Dashboard
router.get(
  "/dashboard/borrower",
  dashboardController.getBorrowerDashboard
);

// Investor Dashboard
router.get(
  "/dashboard/investor",
  dashboardController.getInvestorDashboard
);

// Marketplace Dashboard
router.get(
  "/dashboard/marketplace",
  dashboardController.getMarketplaceDashboard
);

module.exports = router;
