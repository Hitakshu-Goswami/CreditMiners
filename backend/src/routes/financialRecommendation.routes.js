const express = require("express");

const router = express.Router();

const financialRecommendationController =
    require("../controllers/financialRecommendation.controller");
const {
    authenticate
} = require("../middleware/auth.middleware");

const authorize =
    require("../middleware/authorize");

/**
 * ============================================================
 * All Financial Recommendation Routes Require Authentication
 * ============================================================
 */

router.use(authenticate);

/**
 * ============================================================
 * Generate Recommendations
 * ============================================================
 * POST /api/financial-recommendations/generate
 */

router.post(
    "/generate",
    financialRecommendationController.generateRecommendations
);

/**
 * ============================================================
 * Regenerate Recommendations
 * ============================================================
 * POST /api/financial-recommendations/regenerate
 */

router.post(
    "/regenerate",
    financialRecommendationController.regenerateRecommendations
);

/**
 * ============================================================
 * Latest Recommendations
 * ============================================================
 * GET /api/financial-recommendations/latest
 */

router.get(
    "/latest",
    financialRecommendationController.getLatestRecommendations
);

/**
 * ============================================================
 * Recommendation History
 * ============================================================
 * GET /api/financial-recommendations/history
 */

router.get(
    "/history",
    financialRecommendationController.getRecommendationHistory
);

/**
 * ============================================================
 * Recommendation Statistics
 * ============================================================
 * GET /api/financial-recommendations/statistics
 */

router.get(
    "/statistics",
    financialRecommendationController.getRecommendationStatistics
);

/**
 * ============================================================
 * Recommendation By ID
 * ============================================================
 * IMPORTANT:
 * Keep parameterized routes after all static routes.
 *
 * GET /api/financial-recommendations/:id
 */

router.get(
    "/:id",
    financialRecommendationController.getRecommendationById
);

/**
 * ============================================================
 * Update Recommendation Status
 * ============================================================
 * PATCH /api/financial-recommendations/:id/status
 */

router.patch(
    "/:id/status",
    financialRecommendationController.updateRecommendationStatus
);

/**
 * ============================================================
 * Delete Recommendation
 * ============================================================
 * DELETE /api/financial-recommendations/:id
 */

router.delete(
    "/:id",
    authorize("ADMIN"),
    financialRecommendationController.deleteRecommendation
);

module.exports = router;