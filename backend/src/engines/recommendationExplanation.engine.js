const {
    RISK_CATEGORY,
    VOLATILITY
} = require("../constants/investmentAdvisor.constants");

class RecommendationExplanationEngine {

    /**
     * Generates a deterministic explanation for the
     * investment recommendation.
     *
     * @param {Object} input
     * @returns {Object}
     */
    generate(input = {}) {

        const {
            riskCategory,
            investorPersona,
            financialGoals = [],
            affordability = {},
            expectedVolatility = VOLATILITY.MEDIUM
        } = input;

        const explanation = [];

        explanation.push(
            `Based on your ${this.formatRiskCategory(riskCategory).toLowerCase()} risk profile, ${this.formatPersona(investorPersona).toLowerCase()} investor persona, and your stated financial goals, this investment allocation is designed to balance affordability, diversification, and long-term financial growth.`
        );

        if (financialGoals.length) {
            explanation.push(
                `Your primary financial goals include ${financialGoals.join(", ").toLowerCase()}, which influenced the recommended allocation strategy.`
            );
        }

        if (affordability.emergencyFundReady) {
            explanation.push(
                "Your emergency fund appears sufficient, allowing a larger portion of your monthly investment budget to be allocated toward long-term wealth creation."
            );
        } else {
            explanation.push(
                "A portion of your monthly investment capacity is reserved for strengthening your emergency fund before increasing exposure to higher-risk investment categories."
            );
        }

        explanation.push(
            `The recommended portfolio is expected to have ${expectedVolatility.toLowerCase()} volatility based on your current financial profile and investment risk tolerance.`
        );

        explanation.push(
            "This recommendation uses diversified investment categories rather than specific financial products to remain educational, transparent, and aligned with responsible financial decision-making."
        );

        return {
            reasoning: explanation,
            plainLanguageExplanation: explanation.join(" ")
        };
    }

    formatRiskCategory(category) {

        switch (category) {

            case RISK_CATEGORY.CONSERVATIVE:
                return "Conservative";

            case RISK_CATEGORY.AGGRESSIVE:
                return "Aggressive";

            case RISK_CATEGORY.MODERATE:
            default:
                return "Moderate";
        }

    }

    formatPersona(persona) {

        if (!persona) {
            return "Balanced";
        }

        return persona
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, char => char.toUpperCase());

    }

}

module.exports = new RecommendationExplanationEngine();