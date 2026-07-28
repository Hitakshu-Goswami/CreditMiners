const {
  EXPLANATION_VERSION,
  FEATURE_ACTIONS,
  FEATURE_FAMILIES,
} = require("../constants/phase9.constants");

const toNumber = (value) => {
  if (value === null || value === undefined) return 0;
  return Number(value);
};

const round = (value, places = 2) => {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(places));
};

const humanize = (value = "") =>
  value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const strengthFrom = (normalizedValue, contribution = 0) => {
  const distance = Math.max(
    Math.abs(toNumber(normalizedValue) - 0.5),
    Math.abs(toNumber(contribution)) / 20
  );

  if (distance >= 0.3) return "HIGH";
  if (distance >= 0.15) return "MEDIUM";
  return "LOW";
};

const directionFrom = (feature) => {
  const metadataDirection =
    feature.metadata?.percentileBenchmark?.direction ||
    feature.metadata?.benchmarkDirection;

  const normalizedValue = toNumber(feature.normalizedValue);
  const highIsGood = metadataDirection !== "low";
  const positive = highIsGood
    ? normalizedValue >= 0.5
    : normalizedValue < 0.5;

  return positive ? "POSITIVE" : "NEGATIVE";
};

const reasonFor = (feature, direction) => {
  const name = feature.featureName;
  const value = round(toNumber(feature.rawValue));

  const reasons = {
    income_stability_score:
      direction === "POSITIVE"
        ? "Income patterns appear steady across the selected window."
        : "Income patterns look less predictable in the selected window.",
    expense_income_ratio:
      direction === "POSITIVE"
        ? "Monthly expenses are staying within a manageable share of income."
        : `Expenses are using about ${value}% of income, reducing room for savings or repayments.`,
    spending_stability_score:
      direction === "POSITIVE"
        ? "Spending is relatively stable from month to month."
        : "Spending varies enough to make monthly planning harder.",
    spending_drift:
      direction === "POSITIVE"
        ? "Recent spending is not rising faster than earlier months."
        : "Recent spending is rising faster than earlier months.",
    savings_ratio:
      direction === "POSITIVE"
        ? `Savings are around ${value}% of income, which supports financial resilience.`
        : `Savings are around ${value}% of income, leaving limited buffer for surprises.`,
    savings_streak:
      direction === "POSITIVE"
        ? "Recent months show a positive savings streak."
        : "The recent savings streak is short or inconsistent.",
    emergency_fund_ratio:
      direction === "POSITIVE"
        ? "Emergency fund coverage is helping reduce financial stress."
        : "Emergency fund coverage is still below a comfortable buffer.",
    monthly_cash_flow:
      direction === "POSITIVE"
        ? "Monthly cash flow is positive after regular expenses."
        : "Monthly cash flow is tight or negative after regular expenses.",
    cash_flow_stability_score:
      direction === "POSITIVE"
        ? "Cash flow looks steady across the selected window."
        : "Cash flow has enough movement to reduce confidence.",
    utility_reliability_score:
      direction === "POSITIVE"
        ? "Utility payments have been reliable in the selected window."
        : "Utility payment reliability is weaker than expected.",
    recharge_reliability_score:
      direction === "POSITIVE"
        ? "Recharge behavior is regular and successful enough to support digital continuity."
        : "Recharge timing or success patterns are less predictable.",
    digital_payment_score:
      direction === "POSITIVE"
        ? "Traceable digital payment behavior is visible in the data."
        : "There is limited digital payment history available for this window.",
    merchant_diversity_score:
      direction === "POSITIVE"
        ? "Spending is distributed across a healthy variety of merchants."
        : "Spending appears concentrated in a small set of merchants.",
    investment_capacity_score:
      direction === "POSITIVE"
        ? "Current cash-flow signals suggest some capacity for education-first micro-investing."
        : "Bills, expenses, or savings buffers currently limit investment capacity.",
    financial_discipline_score:
      direction === "POSITIVE"
        ? "Savings, spending, and payment signals combine into a stronger discipline pattern."
        : "Savings, spending, and payment signals show room for steadier habits.",
    credit_readiness_score:
      direction === "POSITIVE"
        ? "Financial behavior signals are supporting credit readiness."
        : "Credit readiness is being held back by one or more financial behavior signals.",
    financial_health_feature_score:
      direction === "POSITIVE"
        ? "The overall financial feature profile is moving in a healthy direction."
        : "The overall financial feature profile needs more stable supporting signals.",
  };

  return reasons[name] || `${humanize(name)} is a ${direction.toLowerCase()} signal in the current feature window.`;
};

class ExplanationMapperService {
  mapFeature(feature, options = {}) {
    const contribution = toNumber(options.contribution);
    const direction = options.direction || directionFrom(feature);

    return {
      featureId: feature.id || null,
      featureName: feature.featureName,
      featureLabel: humanize(feature.featureName),
      featureFamily:
        FEATURE_FAMILIES[feature.featureName] ||
        humanize(feature.featureGroup || "Financial behavior"),
      rawValue: round(toNumber(feature.rawValue), 4),
      normalizedValue: round(toNumber(feature.normalizedValue), 6),
      percentile: round(toNumber(feature.percentile), 2),
      bucket: feature.bucket || null,
      dataType: feature.dataType || null,
      contributionDirection: direction,
      contributionStrength: strengthFrom(feature.normalizedValue, contribution),
      contribution,
      reason: reasonFor(feature, direction),
      confidence: round(toNumber(feature.confidence) / 100, 4),
      sourceWindow: feature.window || options.sourceWindow || null,
      suggestedUserAction: FEATURE_ACTIONS[feature.featureName] || null,
      source: feature.source || null,
      definition: feature.definition || null,
      explanationVersion: EXPLANATION_VERSION,
    };
  }

  mapFeatures(features = [], contributionMap = new Map()) {
    return features.map((feature) => {
      const contribution = contributionMap.get(feature.featureName);
      return this.mapFeature(feature, {
        contribution: contribution?.impactPoints || contribution?.impact || 0,
        direction: contribution?.direction,
      });
    });
  }

  mapAssessmentFactor(factor) {
    const isPositive = factor.isPositive || toNumber(factor.impactScore) >= 0;

    return {
      factorId: factor.id || null,
      featureName: factor.factorName,
      featureLabel: humanize(factor.factorName),
      featureFamily:
        FEATURE_FAMILIES[factor.factorName] ||
        "Credit readiness",
      rawValue: factor.featureValue || null,
      contributionDirection: isPositive ? "POSITIVE" : "NEGATIVE",
      contributionStrength: strengthFrom(0.5, toNumber(factor.impactScore)),
      contribution: round(toNumber(factor.impactScore), 4),
      importancePercentage: round(toNumber(factor.importancePercentage), 2),
      reason:
        factor.description ||
        `${humanize(factor.factorName)} ${isPositive ? "supports" : "limits"} the current credit likelihood estimate.`,
      confidence: null,
      sourceWindow: null,
      suggestedUserAction: FEATURE_ACTIONS[factor.factorName] || null,
      explanationVersion: EXPLANATION_VERSION,
    };
  }
}

module.exports = new ExplanationMapperService();
