const {
    INVESTMENT_FREQUENCY,
    SIGNAL_STATUS
} = require("../constants/behaviourSignal.constants");

class BehaviourSignalEngine {

    generateSignals(profile = {}) {

        const planningDiscipline =
            this.calculatePlanningDiscipline(profile);

        const savingDiscipline =
            this.calculateSavingDiscipline(profile);

        const investmentKnowledgeScore =
            this.calculateInvestmentKnowledge(profile);

        const riskAppetiteScore =
            this.calculateRiskAppetite(profile);

        const goalCommitment =
            this.calculateGoalCommitment(profile);

        const financialDiscipline =
            this.calculateFinancialDiscipline(profile);

        const liquidityPreference =
            this.calculateLiquidityPreference(profile);

        const investmentFrequency =
            this.calculateInvestmentFrequency(
                savingDiscipline,
                financialDiscipline
            );

        return {

            status:
                SIGNAL_STATUS.GENERATED,

            signals: {

                planningDiscipline,

                savingDiscipline,

                investmentKnowledgeScore,

                riskAppetiteScore,

                goalCommitment,

                financialDiscipline,

                liquidityPreference,

                investmentFrequency

            }

        };

    }

    calculatePlanningDiscipline(profile) {

        const completion =
            profile.domainCompletion ?? 50;

        const goals =
            profile.goalCount ?? 0;

        return Math.min(
            100,
            Math.round(
                completion * 0.7 +
                Math.min(goals, 5) * 6
            )
        );

    }

    calculateSavingDiscipline(profile) {

        const score =
            profile.savingsScore ??
            profile.savingScore ??
            profile.financialScore ??
            60;

        return Math.max(
            0,
            Math.min(100, Math.round(score))
        );

    }

    calculateInvestmentKnowledge(profile) {

        const score =
            profile.investmentKnowledge ??
            profile.investmentKnowledgeScore ??
            profile.financialLiteracy ??
            50;

        return Math.max(
            0,
            Math.min(100, Math.round(score))
        );

    }

    calculateRiskAppetite(profile) {

        const score =
            profile.riskTolerance ??
            profile.riskScore ??
            50;

        return Math.max(
            0,
            Math.min(100, Math.round(score))
        );

    }

    calculateGoalCommitment(profile) {

        const goals =
            profile.goalCount ?? 0;

        return Math.min(
            100,
            goals * 20
        );

    }

    calculateFinancialDiscipline(profile) {

        const planning =
            this.calculatePlanningDiscipline(profile);

        const saving =
            this.calculateSavingDiscipline(profile);

        return Math.round(
            (planning + saving) / 2
        );

    }

    calculateLiquidityPreference(profile) {

        const emergencyMonths =
            profile.emergencyFundMonths ?? 3;

        if (emergencyMonths >= 6) {
            return "LOW";
        }

        if (emergencyMonths >= 3) {
            return "MEDIUM";
        }

        return "HIGH";

    }

    calculateInvestmentFrequency(
        savingDiscipline,
        financialDiscipline
    ) {

        const average =
            (savingDiscipline +
                financialDiscipline) / 2;

        if (average >= 80) {
            return INVESTMENT_FREQUENCY.MONTHLY;
        }

        if (average >= 55) {
            return INVESTMENT_FREQUENCY.QUARTERLY;
        }

        return INVESTMENT_FREQUENCY.WEEKLY;

    }

}

module.exports =
    new BehaviourSignalEngine();