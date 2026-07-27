/**
 * ============================================================
 * Financial Recommendation Constants
 * ============================================================
 */

const FINANCIAL_RECOMMENDATION = {

    VERSION: "1.0.0",

    PRIORITY: {

        CRITICAL: "CRITICAL",

        HIGH: "HIGH",

        MEDIUM: "MEDIUM",

        LOW: "LOW"

    },

    CATEGORY: {

        SAVINGS: "SAVINGS",

        BUDGETING: "BUDGETING",

        DEBT: "DEBT",

        CREDIT_SCORE: "CREDIT_SCORE",

        EMERGENCY_FUND: "EMERGENCY_FUND",

        CASH_FLOW: "CASH_FLOW",

        INVESTMENT: "INVESTMENT",

        INSURANCE: "INSURANCE",

        TAX: "TAX",

        FINANCIAL_DISCIPLINE: "FINANCIAL_DISCIPLINE"

    },

    STATUS: {

        PENDING: "PENDING",

        IN_PROGRESS: "IN_PROGRESS",

        COMPLETED: "COMPLETED",

        SKIPPED: "SKIPPED"

    },

    IMPACT: {

        VERY_HIGH: "VERY_HIGH",

        HIGH: "HIGH",

        MEDIUM: "MEDIUM",

        LOW: "LOW"

    },

    TIMEFRAME: {

        IMMEDIATE: "IMMEDIATE",

        ONE_MONTH: "1_MONTH",

        THREE_MONTHS: "3_MONTHS",

        SIX_MONTHS: "6_MONTHS",

        ONE_YEAR: "1_YEAR",

        LONG_TERM: "LONG_TERM"

    },

    THRESHOLDS: {

        SAVINGS_RATIO: 0.20,

        EXPENSE_RATIO: 0.70,

        DEBT_TO_INCOME: 0.40,

        EMERGENCY_MONTHS: 6,

        CREDIT_SCORE_GOOD: 700,

        CREDIT_SCORE_EXCELLENT: 750

    },

    SCORE: {

        EXCELLENT: 85,

        GOOD: 70,

        AVERAGE: 55,

        POOR: 40

    }

};

module.exports = FINANCIAL_RECOMMENDATION;