const {
    CREDIT_ASSESSMENT
} = require("../constants/creditAssessment.constants");

class CreditAssessmentEngine {

    /**
     * ============================================================
     * Generate Complete Credit Assessment
     * ============================================================
     */

    generateAssessment(context) {

        const financialHealthScore =
            this.calculateFinancialHealthScore(context);

        const estimatedCreditScore =
            this.calculateCreditScore(
                financialHealthScore,
                context
            );

        const confidenceScore =
            this.calculateConfidence(context);

        const explainabilityScore =
            this.calculateExplainability(context);

        const riskLevel =
            this.determineRiskLevel(
                estimatedCreditScore
            );

        const summary =
            this.generateSummary({

                financialHealthScore,

                estimatedCreditScore,

                confidenceScore,

                riskLevel

            });

        const modelParameters =
            this.generateModelParameters(context);

        return {

            financialHealthScore,

            estimatedCreditScore,

            confidenceScore,

            explainabilityScore,

            riskLevel,

            summary,

            modelParameters

        };

    }

    /**
     * ============================================================
     * Financial Health Score
     * ============================================================
     */

    calculateFinancialHealthScore(context) {

        let score = 0;

        score += this.evaluateSavingsRatio(context);

        score += this.evaluateExpenseRatio(context);

        score += this.evaluateDebtRatio(context);

        score += this.evaluateEmergencyFund(context);

        score += this.evaluateBehaviour(context);

        score += this.evaluateGoals(context);

        score += this.evaluateInvestorPersona(context);

        return Math.max(
            0,
            Math.min(100, Math.round(score))
        );

    }

    /**
     * ============================================================
     * Estimated Credit Score
     * ============================================================
     */

    calculateCreditScore(

        financialHealthScore,

        context

    ) {

        const {

            MIN,

            MAX

        } = CREDIT_ASSESSMENT.CREDIT_SCORE;

        let score =
            MIN +
            ((MAX - MIN) *
                financialHealthScore) /
                100;

        if (
            context.behaviourSignals?.latePayments
        ) {

            score -= 25;

        }

        if (
            context.behaviourSignals?.highRiskBorrowing
        ) {

            score -= 30;

        }

        if (
            context.behaviourSignals?.consistentSavings
        ) {

            score += 20;

        }

        if (
            context.behaviourSignals?.investmentDiscipline
        ) {

            score += 15;

        }

        return Math.round(

            Math.max(

                MIN,

                Math.min(MAX, score)

            )

        );

    }

        /**
     * ============================================================
     * Savings Ratio Evaluation
     * ============================================================
     */

    evaluateSavingsRatio(context) {

        const ratio =
            Number(
                context.financialProfile?.savingsRatio ??
                context.financialSnapshot?.savingsRatio ??
                0
            );

        const thresholds =
            CREDIT_ASSESSMENT.RATIOS.SAVINGS;

        if (ratio >= thresholds.EXCELLENT) return 20;
        if (ratio >= thresholds.GOOD) return 16;
        if (ratio >= thresholds.AVERAGE) return 12;
        if (ratio >= thresholds.POOR) return 8;

        return 4;

    }

    /**
     * ============================================================
     * Expense Ratio Evaluation
     * ============================================================
     */

    evaluateExpenseRatio(context) {

        const ratio =
            Number(
                context.financialProfile?.expenseRatio ??
                context.financialSnapshot?.expenseRatio ??
                1
            );

        const thresholds =
            CREDIT_ASSESSMENT.RATIOS.EXPENSE;

        if (ratio <= thresholds.EXCELLENT) return 20;
        if (ratio <= thresholds.GOOD) return 16;
        if (ratio <= thresholds.AVERAGE) return 12;
        if (ratio <= thresholds.POOR) return 8;

        return 4;

    }

    /**
     * ============================================================
     * Debt-To-Income Evaluation
     * ============================================================
     */

    evaluateDebtRatio(context) {

        const ratio =
            Number(
                context.financialProfile?.debtIncomeRatio ??
                context.financialSnapshot?.debtIncomeRatio ??
                1
            );

        const thresholds =
            CREDIT_ASSESSMENT.RATIOS.DEBT_TO_INCOME;

        if (ratio <= thresholds.EXCELLENT) return 20;
        if (ratio <= thresholds.GOOD) return 16;
        if (ratio <= thresholds.AVERAGE) return 12;
        if (ratio <= thresholds.POOR) return 8;

        return 2;

    }

    /**
     * ============================================================
     * Emergency Fund Evaluation
     * ============================================================
     */

    evaluateEmergencyFund(context) {

        const fund =
            Number(
                context.financialProfile?.emergencyFund ??
                context.financialSnapshot?.emergencyFund ??
                0
            );

        const income =
            Number(
                context.financialProfile?.monthlyIncome ??
                context.financialSnapshot?.monthlyIncome ??
                0
            );

        if (!income) {

            return 0;

        }

        const monthsCovered =
            fund / income;

        const thresholds =
            CREDIT_ASSESSMENT.RATIOS.EMERGENCY_FUND;

        if (monthsCovered >= thresholds.EXCELLENT) return 15;
        if (monthsCovered >= thresholds.GOOD) return 12;
        if (monthsCovered >= thresholds.AVERAGE) return 8;
        if (monthsCovered >= thresholds.POOR) return 4;

        return 0;

    }

    /**
     * ============================================================
     * Behaviour Evaluation
     * ============================================================
     */

    evaluateBehaviour(context) {

        const behaviour =
            context.behaviourSignals || {};

        let score = 0;

        if (behaviour.consistentSavings)
            score += 4;

        if (behaviour.onTimePayments)
            score += 4;

        if (behaviour.investmentDiscipline)
            score += 4;

        if (behaviour.financialPlanning)
            score += 3;

        if (behaviour.latePayments)
            score -= 4;

        if (behaviour.highRiskBorrowing)
            score -= 5;

        return Math.max(0, score);

    }

    /**
     * ============================================================
     * Financial Goals Evaluation
     * ============================================================
     */

    evaluateGoals(context) {

        const goals =
            context.goals?.goals || [];

        if (!Array.isArray(goals))
            return 0;

        if (goals.length >= 5)
            return 10;

        if (goals.length >= 3)
            return 8;

        if (goals.length >= 2)
            return 6;

        if (goals.length >= 1)
            return 4;

        return 0;

    }

    /**
     * ============================================================
     * Investor Persona Evaluation
     * ============================================================
     */

    evaluateInvestorPersona(context) {

        const persona =
            context.investorPersona?.persona;

        switch (persona) {

            case "Conservative":
                return 10;

            case "Balanced":
                return 9;

            case "Growth":
                return 8;

            case "Aggressive":
                return 7;

            default:
                return 5;

        }

    }
        /**
     * ============================================================
     * Confidence Score
     * ============================================================
     */

    calculateConfidence(context) {

        let confidence = 100;

        if (!context.financialProfile)
            confidence -= 15;

        if (!context.financialSnapshot)
            confidence -= 15;

        if (!context.behaviourSignals)
            confidence -= 10;

        if (!context.riskProfile)
            confidence -= 10;

        if (!context.investorPersona)
            confidence -= 10;

        if (!context.goals)
            confidence -= 10;

        if (!context.recommendationProfile)
            confidence -= 10;

        return Math.max(
            0,
            Math.min(100, confidence)
        );

    }

    /**
     * ============================================================
     * Explainability Score
     * ============================================================
     */

    calculateExplainability(context) {

        let score = 100;

        if (!context.behaviourSignals)
            score -= 5;

        if (!context.goals)
            score -= 5;

        if (!context.investorPersona)
            score -= 5;

        if (!context.riskProfile)
            score -= 5;

        return Math.max(
            0,
            Math.min(100, score)
        );

    }

    /**
     * ============================================================
     * Determine Risk Level
     * ============================================================
     */

    determineRiskLevel(creditScore) {

        const {
            EXCELLENT,
            VERY_GOOD,
            GOOD,
            FAIR,
            POOR
        } = CREDIT_ASSESSMENT.CREDIT_SCORE;

        if (creditScore >= EXCELLENT)
            return "LOW";

        if (creditScore >= VERY_GOOD)
            return "LOW";

        if (creditScore >= GOOD)
            return "MEDIUM";

        if (creditScore >= FAIR)
            return "MEDIUM";

        if (creditScore >= POOR)
            return "HIGH";

        return "VERY_HIGH";

    }

    /**
     * ============================================================
     * Assessment Summary
     * ============================================================
     */

    generateSummary(result) {

        return {

            financialHealthCategory:
                this.getFinancialHealthCategory(
                    result.financialHealthScore
                ),

            creditCategory:
                this.getCreditCategory(
                    result.estimatedCreditScore
                ),

            financialHealthScore:
                result.financialHealthScore,

            estimatedCreditScore:
                result.estimatedCreditScore,

            confidenceScore:
                result.confidenceScore,

            riskLevel:
                result.riskLevel

        };

    }

    /**
     * ============================================================
     * Model Parameters
     * ============================================================
     */

    generateModelParameters(context) {

        return {

            modelName:
                CREDIT_ASSESSMENT.MODEL.NAME,

            modelVersion:
                CREDIT_ASSESSMENT.MODEL.VERSION,

            generatedAt:
                context.generatedAt,

            assessmentVersion:
                CREDIT_ASSESSMENT.VERSION,

            engine:
                "CreditAssessmentEngine"

        };

    }

    /**
     * ============================================================
     * Credit Category
     * ============================================================
     */

    getCreditCategory(score) {

        const limits =
            CREDIT_ASSESSMENT.CREDIT_SCORE;

        const category =
            CREDIT_ASSESSMENT.CREDIT_CATEGORY;

        if (score >= limits.EXCELLENT)
            return category.EXCELLENT;

        if (score >= limits.VERY_GOOD)
            return category.VERY_GOOD;

        if (score >= limits.GOOD)
            return category.GOOD;

        if (score >= limits.FAIR)
            return category.FAIR;

        if (score >= limits.POOR)
            return category.POOR;

        return category.VERY_POOR;

    }

    /**
     * ============================================================
     * Financial Health Category
     * ============================================================
     */

    getFinancialHealthCategory(score) {

        const limits =
            CREDIT_ASSESSMENT.FINANCIAL_HEALTH;

        const category =
            CREDIT_ASSESSMENT.HEALTH_CATEGORY;

        if (score >= limits.EXCELLENT)
            return category.EXCELLENT;

        if (score >= limits.GOOD)
            return category.GOOD;

        if (score >= limits.AVERAGE)
            return category.AVERAGE;

        if (score >= limits.BELOW_AVERAGE)
            return category.BELOW_AVERAGE;

        return category.POOR;

    }

}

module.exports =
    new CreditAssessmentEngine();