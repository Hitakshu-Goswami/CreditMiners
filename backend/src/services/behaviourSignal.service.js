const prisma = require("../config/prisma");

const BehaviourSignalEngine = require("../engines/behaviourSignal.engine");

const goalExtractionService = require("./goalExtraction.service");
const domainService = require("./domain.service");

const NotFoundError = require("../errors/NotFoundError");

class BehaviourSignalService {

    async generateBehaviourSignals(sessionId) {

        await this.findSession(sessionId);

        const profile =
            await this.buildBehaviourProfile(
                sessionId
            );

        const result =
            BehaviourSignalEngine.generateSignals(
                profile
            );

        return {

            sessionId,

            generatedAt:
                new Date(),

            ...result

        };

    }

    async getBehaviourSummary(sessionId) {

        const { signals } =
            await this.generateBehaviourSignals(
                sessionId
            );

        return signals;

    }

    async getInvestmentFrequency(sessionId) {

        const { signals } =
            await this.generateBehaviourSignals(
                sessionId
            );

        return signals.investmentFrequency;

    }

    async getSavingDiscipline(sessionId) {

        const { signals } =
            await this.generateBehaviourSignals(
                sessionId
            );

        return signals.savingDiscipline;

    }

    async getRiskAppetite(sessionId) {

        const { signals } =
            await this.generateBehaviourSignals(
                sessionId
            );

        return signals.riskAppetiteScore;

    }

    async buildBehaviourProfile(sessionId) {

        const goals =
            await goalExtractionService.extractGoals(
                sessionId
            );

        const domains =
            await domainService.getAssessmentProfile(
                sessionId
            );

        const financialDomain =
            domains.domains?.financialLiteracy ||
            {};

        const planningDomain =
            domains.domains?.financialPlanning ||
            {};

        return {

            goalCount:
                goals.totalGoals || 0,

            domainCompletion:
                domains.completion || 0,

            investmentKnowledge:
                financialDomain.score || 50,

            financialLiteracy:
                financialDomain.score || 50,

            savingsScore:
                planningDomain.score || 60,

            financialScore:
                planningDomain.score || 60,

            riskTolerance:
                planningDomain.score || 50,

            emergencyFundMonths: 3

        };

    }

    async findSession(sessionId) {

        const session =
            await prisma.riskAssessmentSession.findUnique({

                where: {

                    id: sessionId

                }

            });

        if (!session) {

            throw new NotFoundError(
                "Assessment session not found."
            );

        }

        return session;

    }

}

module.exports =
    new BehaviourSignalService();