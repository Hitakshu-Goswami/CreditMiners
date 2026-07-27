const {
    PROJECTION_SCENARIO,
    EXPECTED_ANNUAL_RETURN,
    INFLATION_RATE,
    SALARY_GROWTH_RATE,
    EXPENSE_GROWTH_RATE,
    SAVINGS_GROWTH_RATE,
    EMERGENCY_FUND,
    CONFIDENCE_SCORE,
    DEFAULT_PORTFOLIO
} = require("../constants/growthProjection.constants");

class ScenarioEngine {

    /**
     * -------------------------------------------------------
     * Generate Projection Scenarios
     * -------------------------------------------------------
     */

   generateScenarios(data) {

    this.validateInput(data);

    const profile =
        this.extractFinancialProfile(data);

    const conservative =
        this.buildConservativeScenario(
            data,
            profile
        );

  const moderate =
    this.buildModerateScenario(
        data,
        profile
    );

const aggressive =
    this.buildAggressiveScenario(
        data,
        profile
    );

    return {

        conservative,

        moderate,

        aggressive

    };

}

    /**
     * -------------------------------------------------------
     * Validate
     * -------------------------------------------------------
     */

    validateInput(data) {

        if (!data)
            throw new Error("Projection data is required.");

        if (!data.financialSnapshot)
            throw new Error("Financial snapshot missing.");

        if (!data.behaviourSignals)
            throw new Error("Behaviour signals missing.");

        if (!data.riskProfile)
            throw new Error("Risk profile missing.");

        if (!data.investmentPlan)
            throw new Error("Investment recommendation missing.");

    }

    /**
     * -------------------------------------------------------
     * Extract Financial Profile
     * -------------------------------------------------------
     */

    extractFinancialProfile(data) {

        const snapshot = data.financialSnapshot;

        return {

            income:

                Number(snapshot.monthlyIncome || 0),

            expenses:

                Number(snapshot.monthlyExpenses || 0),

            savings:

                Number(snapshot.monthlySavings || 0),

            debt:

                Number(snapshot.totalDebt || 0),

            investments:

                Number(snapshot.totalInvestments || 0),

            assets:

                Number(snapshot.totalAssets || 0),

            liabilities:

                Number(snapshot.totalLiabilities || 0)

        };

    }

    /**
     * -------------------------------------------------------
     * Initialize Scenario
     * -------------------------------------------------------
     */

    initializeScenario(type, profile) {

        return {

            scenario: type,

            assumptions: {

                expectedReturn: 0,

                inflationRate: 0,

                salaryGrowth: 0,

                expenseGrowth: 0,

                savingsGrowth: 0,

                emergencyFundMonths:
                    EMERGENCY_FUND.MIN_MONTHS

            },

            financials: {

                currentIncome:
                    profile.income,

                currentExpenses:
                    profile.expenses,

                currentSavings:
                    profile.savings,

                investments:
                    profile.investments,

                assets:
                    profile.assets,

                liabilities:
                    profile.liabilities

            },

            portfolio: {

                equity:
                    DEFAULT_PORTFOLIO.EQUITY,

                debt:
                    DEFAULT_PORTFOLIO.DEBT,

                gold:
                    DEFAULT_PORTFOLIO.GOLD,

                emergencyFund:
                    DEFAULT_PORTFOLIO.EMERGENCY_FUND

            },

            confidence: 0,

            explanation: [],

            metadata: {

                generatedAt:
                    new Date(),

                version: 1

            }

        };

    }

    /**
     * -------------------------------------------------------
     * Normalize Percentage
     * -------------------------------------------------------
     */

    normalizePercentage(value) {

        if (value < 0)
            return 0;

        if (value > 100)
            return 100;

        return value;

    }

    /**
 * -------------------------------------------------------
 * Finalize Scenario
 * -------------------------------------------------------
 */

finalizeScenario(
    scenario,
    data,
    profile,
    behaviour,
    discipline
) {

    scenario.confidence =
        this.calibrateConfidence(
            scenario,
            profile,
            behaviour,
            discipline
        );

    scenario =
        this.validateScenario(
            scenario
        );

    scenario =
        this.normalizeScenario(
            scenario
        );

    scenario.explanation =
        this.enrichExplanation(
            scenario,
            profile,
            behaviour,
            discipline
        );

    scenario.metadata =
        this.attachMetadata(
            scenario
        );

    return Object.freeze(
        scenario
    );

}
/**
 * -------------------------------------------------------
 * Confidence Calibration
 * -------------------------------------------------------
 */

calibrateConfidence(
    scenario,
    profile,
    behaviour,
    discipline
) {

    let confidence = 0;

    confidence += behaviour * 0.30;

    confidence += discipline * 0.20;

    confidence +=
        scenario.financialHealth * 0.20;

    confidence +=
        scenario.wealthPreservation * 0.10;

    confidence +=
        this.getSavingsConsistency(profile) * 0.10;

    confidence +=
        this.getIncomeStability(profile) * 0.10;

    return this.round(

        this.clamp(
            confidence,
            0,
            100
        )

    );

}
/**
 * -------------------------------------------------------
 * Validate Scenario
 * -------------------------------------------------------
 */

validateScenario(
    scenario
) {

    scenario.assumptions.expectedReturn =
        this.clamp(
            scenario.assumptions.expectedReturn,
            0,
            0.30
        );

    scenario.assumptions.inflationRate =
        this.clamp(
            scenario.assumptions.inflationRate,
            0,
            0.15
        );

    scenario.assumptions.salaryGrowth =
        this.clamp(
            scenario.assumptions.salaryGrowth,
            0,
            0.30
        );

    scenario.assumptions.expenseGrowth =
        this.clamp(
            scenario.assumptions.expenseGrowth,
            0,
            0.30
        );

    scenario.assumptions.savingsGrowth =
        this.clamp(
            scenario.assumptions.savingsGrowth,
            0,
            0.40
        );

    return scenario;

}
/**
 * -------------------------------------------------------
 * Normalize Scenario
 * -------------------------------------------------------
 */

normalizeScenario(
    scenario
) {

    Object.keys(
        scenario.assumptions
    ).forEach(key => {

        if (
            typeof scenario.assumptions[key] === "number"
        ) {

            scenario.assumptions[key] =
                this.round(
                    scenario.assumptions[key],
                    4
                );

        }

    });

    return scenario;

}
/**
 * -------------------------------------------------------
 * Enrich Explanation
 * -------------------------------------------------------
 */

enrichExplanation(
    scenario,
    profile,
    behaviour,
    discipline
) {

    const explanation = [
        ...scenario.explanation
    ];

    if (
        scenario.financialHealth >= 80
    ) {

        explanation.push(
            "Overall financial health is excellent, supporting stronger long-term wealth creation."
        );

    }

    if (
        scenario.wealthPreservation >= 70
    ) {

        explanation.push(
            "Existing investments provide a solid foundation for future growth."
        );

    }

    if (
        behaviour >= 80 &&
        discipline >= 80
    ) {

        explanation.push(
            "Strong financial discipline and consistent behaviour increase projection confidence."
        );

    }

    if (
        profile.liabilities >
        profile.assets
    ) {

        explanation.push(
            "High liabilities may reduce long-term wealth accumulation unless debt is reduced."
        );

    }

    return explanation;

}


    /**
     * -------------------------------------------------------
     * Clamp
     * -------------------------------------------------------
     */

    clamp(value, min, max) {

        return Math.max(
            min,
            Math.min(max, value)
        );

    }

    /**
     * -------------------------------------------------------
     * Round
     * -------------------------------------------------------
     */

    round(value, digits = 2) {

        return Number(
            Number(value)
                .toFixed(digits)
        );

    }
        /**
     * -------------------------------------------------------
     * Behaviour Score
     * -------------------------------------------------------
     */

    getBehaviourScore(behaviourSignals = {}) {

        return this.clamp(

            Number(
                behaviourSignals.behaviourScore ??
                behaviourSignals.score ??
                70
            ),

            0,

            100
        );

    }

    /**
     * -------------------------------------------------------
     * Financial Discipline Score
     * -------------------------------------------------------
     */

    getFinancialDisciplineScore(behaviourSignals = {}) {

        let score = 50;

        if (behaviourSignals.paysBillsOnTime)
            score += 10;

        if (behaviourSignals.hasEmergencyFund)
            score += 10;

        if (behaviourSignals.regularSavings)
            score += 10;

        if (behaviourSignals.lowCreditUtilization)
            score += 10;

        if (behaviourSignals.diversifiedInvestments)
            score += 10;

        return this.clamp(score, 0, 100);

    }

    /**
     * -------------------------------------------------------
     * Savings Consistency
     * -------------------------------------------------------
     */

    getSavingsConsistency(profile) {

        if (!profile.income)
            return 0;

        const ratio =
            (profile.savings / profile.income) * 100;

        return this.clamp(ratio, 0, 100);

    }

    /**
     * -------------------------------------------------------
     * Spending Ratio
     * -------------------------------------------------------
     */

    getExpenseRatio(profile) {

        if (!profile.income)
            return 100;

        return this.clamp(

            (profile.expenses / profile.income) * 100,

            0,

            100
        );

    }

    /**
     * -------------------------------------------------------
     * Debt Ratio
     * -------------------------------------------------------
     */

    getDebtRatio(profile) {

        if (!profile.assets)
            return 100;

        return this.clamp(

            (profile.liabilities / profile.assets) * 100,

            0,

            100
        );

    }

    /**
     * -------------------------------------------------------
     * Income Stability
     * -------------------------------------------------------
     */

    getIncomeStability(profile, behaviourSignals = {}) {

        let score = 60;

        if (behaviourSignals.stableEmployment)
            score += 15;

        if (behaviourSignals.salaryCreditedRegularly)
            score += 15;

        if (profile.income > profile.expenses)
            score += 10;

        return this.clamp(score, 0, 100);

    }

    /**
     * -------------------------------------------------------
     * Credit Score
     * -------------------------------------------------------
     */

    getCreditScore(data = {}) {

        const score =
            data.creditAssessment?.creditScore ??
            data.creditAssessment?.score ??
            650;

        return this.clamp(Number(score), 300, 900);

    }

    /**
     * -------------------------------------------------------
     * Normalize Credit Score
     * -------------------------------------------------------
     */

    normalizeCreditScore(score) {

        return this.round(

            ((score - 300) / 600) * 100

        );

    }

    /**
     * -------------------------------------------------------
     * Risk Level
     * -------------------------------------------------------
     */

    getRiskLevel(riskProfile = {}) {

        return (

            riskProfile.level ||

            riskProfile.riskLevel ||

            "MEDIUM"

        ).toUpperCase();

    }

    /**
     * -------------------------------------------------------
     * Risk Multiplier
     * -------------------------------------------------------
     */

    getRiskMultiplier(level) {

        switch (level) {

            case "LOW":
                return 0.85;

            case "HIGH":
                return 1.20;

            default:
                return 1.0;

        }

    }

    /**
     * -------------------------------------------------------
     * Investor Persona
     * -------------------------------------------------------
     */

    getInvestorPersona(data = {}) {

        return (

            data.investorPersona?.persona ||

            data.investorPersona?.type ||

            "BALANCED"

        ).toUpperCase();

    }

    /**
     * -------------------------------------------------------
     * Portfolio Health
     * -------------------------------------------------------
     */

    getPortfolioHealth(profile) {

        if (!profile.assets)
            return 0;

        const investmentRatio =

            (profile.investments / profile.assets) * 100;

        return this.clamp(

            investmentRatio,

            0,

            100

        );

    }

    /**
     * -------------------------------------------------------
     * Initial Confidence Score
     * -------------------------------------------------------
     */

    calculateInitialConfidence(data, profile) {

        const behaviour =
            this.getBehaviourScore(
                data.behaviourSignals
            );

        const discipline =
            this.getFinancialDisciplineScore(
                data.behaviourSignals
            );

        const credit =
            this.normalizeCreditScore(

                this.getCreditScore(data)

            );

        const stability =
            this.getIncomeStability(

                profile,

                data.behaviourSignals
            );

        return this.round(

            (

                behaviour +

                discipline +

                credit +

                stability

            ) / 4

        );

    }
    /**
 * -------------------------------------------------------
 * Conservative Scenario
 * -------------------------------------------------------
 */

buildConservativeScenario(data, profile) {

    const scenario =
        this.initializeScenario(
            PROJECTION_SCENARIO.CONSERVATIVE,
            profile
        );

    const behaviour =
        this.getBehaviourScore(
            data.behaviourSignals
        );

    const discipline =
        this.getFinancialDisciplineScore(
            data.behaviourSignals
        );

    const confidence =
        this.calculateInitialConfidence(
            data,
            profile
        );

    const riskLevel =
        this.getRiskLevel(
            data.riskProfile
        );

    const investorPersona =
        this.getInvestorPersona(data);

    scenario.assumptions.expectedReturn =
        this.calculateConservativeReturn(
            behaviour,
            discipline
        );

    scenario.assumptions.inflationRate =
        INFLATION_RATE.DEFAULT;

    scenario.assumptions.salaryGrowth =
        this.calculateSalaryGrowth(
            behaviour,
            "CONSERVATIVE"
        );

    scenario.assumptions.expenseGrowth =
        this.calculateExpenseGrowth(
            behaviour,
            profile
        );

    scenario.assumptions.savingsGrowth =
        this.calculateSavingsGrowth(
            behaviour,
            discipline
        );

    // -------------------------
    // NEW (Part 3A)
    // -------------------------

    scenario.portfolio =
        this.generatePortfolioAllocation(
            riskLevel,
            investorPersona
        );

    scenario.emergencyFund =
        this.calculateEmergencyFundTarget(
            profile
        );

    scenario.riskMultiplier =
        this.calculateRiskMultiplier(
            profile,
            behaviour,
            riskLevel
        );

    scenario.investmentMultiplier =
        this.calculateInvestmentMultiplier(
            behaviour,
            discipline,
            riskLevel
        );

    scenario.financialHealth =
        this.calculateFinancialHealthScore(
            profile,
            behaviour,
            discipline
        );

    scenario.wealthPreservation =
        this.calculateWealthPreservationScore(
            profile
        );

    // -------------------------

    scenario.explanation =
    this.generateConservativeExplanation(
        profile,
        behaviour,
        discipline
    );

return this.finalizeScenario(
    scenario,
    data,
    profile,
    behaviour,
    discipline
);

}
calculateConservativeReturn(
    behaviour,
    discipline
) {

    let expected =
        EXPECTED_ANNUAL_RETURN.CONSERVATIVE;

    expected +=
        ((behaviour - 50) / 1000);

    expected +=
        ((discipline - 50) / 1500);

    return this.round(expected, 4);

}
calculateSalaryGrowth(
    behaviour,
    scenario
) {

    let growth =
        SALARY_GROWTH_RATE[scenario];

    if (behaviour >= 80)
        growth += 0.02;

    else if (behaviour >= 65)
        growth += 0.01;

    return this.round(growth, 4);

}
calculateExpenseGrowth(
    behaviour,
    profile
) {

    let growth =
        EXPENSE_GROWTH_RATE.CONSERVATIVE;

    if (
        profile.expenses >
        profile.income * 0.80
    ) {

        growth += 0.02;

    }

    if (behaviour >= 75) {

        growth -= 0.01;

    }

    return this.round(growth, 4);

}
calculateSavingsGrowth(
    behaviour,
    discipline
) {

    let growth =
        SAVINGS_GROWTH_RATE.CONSERVATIVE;

    if (behaviour > 70)
        growth += 0.03;

    if (discipline > 80)
        growth += 0.02;

    return this.round(growth, 4);

}

generateConservativeExplanation(
    profile,
    behaviour,
    discipline
) {

    const explanation = [];

    explanation.push(
        "Conservative scenario focuses on stable long-term wealth preservation."
    );

    if (behaviour >= 75) {

        explanation.push(
            "Strong financial behaviour increases confidence in future growth."
        );

    }

    if (discipline >= 80) {

        explanation.push(
            "Consistent financial discipline supports sustainable investing."
        );

    }

    if (
        profile.expenses >
        profile.income * 0.75
    ) {

        explanation.push(
            "High expense ratio may reduce long-term wealth accumulation."
        );

    }

    if (
        profile.savings >
        profile.income * 0.20
    ) {

        explanation.push(
            "Healthy savings rate strengthens financial resilience."
        );

    }

    return explanation;

}
/**
 * -------------------------------------------------------
 * Moderate Scenario
 * -------------------------------------------------------
 */

buildModerateScenario(data, profile) {

    const scenario =
        this.initializeScenario(
            PROJECTION_SCENARIO.MODERATE,
            profile
        );

    const behaviour =
        this.getBehaviourScore(
            data.behaviourSignals
        );

    const discipline =
        this.getFinancialDisciplineScore(
            data.behaviourSignals
        );

    const confidence =
        this.calculateInitialConfidence(
            data,
            profile
        );

    const riskLevel =
        this.getRiskLevel(
            data.riskProfile
        );

    const investorPersona =
        this.getInvestorPersona(data);

    scenario.assumptions.expectedReturn =
        this.calculateModerateReturn(
            behaviour,
            discipline,
            riskLevel
        );

    scenario.assumptions.inflationRate =
        INFLATION_RATE.DEFAULT;

    scenario.assumptions.salaryGrowth =
        this.calculateSalaryGrowth(
            behaviour,
            "MODERATE"
        );

    scenario.assumptions.expenseGrowth =
        this.calculateModerateExpenseGrowth(
            behaviour,
            profile
        );

    scenario.assumptions.savingsGrowth =
        this.calculateModerateSavingsGrowth(
            behaviour,
            discipline
        );

    // Portfolio Intelligence

    scenario.portfolio =
        this.generatePortfolioAllocation(
            riskLevel,
            investorPersona
        );

    scenario.emergencyFund =
        this.calculateEmergencyFundTarget(
            profile
        );

    scenario.riskMultiplier =
        this.calculateRiskMultiplier(
            profile,
            behaviour,
            riskLevel
        );

    scenario.investmentMultiplier =
        this.calculateInvestmentMultiplier(
            behaviour,
            discipline,
            riskLevel
        );

    scenario.financialHealth =
        this.calculateFinancialHealthScore(
            profile,
            behaviour,
            discipline
        );

    scenario.wealthPreservation =
        this.calculateWealthPreservationScore(
            profile
        );

  scenario.explanation =
    this.generateConservativeExplanation(
        profile,
        behaviour,
        discipline
    );

return this.finalizeScenario(
    scenario,
    data,
    profile,
    behaviour,
    discipline
);

}
calculateModerateReturn(
    behaviour,
    discipline,
    riskLevel
) {

    let expected =
        EXPECTED_ANNUAL_RETURN.MODERATE;

    expected +=
        ((behaviour - 50) / 850);

    expected +=
        ((discipline - 50) / 1200);

    if (riskLevel === "HIGH")
        expected += 0.01;

    if (riskLevel === "LOW")
        expected -= 0.005;

    return this.round(expected, 4);

}
calculateModerateExpenseGrowth(
    behaviour,
    profile
) {

    let growth =
        EXPENSE_GROWTH_RATE.MODERATE;

    if (
        profile.expenses >
        profile.income * 0.75
    )
        growth += 0.015;

    if (behaviour >= 80)
        growth -= 0.01;

    return this.round(growth, 4);

}
calculateModerateSavingsGrowth(
    behaviour,
    discipline
) {

    let growth =
        SAVINGS_GROWTH_RATE.MODERATE;

    if (behaviour >= 75)
        growth += 0.04;

    if (discipline >= 85)
        growth += 0.03;

    return this.round(growth, 4);

}
generateModerateExplanation(
    profile,
    behaviour,
    discipline,
    riskLevel
) {

    const explanation = [];

    explanation.push(
        "Moderate strategy balances capital appreciation with controlled risk."
    );

    if (riskLevel === "HIGH")
        explanation.push(
            "Higher risk tolerance supports stronger long-term return assumptions."
        );

    if (behaviour >= 75)
        explanation.push(
            "Positive financial behaviour improves projection reliability."
        );

    if (discipline >= 80)
        explanation.push(
            "Disciplined savings behaviour supports wealth accumulation."
        );

    if (
        profile.expenses >
        profile.income * 0.80
    )
        explanation.push(
            "High expenses may reduce investment capacity."
        );

    return explanation;

}
/**
 * -------------------------------------------------------
 * Aggressive Scenario
 * -------------------------------------------------------
 */

buildAggressiveScenario(data, profile) {

    const scenario =
        this.initializeScenario(
            PROJECTION_SCENARIO.AGGRESSIVE,
            profile
        );

    const behaviour =
        this.getBehaviourScore(
            data.behaviourSignals
        );

    const discipline =
        this.getFinancialDisciplineScore(
            data.behaviourSignals
        );

    const confidence =
        this.calculateInitialConfidence(
            data,
            profile
        );

    const riskLevel =
        this.getRiskLevel(
            data.riskProfile
        );

    const persona =
        this.getInvestorPersona(data);

    scenario.assumptions.expectedReturn =
        this.calculateAggressiveReturn(
            behaviour,
            discipline,
            riskLevel,
            persona
        );

    scenario.assumptions.inflationRate =
        INFLATION_RATE.DEFAULT;

    scenario.assumptions.salaryGrowth =
        this.calculateSalaryGrowth(
            behaviour,
            "AGGRESSIVE"
        );

    scenario.assumptions.expenseGrowth =
        EXPENSE_GROWTH_RATE.AGGRESSIVE;

    scenario.assumptions.savingsGrowth =
        SAVINGS_GROWTH_RATE.AGGRESSIVE;

    // Portfolio Intelligence

    scenario.portfolio =
        this.generatePortfolioAllocation(
            riskLevel,
            persona
        );

    scenario.emergencyFund =
        this.calculateEmergencyFundTarget(
            profile
        );

    scenario.riskMultiplier =
        this.calculateRiskMultiplier(
            profile,
            behaviour,
            riskLevel
        );

    scenario.investmentMultiplier =
        this.calculateInvestmentMultiplier(
            behaviour,
            discipline,
            riskLevel
        );

    scenario.financialHealth =
        this.calculateFinancialHealthScore(
            profile,
            behaviour,
            discipline
        );

    scenario.wealthPreservation =
        this.calculateWealthPreservationScore(
            profile
        );

    scenario.explanation =
    this.generateConservativeExplanation(
        profile,
        behaviour,
        discipline
    );

return this.finalizeScenario(
    scenario,
    data,
    profile,
    behaviour,
    discipline
);

}
calculateAggressiveReturn(
    behaviour,
    discipline,
    riskLevel,
    persona
) {

    let expected =
        EXPECTED_ANNUAL_RETURN.AGGRESSIVE;

    expected +=
        ((behaviour - 50) / 700);

    expected +=
        ((discipline - 50) / 900);

    if (riskLevel === "HIGH")
        expected += 0.02;

    if (
        persona === "GROWTH" ||
        persona === "AGGRESSIVE"
    )
        expected += 0.015;

    return this.round(expected, 4);

}
generateAggressiveExplanation(
    behaviour,
    riskLevel,
    persona
) {

    const explanation = [];

    explanation.push(
        "Aggressive strategy prioritizes long-term capital growth."
    );

    if (riskLevel === "HIGH")
        explanation.push(
            "High risk appetite enables higher expected portfolio returns."
        );

    if (
        persona === "GROWTH" ||
        persona === "AGGRESSIVE"
    )
        explanation.push(
            "Investor persona supports equity-oriented investment decisions."
        );

    if (behaviour >= 80)
        explanation.push(
            "Excellent financial behaviour increases confidence in this projection."
        );

    return explanation;

}
/**
 * -------------------------------------------------------
 * Dynamic Portfolio Allocation
 * -------------------------------------------------------
 */

generatePortfolioAllocation(
    riskLevel,
    investorPersona
) {

    const portfolio = {
        equity: 50,
        debt: 30,
        gold: 10,
        emergencyFund: 10
    };

    switch (riskLevel) {

        case "LOW":

            portfolio.equity = 35;
            portfolio.debt = 45;
            portfolio.gold = 10;
            portfolio.emergencyFund = 10;
            break;

        case "HIGH":

            portfolio.equity = 70;
            portfolio.debt = 15;
            portfolio.gold = 10;
            portfolio.emergencyFund = 5;
            break;

        default:

            portfolio.equity = 55;
            portfolio.debt = 25;
            portfolio.gold = 10;
            portfolio.emergencyFund = 10;
    }

    if (
        investorPersona === "GROWTH" ||
        investorPersona === "AGGRESSIVE"
    ) {

        portfolio.equity += 5;
        portfolio.debt -= 5;

    }

    if (
        investorPersona === "INCOME"
    ) {

        portfolio.debt += 10;
        portfolio.equity -= 10;

    }

    portfolio.equity =
        this.clamp(portfolio.equity, 20, 85);

    portfolio.debt =
        this.clamp(portfolio.debt, 5, 70);

    return portfolio;

}

/**
 * -------------------------------------------------------
 * Emergency Fund Recommendation
 * -------------------------------------------------------
 */

calculateEmergencyFundTarget(profile) {

    const monthlyExpense =
        profile.expenses || 0;

    const reserveMonths =
        monthlyExpense >
        (profile.income * 0.70)

            ? EMERGENCY_FUND.IDEAL_MONTHS
            : EMERGENCY_FUND.MIN_MONTHS;

    return {

        reserveMonths,

        targetAmount:
            this.round(
                monthlyExpense *
                reserveMonths
            )

    };

}

/**
 * -------------------------------------------------------
 * Investment Multiplier
 * -------------------------------------------------------
 */

calculateInvestmentMultiplier(
    behaviour,
    discipline,
    riskLevel
) {

    let multiplier = 1;

    multiplier +=
        ((behaviour - 50) / 500);

    multiplier +=
        ((discipline - 50) / 600);

    if (riskLevel === "HIGH")
        multiplier += 0.15;

    if (riskLevel === "LOW")
        multiplier -= 0.10;

    return this.round(
        this.clamp(
            multiplier,
            0.70,
            1.50
        ),
        3
    );

}

/**
 * -------------------------------------------------------
 * Risk Multiplier
 * -------------------------------------------------------
 */

calculateRiskMultiplier(
    profile,
    behaviour,
    riskLevel
) {

    let multiplier =
        this.getRiskMultiplier(riskLevel);

    if (
        profile.liabilities >
        profile.assets
    ) {

        multiplier *= 0.85;

    }

    if (behaviour >= 80)
        multiplier *= 1.10;

    return this.round(
        multiplier,
        3
    );

}

/**
 * -------------------------------------------------------
 * Wealth Preservation Score
 * -------------------------------------------------------
 */

calculateWealthPreservationScore(
    profile
) {

    if (!profile.assets)
        return 0;

    const score =

        (

            profile.investments +

            profile.savings

        ) /

        profile.assets *

        100;

    return this.clamp(

        this.round(score),

        0,

        100

    );

}

/**
 * -------------------------------------------------------
 * Financial Health Score
 * -------------------------------------------------------
 */

calculateFinancialHealthScore(
    profile,
    behaviour,
    discipline
) {

    const savings =
        this.getSavingsConsistency(
            profile
        );

    const debt =
        100 -
        this.getDebtRatio(
            profile
        );

    return this.round(

        (

            behaviour +

            discipline +

            savings +

            debt

        ) / 4

    );

}
    

}

module.exports = new ScenarioEngine();