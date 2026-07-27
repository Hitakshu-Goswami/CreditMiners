const prisma = require("../config/prisma");

const assessmentPipelineService =
    require("./assessmentPipeline.service");

const creditAssessmentEngine =
    require("../engines/creditAssessment.engine");

const NotFoundError =
    require("../errors/NotFoundError");

class CreditAssessmentService {

    /**
     * ============================================================
     * Generate Credit Assessment
     * ============================================================
     */

    async generateAssessment(userId) {

        const context =
            await assessmentPipelineService.buildValidatedContext(
                userId
            );

        const existingAssessment =
            await this.findLatestAssessmentBySnapshot(
                context.financialSnapshot.id,
                context.activeModel.id
            );

        if (existingAssessment) {

            return existingAssessment;

        }

        const assessment =
            creditAssessmentEngine.generateAssessment(
                context
            );

        return this.saveAssessment({

            context,

            assessment

        });

    }

    /**
     * ============================================================
     * Save Assessment
     * ============================================================
     */

    async saveAssessment({

        context,

        assessment

    }) {

        return prisma.creditAssessment.create({

            data: {

                userId:
                    context.user.id,

                snapshotId:
                    context.financialSnapshot.id,

                modelVersionId:
                    context.activeModel.id,

                financialHealthScore:
                    assessment.financialHealthScore,

                estimatedCreditScore:
                    assessment.estimatedCreditScore,

                confidenceScore:
                    assessment.confidenceScore,

                riskLevel:
                    assessment.riskLevel,

                explainabilityScore:
                    assessment.explainabilityScore,

                summary:
                    assessment.summary,

                modelParameters:
                    assessment.modelParameters

            },

            include: {

                snapshot: true,

                modelVersion: true

            }

        });

    }

    /**
     * ============================================================
     * Latest Assessment
     * ============================================================
     */

    async getLatestAssessment(userId) {

        const assessment =
            await prisma.creditAssessment.findFirst({

                where: {

                    userId

                },

                include: {

                    snapshot: true,

                    modelVersion: true

                },

                orderBy: {

                    generatedAt: "desc"

                }

            });

        if (!assessment) {

            throw new NotFoundError(
                "Credit assessment not found."
            );

        }

        return assessment;

    }

    /**
     * ============================================================
     * Assessment By ID
     * ============================================================
     */

    async getAssessmentById(id) {

        return this.findAssessment(id);

    }
        /**
     * ============================================================
     * Get Assessment History
     * ============================================================
     */

    async getAssessmentHistory(userId) {

        return prisma.creditAssessment.findMany({

            where: {
                userId
            },

            include: {

                snapshot: true,

                modelVersion: true

            },

            orderBy: {

                generatedAt: "desc"

            }

        });

    }

    /**
     * ============================================================
     * Delete Assessment
     * ============================================================
     */

    async deleteAssessment(id) {

        await this.findAssessment(id);

        return prisma.creditAssessment.delete({

            where: {
                id
            }

        });

    }

    /**
     * ============================================================
     * Find Assessment
     * ============================================================
     */

    async findAssessment(id) {

        const assessment =
            await prisma.creditAssessment.findUnique({

                where: {
                    id
                },

                include: {

                    snapshot: true,

                    modelVersion: true,

                    investmentRecommendations: true

                }

            });

        if (!assessment) {

            throw new NotFoundError(
                "Credit assessment not found."
            );

        }

        return assessment;

    }

    /**
     * ============================================================
     * Find Latest Assessment
     * For Snapshot + Model Version
     * ============================================================
     */

    async findLatestAssessmentBySnapshot(

        snapshotId,

        modelVersionId

    ) {

        return prisma.creditAssessment.findFirst({

            where: {

                snapshotId,

                modelVersionId

            },

            orderBy: {

                generatedAt: "desc"

            }

        });

    }

    /**
     * ============================================================
     * Regenerate Assessment
     * ============================================================
     */

    async regenerateAssessment(userId) {

        const context =
            await assessmentPipelineService.buildValidatedContext(
                userId
            );

        const assessment =
            creditAssessmentEngine.generateAssessment(
                context
            );

        return this.saveAssessment({

            context,

            assessment

        });

    }

    /**
     * ============================================================
     * Check Assessment Exists
     * ============================================================
     */

    async assessmentExists(id) {

        const assessment =
            await prisma.creditAssessment.findUnique({

                where: {
                    id
                },

                select: {
                    id: true
                }

            });

        return Boolean(assessment);

    }
        /**
     * ============================================================
     * Compare Latest Two Assessments
     * ============================================================
     */

    async compareLatestAssessments(userId) {

        const assessments =
            await prisma.creditAssessment.findMany({

                where: {
                    userId
                },

                orderBy: {
                    generatedAt: "desc"
                },

                take: 2

            });

        if (assessments.length < 2) {

            throw new NotFoundError(
                "At least two assessments are required for comparison."
            );

        }

        const [latest, previous] = assessments;

        return {

            latest,

            previous,

            difference: {

                financialHealthScore:

                    latest.financialHealthScore -
                    previous.financialHealthScore,

                estimatedCreditScore:

                    latest.estimatedCreditScore -
                    previous.estimatedCreditScore,

                confidenceScore:

                    latest.confidenceScore -
                    previous.confidenceScore

            }

        };

    }

    /**
     * ============================================================
     * Assessment Statistics
     * ============================================================
     */

    async getAssessmentStatistics(userId) {

        const assessments =
            await prisma.creditAssessment.findMany({

                where: {
                    userId
                },

                select: {

                    financialHealthScore: true,

                    estimatedCreditScore: true,

                    confidenceScore: true,

                    generatedAt: true

                }

            });

        return {

            totalAssessments:
                assessments.length,

            latestAssessment:

                assessments.length
                    ? assessments[
                        assessments.length - 1
                    ].generatedAt
                    : null

        };

    }

    /**
     * ============================================================
     * Validate User
     * ============================================================
     */

    async validateUser(userId) {

        const exists =
            await prisma.user.findUnique({

                where: {
                    id: userId
                },

                select: {
                    id: true
                }

            });

        if (!exists) {

            throw new NotFoundError(
                "User not found."
            );

        }

    }

    /**
     * ============================================================
     * Validate Assessment
     * ============================================================
     */

    validateAssessment(assessment) {

        if (!assessment) {

            throw new Error(
                "Assessment generation failed."
            );

        }

        return true;

    }

}

module.exports =
    new CreditAssessmentService();