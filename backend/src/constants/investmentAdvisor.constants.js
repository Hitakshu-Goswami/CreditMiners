/**
 * ============================================================
 * Investment Advisor Constants
 * ============================================================
 */

const INVESTMENT_ADVISOR = {

    VERSION: "1.0.0",

    INVESTOR_PERSONA: {

        CONSERVATIVE: "Conservative",

        BALANCED: "Balanced",

        GROWTH: "Growth",

        AGGRESSIVE: "Aggressive"

    },

    RISK_LEVEL: {

        VERY_LOW: "VERY_LOW",

        LOW: "LOW",

        MODERATE: "MODERATE",

        HIGH: "HIGH",

        VERY_HIGH: "VERY_HIGH"

    },

    INVESTMENT_HORIZON: {

        SHORT_TERM: "SHORT_TERM",

        MEDIUM_TERM: "MEDIUM_TERM",

        LONG_TERM: "LONG_TERM"

    },

    ASSET_CLASS: {

        SAVINGS_ACCOUNT: "SAVINGS_ACCOUNT",

        FIXED_DEPOSIT: "FIXED_DEPOSIT",

        RECURRING_DEPOSIT: "RECURRING_DEPOSIT",

        LIQUID_FUND: "LIQUID_FUND",

        DEBT_MUTUAL_FUND: "DEBT_MUTUAL_FUND",

        HYBRID_MUTUAL_FUND: "HYBRID_MUTUAL_FUND",

        INDEX_FUND: "INDEX_FUND",

        EQUITY_MUTUAL_FUND: "EQUITY_MUTUAL_FUND",

        ELSS: "ELSS",

        ETF: "ETF",

        LARGE_CAP: "LARGE_CAP",

        MID_CAP: "MID_CAP",

        SMALL_CAP: "SMALL_CAP",

        GOLD: "GOLD",

        SGB: "SOVEREIGN_GOLD_BOND",

        REIT: "REIT",

        PPF: "PPF",

        NPS: "NPS"

    },

    GOAL: {

        EMERGENCY_FUND: "Emergency Fund",

        HOME_PURCHASE: "Home Purchase",

        VEHICLE_PURCHASE: "Vehicle Purchase",

        EDUCATION: "Education",

        RETIREMENT: "Retirement",

        WEALTH_CREATION: "Wealth Creation",

        TAX_SAVING: "Tax Saving"

    },

    RECOMMENDATION_PRIORITY: {

        CRITICAL: "CRITICAL",

        HIGH: "HIGH",

        MEDIUM: "MEDIUM",

        LOW: "LOW"

    },

    PORTFOLIO: {

        MAX_ASSET_CLASSES: 8,

        MIN_ASSET_CLASSES: 3

    },

    ALLOCATION: {

        CONSERVATIVE: {

            EQUITY: 20,

            DEBT: 60,

            GOLD: 10,

            CASH: 10

        },

        BALANCED: {

            EQUITY: 50,

            DEBT: 30,

            GOLD: 10,

            CASH: 10

        },

        GROWTH: {

            EQUITY: 70,

            DEBT: 15,

            GOLD: 5,

            CASH: 10

        },

        AGGRESSIVE: {

            EQUITY: 85,

            DEBT: 5,

            GOLD: 5,

            CASH: 5

        }

    },

    REVIEW_PERIOD: {

        MONTHLY: "MONTHLY",

        QUARTERLY: "QUARTERLY",

        HALF_YEARLY: "HALF_YEARLY",

        YEARLY: "YEARLY"

    }

};

module.exports = INVESTMENT_ADVISOR;