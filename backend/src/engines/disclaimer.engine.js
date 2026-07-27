const {
    INVESTMENT_ADVISOR
} = require("../constants/investmentAdvisor.constants");

class DisclaimerEngine {

    /**
     * Returns the mandatory investment disclaimer.
     *
     * @returns {Object}
     */
    generate() {

        return {
            disclaimer:
                INVESTMENT_ADVISOR.DISCLAIMER
        };

    }

}

module.exports = new DisclaimerEngine();