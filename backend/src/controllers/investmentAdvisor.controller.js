const investmentAdvisorService =
    require("../services/investmentAdvisor.service");

const asyncHandler =
    require("../middleware/asyncHandler");

class InvestmentAdvisorController {

    /**
     * ============================================================
     * Generate Investment Plan
     * ============================================================
     * POST /api/investment-advisor/generate
     */

    generateInvestmentPlan = asyncHandler(

        async (req, res) => {

            const investmentPlan =
                await investmentAdvisorService.generateInvestmentPlan(
                    req.user.id
                );

            return res.status(201).json({

                success: true,

                message:
                    "Investment plan generated successfully.",

                data: investmentPlan

            });

        }

    );

    /**
     * ============================================================
     * Latest Investment Plan
     * ============================================================
     * GET /api/investment-advisor/latest
     */

    getLatestInvestmentPlan = asyncHandler(

        async (req, res) => {

            const investmentPlan =
                await investmentAdvisorService.getLatestInvestmentPlan(
                    req.user.id
                );

            return res.status(200).json({

                success: true,

                data: investmentPlan

            });

        }

    );

    /**
     * ============================================================
     * Investment History
     * ============================================================
     * GET /api/investment-advisor/history
     */

    getInvestmentHistory = asyncHandler(

        async (req, res) => {

            const history =
                await investmentAdvisorService.getInvestmentHistory(
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
     * Get Investment Plan By ID
     * ============================================================
     * GET /api/investment-advisor/:id
     */

    getInvestmentPlanById = asyncHandler(

        async (req, res) => {

            const investmentPlan =
                await investmentAdvisorService.getInvestmentPlanById(
                    req.params.id
                );

            return res.status(200).json({

                success: true,

                data: investmentPlan

            });

        }

    );

    /**
     * ============================================================
     * Regenerate Investment Plan
     * ============================================================
     * POST /api/investment-advisor/regenerate
     */

    regenerateInvestmentPlan = asyncHandler(

        async (req, res) => {

            const investmentPlan =
                await investmentAdvisorService.regenerateInvestmentPlan(
                    req.user.id
                );

            return res.status(201).json({

                success: true,

                message:
                    "Investment plan regenerated successfully.",

                data: investmentPlan

            });

        }

    );

    /**
     * ============================================================
     * Compare Investment Plans
     * ============================================================
     * GET /api/investment-advisor/compare
     */

    compareInvestmentPlans = asyncHandler(

        async (req, res) => {

            const comparison =
                await investmentAdvisorService.compareInvestmentPlans(
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
     * Investment Statistics
     * ============================================================
     * GET /api/investment-advisor/statistics
     */

    getInvestmentStatistics = asyncHandler(

        async (req, res) => {

            const statistics =
                await investmentAdvisorService.getInvestmentStatistics(
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
     * Update Investment Plan
     * ============================================================
     * PATCH /api/investment-advisor/:id
     */

    updateInvestmentPlan = asyncHandler(

        async (req, res) => {

            const investmentPlan =
                await investmentAdvisorService.updateInvestmentPlan(

                    req.params.id,

                    req.body

                );

            return res.status(200).json({

                success: true,

                message:
                    "Investment plan updated successfully.",

                data: investmentPlan

            });

        }

    );

    /**
     * ============================================================
     * Delete Investment Plan
     * ============================================================
     * DELETE /api/investment-advisor/:id
     */

    deleteInvestmentPlan = asyncHandler(

        async (req, res) => {

            await investmentAdvisorService.deleteInvestmentPlan(
                req.params.id
            );

            return res.status(200).json({

                success: true,

                message:
                    "Investment plan deleted successfully."

            });

        }

    );

}

module.exports =
    new InvestmentAdvisorController();