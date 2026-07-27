const express = require("express");

const router = express.Router();

const creditAssessmentController =
    require("../controllers/creditAssessment.controller");
const {
    authenticate
} = require("../middleware/auth.middleware");

const authorize =
    require("../middleware/authorize");

/**
 * ============================================================
 * All Credit Assessment Routes Require Authentication
 * ============================================================
 */

router.use(authenticate);

/**
 * ============================================================
 * Generate Credit Assessment
 * ============================================================
 * POST /api/credit-assessment/generate
 */

router.post(
    "/generate",
    creditAssessmentController.generateAssessment
);

/**
 * ============================================================
 * Regenerate Credit Assessment
 * ============================================================
 * POST /api/credit-assessment/regenerate
 */

router.post(
    "/regenerate",
    creditAssessmentController.regenerateAssessment
);

/**
 * ============================================================
 * Latest Assessment
 * ============================================================
 * GET /api/credit-assessment/latest
 */

router.get(
    "/latest",
    creditAssessmentController.getLatestAssessment
);

/**
 * ============================================================
 * Assessment History
 * ============================================================
 * GET /api/credit-assessment/history
 */

router.get(
    "/history",
    creditAssessmentController.getAssessmentHistory
);

/**
 * ============================================================
 * Assessment Comparison
 * ============================================================
 * GET /api/credit-assessment/compare
 */

router.get(
    "/compare",
    creditAssessmentController.compareLatestAssessments
);

/**
 * ============================================================
 * Assessment Statistics
 * ============================================================
 * GET /api/credit-assessment/statistics
 */

router.get(
    "/statistics",
    creditAssessmentController.getAssessmentStatistics
);

/**
 * ============================================================
 * Delete Assessment
 * ============================================================
 * DELETE /api/credit-assessment/:id
 */

router.delete(
    "/:id",
    authorize("ADMIN"),
    creditAssessmentController.deleteAssessment
);

/**
 * ============================================================
 * Assessment By ID
 * ============================================================
 * IMPORTANT:
 * Keep this route LAST to prevent conflicts with:
 * /latest
 * /history
 * /compare
 * /statistics
 * ============================================================
 *
 * GET /api/credit-assessment/:id
 */

router.get(
    "/:id",
    creditAssessmentController.getAssessmentById
);

module.exports = router;