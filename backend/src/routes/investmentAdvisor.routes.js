const express = require("express");

const router = express.Router();

const investmentAdvisorController =
    require("../controllers/investmentAdvisor.controller");

const {
    authenticate
} = require("../middleware/auth.middleware");

const authorize =
    require("../middleware/authorize");

/**
 * ============================================================
 * All Investment Advisor Routes Require Authentication
 * ============================================================
 */

router.use(authenticate);

/**
 * ============================================================
 * Generate Investment Plan
 * ============================================================
 * POST /api/investment-advisor/generate
 */

router.post(
    "/generate",
    investmentAdvisorController.generateInvestmentPlan
);

/**
 * ============================================================
 * Regenerate Investment Plan
 * ============================================================
 * POST /api/investment-advisor/regenerate
 */

router.post(
    "/regenerate",
    investmentAdvisorController.regenerateInvestmentPlan
);

/**
 * ============================================================
 * Latest Investment Plan
 * ============================================================
 * GET /api/investment-advisor/latest
 */

router.get(
    "/latest",
    investmentAdvisorController.getLatestInvestmentPlan
);

/**
 * ============================================================
 * Investment History
 * ============================================================
 * GET /api/investment-advisor/history
 */

router.get(
    "/history",
    investmentAdvisorController.getInvestmentHistory
);

/**
 * ============================================================
 * Compare Investment Plans
 * ============================================================
 * GET /api/investment-advisor/compare
 */

router.get(
    "/compare",
    investmentAdvisorController.compareInvestmentPlans
);

/**
 * ============================================================
 * Investment Statistics
 * ============================================================
 * GET /api/investment-advisor/statistics
 */

router.get(
    "/statistics",
    investmentAdvisorController.getInvestmentStatistics
);

/**
 * ============================================================
 * Get Investment Plan By ID
 * ============================================================
 * IMPORTANT:
 * Keep parameterized routes after all static routes.
 *
 * GET /api/investment-advisor/:id
 */

router.get(
    "/:id",
    investmentAdvisorController.getInvestmentPlanById
);

/**
 * ============================================================
 * Update Investment Plan
 * ============================================================
 * PATCH /api/investment-advisor/:id
 */

router.patch(
    "/:id",
    authorize("ADMIN"),
    investmentAdvisorController.updateInvestmentPlan
);

/**
 * ============================================================
 * Delete Investment Plan
 * ============================================================
 * DELETE /api/investment-advisor/:id
 */

router.delete(
    "/:id",
    authorize("ADMIN"),
    investmentAdvisorController.deleteInvestmentPlan
);

module.exports = router;