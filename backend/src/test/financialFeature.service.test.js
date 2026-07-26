const test = require("node:test");
const assert = require("node:assert/strict");

const financialFeatureService = require("../services/financialFeature.service");

const findFeature = (features, featureName) => {
  const feature = features.find((item) => item.featureName === featureName);
  assert.ok(feature, `Expected feature ${featureName}`);
  return feature;
};

test("calculates granular financial behavior features", () => {
  const windowStart = new Date("2026-01-01T00:00:00.000Z");
  const windowEnd = new Date("2026-07-01T00:00:00.000Z");
  const dataset = {
    profile: {
      monthlyIncome: 60000,
      monthlyExpenses: 200,
      incomeFrequency: "MONTHLY",
      savingsHabit: "REGULAR",
      emergencyFund: 120000,
      existingInvestments: 10000,
    },
    snapshots: [],
    transactions: [
      ...[
        ["2026-01-01T09:00:00.000Z", 60000],
        ["2026-02-03T09:00:00.000Z", 60000],
        ["2026-03-01T09:00:00.000Z", 60000],
        ["2026-04-02T09:00:00.000Z", 60000],
        ["2026-05-01T09:00:00.000Z", 60000],
        ["2026-06-01T09:00:00.000Z", 60000],
      ].map(([transactionDate, amount], index) => ({
        id: `income-${index}`,
        amount,
        transactionType: "INCOME",
        paymentMethod: "BANK_TRANSFER",
        merchant: "Employer",
        description: "Salary",
        transactionDate,
      })),
      ...[
        ["2026-01-10T12:00:00.000Z", 100, "Grocer A"],
        ["2026-02-10T23:00:00.000Z", 100, "Grocer B"],
        ["2026-03-10T12:00:00.000Z", 100, "Grocer B"],
        ["2026-04-10T12:00:00.000Z", 300, "Grocer C"],
        ["2026-05-10T23:30:00.000Z", 300, "Grocer D"],
        ["2026-06-10T12:00:00.000Z", 300, "Grocer D"],
      ].map(([transactionDate, amount, merchant], index) => ({
        id: `expense-${index}`,
        amount,
        transactionType: "EXPENSE",
        paymentMethod: "UPI",
        merchant,
        description: "grocery",
        category: { name: "Grocery" },
        transactionDate,
      })),
    ],
    utilityBills: [
      { amountDue: 100, billMonth: "2026-01", dueDate: "2026-01-20T00:00:00.000Z", status: "PAID", paymentDelayDays: 0, utilityType: "ELECTRICITY" },
      { amountDue: 200, billMonth: "2026-02", dueDate: "2026-02-20T00:00:00.000Z", status: "PAID", paymentDelayDays: 0, utilityType: "ELECTRICITY" },
      { amountDue: 100, billMonth: "2026-03", dueDate: "2026-03-20T00:00:00.000Z", status: "PAID", paymentDelayDays: 0, utilityType: "ELECTRICITY" },
    ],
    mobileRecharges: [
      { amount: 100, rechargeDate: "2026-01-05T00:00:00.000Z", status: "SUCCESS", provider: "JIO" },
      { amount: 100, rechargeDate: "2026-02-05T00:00:00.000Z", status: "SUCCESS", provider: "JIO" },
      { amount: 150, rechargeDate: "2026-04-05T00:00:00.000Z", status: "SUCCESS", provider: "JIO" },
      { amount: 150, rechargeDate: "2026-06-05T00:00:00.000Z", status: "SUCCESS", provider: "JIO" },
    ],
    ecommerceOrders: [],
    goals: [],
  };

  const features = financialFeatureService._buildFeatures({
    dataset,
    validationIssues: [],
    qualityScore: 100,
    version: "feature-engine-v2",
    window: "6M",
    windowStart,
    windowEnd,
  });

  assert.equal(findFeature(features, "salary_delay_days").rawValue, 0.5);
  assert.equal(Math.round(findFeature(features, "night_spending_ratio").rawValue), 33);
  assert.equal(findFeature(features, "spending_drift").rawValue, 200);
  assert.equal(findFeature(features, "savings_streak").rawValue, 6);
  assert.equal(findFeature(features, "recharge_growth").rawValue, 50);
  assert.equal(Math.round(findFeature(features, "merchant_switching_frequency").rawValue), 60);
  assert.ok(findFeature(features, "income_seasonality").rawValue >= 0);
  assert.ok(findFeature(features, "utility_seasonality").rawValue > 0);
});

test("uses population benchmarks for configured feature percentiles", () => {
  const feature = financialFeatureService._feature({
    featureName: "night_spending_ratio",
    featureGroup: "Expense",
    rawValue: 33,
    definition: "Night spending share.",
    formula: "night expenses / total expenses",
    dependencies: ["Transaction.transactionDate"],
    dataType: "RATIO",
    window: "6M",
    version: "feature-engine-v2",
    qualityScore: 100,
    confidence: 100,
    source: {},
    normalization: { min: 0, max: 60, direction: "low" },
  });

  assert.equal(
    feature.metadata.percentileBenchmark.name,
    "CreditMiners synthetic population benchmark v1"
  );
  assert.notEqual(feature.percentile, 45);
  assert.equal(feature.normalizedValue, Number((feature.percentile / 100).toFixed(6)));
});

test("documents the complete financial feature catalog", () => {
  const documentation = financialFeatureService.getFeatureDocumentation();
  const documentedNames = documentation.groups.flatMap((group) =>
    group.features.map((feature) => feature.featureName)
  );

  assert.equal(documentation.status, "Implemented");
  assert.ok(documentation.featureCount >= 50);
  assert.ok(documentedNames.includes("salary_delay_days"));
  assert.ok(documentedNames.includes("utility_seasonality"));
  assert.ok(documentedNames.includes("merchant_switching_frequency"));
});
