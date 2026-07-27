const {
    INSTRUMENT_CATEGORY
} = require("../constants/investmentAdvisor.constants");

class RiskExplanationEngine {

    /**
     * Generates explanations for each allocation category.
     *
     * @param {Array} allocation
     * @returns {Array}
     */
    generate(allocation = []) {

        return allocation.map(asset => ({

            ...asset,

            explanation: this.getExplanation(
                asset.instrument
            )

        }));

    }

    getExplanation(instrument) {

        switch (instrument) {

            case INSTRUMENT_CATEGORY.EQUITY_MUTUAL_FUNDS:

                return [
                    "Supports long-term wealth creation.",
                    "Suitable for investors with higher growth expectations.",
                    "Recommended for longer investment horizons.",
                    "Accepts moderate to high market fluctuations for potentially higher long-term returns."
                ];

            case INSTRUMENT_CATEGORY.DEBT_FUNDS:

                return [
                    "Helps reduce overall portfolio volatility.",
                    "Provides relatively stable returns.",
                    "Supports capital preservation during uncertain market conditions."
                ];

            case INSTRUMENT_CATEGORY.GOLD:

                return [
                    "Acts as an inflation hedge.",
                    "Improves portfolio diversification.",
                    "Can reduce the impact of equity market volatility."
                ];

            case INSTRUMENT_CATEGORY.EMERGENCY_FUND:

                return [
                    "Maintains liquidity for unexpected expenses.",
                    "Reduces the need to sell long-term investments during emergencies.",
                    "Improves overall financial resilience."
                ];

            default:

                return [];

        }

    }

}

module.exports = new RiskExplanationEngine();