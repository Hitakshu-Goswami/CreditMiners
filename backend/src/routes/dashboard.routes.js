const express = require("express");

const router = express.Router();

const { authenticate } = require("../middleware/auth.middleware");

const dashboardController = require("../controllers/dashboard.controller");

router.use(authenticate);

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