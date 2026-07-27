const INVESTMENT_ADVISOR =
    require("../constants/investmentAdvisor.constants");

class InvestmentAdvisorEngine {

    /**
     * ============================================================
     * Generate Investment Plan
     * ============================================================
     */

    generateInvestmentPlan(context) {

        const investmentReadiness =
            this.calculateInvestmentReadiness(context);

        const assetAllocation =
            this.generateAssetAllocation(context);

        const recommendations =
            this.generateRecommendations(
                context,
                assetAllocation
            );

        const portfolio =
            this.generatePortfolio(
                context,
                assetAllocation
            );

        const reviewSchedule =
            this.generateReviewSchedule(context);

        const explanation =
            this.generateExplanation(
                context,
                investmentReadiness,
                assetAllocation
            );

        return {

            investmentReadiness,

            assetAllocation,

            recommendations,

            portfolio,

            reviewSchedule,

            explanation

        };

    }

    /**
     * ============================================================
     * Investment Readiness Score
     * ============================================================
     */

    calculateInvestmentReadiness(context) {

        let score = 0;

        const financialHealth =
            context.assessmentHistory
                ?.financialHealthScore ?? 0;

        if (financialHealth >= 80) {

            score += 30;

        } else if (financialHealth >= 60) {

            score += 20;

        } else {

            score += 10;

        }

        if (

            context.financialFeatures
                .savingsRatio >= 0.20

        ) {

            score += 20;

        }

        if (

            context.financialFeatures
                .debtToIncomeRatio <= 0.40

        ) {

            score += 20;

        }

        if (

            context.financialFeatures
                .emergencyFundMonths >= 6

        ) {

            score += 15;

        }

        if (

            context.behaviourSignals
                ?.investmentDiscipline

        ) {

            score += 15;

        }

        return {

            score,

            eligible:
                score >= 70

        };

    }

    /**
     * ============================================================
     * Asset Allocation
     * ============================================================
     */

    generateAssetAllocation(context) {

        const persona =
            context.investorPersona.persona;

        switch (persona) {

            case INVESTMENT_ADVISOR
                .INVESTOR_PERSONA
                .CONSERVATIVE:

                return INVESTMENT_ADVISOR
                    .ALLOCATION
                    .CONSERVATIVE;

            case INVESTMENT_ADVISOR
                .INVESTOR_PERSONA
                .BALANCED:

                return INVESTMENT_ADVISOR
                    .ALLOCATION
                    .BALANCED;

            case INVESTMENT_ADVISOR
                .INVESTOR_PERSONA
                .GROWTH:

                return INVESTMENT_ADVISOR
                    .ALLOCATION
                    .GROWTH;

            case INVESTMENT_ADVISOR
                .INVESTOR_PERSONA
                .AGGRESSIVE:

                return INVESTMENT_ADVISOR
                    .ALLOCATION
                    .AGGRESSIVE;

            default:

                return INVESTMENT_ADVISOR
                    .ALLOCATION
                    .BALANCED;

        }

    }

    /**
     * ============================================================
     * Generate Recommendations
     * ============================================================
     */

    generateRecommendations(

        context,

        allocation

    ) {

        const recommendations = [];

        if (allocation.EQUITY > 60) {

            recommendations.push({

                priority: "HIGH",

                title:
                    "Increase Equity Exposure",

                description:
                    "You have the financial capacity to allocate a larger portion of your portfolio to equity investments for long-term growth."

            });

        }

        if (allocation.DEBT >= 30) {

            recommendations.push({

                priority: "MEDIUM",

                title:
                    "Maintain Debt Allocation",

                description:
                    "Debt instruments help stabilize the portfolio during market volatility."

            });

        }

        if (allocation.GOLD >= 5) {

            recommendations.push({

                priority: "LOW",

                title:
                    "Maintain Gold Allocation",

                description:
                    "Gold provides diversification and acts as a hedge during uncertain market conditions."

            });

        }

        return recommendations;

    }
        /**
     * ============================================================
     * Generate Portfolio
     * ============================================================
     */

    generatePortfolio(

        context,

        allocation

    ) {

        const portfolio = [];

        if (allocation.EQUITY > 0) {

            portfolio.push({

                assetClass:
                    INVESTMENT_ADVISOR
                        .ASSET_CLASS
                        .INDEX_FUND,

                allocation:
                    allocation.EQUITY,

                rationale:
                    "Core long-term wealth creation."

            });

        }

        if (allocation.DEBT > 0) {

            portfolio.push({

                assetClass:
                    INVESTMENT_ADVISOR
                        .ASSET_CLASS
                        .DEBT_MUTUAL_FUND,

                allocation:
                    allocation.DEBT,

                rationale:
                    "Provides portfolio stability and predictable returns."

            });

        }

        if (allocation.GOLD > 0) {

            portfolio.push({

                assetClass:
                    INVESTMENT_ADVISOR
                        .ASSET_CLASS
                        .SGB,

                allocation:
                    allocation.GOLD,

                rationale:
                    "Diversification and inflation hedge."

            });

        }

        if (allocation.CASH > 0) {

            portfolio.push({

                assetClass:
                    INVESTMENT_ADVISOR
                        .ASSET_CLASS
                        .LIQUID_FUND,

                allocation:
                    allocation.CASH,

                rationale:
                    "Liquidity for emergencies and short-term needs."

            });

        }

        return portfolio;

    }

    /**
     * ============================================================
     * Review Schedule
     * ============================================================
     */

    generateReviewSchedule(context) {

        const persona =
            context.investorPersona.persona;

        switch (persona) {

            case INVESTMENT_ADVISOR
                .INVESTOR_PERSONA
                .CONSERVERVATIVE:

                return {

                    frequency:
                        INVESTMENT_ADVISOR
                            .REVIEW_PERIOD
                            .YEARLY,

                    reason:
                        "Stable portfolio with minimal changes."

                };

            case INVESTMENT_ADVISOR
                .INVESTOR_PERSONA
                .BALANCED:

                return {

                    frequency:
                        INVESTMENT_ADVISOR
                            .REVIEW_PERIOD
                            .HALF_YEARLY,

                    reason:
                        "Balanced allocation requires periodic rebalancing."

                };

            case INVESTMENT_ADVISOR
                .INVESTOR_PERSONA
                .GROWTH:

                return {

                    frequency:
                        INVESTMENT_ADVISOR
                            .REVIEW_PERIOD
                            .QUARTERLY,

                    reason:
                        "Growth-oriented portfolio requires regular monitoring."

                };

            case INVESTMENT_ADVISOR
                .INVESTOR_PERSONA
                .AGGRESSIVE:

                return {

                    frequency:
                        INVESTMENT_ADVISOR
                            .REVIEW_PERIOD
                            .QUARTERLY,

                    reason:
                        "Aggressive investments require frequent review."

                };

            default:

                return {

                    frequency:
                        INVESTMENT_ADVISOR
                            .REVIEW_PERIOD
                            .HALF_YEARLY,

                    reason:
                        "Default review schedule."

                };

        }

    }

    /**
     * ============================================================
     * Explainable Recommendation
     * ============================================================
     */

    generateExplanation(

        context,

        readiness,

        allocation

    ) {

        return {

            investorPersona:
                context.investorPersona.persona,

            investmentReadiness:
                readiness.score,

            financialHealth:
                context.assessmentHistory
                    ?.financialHealthScore,

            creditScore:
                context.assessmentHistory
                    ?.estimatedCreditScore,

            allocation,

            explanation:

                `Portfolio generated based on your ${context.investorPersona.persona} investor profile, financial health, behavioural signals, financial goals, savings ratio, debt-to-income ratio and emergency fund adequacy.`

        };

    }
        /**
     * ============================================================
     * Goal-Based Investment Planning
     * ============================================================
     */

    generateGoalBasedPlan(context) {

        const plans = [];

        const goals =
            context.goals?.goals || [];

        goals.forEach(goal => {

            switch (goal.type) {

                case "RETIREMENT":

                    plans.push({

                        goal: goal.type,

                        horizon:
                            INVESTMENT_ADVISOR
                                .INVESTMENT_HORIZON
                                .LONG_TERM,

                        recommendedAssets: [

                            INVESTMENT_ADVISOR
                                .ASSET_CLASS
                                .INDEX_FUND,

                            INVESTMENT_ADVISOR
                                .ASSET_CLASS
                                .NPS,

                            INVESTMENT_ADVISOR
                                .ASSET_CLASS
                                .PPF

                        ],

                        review:
                            INVESTMENT_ADVISOR
                                .REVIEW_PERIOD
                                .YEARLY

                    });

                    break;

                case "HOME_PURCHASE":

                    plans.push({

                        goal: goal.type,

                        horizon:
                            INVESTMENT_ADVISOR
                                .INVESTMENT_HORIZON
                                .MEDIUM_TERM,

                        recommendedAssets: [

                            INVESTMENT_ADVISOR
                                .ASSET_CLASS
                                .HYBRID_MUTUAL_FUND,

                            INVESTMENT_ADVISOR
                                .ASSET_CLASS
                                .DEBT_MUTUAL_FUND

                        ],

                        review:
                            INVESTMENT_ADVISOR
                                .REVIEW_PERIOD
                                .HALF_YEARLY

                    });

                    break;

                case "EDUCATION":

                    plans.push({

                        goal: goal.type,

                        horizon:
                            INVESTMENT_ADVISOR
                                .INVESTMENT_HORIZON
                                .MEDIUM_TERM,

                        recommendedAssets: [

                            INVESTMENT_ADVISOR
                                .ASSET_CLASS
                                .INDEX_FUND,

                            INVESTMENT_ADVISOR
                                .ASSET_CLASS
                                .HYBRID_MUTUAL_FUND

                        ],

                        review:
                            INVESTMENT_ADVISOR
                                .REVIEW_PERIOD
                                .HALF_YEARLY

                    });

                    break;

                default:

                    plans.push({

                        goal: goal.type,

                        horizon:
                            INVESTMENT_ADVISOR
                                .INVESTMENT_HORIZON
                                .LONG_TERM,

                        recommendedAssets: [

                            INVESTMENT_ADVISOR
                                .ASSET_CLASS
                                .INDEX_FUND

                        ],

                        review:
                            INVESTMENT_ADVISOR
                                .REVIEW_PERIOD
                                .YEARLY

                    });

            }

        });

        return plans;

    }

    /**
     * ============================================================
     * Risk Analysis
     * ============================================================
     */

    generateRiskAnalysis(context) {

        const readiness =
            this.calculateInvestmentReadiness(
                context
            );

        return {

            investorPersona:
                context.investorPersona.persona,

            readinessScore:
                readiness.score,

            financialHealth:
                context.assessmentHistory
                    ?.financialHealthScore,

            creditScore:
                context.assessmentHistory
                    ?.estimatedCreditScore,

            debtToIncome:
                context.financialFeatures
                    .debtToIncomeRatio,

            savingsRatio:
                context.financialFeatures
                    .savingsRatio,

            emergencyFundMonths:
                context.financialFeatures
                    .emergencyFundMonths,

            overallRisk:

                readiness.score >= 80
                    ? INVESTMENT_ADVISOR
                        .RISK_LEVEL
                        .LOW

                    : readiness.score >= 60
                    ? INVESTMENT_ADVISOR
                        .RISK_LEVEL
                        .MODERATE

                    : INVESTMENT_ADVISOR
                        .RISK_LEVEL
                        .HIGH

        };

    }

    /**
     * ============================================================
     * Diversification Analysis
     * ============================================================
     */

    generateDiversificationAnalysis(

        allocation

    ) {

        return {

            diversificationScore:

                Object.keys(allocation).length * 25,

            equityExposure:
                allocation.EQUITY,

            debtExposure:
                allocation.DEBT,

            goldExposure:
                allocation.GOLD,

            cashExposure:
                allocation.CASH,

            diversified:

                Object.keys(allocation)
                    .length >=

                INVESTMENT_ADVISOR
                    .PORTFOLIO
                    .MIN_ASSET_CLASSES

        };

    }

    /**
     * ============================================================
     * Asset Suitability
     * ============================================================
     */

    calculateAssetSuitability(

        context,

        assetClass

    ) {

        const persona =
            context.investorPersona.persona;

        const score = {

            suitability: 0,

            rationale: ""

        };

        switch (assetClass) {

            case INVESTMENT_ADVISOR
                .ASSET_CLASS
                .INDEX_FUND:

                score.suitability =
                    persona ===
                    INVESTMENT_ADVISOR
                        .INVESTOR_PERSONA
                        .CONSERVATIVE

                        ? 60

                        : 95;

                score.rationale =
                    "Suitable for long-term wealth creation.";

                break;

            case INVESTMENT_ADVISOR
                .ASSET_CLASS
                .DEBT_MUTUAL_FUND:

                score.suitability =
                    persona ===
                    INVESTMENT_ADVISOR
                        .INVESTOR_PERSONA
                        .AGGRESSIVE

                        ? 60

                        : 95;

                score.rationale =
                    "Provides stable income and lower volatility.";

                break;

            case INVESTMENT_ADVISOR
                .ASSET_CLASS
                .SGB:

                score.suitability = 85;

                score.rationale =
                    "Good hedge against inflation.";

                break;

            default:

                score.suitability = 75;

                score.rationale =
                    "Suitable as part of a diversified portfolio.";

        }

        return score;

    }
        /**
     * ============================================================
     * Validate Investment Context
     * ============================================================
     */

    validateContext(context) {

        const requiredFields = [

            "financialFeatures",

            "behaviourSignals",

            "investorPersona",

            "assessmentHistory"

        ];

        requiredFields.forEach(field => {

            if (!context[field]) {

                throw new Error(

                    `Investment context missing: ${field}`

                );

            }

        });

        return true;

    }

    /**
     * ============================================================
     * Validate Portfolio Allocation
     * ============================================================
     */

    validateAllocation(allocation) {

        const total =

            Object.values(allocation)

                .reduce(

                    (sum, value) => sum + value,

                    0

                );

        if (total !== 100) {

            throw new Error(

                `Portfolio allocation must equal 100%. Received ${total}%`

            );

        }

        return true;

    }

    /**
     * ============================================================
     * Validate Portfolio
     * ============================================================
     */

    validatePortfolio(portfolio) {

        if (

            !portfolio ||

            portfolio.length === 0

        ) {

            throw new Error(

                "Portfolio generation failed."

            );

        }

        return true;

    }

    /**
     * ============================================================
     * Portfolio Summary
     * ============================================================
     */

    generatePortfolioSummary(portfolio) {

        return {

            totalAssets:

                portfolio.length,

            equityAssets:

                portfolio.filter(asset =>

                    asset.assetClass ===
                    INVESTMENT_ADVISOR
                        .ASSET_CLASS
                        .INDEX_FUND

                ).length,

            debtAssets:

                portfolio.filter(asset =>

                    asset.assetClass ===
                    INVESTMENT_ADVISOR
                        .ASSET_CLASS
                        .DEBT_MUTUAL_FUND

                ).length,

            goldAssets:

                portfolio.filter(asset =>

                    asset.assetClass ===
                    INVESTMENT_ADVISOR
                        .ASSET_CLASS
                        .SGB

                ).length,

            liquidityAssets:

                portfolio.filter(asset =>

                    asset.assetClass ===
                    INVESTMENT_ADVISOR
                        .ASSET_CLASS
                        .LIQUID_FUND

                ).length

        };

    }

    /**
     * ============================================================
     * Portfolio Risk Score
     * ============================================================
     */

    calculatePortfolioRiskScore(allocation) {

        let score = 0;

        score += allocation.EQUITY * 1.0;

        score += allocation.DEBT * 0.30;

        score += allocation.GOLD * 0.40;

        score += allocation.CASH * 0.10;

        return Math.round(score);

    }

    /**
     * ============================================================
     * Expected Return Estimate
     * ============================================================
     */

    estimateExpectedReturn(allocation) {

        const expectedReturn =

            allocation.EQUITY * 0.12 +

            allocation.DEBT * 0.07 +

            allocation.GOLD * 0.08 +

            allocation.CASH * 0.04;

        return Number(

            (expectedReturn / 100)

                .toFixed(2)

        );

    }

    /**
     * ============================================================
     * Engine Validation
     * ============================================================
     */

    validateInvestmentPlan(plan) {

        if (!plan) {

            throw new Error(

                "Investment plan generation failed."

            );

        }

        this.validateAllocation(

            plan.assetAllocation

        );

        this.validatePortfolio(

            plan.portfolio

        );

        return true;

    }

}

module.exports =
    new InvestmentAdvisorEngine();