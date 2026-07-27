const prisma =
    require("../config/prisma");

const assessmentPipelineService =
    require("./assessmentPipeline.service");

const investmentAdvisorEngine =
    require("../engines/investmentAdvisor.engine");

const NotFoundError =
    require("../errors/NotFoundError");

class InvestmentAdvisorService {

    /**
     * ============================================================
     * Generate Investment Plan
     * ============================================================
     */

    async generateInvestmentPlan(userId) {

        const context =
            await assessmentPipelineService
                .buildValidatedContext(userId);

        const existingPlan =
            await this.findLatestPlanBySnapshot(

                context.financialSnapshot.id,

                context.activeModel.id

            );

        if (existingPlan) {

            return existingPlan;

        }

        const investmentPlan =
            investmentAdvisorEngine
                .generateInvestmentPlan(context);

        return this.saveInvestmentPlan({

            context,

            investmentPlan

        });

    }

    /**
     * ============================================================
     * Save Investment Plan
     * ============================================================
     */

    async saveInvestmentPlan({

        context,

        investmentPlan

    }) {

        return prisma.investmentRecommendation.create({

            data: {

                userId:
                    context.user.id,

                snapshotId:
                    context.financialSnapshot.id,

                modelVersionId:
                    context.activeModel.id,

                investmentReadiness:
                    investmentPlan.investmentReadiness,

                assetAllocation:
                    investmentPlan.assetAllocation,

                recommendations:
                    investmentPlan.recommendations,

                portfolio:
                    investmentPlan.portfolio,

                goalBasedPlan:
                    investmentPlan.goalBasedPlan,

                riskAnalysis:
                    investmentPlan.riskAnalysis,

                diversification:
                    investmentPlan.diversification,

                portfolioSummary:
                    investmentPlan.portfolioSummary,

                portfolioRiskScore:
                    investmentPlan.portfolioRiskScore,

                expectedAnnualReturn:
                    investmentPlan.expectedAnnualReturn,

                reviewSchedule:
                    investmentPlan.reviewSchedule,

                explanation:
                    investmentPlan.explanation

            }

        });

    }

    /**
     * ============================================================
     * Latest Investment Plan
     * ============================================================
     */

    async getLatestInvestmentPlan(userId) {

        const plan =
            await prisma.investmentRecommendation.findFirst({

                where: {

                    userId

                },

                orderBy: {

                    createdAt: "desc"

                }

            });

        if (!plan) {

            throw new NotFoundError(

                "Investment plan not found."

            );

        }

        return plan;

    }

    /**
     * ============================================================
     * Investment History
     * ============================================================
     */

    async getInvestmentHistory(userId) {

        return prisma.investmentRecommendation.findMany({

            where: {

                userId

            },

            orderBy: {

                createdAt: "desc"

            }

        });

    }
        /**
     * ============================================================
     * Get Investment Plan By ID
     * ============================================================
     */

    async getInvestmentPlanById(id) {

        return this.findInvestmentPlan(id);

    }

    /**
     * ============================================================
     * Update Investment Plan
     * ============================================================
     */

    async updateInvestmentPlan(

        id,

        updates

    ) {

        await this.findInvestmentPlan(id);

        return prisma.investmentRecommendation.update({

            where: {

                id

            },

            data: {

                ...updates

            }

        });

    }

    /**
     * ============================================================
     * Delete Investment Plan
     * ============================================================
     */

    async deleteInvestmentPlan(id) {

        await this.findInvestmentPlan(id);

        return prisma.investmentRecommendation.delete({

            where: {

                id

            }

        });

    }

    /**
     * ============================================================
     * Find Investment Plan
     * ============================================================
     */

    async findInvestmentPlan(id) {

        const plan =

            await prisma.investmentRecommendation.findUnique({

                where: {

                    id

                },

                include: {

                    snapshot: true,

                    modelVersion: true,

                    user: {

                        select: {

                            id: true,

                            fullName: true,

                            email: true

                        }

                    }

                }

            });

        if (!plan) {

            throw new NotFoundError(

                "Investment plan not found."

            );

        }

        return plan;

    }

    /**
     * ============================================================
     * Find Latest Plan By Snapshot
     * ============================================================
     */

    async findLatestPlanBySnapshot(

        snapshotId,

        modelVersionId

    ) {

        return prisma.investmentRecommendation.findFirst({

            where: {

                snapshotId,

                modelVersionId

            },

            orderBy: {

                createdAt: "desc"

            }

        });

    }

    /**
     * ============================================================
     * Compare Investment Plans
     * ============================================================
     */

    async compareInvestmentPlans(userId) {

        const plans =

            await prisma.investmentRecommendation.findMany({

                where: {

                    userId

                },

                orderBy: {

                    createdAt: "desc"

                },

                take: 2

            });

        if (plans.length < 2) {

            throw new NotFoundError(

                "At least two investment plans are required for comparison."

            );

        }

        const [

            latest,

            previous

        ] = plans;

        return {

            latest,

            previous,

            changes: {

                readinessScore:

                    latest.investmentReadiness.score -

                    previous.investmentReadiness.score,

                expectedAnnualReturn:

                    latest.expectedAnnualReturn -

                    previous.expectedAnnualReturn,

                portfolioRiskScore:

                    latest.portfolioRiskScore -

                    previous.portfolioRiskScore

            }

        };

    }
        /**
     * ============================================================
     * Regenerate Investment Plan
     * ============================================================
     */

    async regenerateInvestmentPlan(userId) {

        const context =
            await assessmentPipelineService
                .buildValidatedContext(userId);

        const investmentPlan =
            investmentAdvisorEngine
                .generateInvestmentPlan(context);

        return this.saveInvestmentPlan({

            context,

            investmentPlan

        });

    }

    /**
     * ============================================================
     * Investment Statistics
     * ============================================================
     */

    async getInvestmentStatistics(userId) {

        const plans =
            await prisma.investmentRecommendation.findMany({

                where: {

                    userId

                },

                select: {

                    investmentReadiness: true,

                    expectedAnnualReturn: true,

                    portfolioRiskScore: true,

                    createdAt: true

                },

                orderBy: {

                    createdAt: "desc"

                }

            });

        if (!plans.length) {

            return {

                totalPlans: 0,

                latestPlan: null,

                averageReadinessScore: 0,

                averageExpectedReturn: 0,

                averagePortfolioRiskScore: 0

            };

        }

        const totalReadiness = plans.reduce(

            (sum, plan) =>

                sum +

                (plan.investmentReadiness?.score ?? 0),

            0

        );

        const totalExpectedReturn = plans.reduce(

            (sum, plan) =>

                sum +

                (plan.expectedAnnualReturn ?? 0),

            0

        );

        const totalRiskScore = plans.reduce(

            (sum, plan) =>

                sum +

                (plan.portfolioRiskScore ?? 0),

            0

        );

        return {

            totalPlans:
                plans.length,

            latestPlan:
                plans[0].createdAt,

            averageReadinessScore:

                Number(

                    (
                        totalReadiness /

                        plans.length

                    ).toFixed(2)

                ),

            averageExpectedReturn:

                Number(

                    (
                        totalExpectedReturn /

                        plans.length

                    ).toFixed(2)

                ),

            averagePortfolioRiskScore:

                Number(

                    (
                        totalRiskScore /

                        plans.length

                    ).toFixed(2)

                )

        };

    }

    /**
     * ============================================================
     * Investment Plan Exists
     * ============================================================
     */

    async investmentPlanExists(id) {

        const plan =
            await prisma.investmentRecommendation.findUnique({

                where: {

                    id

                },

                select: {

                    id: true

                }

            });

        return Boolean(plan);

    }

    /**
     * ============================================================
     * Validate Investment Plan
     * ============================================================
     */

    validateInvestmentPlan(plan) {

        if (!plan) {

            throw new Error(

                "Investment plan generation failed."

            );

        }

        if (!plan.assetAllocation) {

            throw new Error(

                "Investment plan is missing asset allocation."

            );

        }

        if (!plan.portfolio) {

            throw new Error(

                "Investment plan is missing portfolio."

            );

        }

        return true;

    }

    /**
     * ============================================================
     * Validate User
     * ============================================================
     */

    async validateUser(userId) {

        const user =
            await prisma.user.findUnique({

                where: {

                    id: userId

                },

                select: {

                    id: true

                }

            });

        if (!user) {

            throw new NotFoundError(

                "User not found."

            );

        }

        return true;

    }

}

module.exports =
    new InvestmentAdvisorService();