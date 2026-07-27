const prisma = require("../config/prisma");

const financialFeatureService =
    require("./financialFeature.service");

const behaviourSignalService =
    require("./behaviourSignal.service");

const goalExtractionService =
    require("./goalExtraction.service");

const riskProfilingService =
    require("./riskProfiling.service");

const investorPersonaService =
    require("./investorPersona.service");

const recommendationPreparationService =
    require("./recommendationPreparation.service");

const assessmentHistoryService =
    require("./assessmentHistory.service");

const NotFoundError =
    require("../errors/NotFoundError");

class AssessmentPipelineService {

    /**
     * ============================================================
     * Build Complete Assessment Context
     * ============================================================
     */

    async buildContext(userId) {

        const [

            user,

            financialProfile,

            financialSnapshot,

            riskSession,

            activeModel

        ] = await Promise.all([

            this.findUser(userId),

            this.findFinancialProfile(userId),

            this.findLatestSnapshot(userId),

            this.findLatestRiskSession(userId),

            this.findActiveModel()

        ]);

        const financialFeatures =
            await financialFeatureService.getFinancialProfile(
                userId
            );

        const [

            behaviourSignals,

            goals,

            riskProfile,

            investorPersona,

            recommendationProfile,

            assessmentHistory,

            answers

        ] = await Promise.all([

            behaviourSignalService.generateBehaviourSignals(
                riskSession.id
            ),

            goalExtractionService.extractGoals(
                riskSession.id
            ),

            riskProfilingService.generateRiskProfile(
                riskSession.id
            ),

            investorPersonaService.generatePersona(
                riskSession.id
            ),

            recommendationPreparationService.generateRecommendationProfile(
                riskSession.id
            ),

            assessmentHistoryService.getLatestSnapshot(
                userId
            ),

            this.getAnswers(
                riskSession.id
            )

        ]);

        return {

            user,

            financialProfile,

            financialSnapshot,

            financialFeatures,

            riskSession,

            answers,

            behaviourSignals,

            goals,

            riskProfile,

            investorPersona,

            recommendationProfile,

            activeModel,

            assessmentHistory,

            generatedAt: new Date()

        };

    }

    /**
     * ============================================================
     * Find User
     * ============================================================
     */

    async findUser(userId) {

        const user =
            await prisma.user.findUnique({

                where: {
                    id: userId
                }

            });

        if (!user) {

            throw new NotFoundError(
                "User not found."
            );

        }

        return user;

    }

    /**
     * ============================================================
     * Find Financial Profile
     * ============================================================
     */

    async findFinancialProfile(userId) {

        const profile =
            await prisma.financialProfile.findUnique({

                where: {
                    userId
                }

            });

        if (!profile) {

            throw new NotFoundError(
                "Financial profile not found."
            );

        }

        return profile;

    }

    /**
     * ============================================================
     * Find Latest Financial Snapshot
     * ============================================================
     */

    async findLatestSnapshot(userId) {

        const snapshot =
            await prisma.financialSnapshot.findFirst({

                where: {
                    userId
                },

                orderBy: {

                    snapshotDate: "desc"

                }

            });

        if (!snapshot) {

            throw new NotFoundError(
                "Financial snapshot not found."
            );

        }

        return snapshot;

    }
        /**
     * ============================================================
     * Find Latest Risk Assessment Session
     * ============================================================
     */

    async findLatestRiskSession(userId) {

        const session =
            await prisma.riskAssessmentSession.findFirst({

                where: {
                    userId
                },

                orderBy: {
                    createdAt: "desc"
                }

            });

        if (!session) {

            throw new NotFoundError(
                "Risk assessment session not found."
            );

        }

        return session;

    }

    /**
     * ============================================================
     * Find Active AI Model Version
     * ============================================================
     */

    async findActiveModel() {

        const model =
            await prisma.aIModelVersion.findFirst({

                where: {
                    isActive: true
                },

                orderBy: {
                    createdAt: "desc"
                }

            });

        if (!model) {

            throw new NotFoundError(
                "Active AI model version not found."
            );

        }

        return model;

    }

    /**
     * ============================================================
     * Get Assessment Answers
     * ============================================================
     */

    async getAnswers(sessionId) {

        const session =
            await prisma.riskAssessmentSession.findUnique({

                where: {
                    id: sessionId
                },

                select: {
                    answers: true
                }

            });

        return session?.answers ?? {};

    }

    /**
     * ============================================================
     * Validate Assessment Context
     * ============================================================
     */

    validateContext(context) {

        const requiredFields = [

            "user",
            "financialProfile",
            "financialSnapshot",
            "financialFeatures",
            "riskSession",
            "answers",
            "behaviourSignals",
            "goals",
            "riskProfile",
            "investorPersona",
            "recommendationProfile",
            "activeModel"

        ];

        for (const field of requiredFields) {

            if (
                context[field] === undefined ||
                context[field] === null
            ) {

                throw new Error(
                    `Assessment context missing required field: ${field}`
                );

            }

        }

        return true;

    }

    /**
     * ============================================================
     * Build & Validate Context
     * ============================================================
     */

    async buildValidatedContext(userId) {

        const context =
            await this.buildContext(userId);

        this.validateContext(context);

        return context;

    }

}

module.exports =
    new AssessmentPipelineService();