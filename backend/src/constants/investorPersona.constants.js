const INVESTOR_PERSONAS = Object.freeze({
  CONSERVATIVE_SAVER: "CONSERVATIVE_SAVER",
  BALANCED_PLANNER: "BALANCED_PLANNER",
  GROWTH_INVESTOR: "GROWTH_INVESTOR",
  AGGRESSIVE_WEALTH_BUILDER: "AGGRESSIVE_WEALTH_BUILDER",
  GOAL_ORIENTED_BEGINNER: "GOAL_ORIENTED_BEGINNER",
  DISCIPLINED_ACCUMULATOR: "DISCIPLINED_ACCUMULATOR",
  HIGH_RISK_EXPLORER: "HIGH_RISK_EXPLORER",
  INCOME_FOCUSED_INVESTOR: "INCOME_FOCUSED_INVESTOR",
});

const PERSONA_CONFIDENCE = Object.freeze({
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  VERY_HIGH: "VERY_HIGH",
});

const PERSONA_STATUS = Object.freeze({
  GENERATED: "GENERATED",
  PENDING: "PENDING",
  NOT_AVAILABLE: "NOT_AVAILABLE",
});

const PERSONA_SCORE_THRESHOLDS = Object.freeze({
  LOW: 40,
  MEDIUM: 60,
  HIGH: 80,
  VERY_HIGH: 100,
});

const PERSONA_FACTORS = Object.freeze({
  CONSERVATIVE_SAVER: [
    "liquidityPreference",
    "lossToleranceScore",
    "incomeStability",
  ],

  BALANCED_PLANNER: [
    "planningDiscipline",
    "goalClarity",
    "decisionConsistency",
  ],

  GROWTH_INVESTOR: [
    "riskToleranceScore",
    "investmentKnowledgeScore",
    "timeHorizonScore",
  ],

  AGGRESSIVE_WEALTH_BUILDER: [
    "riskToleranceScore",
    "financialConfidence",
    "portfolioMaturity",
  ],

  GOAL_ORIENTED_BEGINNER: [
    "goalClarity",
    "investmentKnowledgeScore",
    "experienceScore",
  ],

  DISCIPLINED_ACCUMULATOR: [
    "savingDiscipline",
    "planningDiscipline",
    "decisionConsistency",
  ],

  HIGH_RISK_EXPLORER: [
    "riskToleranceScore",
    "lossToleranceScore",
    "financialConfidence",
  ],

  INCOME_FOCUSED_INVESTOR: [
    "incomeStability",
    "cashFlowStrength",
    "liquidityPreference",
  ],
});

const PERSONA_RECOMMENDATIONS = Object.freeze({
  CONSERVATIVE_SAVER: [
    "Maintain a strong emergency fund.",
    "Gradually diversify into low-risk investments.",
    "Review your portfolio annually.",
  ],

  BALANCED_PLANNER: [
    "Maintain a diversified portfolio.",
    "Increase long-term equity exposure gradually.",
    "Review financial goals periodically.",
  ],

  GROWTH_INVESTOR: [
    "Increase equity allocation for long-term growth.",
    "Invest consistently through SIPs.",
    "Review portfolio diversification regularly.",
  ],

  AGGRESSIVE_WEALTH_BUILDER: [
    "Maintain disciplined risk management.",
    "Diversify across sectors and asset classes.",
    "Avoid excessive concentration in high-risk assets.",
  ],

  GOAL_ORIENTED_BEGINNER: [
    "Focus on building investment knowledge.",
    "Start with diversified index funds.",
    "Set realistic financial milestones.",
  ],

  DISCIPLINED_ACCUMULATOR: [
    "Continue systematic investing.",
    "Review retirement planning annually.",
    "Increase investments with income growth.",
  ],

  HIGH_RISK_EXPLORER: [
    "Limit speculative investments.",
    "Maintain portfolio diversification.",
    "Keep sufficient emergency savings.",
  ],

  INCOME_FOCUSED_INVESTOR: [
    "Focus on income-generating assets.",
    "Maintain adequate liquidity.",
    "Review cash flow requirements regularly.",
  ],
});

module.exports = {
  INVESTOR_PERSONAS,
  PERSONA_CONFIDENCE,
  PERSONA_STATUS,
  PERSONA_SCORE_THRESHOLDS,
  PERSONA_FACTORS,
  PERSONA_RECOMMENDATIONS,
};