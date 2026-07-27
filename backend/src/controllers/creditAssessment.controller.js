const creditAssessmentService =
    require("../services/creditAssessment.service");

const asyncHandler =
    require("../middleware/asyncHandler");

class CreditAssessmentController {

    /**
     * ============================================================
     * Generate Credit Assessment
     * ============================================================
     * POST /api/credit-assessment/generate
     */

    generateAssessment = asyncHandler(

        async (req, res) => {

            const result =
                await creditAssessmentService.generateAssessment(
                    req.user.id
                );

            return res.status(201).json({

                success: true,

                message:
                    "Credit assessment generated successfully.",

                data: result

            });

        }

    );

    /**
     * ============================================================
     * Get Latest Assessment
     * ============================================================
     * GET /api/credit-assessment/latest
     */

    getLatestAssessment = asyncHandler(

        async (req, res) => {

            const result =
                await creditAssessmentService.getLatestAssessment(
                    req.user.id
                );

            return res.status(200).json({

                success: true,

                data: result

            });

        }

    );

    /**
     * ============================================================
     * Get Assessment History
     * ============================================================
     * GET /api/credit-assessment/history
     */

    getAssessmentHistory = asyncHandler(

        async (req, res) => {

            const history =
                await creditAssessmentService.getAssessmentHistory(
                    req.user.id
                );

            return res.status(200).json({

                success: true,

                count: history.length,

                data: history

            });

        }

    );

    /**
     * ============================================================
     * Get Assessment By ID
     * ============================================================
     * GET /api/credit-assessment/:id
     */

    getAssessmentById = asyncHandler(

        async (req, res) => {

            const assessment =
                await creditAssessmentService.getAssessmentById(
                    req.params.id
                );

            return res.status(200).json({

                success: true,

                data: assessment

            });

        }

    );

    /**
     * ============================================================
     * Regenerate Assessment
     * ============================================================
     * POST /api/credit-assessment/regenerate
     */

    regenerateAssessment = asyncHandler(

        async (req, res) => {

            const assessment =
                await creditAssessmentService.regenerateAssessment(
                    req.user.id
                );

            return res.status(201).json({

                success: true,

                message:
                    "Credit assessment regenerated successfully.",

                data: assessment

            });

        }

    );

    /**
     * ============================================================
     * Compare Latest Assessments
     * ============================================================
     * GET /api/credit-assessment/compare
     */

    compareLatestAssessments = asyncHandler(

        async (req, res) => {

            const comparison =
                await creditAssessmentService.compareLatestAssessments(
                    req.user.id
                );

            return res.status(200).json({

                success: true,

                data: comparison

            });

        }

    );

    /**
     * ============================================================
     * Assessment Statistics
     * ============================================================
     * GET /api/credit-assessment/statistics
     */

    getAssessmentStatistics = asyncHandler(

        async (req, res) => {

            const statistics =
                await creditAssessmentService.getAssessmentStatistics(
                    req.user.id
                );

            return res.status(200).json({

                success: true,

                data: statistics

            });

        }

    );

    /**
     * ============================================================
     * Delete Assessment
     * ============================================================
     * DELETE /api/credit-assessment/:id
     */

    deleteAssessment = asyncHandler(

        async (req, res) => {

            await creditAssessmentService.deleteAssessment(
                req.params.id
            );

            return res.status(200).json({

                success: true,

                message:
                    "Credit assessment deleted successfully."

            });

        }

    );

}

module.exports =
    new CreditAssessmentController();