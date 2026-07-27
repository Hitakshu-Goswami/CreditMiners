const QUESTION_TYPES = Object.freeze({
  TEXT: "TEXT",
  NUMBER: "NUMBER",
  CURRENCY: "CURRENCY",
  PERCENTAGE: "PERCENTAGE",
  BOOLEAN: "BOOLEAN",
  DATE: "DATE",
  EMAIL: "EMAIL",
  PHONE: "PHONE",
  SELECT: "SELECT",
  MULTI_SELECT: "MULTI_SELECT",
  RADIO: "RADIO",
  CHECKBOX: "CHECKBOX",
  SLIDER: "SLIDER",
});

const QUESTION_SECTIONS = Object.freeze({
  PERSONAL: "PERSONAL",
  EMPLOYMENT: "EMPLOYMENT",
  INCOME: "INCOME",
  EXPENSES: "EXPENSES",
  SAVINGS: "SAVINGS",
  ASSETS: "ASSETS",
  LIABILITIES: "LIABILITIES",
  INVESTMENTS: "INVESTMENTS",
  FINANCIAL_BEHAVIOUR: "FINANCIAL_BEHAVIOUR",
  GOALS: "GOALS",
});

const QUESTION_CATEGORIES = Object.freeze({
  PERSONAL: "PERSONAL",
  EMPLOYMENT: "EMPLOYMENT",
  INCOME: "INCOME",
  EXPENSES: "EXPENSES",
  SAVINGS: "SAVINGS",
  ASSETS: "ASSETS",
  LIABILITIES: "LIABILITIES",
  INVESTMENTS: "INVESTMENTS",
  CREDIT: "CREDIT",
  FINANCIAL_BEHAVIOUR: "FINANCIAL_BEHAVIOUR",
});

const SCORING_RULES = Object.freeze({
  HIGHER_IS_BETTER: "HIGHER_IS_BETTER",
  LOWER_IS_BETTER: "LOWER_IS_BETTER",
  BOOLEAN_POSITIVE: "BOOLEAN_POSITIVE",
  BOOLEAN_NEGATIVE: "BOOLEAN_NEGATIVE",
  RANGE_SCORE: "RANGE_SCORE",
  CUSTOM: "CUSTOM",
});

const OPERATORS = Object.freeze({
  EQUALS: "EQUALS",
  NOT_EQUALS: "NOT_EQUALS",
  GREATER_THAN: "GREATER_THAN",
  GREATER_THAN_EQUAL: "GREATER_THAN_EQUAL",
  LESS_THAN: "LESS_THAN",
  LESS_THAN_EQUAL: "LESS_THAN_EQUAL",
  IN: "IN",
  NOT_IN: "NOT_IN",
});

const QUESTION_VERSION = "v1";

const assessmentQuestions = [
  {
    id: 1,
    key: "age",
    version: QUESTION_VERSION,

    section: QUESTION_SECTIONS.PERSONAL,
    category: QUESTION_CATEGORIES.PERSONAL,

    order: 1,

    title: "What is your age?",

    description:
      "Enter your completed age in years.",

    type: QUESTION_TYPES.NUMBER,

    required: true,

    active: true,

    placeholder: "25",

    options: [],

    validation: {
      min: 18,
      max: 100,
    },

    dependencies: [],

    weight: 5,

    scoringRule:
      SCORING_RULES.RANGE_SCORE,
  },

  {
    id: 2,
    key: "employment_status",
    version: QUESTION_VERSION,

    section:
      QUESTION_SECTIONS.EMPLOYMENT,

    category:
      QUESTION_CATEGORIES.EMPLOYMENT,

    order: 2,

    title:
      "What is your employment status?",

    description:
      "Select your current employment status.",

    type: QUESTION_TYPES.SELECT,

    required: true,

    active: true,

    placeholder: "",

    options: [
      "Salaried",
      "Self Employed",
      "Business",
      "Student",
      "Unemployed",
      "Retired",
    ],

    validation: {},

    dependencies: [],

    weight: 10,

    scoringRule:
      SCORING_RULES.CUSTOM,
  },

  {
    id: 3,
    key: "monthly_income",
    version: QUESTION_VERSION,

    section: QUESTION_SECTIONS.INCOME,

    category: QUESTION_CATEGORIES.INCOME,

    order: 3,

    title: "Monthly Income",

    description:
      "Average monthly income from all sources.",

    type: QUESTION_TYPES.CURRENCY,

    required: true,

    active: true,

    placeholder: "50000",

    options: [],

    validation: {
      min: 0,
      max: 100000000,
    },

    dependencies: [],

    weight: 15,

    scoringRule:
      SCORING_RULES.HIGHER_IS_BETTER,
  },

  {
    id: 4,
    key: "monthly_expenses",
    version: QUESTION_VERSION,

    section:
      QUESTION_SECTIONS.EXPENSES,

    category:
      QUESTION_CATEGORIES.EXPENSES,

    order: 4,

    title: "Monthly Expenses",

    description:
      "Average monthly expenses.",

    type: QUESTION_TYPES.CURRENCY,

    required: true,

    active: true,

    placeholder: "25000",

    options: [],

    validation: {
      min: 0,
      max: 100000000,
    },

    dependencies: [],

    weight: 12,

    scoringRule:
      SCORING_RULES.LOWER_IS_BETTER,
  },

  {
    id: 5,
    key: "monthly_savings",
    version: QUESTION_VERSION,

    section:
      QUESTION_SECTIONS.SAVINGS,

    category:
      QUESTION_CATEGORIES.SAVINGS,

    order: 5,

    title: "Monthly Savings",

    description:
      "Average monthly savings.",

    type: QUESTION_TYPES.CURRENCY,

    required: true,

    active: true,

    placeholder: "10000",

    options: [],

    validation: {
      min: 0,
    },

    dependencies: [],

    weight: 15,

    scoringRule:
      SCORING_RULES.HIGHER_IS_BETTER,
  },

  {
    id: 6,
    key: "has_existing_loan",
    version: QUESTION_VERSION,

    section:
      QUESTION_SECTIONS.LIABILITIES,

    category:
      QUESTION_CATEGORIES.LIABILITIES,

    order: 6,

    title:
      "Do you currently have any active loans?",

    description:
      "Select Yes if you have any running loans.",

    type: QUESTION_TYPES.BOOLEAN,

    required: true,

    active: true,

    placeholder: "",

    options: [true, false],

    validation: {},

    dependencies: [],

    weight: 10,

    scoringRule:
      SCORING_RULES.BOOLEAN_NEGATIVE,
  },

  {
    id: 7,
    key: "loan_emi",
    version: QUESTION_VERSION,

    section:
      QUESTION_SECTIONS.LIABILITIES,

    category:
      QUESTION_CATEGORIES.LIABILITIES,

    order: 7,

    title:
      "Monthly EMI Amount",

    description:
      "Enter your total monthly EMI.",

    type: QUESTION_TYPES.CURRENCY,

    required: true,

    active: true,

    placeholder: "12000",

    options: [],

    validation: {
      min: 0,
    },

    dependencies: [
      {
        questionKey:
          "has_existing_loan",

        operator:
          OPERATORS.EQUALS,

        value: true,
      },
    ],

    weight: 15,

    scoringRule:
      SCORING_RULES.LOWER_IS_BETTER,
  },

  {
    id: 8,
    key: "investment_experience",
    version: QUESTION_VERSION,

    section:
      QUESTION_SECTIONS.INVESTMENTS,

    category:
      QUESTION_CATEGORIES.INVESTMENTS,

    order: 8,

    title:
      "Investment Experience",

    description:
      "Choose your investing experience.",

    type: QUESTION_TYPES.SELECT,

    required: true,

    active: true,

    placeholder: "",

    options: [
      "None",
      "Beginner",
      "Intermediate",
      "Advanced",
    ],

    validation: {},

    dependencies: [],

    weight: 8,

    scoringRule:
      SCORING_RULES.CUSTOM,
  },

  {
    id: 9,
    key: "missed_emi_last_year",
    version: QUESTION_VERSION,

    section:
      QUESTION_SECTIONS.FINANCIAL_BEHAVIOUR,

    category:
      QUESTION_CATEGORIES.FINANCIAL_BEHAVIOUR,

    order: 9,

    title:
      "Have you missed any EMI in the last 12 months?",

    description:
      "Select Yes if you missed any EMI payment.",

    type: QUESTION_TYPES.BOOLEAN,

    required: true,

    active: true,

    placeholder: "",

    options: [true, false],

    validation: {},

    dependencies: [],

    weight: 20,

    scoringRule:
      SCORING_RULES.BOOLEAN_NEGATIVE,
  },

  {
    id: 10,
    key: "financial_goal",
    version: QUESTION_VERSION,

    section:
      QUESTION_SECTIONS.GOALS,

    category:
      QUESTION_CATEGORIES.FINANCIAL_BEHAVIOUR,

    order: 10,

    title:
      "Primary Financial Goal",

    description:
      "Select your primary financial goal.",

    type: QUESTION_TYPES.SELECT,

    required: true,

    active: true,

    placeholder: "",

    options: [
      "Emergency Fund",
      "Home",
      "Vehicle",
      "Retirement",
      "Wealth Creation",
      "Education",
    ],

    validation: {},

    dependencies: [],

    weight: 5,

    scoringRule:
      SCORING_RULES.CUSTOM,
  },
];

module.exports = {
  QUESTION_TYPES,
  QUESTION_SECTIONS,
  QUESTION_CATEGORIES,
  SCORING_RULES,
  OPERATORS,
  QUESTION_VERSION,
  assessmentQuestions,
};