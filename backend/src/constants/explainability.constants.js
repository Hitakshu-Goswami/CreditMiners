const EXPLANATION_TYPES = Object.freeze({
  RISK: "RISK",
  PERSONA: "PERSONA",
  GOAL: "GOAL",
  CONFIDENCE: "CONFIDENCE",
  RECOMMENDATION: "RECOMMENDATION",
  DOMAIN: "DOMAIN",
  BEHAVIOUR: "BEHAVIOUR",
  CREDIT_SCORE: "CREDIT_SCORE",
});

const EXPLANATION_SECTIONS = Object.freeze({
  SUMMARY: "SUMMARY",
  FACTORS: "FACTORS",
  STRENGTHS: "STRENGTHS",
  WEAKNESSES: "WEAKNESSES",
  RECOMMENDATIONS: "RECOMMENDATIONS",
  NEXT_STEPS: "NEXT_STEPS",
});

const EXPLANATION_TONE = Object.freeze({
  SIMPLE: "SIMPLE",
  CONVERSATIONAL: "CONVERSATIONAL",
  DETAILED: "DETAILED",
  PROFESSIONAL: "PROFESSIONAL",
});

const EXPLANATION_STATUS = Object.freeze({
  GENERATED: "GENERATED",
  PENDING: "PENDING",
  FAILED: "FAILED",
});

const EXPLANATION_PRIORITY = Object.freeze({
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
});

const EXPLANATION_LIMITS = Object.freeze({
  MAX_FACTORS: 5,
  MAX_STRENGTHS: 5,
  MAX_WEAKNESSES: 5,
  MAX_RECOMMENDATIONS: 5,
  MAX_NEXT_STEPS: 5,
});

const EXPLANATION_TEMPLATES = Object.freeze({
  RISK:
    "Your risk profile was determined based on your investment behaviour, financial goals, time horizon, income stability, and ability to tolerate market fluctuations.",

  PERSONA:
    "Your investor persona represents your overall investing style based on your financial behaviour and preferences.",

  GOAL:
    "Your financial goals were identified from your responses and prioritized based on importance and timeline.",

  CONFIDENCE:
    "Your assessment confidence reflects the overall reliability and consistency of your responses.",

  RECOMMENDATION:
    "These recommendations are tailored according to your financial profile, goals, risk level, and investor persona.",

  DOMAIN:
    "This assessment domain measures a specific aspect of your financial profile.",

  BEHAVIOUR:
    "Behavioural insights are derived from your financial decision-making patterns and response consistency.",

  CREDIT_SCORE:
    "Your AI Credit Score combines traditional and alternative financial indicators to estimate your creditworthiness.",
});

const EXPLANATION_FACTORS = Object.freeze({
  RISK: [
    "Risk tolerance",
    "Investment horizon",
    "Income stability",
    "Investment knowledge",
    "Financial goals",
  ],

  PERSONA: [
    "Financial behaviour",
    "Investment habits",
    "Planning discipline",
    "Goal orientation",
    "Decision consistency",
  ],

  GOAL: [
    "Priority",
    "Timeline",
    "Category",
    "Financial impact",
  ],

  CONFIDENCE: [
    "Assessment completeness",
    "Answer consistency",
    "Behaviour consistency",
    "Response timing",
    "Response quality",
  ],

  RECOMMENDATION: [
    "Risk profile",
    "Investor persona",
    "Financial goals",
    "Assessment confidence",
  ],
});

module.exports = {
  EXPLANATION_TYPES,
  EXPLANATION_SECTIONS,
  EXPLANATION_TONE,
  EXPLANATION_STATUS,
  EXPLANATION_PRIORITY,
  EXPLANATION_LIMITS,
  EXPLANATION_TEMPLATES,
  EXPLANATION_FACTORS,
};