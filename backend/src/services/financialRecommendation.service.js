const prisma = require("../config/prisma");

const assessmentPipelineService =
    require("./assessmentPipeline.service");

const financialRecommendationEngine =
    require("../engines/financialRecommendation.engine");

const NotFoundError =
    require("../errors/NotFoundError");

class FinancialRecommendationService {

    /**
     * ============================================================
     * Generate Financial Recommendations
     * ============================================================
     */

    async generateRecommendations(userId) {

        const context =
            await assessmentPipelineService.buildValidatedContext(
                userId
            );

        const existing =
            await this.findLatestRecommendationBySnapshot(

                context.financialSnapshot.id,

                context.activeModel.id

            );

        if (existing) {

            return existing;

        }

        const recommendations =
            financialRecommendationEngine
                .generateRecommendations(context);

        return this.saveRecommendations({

            context,

            recommendations

        });

    }

    /**
     * ============================================================
     * Save Recommendations
     * ============================================================
     */

    async saveRecommendations({

        context,

        recommendations

    }) {

        return prisma.$transaction(

            recommendations.map(

                recommendation =>

                    prisma.financialRecommendation.create({

                        data: {

                            userId:
                                context.user.id,

                            snapshotId:
                                context.financialSnapshot.id,

                            modelVersionId:
                                context.activeModel.id,

                            category:
                                recommendation.category,

                            priority:
                                recommendation.priority,

                            impact:
                                recommendation.impact,

                            timeframe:
                                recommendation.timeframe,

                            title:
                                recommendation.title,

                            description:
                                recommendation.description,

                            actionItems:
                                recommendation.actionItems,

                            status:
                                "PENDING"

                        }

                    })

            )

        );

    }

    /**
     * ============================================================
     * Latest Recommendations
     * ============================================================
     */

    async getLatestRecommendations(userId) {

        const recommendations =

            await prisma.financialRecommendation.findMany({

                where: {

                    userId

                },

                orderBy: {

                    createdAt: "desc"

                }

            });

        if (!recommendations.length) {

            throw new NotFoundError(

                "Financial recommendations not found."

            );

        }

        return recommendations;

    }

    /**
     * ============================================================
     * Recommendation History
     * ============================================================
     */

    async getRecommendationHistory(userId) {

        return prisma.financialRecommendation.findMany({

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
     * Get Recommendation By ID
     * ============================================================
     */

    async getRecommendationById(id) {

        return this.findRecommendation(id);

    }

    /**
     * ============================================================
     * Update Recommendation Status
     * ============================================================
     */

    async updateRecommendationStatus(

        id,

        status

    ) {

        await this.findRecommendation(id);

        return prisma.financialRecommendation.update({

            where: {

                id

            },

            data: {

                status

            }

        });

    }

    /**
     * ============================================================
     * Delete Recommendation
     * ============================================================
     */

    async deleteRecommendation(id) {

        await this.findRecommendation(id);

        return prisma.financialRecommendation.delete({

            where: {

                id

            }

        });

    }

    /**
     * ============================================================
     * Find Recommendation
     * ============================================================
     */

    async findRecommendation(id) {

        const recommendation =

            await prisma.financialRecommendation.findUnique({

                where: {

                    id

                },

                include: {

                    snapshot: true,

                    modelVersion: true

                }

            });

        if (!recommendation) {

            throw new NotFoundError(

                "Financial recommendation not found."

            );

        }

        return recommendation;

    }

    /**
     * ============================================================
     * Find Latest Recommendation By Snapshot
     * ============================================================
     */

    async findLatestRecommendationBySnapshot(

        snapshotId,

        modelVersionId

    ) {

        return prisma.financialRecommendation.findFirst({

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
     * Regenerate Recommendations
     * ============================================================
     */

    async regenerateRecommendations(userId) {

        const context =

            await assessmentPipelineService
                .buildValidatedContext(userId);

        const recommendations =

            financialRecommendationEngine
                .generateRecommendations(context);

        return this.saveRecommendations({

            context,

            recommendations

        });

    }

    /**
     * ============================================================
     * Recommendation Statistics
     * ============================================================
     */

    async getRecommendationStatistics(userId) {

        const recommendations =

            await prisma.financialRecommendation.findMany({

                where: {

                    userId

                },

                select: {

                    priority: true,

                    status: true,

                    createdAt: true

                }

            });

        const statistics = {

            totalRecommendations:
                recommendations.length,

            pending:
                recommendations.filter(

                    recommendation =>

                        recommendation.status ===
                        "PENDING"

                ).length,

            inProgress:
                recommendations.filter(

                    recommendation =>

                        recommendation.status ===
                        "IN_PROGRESS"

                ).length,

            completed:
                recommendations.filter(

                    recommendation =>

                        recommendation.status ===
                        "COMPLETED"

                ).length,

            critical:
                recommendations.filter(

                    recommendation =>

                        recommendation.priority ===
                        "CRITICAL"

                ).length,

            high:
                recommendations.filter(

                    recommendation =>

                        recommendation.priority ===
                        "HIGH"

                ).length,

            medium:
                recommendations.filter(

                    recommendation =>

                        recommendation.priority ===
                        "MEDIUM"

                ).length,

            low:
                recommendations.filter(

                    recommendation =>

                        recommendation.priority ===
                        "LOW"

                ).length,

            latestRecommendation:

                recommendations.length

                    ? recommendations[0].createdAt

                    : null

        };

        return statistics;

    }

    /**
     * ============================================================
     * Recommendation Exists
     * ============================================================
     */

    async recommendationExists(id) {

        const recommendation =

            await prisma.financialRecommendation.findUnique({

                where: {

                    id

                },

                select: {

                    id: true

                }

            });

        return Boolean(recommendation);

    }

    /**
     * ============================================================
     * Validate Recommendation
     * ============================================================
     */

    validateRecommendation(recommendation) {

        if (!recommendation) {

            throw new Error(

                "Recommendation generation failed."

            );

        }

        return true;

    }

}

module.exports =
    new FinancialRecommendationService();