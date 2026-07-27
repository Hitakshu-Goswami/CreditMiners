const {
    INSTRUMENT_CATEGORY
} = require("../constants/investmentAdvisor.constants");

class InstrumentMappingEngine {

    /**
     * Maps allocation categories to generic
     * investment instrument categories.
     *
     * No real products are recommended.
     *
     * @param {Array} allocation
     * @returns {Array}
     */
    map(allocation = []) {

        return allocation.map(asset => ({

            ...asset,

            instrumentCategories:
                this.getCategories(asset.instrument)

        }));

    }

    /**
     * Returns educational investment categories.
     *
     * @param {String} instrument
     * @returns {Array}
     */
    getCategories(instrument) {

        switch (instrument) {

            case INSTRUMENT_CATEGORY.EQUITY_MUTUAL_FUNDS:

                return [
                    "Index Funds",
                    "Large Cap Mutual Funds",
                    "Exchange Traded Funds (ETFs)"
                ];

            case INSTRUMENT_CATEGORY.DEBT_FUNDS:

                return [
                    "Debt Mutual Funds",
                    "Recurring Deposits",
                    "Short Duration Funds"
                ];

            case INSTRUMENT_CATEGORY.GOLD:

                return [
                    "Gold ETFs",
                    "Sovereign Gold Bonds",
                    "Digital Gold"
                ];

            case INSTRUMENT_CATEGORY.EMERGENCY_FUND:

                return [
                    "Savings Account",
                    "Liquid Mutual Funds"
                ];

            default:

                return [];

        }

    }

}

module.exports = new InstrumentMappingEngine();