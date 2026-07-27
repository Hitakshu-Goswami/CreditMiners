const {
    RISK_CATEGORY,
    INSTRUMENT_CATEGORY,
    VOLATILITY
} = require("../constants/investmentAdvisor.constants");

class AllocationEngine {
    /**
     * Generate a deterministic investment allocation.
     *
     * @param {Object} recommendationInput
     * @returns {Object}
     */
    generate(recommendationInput = {}) {
        const {
            riskCategory = RISK_CATEGORY.MODERATE,
            investorPersona = null,
            financialGoals = [],
            investmentHorizon = null,
            monthlyBudget = 0
        } = recommendationInput;

        const allocationTemplate =
            this.getAllocationTemplate(riskCategory);

        const allocation = allocationTemplate.map((item) => ({
            instrument: item.instrument,
            percentage: item.percentage,
            amount: Math.round(
                (monthlyBudget * item.percentage) / 100
            ),
            riskLevel: item.riskLevel,
            expectedReturnRange: item.expectedReturnRange,
            priority: item.priority
        }));

        return {
            riskCategory,
            investorPersona,
            financialGoals,
            investmentHorizon,
            monthlyBudget,
            expectedVolatility: this.getVolatility(riskCategory),
            allocation
        };
    }

    /**
     * Allocation templates based on AI Risk Profile.
     */
    getAllocationTemplate(riskCategory) {
        switch (riskCategory) {

            case RISK_CATEGORY.CONSERVATIVE:
                return [
                    {
                        instrument: INSTRUMENT_CATEGORY.EMERGENCY_FUND,
                        percentage: 35,
                        riskLevel: "Very Low",
                        expectedReturnRange: "3–5%",
                        priority: 1
                    },
                    {
                        instrument: INSTRUMENT_CATEGORY.DEBT_FUNDS,
                        percentage: 35,
                        riskLevel: "Low",
                        expectedReturnRange: "6–8%",
                        priority: 2
                    },
                    {
                        instrument: INSTRUMENT_CATEGORY.GOLD,
                        percentage: 20,
                        riskLevel: "Low",
                        expectedReturnRange: "5–8%",
                        priority: 3
                    },
                    {
                        instrument: INSTRUMENT_CATEGORY.EQUITY_MUTUAL_FUNDS,
                        percentage: 10,
                        riskLevel: "Medium",
                        expectedReturnRange: "10–14%",
                        priority: 4
                    }
                ];

            case RISK_CATEGORY.AGGRESSIVE:
                return [
                    {
                        instrument: INSTRUMENT_CATEGORY.EMERGENCY_FUND,
                        percentage: 10,
                        riskLevel: "Very Low",
                        expectedReturnRange: "3–5%",
                        priority: 1
                    },
                    {
                        instrument: INSTRUMENT_CATEGORY.DEBT_FUNDS,
                        percentage: 10,
                        riskLevel: "Low",
                        expectedReturnRange: "6–8%",
                        priority: 2
                    },
                    {
                        instrument: INSTRUMENT_CATEGORY.GOLD,
                        percentage: 10,
                        riskLevel: "Low",
                        expectedReturnRange: "5–8%",
                        priority: 3
                    },
                    {
                        instrument: INSTRUMENT_CATEGORY.EQUITY_MUTUAL_FUNDS,
                        percentage: 70,
                        riskLevel: "High",
                        expectedReturnRange: "12–18%",
                        priority: 4
                    }
                ];

            case RISK_CATEGORY.MODERATE:
            default:
                return [
                    {
                        instrument: INSTRUMENT_CATEGORY.EMERGENCY_FUND,
                        percentage: 20,
                        riskLevel: "Very Low",
                        expectedReturnRange: "3–5%",
                        priority: 1
                    },
                    {
                        instrument: INSTRUMENT_CATEGORY.DEBT_FUNDS,
                        percentage: 25,
                        riskLevel: "Low",
                        expectedReturnRange: "6–8%",
                        priority: 2
                    },
                    {
                        instrument: INSTRUMENT_CATEGORY.GOLD,
                        percentage: 15,
                        riskLevel: "Low",
                        expectedReturnRange: "5–8%",
                        priority: 3
                    },
                    {
                        instrument: INSTRUMENT_CATEGORY.EQUITY_MUTUAL_FUNDS,
                        percentage: 40,
                        riskLevel: "Medium",
                        expectedReturnRange: "10–15%",
                        priority: 4
                    }
                ];
        }
    }

    /**
     * Expected portfolio volatility.
     */
    getVolatility(riskCategory) {
        switch (riskCategory) {
            case RISK_CATEGORY.CONSERVATIVE:
                return VOLATILITY.LOW;

            case RISK_CATEGORY.AGGRESSIVE:
                return VOLATILITY.HIGH;

            case RISK_CATEGORY.MODERATE:
            default:
                return VOLATILITY.MEDIUM;
        }
    }
}

module.exports = new AllocationEngine();