const GOAL_TYPES = Object.freeze({
  EMERGENCY_FUND: "EMERGENCY_FUND",
  RETIREMENT: "RETIREMENT",
  HOUSE: "HOUSE",
  VEHICLE: "VEHICLE",
  EDUCATION: "EDUCATION",
  HIGHER_EDUCATION: "HIGHER_EDUCATION",
  CHILD_EDUCATION: "CHILD_EDUCATION",
  MARRIAGE: "MARRIAGE",
  BUSINESS: "BUSINESS",
  WEALTH_CREATION: "WEALTH_CREATION",
  PASSIVE_INCOME: "PASSIVE_INCOME",
  TRAVEL: "TRAVEL",
  VACATION: "VACATION",
  HEALTHCARE: "HEALTHCARE",
  INSURANCE: "INSURANCE",
  TAX_SAVING: "TAX_SAVING",
  DEBT_REPAYMENT: "DEBT_REPAYMENT",
  FINANCIAL_FREEDOM: "FINANCIAL_FREEDOM",
  OTHER: "OTHER",
});

const GOAL_CATEGORIES = Object.freeze({
  PROTECTION: "PROTECTION",
  LIFESTYLE: "LIFESTYLE",
  ASSET_CREATION: "ASSET_CREATION",
  FAMILY: "FAMILY",
  RETIREMENT: "RETIREMENT",
  BUSINESS: "BUSINESS",
  EDUCATION: "EDUCATION",
  DEBT: "DEBT",
  WEALTH: "WEALTH",
});

const GOAL_PRIORITY = Object.freeze({
  CRITICAL: "CRITICAL",
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
});

const GOAL_HORIZON = Object.freeze({
  SHORT_TERM: "SHORT_TERM",
  MEDIUM_TERM: "MEDIUM_TERM",
  LONG_TERM: "LONG_TERM",
});

const GOAL_STATUS = Object.freeze({
  IDENTIFIED: "IDENTIFIED",
  PLANNED: "PLANNED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
});

const GOAL_EXTRACTION_SOURCE = Object.freeze({
  PRIMARY_GOAL: "PRIMARY_GOAL",
  SECONDARY_GOAL: "SECONDARY_GOAL",
  QUESTIONNAIRE: "QUESTIONNAIRE",
  FREE_TEXT: "FREE_TEXT",
  AI_INFERENCE: "AI_INFERENCE",
});

const HORIZON_THRESHOLDS = Object.freeze({
  SHORT_TERM_MAX_YEARS: 3,
  MEDIUM_TERM_MAX_YEARS: 10,
});

const GOAL_KEYWORDS = Object.freeze({
  HOUSE: [
    "house",
    "home",
    "flat",
    "property",
  ],

  RETIREMENT: [
    "retirement",
    "retire",
    "pension",
  ],

  EDUCATION: [
    "education",
    "college",
    "university",
    "study",
  ],

  BUSINESS: [
    "business",
    "startup",
    "company",
  ],

  VEHICLE: [
    "car",
    "vehicle",
    "bike",
  ],

  EMERGENCY_FUND: [
    "emergency",
    "emergency fund",
  ],

  WEALTH_CREATION: [
    "wealth",
    "wealth creation",
    "investment",
  ],

  TRAVEL: [
    "travel",
    "vacation",
    "trip",
    "holiday",
  ],

  MARRIAGE: [
    "marriage",
    "wedding",
  ],

  FINANCIAL_FREEDOM: [
    "financial freedom",
    "financial independence",
  ],
});

module.exports = {
  GOAL_TYPES,
  GOAL_CATEGORIES,
  GOAL_PRIORITY,
  GOAL_HORIZON,
  GOAL_STATUS,
  GOAL_EXTRACTION_SOURCE,
  HORIZON_THRESHOLDS,
  GOAL_KEYWORDS,
};