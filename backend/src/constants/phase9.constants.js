const PHASE9_DISCLAIMER =
  "This output is educational guidance based on available financial signals. It is not a credit decision, loan approval, or regulated investment advice.";

const EXPLANATION_VERSION = "phase-9-explainability-v1";
const INSIGHT_ENGINE_VERSION = "phase-9-insight-engine-v1";
const MONTHLY_REPORT_VERSION = "phase-9-report-v1";

const FEATURE_FAMILIES = {
  monthly_income: "Income stability",
  income_stability_score: "Income stability",
  income_volatility: "Income stability",
  income_seasonality: "Income stability",
  salary_delay_days: "Income stability",
  expense_income_ratio: "Expense discipline",
  monthly_expenses: "Expense discipline",
  spending_stability_score: "Expense discipline",
  weekend_spending_ratio: "Expense discipline",
  night_spending_ratio: "Expense discipline",
  spending_drift: "Expense discipline",
  essential_spend_ratio: "Expense discipline",
  luxury_spend_ratio: "Expense discipline",
  savings_ratio: "Savings behavior",
  monthly_savings: "Savings behavior",
  savings_streak: "Savings behavior",
  emergency_fund_ratio: "Savings behavior",
  monthly_cash_flow: "Cash flow health",
  cash_flow_stability_score: "Cash flow health",
  utility_reliability_score: "Utility reliability",
  utility_seasonality: "Utility reliability",
  recharge_reliability_score: "Recharge consistency",
  recharge_growth: "Recharge consistency",
  average_recharge_amount: "Recharge consistency",
  digital_payment_score: "Digital payment behavior",
  merchant_diversity_score: "Merchant diversity",
  merchant_concentration: "Merchant diversity",
  merchant_switching_frequency: "Merchant diversity",
  investment_capacity_score: "Investment capacity",
  investment_capacity: "Investment capacity",
  financial_health_feature_score: "Cash flow health",
  financial_discipline_score: "Expense discipline",
  credit_readiness_score: "Cash flow health",
  financial_behaviour_score: "Cash flow health",
};

const FEATURE_ACTIONS = {
  expense_income_ratio: "Review the largest expense categories and keep essential payments predictable before adding new discretionary commitments.",
  savings_ratio: "Set aside a small fixed amount soon after income arrives, even if the amount starts modestly.",
  utility_reliability_score: "Keep utility due dates visible and pay before the due date when cash flow allows.",
  recharge_reliability_score: "Use a consistent recharge plan or reminder so phone access remains predictable.",
  monthly_cash_flow: "Protect a positive month-end balance before increasing optional spending.",
  digital_payment_score: "Use traceable digital payments for recurring bills where it is convenient and consented.",
  emergency_fund_ratio: "Build one extra week of expenses as a starter emergency buffer.",
  spending_drift: "Compare recent discretionary spending with last month and choose one category to slow down.",
  luxury_spend_ratio: "Set a soft ceiling for non-essential purchases this month.",
  investment_capacity_score: "Treat investment capacity as an education signal and avoid investing money needed for bills or emergencies.",
};

module.exports = {
  EXPLANATION_VERSION,
  FEATURE_ACTIONS,
  FEATURE_FAMILIES,
  INSIGHT_ENGINE_VERSION,
  MONTHLY_REPORT_VERSION,
  PHASE9_DISCLAIMER,
};
