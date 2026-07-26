const test = require("node:test");
const assert = require("node:assert/strict");

const aiCreditService = require("../services/aiCredit.service");

const feature = (featureName, rawValue, normalizedValue = rawValue / 100) => ({
  featureName,
  rawValue,
  normalizedValue,
  window: "6M",
  version: "feature-engine-v2",
  qualityScore: 90,
});

const coreFeatures = [
  feature("expense_income_ratio", 45, 0.55),
  feature("savings_ratio", 22, 0.7),
  feature("income_stability_score", 82, 0.82),
  feature("utility_reliability_score", 95, 0.95),
  feature("recharge_reliability_score", 88, 0.88),
  feature("monthly_cash_flow", 15000, 0.65),
  feature("digital_payment_score", 76, 0.76),
  feature("spending_stability_score", 80, 0.8),
  feature("merchant_diversity_score", 70, 0.7),
  feature("financial_discipline_score", 84, 0.84),
];

test("validates feature readiness before credit inference", () => {
  const report = aiCreditService._validateFeatureReadiness({
    run: {
      id: "run-1",
      version: "feature-engine-v2",
      computedAt: new Date(),
      qualityScore: 90,
    },
    features: [
      ...coreFeatures,
      feature("night_spending_ratio", 10, 1.4),
      feature("night_spending_ratio", 12, 0.6),
    ],
  });

  assert.equal(report.ready, false);
  assert.equal(report.outOfRangeCount, 1);
  assert.equal(report.duplicateFeatureCount, 1);
});

test("selects features and generates calibrated explainable score", () => {
  const selected = aiCreditService._selectFeatures([
    ...coreFeatures,
    feature("night_spending_ratio", 8, 0.8),
    feature("luxury_spend_ratio", 12, 0.7),
    feature("savings_streak", 5, 0.75),
  ]);
  const scoring = aiCreditService._scoreFeatureVector(selected);
  const explanation = aiCreditService._buildExplanation(selected, scoring);

  assert.equal(selected.core.length, 10);
  assert.ok(scoring.creditScore >= 300);
  assert.ok(scoring.creditScore <= 860);
  assert.ok(scoring.calibratedProbability >= 0);
  assert.ok(scoring.calibratedProbability <= 1);
  assert.ok(explanation.topPositiveFactors.length > 0);
  assert.ok(explanation.topNegativeFactors.length > 0);
  assert.equal(explanation.productionMethod, "SHAP or LIME over the selected trained model");
});

test("builds multidimensional risk, confidence, and roadmap outputs", () => {
  const featurePayload = {
    run: {
      id: "run-1",
      version: "feature-engine-v2",
      computedAt: new Date(),
      qualityScore: 92,
    },
    features: [
      ...coreFeatures,
      feature("luxury_spend_ratio", 40, 0.2),
      feature("cash_flow_stability_score", 80, 0.8),
      feature("savings_streak", 6, 0.8),
    ],
  };
  const readiness = aiCreditService._validateFeatureReadiness(featurePayload);
  const selected = aiCreditService._selectFeatures(featurePayload.features);
  const scoring = aiCreditService._scoreFeatureVector(selected);
  const risk = aiCreditService._buildRiskAssessment(featurePayload.features, readiness, scoring);
  const confidence = aiCreditService._estimateConfidence(featurePayload, readiness, scoring);
  const explanation = aiCreditService._buildExplanation(selected, scoring);
  const plan = aiCreditService._buildImprovementPlan(explanation, risk);

  assert.equal(readiness.ready, true);
  assert.ok(["LOW", "MEDIUM", "HIGH"].includes(risk.overallRisk));
  assert.ok(confidence.score > 0);
  assert.ok(confidence.reasons.length >= 3);
  assert.ok(plan.length > 0);
  assert.ok(plan.every((item) => ["HIGH", "MEDIUM", "LOW"].includes(item.priority)));
});
