const FINANCIAL_RECOMMENDATION =
    require("../constants/financialRecommendation.constants");

class FinancialRecommendationEngine {

    /**
     * ============================================================
     * Generate Recommendations
     * ============================================================
     */

    generateRecommendations(context) {

        const recommendations = [];

        recommendations.push(
            ...this.evaluateSavings(context)
        );

        recommendations.push(
            ...this.evaluateDebt(context)
        );

        recommendations.push(
            ...this.evaluateEmergencyFund(context)
        );

        recommendations.push(
            ...this.evaluateCashFlow(context)
        );

        recommendations.push(
            ...this.evaluateCreditScore(context)
        );

        recommendations.push(
            ...this.evaluateBehaviour(context)
        );

        recommendations.push(
            ...this.evaluateGoals(context)
        );

        recommendations.push(
            ...this.evaluateInvestmentReadiness(context)
        );

        return recommendations.sort(
            (a, b) =>
                this.priorityWeight(b.priority) -
                this.priorityWeight(a.priority)
        );

    }

    /**
     * ============================================================
     * Savings Recommendations
     * ============================================================
     */

    evaluateSavings(context) {

        const recommendations = [];

        const savingsRatio =

            context.financialFeatures.savingsRatio;

        if (

            savingsRatio <
            FINANCIAL_RECOMMENDATION
                .THRESHOLDS
                .SAVINGS_RATIO

        ) {

            recommendations.push({

                category:
                    FINANCIAL_RECOMMENDATION
                        .CATEGORY
                        .SAVINGS,

                priority:
                    FINANCIAL_RECOMMENDATION
                        .PRIORITY
                        .HIGH,

                impact:
                    FINANCIAL_RECOMMENDATION
                        .IMPACT
                        .HIGH,

                timeframe:
                    FINANCIAL_RECOMMENDATION
                        .TIMEFRAME
                        .THREE_MONTHS,

                title:
                    "Increase Monthly Savings",

                description:
                    "Increase monthly savings to at least 20% of your income.",

                actionItems: [

                    "Create monthly savings target",

                    "Automate savings",

                    "Reduce discretionary spending"

                ]

            });

        }

        return recommendations;

    }

    /**
     * ============================================================
     * Debt Recommendations
     * ============================================================
     */

    evaluateDebt(context) {

        const recommendations = [];

        const debtRatio =

            context.financialFeatures.debtToIncomeRatio;

        if (

            debtRatio >

            FINANCIAL_RECOMMENDATION
                .THRESHOLDS
                .DEBT_TO_INCOME

        ) {

            recommendations.push({

                category:
                    FINANCIAL_RECOMMENDATION
                        .CATEGORY
                        .DEBT,

                priority:
                    FINANCIAL_RECOMMENDATION
                        .PRIORITY
                        .CRITICAL,

                impact:
                    FINANCIAL_RECOMMENDATION
                        .IMPACT
                        .VERY_HIGH,

                timeframe:
                    FINANCIAL_RECOMMENDATION
                        .TIMEFRAME
                        .IMMEDIATE,

                title:
                    "Reduce Debt Burden",

                description:
                    "Your debt-to-income ratio is above the recommended limit.",

                actionItems: [

                    "Prioritize high-interest debt",

                    "Avoid new loans",

                    "Increase EMI payments"

                ]

            });

        }

        return recommendations;

    }

    /**
     * ============================================================
     * Emergency Fund
     * ============================================================
     */

    evaluateEmergencyFund(context) {

        const recommendations = [];

        const months =

            context.financialFeatures
                .emergencyFundMonths;

        if (

            months <
            FINANCIAL_RECOMMENDATION
                .THRESHOLDS
                .EMERGENCY_MONTHS

        ) {

            recommendations.push({

                category:
                    FINANCIAL_RECOMMENDATION
                        .CATEGORY
                        .EMERGENCY_FUND,

                priority:
                    FINANCIAL_RECOMMENDATION
                        .PRIORITY
                        .HIGH,

                impact:
                    FINANCIAL_RECOMMENDATION
                        .IMPACT
                        .HIGH,

                timeframe:
                    FINANCIAL_RECOMMENDATION
                        .TIMEFRAME
                        .SIX_MONTHS,

                title:
                    "Build Emergency Fund",

                description:
                    "Maintain at least six months of living expenses.",

                actionItems: [

                    "Create emergency account",

                    "Save fixed amount monthly",

                    "Avoid using emergency savings"

                ]

            });

        }

        return recommendations;

    }

        /**
     * ============================================================
     * Cash Flow Recommendations
     * ============================================================
     */

    evaluateCashFlow(context) {

        const recommendations = [];

        const expenseRatio =
            context.financialFeatures.expenseRatio;

        if (

            expenseRatio >

            FINANCIAL_RECOMMENDATION
                .THRESHOLDS
                .EXPENSE_RATIO

        ) {

            recommendations.push({

                category:
                    FINANCIAL_RECOMMENDATION
                        .CATEGORY
                        .CASH_FLOW,

                priority:
                    FINANCIAL_RECOMMENDATION
                        .PRIORITY
                        .HIGH,

                impact:
                    FINANCIAL_RECOMMENDATION
                        .IMPACT
                        .HIGH,

                timeframe:
                    FINANCIAL_RECOMMENDATION
                        .TIMEFRAME
                        .ONE_MONTH,

                title:
                    "Improve Monthly Cash Flow",

                description:
                    "Your monthly expenses consume a large percentage of your income.",

                actionItems: [

                    "Review recurring expenses",

                    "Reduce unnecessary subscriptions",

                    "Follow a monthly budget"

                ]

            });

        }

        return recommendations;

    }

    /**
     * ============================================================
     * Credit Score Recommendations
     * ============================================================
     */

    evaluateCreditScore(context) {

        const recommendations = [];

        const score =
            context.assessmentHistory
                ?.estimatedCreditScore ??
            context.financialSnapshot
                ?.estimatedCreditScore ??
            650;

        if (

            score <

            FINANCIAL_RECOMMENDATION
                .THRESHOLDS
                .CREDIT_SCORE_GOOD

        ) {

            recommendations.push({

                category:
                    FINANCIAL_RECOMMENDATION
                        .CATEGORY
                        .CREDIT_SCORE,

                priority:
                    FINANCIAL_RECOMMENDATION
                        .PRIORITY
                        .HIGH,

                impact:
                    FINANCIAL_RECOMMENDATION
                        .IMPACT
                        .VERY_HIGH,

                timeframe:
                    FINANCIAL_RECOMMENDATION
                        .TIMEFRAME
                        .SIX_MONTHS,

                title:
                    "Improve Credit Score",

                description:
                    "Maintain timely repayments and reduce credit utilization to improve your credit score.",

                actionItems: [

                    "Pay EMIs before due dates",

                    "Avoid loan defaults",

                    "Maintain low credit utilization",

                    "Review your credit report regularly"

                ]

            });

        }

        return recommendations;

    }

    /**
     * ============================================================
     * Behaviour Recommendations
     * ============================================================
     */

    evaluateBehaviour(context) {

        const recommendations = [];

        const behaviour =
            context.behaviourSignals;

        if (

            behaviour?.latePayments

        ) {

            recommendations.push({

                category:
                    FINANCIAL_RECOMMENDATION
                        .CATEGORY
                        .FINANCIAL_DISCIPLINE,

                priority:
                    FINANCIAL_RECOMMENDATION
                        .PRIORITY
                        .CRITICAL,

                impact:
                    FINANCIAL_RECOMMENDATION
                        .IMPACT
                        .VERY_HIGH,

                timeframe:
                    FINANCIAL_RECOMMENDATION
                        .TIMEFRAME
                        .IMMEDIATE,

                title:
                    "Improve Payment Discipline",

                description:
                    "Late repayments negatively affect your financial profile and creditworthiness.",

                actionItems: [

                    "Enable automatic bill payments",

                    "Set repayment reminders",

                    "Avoid missing EMI deadlines"

                ]

            });

        }

        if (

            behaviour?.highRiskBorrowing

        ) {

            recommendations.push({

                category:
                    FINANCIAL_RECOMMENDATION
                        .CATEGORY
                        .DEBT,

                priority:
                    FINANCIAL_RECOMMENDATION
                        .PRIORITY
                        .HIGH,

                impact:
                    FINANCIAL_RECOMMENDATION
                        .IMPACT
                        .HIGH,

                timeframe:
                    FINANCIAL_RECOMMENDATION
                        .TIMEFRAME
                        .THREE_MONTHS,

                title:
                    "Reduce High-Risk Borrowing",

                description:
                    "Frequent borrowing may indicate financial stress.",

                actionItems: [

                    "Avoid unnecessary borrowing",

                    "Build savings before taking loans",

                    "Maintain healthier debt levels"

                ]

            });

        }

        return recommendations;

    }
        /**
     * ============================================================
     * Financial Goal Recommendations
     * ============================================================
     */

    evaluateGoals(context) {

        const recommendations = [];

        const goals = context.goals?.goals || [];

        if (!goals.length) {

            recommendations.push({

                category:
                    FINANCIAL_RECOMMENDATION
                        .CATEGORY
                        .FINANCIAL_DISCIPLINE,

                priority:
                    FINANCIAL_RECOMMENDATION
                        .PRIORITY
                        .MEDIUM,

                impact:
                    FINANCIAL_RECOMMENDATION
                        .IMPACT
                        .MEDIUM,

                timeframe:
                    FINANCIAL_RECOMMENDATION
                        .TIMEFRAME
                        .ONE_MONTH,

                title:
                    "Define Financial Goals",

                description:
                    "Setting clear financial goals improves planning and investment decisions.",

                actionItems: [

                    "Create short-term goals",

                    "Create long-term goals",

                    "Review goals every quarter"

                ]

            });

        }

        return recommendations;

    }

    /**
     * ============================================================
     * Investment Readiness
     * ============================================================
     */

    evaluateInvestmentReadiness(context) {

        const recommendations = [];

        const persona =
            context.investorPersona?.persona;

        if (

            persona === "Conservative"

        ) {

            recommendations.push({

                category:
                    FINANCIAL_RECOMMENDATION
                        .CATEGORY
                        .INVESTMENT,

                priority:
                    FINANCIAL_RECOMMENDATION
                        .PRIORITY
                        .LOW,

                impact:
                    FINANCIAL_RECOMMENDATION
                        .IMPACT
                        .MEDIUM,

                timeframe:
                    FINANCIAL_RECOMMENDATION
                        .TIMEFRAME
                        .LONG_TERM,

                title:
                    "Begin Low-Risk Investments",

                description:
                    "Consider stable investment options while maintaining liquidity.",

                actionItems: [

                    "Build emergency fund first",

                    "Consider debt mutual funds",

                    "Review investment allocation annually"

                ]

            });

        }

        if (

            persona === "Balanced"

        ) {

            recommendations.push({

                category:
                    FINANCIAL_RECOMMENDATION
                        .CATEGORY
                        .INVESTMENT,

                priority:
                    FINANCIAL_RECOMMENDATION
                        .PRIORITY
                        .LOW,

                impact:
                    FINANCIAL_RECOMMENDATION
                        .IMPACT
                        .MEDIUM,

                timeframe:
                    FINANCIAL_RECOMMENDATION
                        .TIMEFRAME
                        .LONG_TERM,

                title:
                    "Maintain Diversified Portfolio",

                description:
                    "Maintain a balanced allocation between equity and debt investments.",

                actionItems: [

                    "Review portfolio quarterly",

                    "Diversify investments",

                    "Rebalance annually"

                ]

            });

        }

        if (

            persona === "Growth" ||

            persona === "Aggressive"

        ) {

            recommendations.push({

                category:
                    FINANCIAL_RECOMMENDATION
                        .CATEGORY
                        .INVESTMENT,

                priority:
                    FINANCIAL_RECOMMENDATION
                        .PRIORITY
                        .LOW,

                impact:
                    FINANCIAL_RECOMMENDATION
                        .IMPACT
                        .LOW,

                timeframe:
                    FINANCIAL_RECOMMENDATION
                        .TIMEFRAME
                        .LONG_TERM,

                title:
                    "Optimize Investment Portfolio",

                description:
                    "Continue investing while maintaining diversification and risk management.",

                actionItems: [

                    "Review asset allocation",

                    "Maintain diversification",

                    "Avoid emotional investing",

                    "Review risk annually"

                ]

            });

        }

        return recommendations;

    }

    /**
     * ============================================================
     * Priority Weight
     * ============================================================
     */

    priorityWeight(priority) {

        switch (priority) {

            case FINANCIAL_RECOMMENDATION
                .PRIORITY
                .CRITICAL:

                return 4;

            case FINANCIAL_RECOMMENDATION
                .PRIORITY
                .HIGH:

                return 3;

            case FINANCIAL_RECOMMENDATION
                .PRIORITY
                .MEDIUM:

                return 2;

            case FINANCIAL_RECOMMENDATION
                .PRIORITY
                .LOW:

                return 1;

            default:

                return 0;

        }

    }

}

module.exports =
    new FinancialRecommendationEngine();