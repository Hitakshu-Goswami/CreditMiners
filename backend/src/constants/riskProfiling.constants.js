const RISK_DIMENSIONS = Object.freeze({
  INVESTMENT: "INVESTMENT",
  BEHAVIOUR: "BEHAVIOUR",
  LIQUIDITY: "LIQUIDITY",
  INCOME: "INCOME",
  GOAL: "GOAL",
  EMOTIONAL: "EMOTIONAL",
  KNOWLEDGE: "KNOWLEDGE",
  OVERALL: "OVERALL",
});

const RISK_LEVELS = Object.freeze({
  VERY_LOW: "VERY_LOW",
  LOW: "LOW",
  MODERATE: "MODERATE",
  MODERATE_HIGH: "MODERATE_HIGH",
  HIGH: "HIGH",
  VERY_HIGH: "VERY_HIGH",
});

const RISK_STATUS = Object.freeze({
  CALCULATED: "CALCULATED",
  PENDING: "PENDING",
  NOT_AVAILABLE: "NOT_AVAILABLE",
});

const SCORE_RANGE = Object.freeze({
  MIN: 0,
  MAX: 100,
});

const RISK_THRESHOLDS = Object.freeze({
  VERY_LOW_MAX: 20,
  LOW_MAX: 40,
  MODERATE_MAX: 60,
  MODERATE_HIGH_MAX: 80,
  HIGH_MAX: 100,
});

const DIMENSION_WEIGHTS = Object.freeze({
  INVESTMENT: 0.20,
  BEHAVIOUR: 0.15,
  LIQUIDITY: 0.15,
  INCOME: 0.15,
  GOAL: 0.10,
  EMOTIONAL: 0.10,
  KNOWLEDGE: 0.15,
});

const INVESTMENT_FACTORS = Object.freeze([
  "riskToleranceScore",
  "investmentKnowledgeScore",
  "timeHorizonScore",
  "portfolioMaturity",
]);

const BEHAVIOUR_FACTORS = Object.freeze([
  "planningDiscipline",
  "savingDiscipline",
  "decisionConsistency",
  "behaviourConfidence",
]);

const LIQUIDITY_FACTORS = Object.freeze([
  "liquidityPreference",
  "cashFlowStrength",
]);

const INCOME_FACTORS = Object.freeze([
  "incomeStability",
  "futureIncomeExpectation",
]);

const GOAL_FACTORS = Object.freeze([
  "goalClarity",
  "goalConsistency",
]);

const EMOTIONAL_FACTORS = Object.freeze([
  "lossToleranceScore",
  "financialConfidence",
]);

const KNOWLEDGE_FACTORS = Object.freeze([
  "investmentKnowledgeScore",
  "experienceScore",
  "diversificationAwareness",
]);

module.exports = {
  RISK_DIMENSIONS,
  RISK_LEVELS,
  RISK_STATUS,
  SCORE_RANGE,
  RISK_THRESHOLDS,
  DIMENSION_WEIGHTS,
  INVESTMENT_FACTORS,
  BEHAVIOUR_FACTORS,
  LIQUIDITY_FACTORS,
  INCOME_FACTORS,
  GOAL_FACTORS,
  EMOTIONAL_FACTORS,
  KNOWLEDGE_FACTORS,
};