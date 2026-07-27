/**
 * ============================================================
 * Credit Assessment Constants
 * ============================================================
 * Central configuration used by the Credit Assessment Engine.
 * Modify thresholds here instead of changing engine logic.
 * ============================================================
 */

const CREDIT_ASSESSMENT = {

    VERSION: "1.0.0",

    /**
     * ========================================================
     * Estimated Credit Score
     * ========================================================
     */

    CREDIT_SCORE: {

        MIN: 300,

        MAX: 900,

        EXCELLENT: 800,

        VERY_GOOD: 750,

        GOOD: 700,

        FAIR: 650,

        POOR: 600,

        VERY_POOR: 550

    },

    /**
     * ========================================================
     * Financial Health Score
     * ========================================================
     */

    FINANCIAL_HEALTH: {

        MAX: 100,

        EXCELLENT: 90,

        GOOD: 75,

        AVERAGE: 60,

        BELOW_AVERAGE: 45,

        POOR: 30

    },

    /**
     * ========================================================
     * AI Confidence Score
     * ========================================================
     */

    CONFIDENCE: {

        MAX: 100,

        VERY_HIGH: 95,

        HIGH: 85,

        MEDIUM: 70,

        LOW: 50,

        VERY_LOW: 30

    },

    /**
     * ========================================================
     * Financial Ratios
     * ========================================================
     */

    RATIOS: {

        SAVINGS: {

            EXCELLENT: 0.35,

            GOOD: 0.25,

            AVERAGE: 0.15,

            POOR: 0.10

        },

        EXPENSE: {

            EXCELLENT: 0.50,

            GOOD: 0.65,

            AVERAGE: 0.80,

            POOR: 0.90

        },

        DEBT_TO_INCOME: {

            EXCELLENT: 0.20,

            GOOD: 0.35,

            AVERAGE: 0.45,

            POOR: 0.60

        },

        EMERGENCY_FUND: {

            EXCELLENT: 12,

            GOOD: 6,

            AVERAGE: 3,

            POOR: 1

        }

    },

    /**
     * ========================================================
     * Behaviour Weights
     * ========================================================
     */

    WEIGHTS: {

        FINANCIAL_PROFILE: 0.40,

        BEHAVIOUR: 0.20,

        RISK_PROFILE: 0.15,

        INVESTOR_PERSONA: 0.10,

        GOALS: 0.10,

        RECOMMENDATION_PROFILE: 0.05

    },

    /**
     * ========================================================
     * Credit Categories
     * ========================================================
     */

    CREDIT_CATEGORY: {

        EXCELLENT: "Excellent",

        VERY_GOOD: "Very Good",

        GOOD: "Good",

        FAIR: "Fair",

        POOR: "Poor",

        VERY_POOR: "Very Poor"

    },

    /**
     * ========================================================
     * Financial Health Categories
     * ========================================================
     */

    HEALTH_CATEGORY: {

        EXCELLENT: "Excellent",

        GOOD: "Good",

        AVERAGE: "Average",

        BELOW_AVERAGE: "Below Average",

        POOR: "Poor"

    },

    /**
     * ========================================================
     * Explainability
     * ========================================================
     */

    EXPLAINABILITY: {

        MAX_SCORE: 100,

        DEFAULT_SCORE: 90

    },

    /**
     * ========================================================
     * Model Parameters
     * ========================================================
     */

    MODEL: {

        NAME: "CreditMiners Credit Assessment Engine",

        TYPE: "Rule-Based AI",

        VERSION: "1.0.0"

    }

};

module.exports = {

    CREDIT_ASSESSMENT

};