const financialRecommendationService =
    require("../services/financialRecommendation.service");

const asyncHandler =
    require("../middleware/asyncHandler");

class FinancialRecommendationController {

    /**
     * ============================================================
     * Generate Recommendations
     * ============================================================
     * POST /api/financial-recommendations/generate
     */

    generateRecommendations = asyncHandler(

        async (req, res) => {

            const recommendations =
                await financialRecommendationService.generateRecommendations(
                    req.user.id
                );

            return res.status(201).json({

                success: true,

                message:
                    "Financial recommendations generated successfully.",

                data: recommendations

            });

        }

    );

    /**
     * ============================================================
     * Latest Recommendations
     * ============================================================
     * GET /api/financial-recommendations/latest
     */

    getLatestRecommendations = asyncHandler(

        async (req, res) => {

            const recommendations =
                await financialRecommendationService.getLatestRecommendations(
                    req.user.id
                );

            return res.status(200).json({

                success: true,

                count: recommendations.length,

                data: recommendations

            });

        }

    );

    /**
     * ============================================================
     * Recommendation History
     * ============================================================
     * GET /api/financial-recommendations/history
     */

    getRecommendationHistory = asyncHandler(

        async (req, res) => {

            const history =
                await financialRecommendationService.getRecommendationHistory(
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
     * Recommendation By ID
     * ============================================================
     * GET /api/financial-recommendations/:id
     */

    getRecommendationById = asyncHandler(

        async (req, res) => {

            const recommendation =
                await financialRecommendationService.getRecommendationById(
                    req.params.id
                );

            return res.status(200).json({

                success: true,

                data: recommendation

            });

        }

    );

    /**
     * ============================================================
     * Regenerate Recommendations
     * ============================================================
     * POST /api/financial-recommendations/regenerate
     */

    regenerateRecommendations = asyncHandler(

        async (req, res) => {

            const recommendations =
                await financialRecommendationService.regenerateRecommendations(
                    req.user.id
                );

            return res.status(201).json({

                success: true,

                message:
                    "Financial recommendations regenerated successfully.",

                data: recommendations

            });

        }

    );

    /**
     * ============================================================
     * Update Recommendation Status
     * ============================================================
     * PATCH /api/financial-recommendations/:id/status
     */

    updateRecommendationStatus = asyncHandler(

        async (req, res) => {

            const recommendation =
                await financialRecommendationService.updateRecommendationStatus(

                    req.params.id,

                    req.body.status

                );

            return res.status(200).json({

                success: true,

                message:
                    "Recommendation status updated successfully.",

                data: recommendation

            });

        }

    );

    /**
     * ============================================================
     * Recommendation Statistics
     * ============================================================
     * GET /api/financial-recommendations/statistics
     */

    getRecommendationStatistics = asyncHandler(

        async (req, res) => {

            const statistics =
                await financialRecommendationService.getRecommendationStatistics(
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
     * Delete Recommendation
     * ============================================================
     * DELETE /api/financial-recommendations/:id
     */

    deleteRecommendation = asyncHandler(

        async (req, res) => {

            await financialRecommendationService.deleteRecommendation(
                req.params.id
            );

            return res.status(200).json({

                success: true,

                message:
                    "Financial recommendation deleted successfully."

            });

        }

    );

}

module.exports =
    new FinancialRecommendationController();