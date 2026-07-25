const QUESTIONS = [
  {
    id: "monthlyAmount",
    prompt: "How much can you invest each month?",
    options: [
      { label: "Rs. 500", value: 500, points: 1 },
      { label: "Rs. 2,000", value: 2000, points: 2 },
      { label: "Rs. 5,000", value: 5000, points: 3 },
    ],
  },
  {
    id: "horizonYears",
    prompt: "When do you need this money?",
    options: [
      { label: "1 year", value: 1, points: 1 },
      { label: "3 years", value: 3, points: 2 },
      { label: "5+ years", value: 5, points: 3 },
    ],
  },
  {
    id: "lossComfort",
    prompt: "If your investment falls temporarily, what feels acceptable?",
    options: [
      { label: "I prefer no loss", value: "low", points: 1 },
      { label: "Small ups and downs are okay", value: "medium", points: 2 },
      { label: "I can handle volatility", value: "high", points: 3 },
    ],
  },
  {
    id: "emergencyFundMonths",
    prompt: "How many months of expenses do you have saved?",
    options: [
      { label: "Less than 1 month", value: 0.5, points: 1 },
      { label: "1 to 3 months", value: 2, points: 2 },
      { label: "More than 3 months", value: 4, points: 3 },
    ],
  },
  {
    id: "incomeStability",
    prompt: "How stable is your income?",
    options: [
      { label: "Irregular", value: "irregular", points: 1 },
      { label: "Mostly stable", value: "mostly_stable", points: 2 },
      { label: "Very stable", value: "stable", points: 3 },
    ],
  },
  {
    id: "experience",
    prompt: "How much investing experience do you have?",
    options: [
      { label: "New investor", value: "new", points: 1 },
      { label: "Some experience", value: "some", points: 2 },
      { label: "Experienced", value: "experienced", points: 3 },
    ],
  },
];

const allocationByRisk = {
  LOW: {
    expectedReturns: { conservative: 0.05, base: 0.07, optimistic: 0.09 },
    allocation: [
      { category: "Recurring deposit or fixed deposit", percentage: 45 },
      { category: "Liquid or short-duration debt fund", percentage: 35 },
      { category: "Large-cap index fund", percentage: 15 },
      { category: "Gold ETF or savings gold", percentage: 5 },
    ],
  },
  MEDIUM: {
    expectedReturns: { conservative: 0.07, base: 0.1, optimistic: 0.13 },
    allocation: [
      { category: "Large-cap index fund", percentage: 35 },
      { category: "Hybrid mutual fund", percentage: 30 },
      { category: "Short-duration debt fund", percentage: 25 },
      { category: "Gold ETF", percentage: 10 },
    ],
  },
  HIGH: {
    expectedReturns: { conservative: 0.09, base: 0.13, optimistic: 0.17 },
    allocation: [
      { category: "Broad-market index fund", percentage: 45 },
      { category: "Flexi-cap or mid-cap fund", percentage: 25 },
      { category: "Hybrid fund", percentage: 20 },
      { category: "Liquid fund buffer", percentage: 10 },
    ],
  },
};

const futureValueSip = (monthlyAmount, annualReturn, years) => {
  const months = years * 12;
  const monthlyRate = annualReturn / 12;

  if (monthlyRate === 0) {
    return Math.round(monthlyAmount * months);
  }

  return Math.round(monthlyAmount * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate));
};

const classifyRisk = (points) => {
  if (points <= 9) return "LOW";
  if (points <= 14) return "MEDIUM";
  return "HIGH";
};

const getAnswerPoints = (question, answer) => {
  const selected = question.options.find((option) => String(option.value) === String(answer));
  return selected?.points || question.options[0].points;
};

const assessRiskProfile = (answers = {}) => {
  const points = QUESTIONS.reduce((sum, question) => sum + getAnswerPoints(question, answers[question.id]), 0);
  const riskLevel = classifyRisk(points);
  const monthlyAmount = Number(answers.monthlyAmount) || 2000;
  const recommendation = allocationByRisk[riskLevel];

  const projections = [1, 3, 5].map((years) => ({
    years,
    conservative: futureValueSip(monthlyAmount, recommendation.expectedReturns.conservative, years),
    base: futureValueSip(monthlyAmount, recommendation.expectedReturns.base, years),
    optimistic: futureValueSip(monthlyAmount, recommendation.expectedReturns.optimistic, years),
  }));

  const plainLanguage =
    riskLevel === "LOW"
      ? "Your answers suggest capital safety matters most. Start with stable instruments and keep only a small equity exposure."
      : riskLevel === "MEDIUM"
        ? "Your answers suggest a balanced approach. Mix equity growth with debt stability so small monthly investing feels manageable."
        : "Your answers suggest you can accept higher volatility for long-term growth. Keep a cash buffer while using equity-heavy categories.";

  return {
    riskLevel,
    score: points,
    monthlyAmount,
    allocation: recommendation.allocation,
    expectedReturns: recommendation.expectedReturns,
    projections,
    plainLanguage,
    disclaimer:
      "For educational purposes only. This is not regulated financial advice, credit approval, or an investment recommendation from a licensed advisor.",
  };
};

module.exports = {
  QUESTIONS,
  assessRiskProfile,
};
