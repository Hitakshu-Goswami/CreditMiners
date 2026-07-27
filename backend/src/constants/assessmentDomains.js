const DOMAIN_TYPES = Object.freeze({
  FINANCIAL_GOALS: "FINANCIAL_GOALS",
  INVESTMENT_CAPACITY: "INVESTMENT_CAPACITY",
  RISK_APPETITE: "RISK_APPETITE",
  TIME_HORIZON: "TIME_HORIZON",
  INCOME_STABILITY: "INCOME_STABILITY",
  FINANCIAL_EXPERIENCE: "FINANCIAL_EXPERIENCE",
  FINANCIAL_BEHAVIOUR: "FINANCIAL_BEHAVIOUR",
});

const DOMAIN_OUTPUTS = Object.freeze({
  GOAL_HIERARCHY: "GOAL_HIERARCHY",
  INVESTMENT_CAPACITY_SCORE: "INVESTMENT_CAPACITY_SCORE",
  RISK_TOLERANCE_SCORE: "RISK_TOLERANCE_SCORE",
  INVESTMENT_HORIZON: "INVESTMENT_HORIZON",
  INCOME_STABILITY_CONFIDENCE:
    "INCOME_STABILITY_CONFIDENCE",
  EXPERIENCE_LEVEL: "EXPERIENCE_LEVEL",
  BEHAVIOUR_SCORE: "BEHAVIOUR_SCORE",
});

const assessmentDomains = [
  {
    id: 1,

    key: DOMAIN_TYPES.FINANCIAL_GOALS,

    title: "Financial Goals",

    description:
      "Understands the user's financial objectives and priorities.",

    output:
      DOMAIN_OUTPUTS.GOAL_HIERARCHY,

    weight: 10,

    order: 1,

    active: true,

    questionKeys: [
      "primary_investment_goal",
      "secondary_goals",
      "retirement_goal",
      "wealth_creation_goal",
      "emergency_fund_goal",
      "education_goal",
      "house_goal",
      "vehicle_goal",
      "business_goal",
    ],
  },

  {
    id: 2,

    key:
      DOMAIN_TYPES.INVESTMENT_CAPACITY,

    title: "Investment Capacity",

    description:
      "Evaluates how much the user can realistically invest.",

    output:
      DOMAIN_OUTPUTS.INVESTMENT_CAPACITY_SCORE,

    weight: 20,

    order: 2,

    active: true,

    questionKeys: [
      "monthly_investment_budget",
      "disposable_income",
      "monthly_income",
      "monthly_expenses",
      "monthly_savings",
      "expected_income_growth",
    ],
  },

  {
    id: 3,

    key: DOMAIN_TYPES.RISK_APPETITE,

    title: "Risk Appetite",

    description:
      "Measures the user's willingness to take investment risks.",

    output:
      DOMAIN_OUTPUTS.RISK_TOLERANCE_SCORE,

    weight: 20,

    order: 3,

    active: true,

    questionKeys: [
      "loss_tolerance",
      "market_reaction",
      "volatility_comfort",
      "expected_return",
    ],
  },

  {
    id: 4,

    key: DOMAIN_TYPES.TIME_HORIZON,

    title: "Time Horizon",

    description:
      "Determines the expected investment duration and liquidity needs.",

    output:
      DOMAIN_OUTPUTS.INVESTMENT_HORIZON,

    weight: 10,

    order: 4,

    active: true,

    questionKeys: [
      "investment_duration",
      "goal_deadline",
      "liquidity_requirement",
    ],
  },

  {
    id: 5,

    key:
      DOMAIN_TYPES.INCOME_STABILITY,

    title: "Income Stability",

    description:
      "Evaluates the consistency and predictability of income.",

    output:
      DOMAIN_OUTPUTS.INCOME_STABILITY_CONFIDENCE,

    weight: 15,

    order: 5,

    active: true,

    questionKeys: [
      "employment_status",
      "employment_type",
      "salary_growth_expectation",
      "business_stability",
      "freelance_income_predictability",
    ],
  },

  {
    id: 6,

    key:
      DOMAIN_TYPES.FINANCIAL_EXPERIENCE,

    title: "Financial Experience",

    description:
      "Assesses previous investing experience across financial products.",

    output:
      DOMAIN_OUTPUTS.EXPERIENCE_LEVEL,

    weight: 10,

    order: 6,

    active: true,

    questionKeys: [
      "investment_experience",
      "mutual_funds_experience",
      "stocks_experience",
      "sip_experience",
      "gold_investment",
      "crypto_investment",
      "fixed_deposit_experience",
    ],
  },

  {
    id: 7,

    key:
      DOMAIN_TYPES.FINANCIAL_BEHAVIOUR,

    title: "Financial Behaviour",

    description:
      "Evaluates financial discipline and behavioural patterns.",

    output:
      DOMAIN_OUTPUTS.BEHAVIOUR_SCORE,

    weight: 15,

    order: 7,

    active: true,

    questionKeys: [
      "panic_selling",
      "saving_habit",
      "budgeting_habit",
      "financial_planning",
      "missed_emi_last_year",
    ],
  },
];

module.exports = {
  DOMAIN_TYPES,
  DOMAIN_OUTPUTS,
  assessmentDomains,
};