/**
 * ============================================================
 * CreditMiners
 * Growth Projection Constants
 * Phase 8
 * ============================================================
 *
 * Shared configuration for every projection engine.
 * All business assumptions should live here.
 *
 * Engines importing this file:
 *
 * • Scenario Engine
 * • Forecast Engine
 * • Wealth Projection Engine
 * • Goal Projection Engine
 * • Chart Engine
 * • Insight Engine
 * • Growth Projection Engine
 *
 * ============================================================
 */

const PROJECTION_DURATION = Object.freeze({
    ONE_YEAR: 1,
    THREE_YEARS: 3,
    FIVE_YEARS: 5
});

const PROJECTION_SCENARIO = Object.freeze({
    CONSERVATIVE: "CONSERVATIVE",
    MODERATE: "MODERATE",
    AGGRESSIVE: "AGGRESSIVE"
});

const RISK_PROFILE = Object.freeze({
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH"
});

/**
 * Expected annual portfolio return assumptions.
 *
 * These are intentionally conservative and can later
 * be replaced by historical market data or ML outputs.
 */
const EXPECTED_ANNUAL_RETURN = Object.freeze({

    CONSERVATIVE: 0.08,

    MODERATE: 0.12,

    AGGRESSIVE: 0.16
});

/**
 * Annual inflation assumption.
 */

const INFLATION_RATE = Object.freeze({

    DEFAULT: 0.05
});

/**
 * Estimated yearly salary growth.
 */

const SALARY_GROWTH_RATE = Object.freeze({

    CONSERVATIVE: 0.05,

    MODERATE: 0.08,

    AGGRESSIVE: 0.12
});

/**
 * Expected annual expense increase.
 */

const EXPENSE_GROWTH_RATE = Object.freeze({

    CONSERVATIVE: 0.04,

    MODERATE: 0.06,

    AGGRESSIVE: 0.08
});

/**
 * Savings behaviour assumptions.
 */

const SAVINGS_GROWTH_RATE = Object.freeze({

    CONSERVATIVE: 0.05,

    MODERATE: 0.10,

    AGGRESSIVE: 0.15
});

/**
 * Emergency fund assumptions.
 */

const EMERGENCY_FUND = Object.freeze({

    MIN_MONTHS: 6,

    IDEAL_MONTHS: 12
});

/**
 * Projection confidence thresholds.
 */

const CONFIDENCE_SCORE = Object.freeze({

    HIGH: 90,

    MEDIUM: 75,

    LOW: 60
});

/**
 * Wealth milestone definitions.
 */

const WEALTH_MILESTONES = Object.freeze({

    FIRST_100K: 100000,

    FIRST_500K: 500000,

    FIRST_1M: 1000000,

    FIRST_5M: 5000000,

    FIRST_10M: 10000000
});

/**
 * Goal achievement probability.
 */

const GOAL_PROBABILITY = Object.freeze({

    HIGH: 85,

    MEDIUM: 65,

    LOW: 40
});

/**
 * Default portfolio allocation.
 */

const DEFAULT_PORTFOLIO = Object.freeze({

    EQUITY: 50,

    DEBT: 30,

    GOLD: 10,

    EMERGENCY_FUND: 10
});

/**
 * Chart labels.
 */

const CHART_LABELS = Object.freeze({

    ONE_YEAR: [

        "Current",

        "Year 1"
    ],

    THREE_YEAR: [

        "Current",

        "Year 1",

        "Year 2",

        "Year 3"
    ],

    FIVE_YEAR: [

        "Current",

        "Year 1",

        "Year 2",

        "Year 3",

        "Year 4",

        "Year 5"
    ]
});

/**
 * Projection validation.
 */

const VALIDATION = Object.freeze({

    MIN_INVESTMENT: 100,

    MAX_PROJECTION_YEARS: 5,

    MIN_PROJECTION_YEARS: 1
});

/**
 * Default projection configuration.
 */

const DEFAULT_CONFIGURATION = Object.freeze({

    INCLUDE_INFLATION: true,

    INCLUDE_REBALANCING: true,

    INCLUDE_GOAL_ANALYSIS: true,

    INCLUDE_CASHFLOW: true,

    INCLUDE_INSIGHTS: true,

    INCLUDE_CHARTS: true
});

/**
 * API metadata.
 */

const VERSION = "v1";

module.exports = {

    VERSION,

    PROJECTION_DURATION,

    PROJECTION_SCENARIO,

    RISK_PROFILE,

    EXPECTED_ANNUAL_RETURN,

    INFLATION_RATE,

    SALARY_GROWTH_RATE,

    EXPENSE_GROWTH_RATE,

    SAVINGS_GROWTH_RATE,

    EMERGENCY_FUND,

    CONFIDENCE_SCORE,

    WEALTH_MILESTONES,

    GOAL_PROBABILITY,

    DEFAULT_PORTFOLIO,

    CHART_LABELS,

    VALIDATION,

    DEFAULT_CONFIGURATION
};