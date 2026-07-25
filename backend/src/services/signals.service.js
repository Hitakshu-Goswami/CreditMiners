const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../../../data/sample-data");
const REFERENCE_DATE = new Date("2026-07-25T00:00:00.000Z");

const FEATURE_WEIGHTS = {
  utilityRegularity: 0.3,
  rechargeConsistency: 0.2,
  ecommerceDiscipline: 0.2,
  cashflowStrength: 0.2,
  dataCompleteness: 0.1,
};

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseDate = (value) => (value ? new Date(`${value}T00:00:00.000Z`) : null);

const daysBetween = (first, second) => {
  if (!first || !second) return 0;
  return Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
};

const mean = (values) => {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const stdDev = (values) => {
  if (values.length < 2) return 0;
  const avg = mean(values);
  return Math.sqrt(mean(values.map((value) => (value - avg) ** 2)));
};

const coefficientOfVariation = (values) => {
  const avg = mean(values);
  return avg === 0 ? 0 : stdDev(values) / avg;
};

const scoreHighIsGood = (value, min, max) => clamp((value - min) / (max - min));
const scoreLowIsGood = (value, min, max) => 1 - scoreHighIsGood(value, min, max);

const monthKey = (date) => date.toISOString().slice(0, 7);

const inLastDays = (date, days) => {
  if (!date) return false;
  return daysBetween(date, REFERENCE_DATE) <= days && date <= REFERENCE_DATE;
};

const parseCsv = (filename) => {
  const filePath = path.join(DATA_DIR, filename);
  const content = fs.readFileSync(filePath, "utf8").trim();
  const [headerLine, ...lines] = content.split(/\r?\n/);
  const headers = headerLine.split(",");

  return lines.map((line) => {
    const values = line.split(",");
    return headers.reduce((row, header, index) => {
      row[header] = values[index] || "";
      return row;
    }, {});
  });
};

const getRawData = () => ({
  users: parseCsv("users.csv"),
  recharges: parseCsv("mobile_recharges.csv"),
  utilities: parseCsv("utility_payments.csv"),
  ecommerce: parseCsv("ecommerce_transactions.csv"),
});

const getRechargeFeatures = (rows) => {
  const successful = rows
    .filter((row) => row.status === "SUCCESS")
    .map((row) => ({ ...row, parsedDate: parseDate(row.date), amount: toNumber(row.amount) }))
    .sort((a, b) => a.parsedDate - b.parsedDate);

  const recentSuccessful = successful.filter((row) => inLastDays(row.parsedDate, 90));
  const gaps = successful.slice(1).map((row, index) => daysBetween(successful[index].parsedDate, row.parsedDate));
  const activeMonths = new Set(successful.filter((row) => inLastDays(row.parsedDate, 180)).map((row) => monthKey(row.parsedDate)));
  const attempts = rows.length;

  return {
    rechargeCount90d: recentSuccessful.length,
    avgRechargeGapDays: mean(gaps),
    rechargeGapStd: stdDev(gaps),
    rechargeAmountCv: coefficientOfVariation(successful.map((row) => row.amount)),
    successfulRechargeRatio: attempts ? successful.length / attempts : 0,
    activeRechargeMonths6m: activeMonths.size,
    smallEmergencyRechargeRatio: successful.length
      ? successful.filter((row) => row.amount <= 100).length / successful.length
      : 0,
  };
};

const getUtilityFeatures = (rows) => {
  const normalized = rows.map((row) => ({
    ...row,
    dueDate: parseDate(row.due_date),
    paidDate: parseDate(row.paid_date),
    amountDue: toNumber(row.amount_due),
    amountPaid: toNumber(row.amount_paid),
  }));

  const paidOrPartial = normalized.filter((row) => row.status === "PAID" || row.status === "PARTIAL");
  const delays = paidOrPartial.map((row) => Math.max(0, daysBetween(row.dueDate, row.paidDate)));
  const onTime = paidOrPartial.filter((row) => row.paidDate && row.paidDate <= row.dueDate);
  const utilityMonths = new Set(normalized.map((row) => row.bill_month));

  return {
    utilityOnTimeRatio: paidOrPartial.length ? onTime.length / paidOrPartial.length : 0,
    avgPaymentDelayDays: mean(delays),
    maxPaymentDelayDays: delays.length ? Math.max(...delays) : 0,
    missedUtilityPaymentCount: normalized.filter((row) => row.status === "MISSED").length,
    partialPaymentRatio: normalized.length
      ? normalized.filter((row) => row.status === "PARTIAL" || row.amountPaid < row.amountDue).length / normalized.length
      : 0,
    utilityAmountCv: coefficientOfVariation(normalized.map((row) => row.amountDue)),
    utilityPaymentCoverage6m: utilityMonths.size,
  };
};

const getEcommerceFeatures = (rows, monthlyIncome) => {
  const normalized = rows.map((row) => ({
    ...row,
    parsedDate: parseDate(row.date),
    amount: toNumber(row.amount),
    isReturned: row.is_returned === "true",
    isRefunded: row.is_refunded === "true",
  }));
  const recentRows = normalized.filter((row) => inLastDays(row.parsedDate, 180));
  const recent90Rows = normalized.filter((row) => inLastDays(row.parsedDate, 90));
  const successful = recentRows.filter((row) => row.status === "COMPLETED");
  const discretionaryCategories = new Set(["Fashion", "Electronics", "Entertainment", "Beauty", "Luxury", "Food"]);
  const totalSpend = successful.reduce((sum, row) => sum + row.amount, 0);
  const discretionarySpend = successful
    .filter((row) => discretionaryCategories.has(row.category))
    .reduce((sum, row) => sum + row.amount, 0);

  return {
    ecommerceSpendToIncomeRatio: monthlyIncome ? totalSpend / 6 / monthlyIncome : 0,
    ecommerceOrderCount90d: recent90Rows.length,
    ecommerceAmountCv: coefficientOfVariation(successful.map((row) => row.amount)),
    returnRefundRatio: recentRows.length
      ? recentRows.filter((row) => row.isReturned || row.isRefunded || row.status === "RETURNED").length / recentRows.length
      : 0,
    cancellationRatio: recentRows.length
      ? recentRows.filter((row) => row.status === "CANCELLED").length / recentRows.length
      : 0,
    codRatio: recentRows.length ? recentRows.filter((row) => row.payment_mode === "COD").length / recentRows.length : 0,
    discretionarySpendRatio: monthlyIncome ? discretionarySpend / 6 / monthlyIncome : 0,
    highTicketPurchaseCount: monthlyIncome
      ? successful.filter((row) => row.amount >= monthlyIncome * 0.25).length
      : 0,
  };
};

const getCrossSignalFeatures = (recharges, utilities, ecommerce) => {
  const months = new Set();
  recharges.forEach((row) => {
    const date = parseDate(row.date);
    if (date) months.add(monthKey(date));
  });
  utilities.forEach((row) => months.add(row.bill_month));
  ecommerce.forEach((row) => {
    const date = parseDate(row.date);
    if (date) months.add(monthKey(date));
  });

  const ecommerceMonthlySpend = ecommerce.reduce((result, row) => {
    const date = parseDate(row.date);
    if (!date || row.status !== "COMPLETED") return result;
    const key = monthKey(date);
    result[key] = (result[key] || 0) + toNumber(row.amount);
    return result;
  }, {});

  return {
    observedMonths: months.size,
    monthlySpendVolatility: coefficientOfVariation(Object.values(ecommerceMonthlySpend)),
  };
};

const buildFactor = ({ key, label, value, displayValue, score, weight, positiveText, negativeText }) => {
  const contribution = (score - 0.5) * weight * 600;
  return {
    key,
    label,
    value,
    displayValue,
    score: Number(score.toFixed(3)),
    contribution: Number(contribution.toFixed(1)),
    importancePercentage: Number((weight * 100).toFixed(1)),
    isPositive: score >= 0.6,
    description: score >= 0.6 ? positiveText : negativeText,
  };
};

const getScoreBands = (score) => {
  if (score >= 740) return { riskLevel: "LOW", band: "Strong", message: "Low credit risk based on stable digital behavior." };
  if (score >= 620) return { riskLevel: "MEDIUM", band: "Watchful", message: "Medium credit risk with clear improvement levers." };
  return { riskLevel: "HIGH", band: "Needs work", message: "High credit risk due to inconsistent or incomplete digital signals." };
};

const getRecommendations = (features, categoryScores) => {
  const recommendations = [];

  if (features.utilityOnTimeRatio < 0.85 || features.avgPaymentDelayDays > 3) {
    recommendations.push({
      title: "Pay utility bills before the due date",
      description: "Three consecutive on-time bill payments can lift the utility regularity signal.",
      priority: "HIGH",
      estimatedImpact: "+25 to +45 score points",
    });
  }

  if (features.missedUtilityPaymentCount > 0 || features.partialPaymentRatio > 0.15) {
    recommendations.push({
      title: "Avoid missed or partial utility payments",
      description: "Set reminders or autopay for electricity/water bills to reduce missed-payment flags.",
      priority: "HIGH",
      estimatedImpact: "+20 to +40 score points",
    });
  }

  if (features.rechargeGapStd > 10 || features.activeRechargeMonths6m < 5) {
    recommendations.push({
      title: "Keep mobile recharges predictable",
      description: "A stable monthly recharge pattern shows continuity and reliable digital activity.",
      priority: "MEDIUM",
      estimatedImpact: "+10 to +25 score points",
    });
  }

  if (features.returnRefundRatio > 0.15 || features.cancellationRatio > 0.1) {
    recommendations.push({
      title: "Reduce avoidable returns and cancellations",
      description: "Frequent returns or cancellations can look like unstable transaction behavior.",
      priority: "MEDIUM",
      estimatedImpact: "+10 to +20 score points",
    });
  }

  if (features.discretionarySpendRatio > 0.18 || features.ecommerceSpendToIncomeRatio > 0.25) {
    recommendations.push({
      title: "Cap discretionary e-commerce spends",
      description: "Keep non-essential online purchases below a planned monthly limit.",
      priority: "MEDIUM",
      estimatedImpact: "+10 to +25 score points",
    });
  }

  if (categoryScores.cashflowStrength < 0.55) {
    recommendations.push({
      title: "Build a small emergency buffer",
      description: "Aim for one month of expenses first, then gradually move toward three months.",
      priority: "HIGH",
      estimatedImpact: "+20 to +35 score points",
    });
  }

  if (categoryScores.dataCompleteness < 0.8) {
    recommendations.push({
      title: "Share at least six months of consented history",
      description: "More complete recharge, utility, and transaction data improves score confidence.",
      priority: "LOW",
      estimatedImpact: "+5 to +15 score points",
    });
  }

  return recommendations.slice(0, 3);
};

const scoreUser = (userId) => {
  const rawData = getRawData();
  const user = rawData.users.find((profile) => profile.user_id === userId);

  if (!user) {
    return null;
  }

  const monthlyIncome = toNumber(user.monthly_income);
  const monthlySavings = toNumber(user.monthly_savings);
  const emergencyFund = toNumber(user.emergency_fund);
  const currentInvestments = toNumber(user.current_investments);
  const userRecharges = rawData.recharges.filter((row) => row.user_id === userId);
  const userUtilities = rawData.utilities.filter((row) => row.user_id === userId);
  const userEcommerce = rawData.ecommerce.filter((row) => row.user_id === userId);

  const features = {
    ...getRechargeFeatures(userRecharges),
    ...getUtilityFeatures(userUtilities),
    ...getEcommerceFeatures(userEcommerce, monthlyIncome),
    ...getCrossSignalFeatures(userRecharges, userUtilities, userEcommerce),
  };

  features.savingsRatio = monthlyIncome ? monthlySavings / monthlyIncome : 0;
  features.emergencyFundMonths = monthlyIncome ? emergencyFund / monthlyIncome : 0;
  features.currentInvestmentRatio = monthlyIncome ? currentInvestments / monthlyIncome : 0;
  features.dataCompletenessScore = mean([
    clamp(features.activeRechargeMonths6m / 6),
    clamp(features.utilityPaymentCoverage6m / 6),
    clamp(features.observedMonths / 6),
  ]);

  const categoryScores = {
    utilityRegularity: clamp(
      features.utilityOnTimeRatio * 0.5 +
        scoreLowIsGood(features.avgPaymentDelayDays, 0, 18) * 0.25 +
        scoreLowIsGood(features.missedUtilityPaymentCount, 0, 3) * 0.15 +
        scoreLowIsGood(features.partialPaymentRatio, 0, 0.5) * 0.1
    ),
    rechargeConsistency: clamp(
      clamp(features.activeRechargeMonths6m / 6) * 0.35 +
        features.successfulRechargeRatio * 0.25 +
        scoreLowIsGood(features.rechargeGapStd, 0, 25) * 0.2 +
        scoreLowIsGood(features.rechargeAmountCv, 0, 1) * 0.2
    ),
    ecommerceDiscipline: clamp(
      scoreLowIsGood(features.ecommerceSpendToIncomeRatio, 0.05, 0.45) * 0.25 +
        scoreLowIsGood(features.returnRefundRatio, 0, 0.35) * 0.25 +
        scoreLowIsGood(features.cancellationRatio, 0, 0.25) * 0.2 +
        scoreLowIsGood(features.discretionarySpendRatio, 0.05, 0.35) * 0.15 +
        scoreLowIsGood(features.monthlySpendVolatility, 0, 1) * 0.15
    ),
    cashflowStrength: clamp(
      scoreHighIsGood(features.savingsRatio, 0.03, 0.35) * 0.5 +
        scoreHighIsGood(features.emergencyFundMonths, 0.25, 3) * 0.3 +
        scoreHighIsGood(features.currentInvestmentRatio, 0, 2) * 0.2
    ),
    dataCompleteness: clamp(features.dataCompletenessScore),
  };

  const categoryContributions = Object.entries(categoryScores).reduce((result, [key, value]) => {
    result[key] = Number((value * FEATURE_WEIGHTS[key] * 600).toFixed(1));
    return result;
  }, {});

  const score = Math.round(300 + Object.values(categoryContributions).reduce((sum, value) => sum + value, 0));
  const scoreBand = getScoreBands(score);

  const factors = [
    buildFactor({
      key: "utilityOnTimeRatio",
      label: "Utility on-time ratio",
      value: features.utilityOnTimeRatio,
      displayValue: `${Math.round(features.utilityOnTimeRatio * 100)}%`,
      score: features.utilityOnTimeRatio,
      weight: 0.18,
      positiveText: "Utility payments are mostly on time, improving repayment confidence.",
      negativeText: "Utility payment delays reduce repayment confidence.",
    }),
    buildFactor({
      key: "avgPaymentDelayDays",
      label: "Average utility delay",
      value: features.avgPaymentDelayDays,
      displayValue: `${features.avgPaymentDelayDays.toFixed(1)} days`,
      score: scoreLowIsGood(features.avgPaymentDelayDays, 0, 18),
      weight: 0.12,
      positiveText: "Utility bills are cleared with little or no delay.",
      negativeText: "Average utility delay is high and needs attention.",
    }),
    buildFactor({
      key: "rechargeConsistency",
      label: "Recharge consistency",
      value: categoryScores.rechargeConsistency,
      displayValue: `${Math.round(categoryScores.rechargeConsistency * 100)}%`,
      score: categoryScores.rechargeConsistency,
      weight: 0.2,
      positiveText: "Mobile recharge pattern is regular across recent months.",
      negativeText: "Recharge pattern is irregular or has failed attempts.",
    }),
    buildFactor({
      key: "ecommerceDiscipline",
      label: "E-commerce discipline",
      value: categoryScores.ecommerceDiscipline,
      displayValue: `${Math.round(categoryScores.ecommerceDiscipline * 100)}%`,
      score: categoryScores.ecommerceDiscipline,
      weight: 0.2,
      positiveText: "Online spending looks stable relative to income.",
      negativeText: "Online spending, returns, or cancellations create instability.",
    }),
    buildFactor({
      key: "cashflowStrength",
      label: "Savings and buffer",
      value: categoryScores.cashflowStrength,
      displayValue: `${Math.round(categoryScores.cashflowStrength * 100)}%`,
      score: categoryScores.cashflowStrength,
      weight: 0.2,
      positiveText: "Savings and emergency funds strengthen the profile.",
      negativeText: "Low savings or emergency buffer weakens the profile.",
    }),
    buildFactor({
      key: "dataCompleteness",
      label: "Data completeness",
      value: categoryScores.dataCompleteness,
      displayValue: `${Math.round(categoryScores.dataCompleteness * 100)}%`,
      score: categoryScores.dataCompleteness,
      weight: 0.1,
      positiveText: "Enough consent-style history is available for a confident score.",
      negativeText: "Limited history lowers score confidence.",
    }),
  ];

  const topFactors = factors
    .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
    .slice(0, 3)
    .map((factor, index) => ({ ...factor, rank: index + 1 }));

  return {
    user: {
      id: user.user_id,
      fullName: user.full_name,
      city: user.city,
      cityTier: user.city_tier,
      occupation: user.occupation,
      monthlyIncome,
      monthlySavings,
      emergencyFund,
      currentInvestments,
      dependents: toNumber(user.dependents),
      sourceType: user.source_type,
    },
    score,
    estimatedCreditScore: score,
    financialHealthScore: Math.round(((score - 300) / 600) * 100),
    confidenceScore: Math.round(features.dataCompletenessScore * 100),
    riskLevel: scoreBand.riskLevel,
    band: scoreBand.band,
    summary: scoreBand.message,
    features,
    categoryScores,
    categoryContributions,
    topFactors,
    recommendations: getRecommendations(features, categoryScores),
    disclaimer:
      "For educational purposes only. This is not regulated financial advice, credit approval, or an investment recommendation from a licensed advisor.",
  };
};

const getAssessments = () => getRawData().users.map((user) => scoreUser(user.user_id));

const getProfiles = () =>
  getAssessments().map((assessment) => ({
    ...assessment.user,
    score: assessment.score,
    riskLevel: assessment.riskLevel,
    band: assessment.band,
    confidenceScore: assessment.confidenceScore,
    topReason: assessment.topFactors[0]?.description || "No explanation available.",
  }));

const getSummary = () => {
  const assessments = getAssessments();
  const buckets = assessments.reduce(
    (result, assessment) => {
      result[assessment.riskLevel] += 1;
      return result;
    },
    { LOW: 0, MEDIUM: 0, HIGH: 0 }
  );

  return {
    totalProfiles: assessments.length,
    buckets,
    averageScore: Math.round(mean(assessments.map((assessment) => assessment.score))),
    source: "Synthetic CSVs modeled after consented mobile recharge, utility, and e-commerce behavior.",
  };
};

module.exports = {
  getProfiles,
  getSummary,
  scoreUser,
  getAssessments,
};
