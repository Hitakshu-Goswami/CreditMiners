const {
    RISK_CATEGORY,
    VOLATILITY
} = require("../constants/investmentAdvisor.constants");

class VolatilityEngine {

    /**
     * Estimates expected portfolio volatility.
     *
     * @param {String} riskCategory
     * @returns {Object}
     */
    generate(riskCategory) {

        switch (riskCategory) {

            case RISK_CATEGORY.CONSERVATIVE:

                return {
                    expectedVolatility: VOLATILITY.LOW,
                    description:
                        "This portfolio is designed to minimise short-term market fluctuations while prioritising capital preservation and financial stability."
                };

            case RISK_CATEGORY.AGGRESSIVE:

                return {
                    expectedVolatility: VOLATILITY.HIGH,
                    description:
                        "Short-term market fluctuations may be significant. The portfolio prioritises long-term capital appreciation and is intended for investors with a higher tolerance for investment risk."
                };

            case RISK_CATEGORY.MODERATE:
            default:

                return {
                    expectedVolatility: VOLATILITY.MEDIUM,
                    description:
                        "Moderate short-term market fluctuations are expected. The portfolio balances growth opportunities with diversification to reduce overall investment risk."
                };

        }

    }

}

module.exports = new VolatilityEngine();