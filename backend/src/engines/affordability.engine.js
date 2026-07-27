const {
    AFFORDABILITY
} = require("../constants/investmentAdvisor.constants");

class AffordabilityEngine {
    /**
     * Calculates the user's monthly investment affordability.
     *
     * @param {Object} financialProfile
     * @returns {Object}
     */
    calculate(financialProfile = {}) {
        const monthlyIncome = Number(financialProfile.monthlyIncome || 0);
        const monthlyExpenses = Number(financialProfile.monthlyExpenses || 0);
        const emergencyFund = Number(financialProfile.emergencyFund || 0);
        const currentSavings = Number(financialProfile.currentSavings || 0);

        const disposableIncome = Math.max(
            monthlyIncome - monthlyExpenses,
            0
        );

        const emergencyFundTarget =
            monthlyExpenses *
            AFFORDABILITY.EMERGENCY_FUND_MONTHS;

        const emergencyFundGap = Math.max(
            emergencyFundTarget - emergencyFund,
            0
        );

        const emergencyFundReady =
            emergencyFund >= emergencyFundTarget;

        const investmentRatio = emergencyFundReady
            ? AFFORDABILITY.INVESTMENT_RATIO.WITH_EMERGENCY_FUND
            : AFFORDABILITY.INVESTMENT_RATIO.WITHOUT_EMERGENCY_FUND;

        const recommendedInvestmentBudget = Math.round(
            disposableIncome * investmentRatio
        );

        return {
            monthlyIncome,

            monthlyExpenses,

            currentSavings,

            emergencyFund,

            disposableIncome,

            emergencyFundTarget,

            emergencyFundGap,

            emergencyFundReady,

            investmentRatio,

            recommendedInvestmentBudget
        };
    }
}

module.exports = new AffordabilityEngine();