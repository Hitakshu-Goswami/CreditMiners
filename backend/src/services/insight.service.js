const prisma = require("../config/prisma");
const NotFoundError = require("../errors/NotFoundError");
const explanationMapper = require("./explanation-mapper.service");
const {
  EXPLANATION_VERSION,
  INSIGHT_ENGINE_VERSION,
  PHASE9_DISCLAIMER,
} = require("../constants/phase9.constants");

const toNumber = (value) => {
  if (value === null || value === undefined) return 0;
  return Number(value);
};

const round = (value, places = 2) => {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(places));
};

const clamp = (value, min = 0, max = 1) => {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
};

const monthKey = (date) => {
  const parsed = new Date(date);
  return `${parsed.getUTCFullYear()}-${String(parsed.getUTCMonth() + 1).padStart(2, "0")}`;
};

const startOfMonth = (date = new Date()) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));

const humanize = (value = "") =>
  value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const movingAverage = (values, window) => {
  if (!values.length) return 0;
  return round(
    values.slice(Math.max(0, values.length - window)).reduce((sum, value) => sum + value, 0) /
      Math.min(values.length, window),
    2
  );
};

const directionFromDelta = (delta) => {
  if (delta > 0) return "UP";
  if (delta < 0) return "DOWN";
  return "FLAT";
};

class InsightService {
  async getInsightInputContract(userId) {
    const context = await this._loadContext(userId);
    const latestAssessment = context.assessments[0] || null;
    const latestRun = context.latestRun;
    const features = latestRun?.features || [];
    const modelParameters = latestAssessment?.modelParameters || {};

    const confidence = latestAssessment
      ? round(toNumber(latestAssessment.confidenceScore) / 100, 4)
      : round(this._average(features.map((feature) => toNumber(feature.confidence))) / 100, 4);

    return {
      userId,
      sourceType: latestAssessment ? "CREDIT_ASSESSMENT" : "FINANCIAL_FEATURE_RUN",
      sourceId: latestAssessment?.id || latestRun?.id || null,
      modelVersion:
        modelParameters.modelVersion ||
        latestAssessment?.modelVersion?.version ||
        "deterministic-phase-9-synthesis",
      featureVersion:
        modelParameters.featureVersion ||
        latestRun?.version ||
        "feature-engine-unavailable",
      computedAt:
        latestAssessment?.generatedAt ||
        latestRun?.computedAt ||
        new Date(),
      confidence,
      dataCompleteness: round(this._dataCompleteness(context), 4),
      explanationVersion: EXPLANATION_VERSION,
      featureCount: features.length,
      topPositiveFactors: this._topAssessmentFactors(latestAssessment, true),
      topNegativeFactors: this._topAssessmentFactors(latestAssessment, false),
      shapOrLimePayload:
        modelParameters.explanation?.localFactors ||
        modelParameters.explanation ||
        null,
      investmentRecommendationCount: context.investmentRecommendations.length,
      growthProjectionAvailable: Boolean(modelParameters.growthProjection),
      historicalFeatureSnapshots: context.featureRuns.length,
      historicalScoreSnapshots: context.assessments.length,
      status: features.length || latestAssessment ? "VALIDATED" : "PARTIAL_DATA",
      disclaimer: PHASE9_DISCLAIMER,
    };
  }

  async getInsights(userId, query = {}) {
    const context = await this._loadContext(userId);
    const insights = this._generateInsights(context);
    const severity = query.severity ? String(query.severity).toUpperCase() : null;
    const category = query.category ? String(query.category).toLowerCase() : null;

    return {
      engineVersion: INSIGHT_ENGINE_VERSION,
      generatedAt: new Date(),
      disclaimer: PHASE9_DISCLAIMER,
      insights: insights.filter((insight) => {
        if (severity && insight.severity !== severity) return false;
        if (category && insight.category.toLowerCase() !== category) return false;
        return true;
      }),
      sourceTrace: this._sourceTrace(context),
    };
  }

  async getInsightById(userId, insightId) {
    const result = await this.getInsights(userId);
    const insight = result.insights.find((item) => item.id === insightId);

    if (!insight) {
      throw new NotFoundError("Insight not found.");
    }

    return {
      ...insight,
      disclaimer: PHASE9_DISCLAIMER,
    };
  }

  async getFinancialHealthDashboard(userId) {
    const context = await this._loadContext(userId);
    const indicators = this._buildIndicators(context);
    const insights = this._generateInsights(context).slice(0, 6);

    return {
      summary: this._buildHealthSummary(context, indicators),
      indicators,
      sections: this._buildHealthSections(context, indicators),
      improvementOpportunities: insights.filter((insight) =>
        ["Improvement opportunity", "Risk warning", "Spending drift"].includes(insight.type)
      ),
      insightPreview: insights,
      metadata: await this.getInsightInputContract(userId),
      disclaimer: PHASE9_DISCLAIMER,
    };
  }

  async getCreditDashboard(userId) {
    const context = await this._loadContext(userId);
    const latestAssessment = context.assessments[0] || null;
    const previousAssessment = context.assessments[1] || null;
    const contributionMap = this._assessmentContributionMap(latestAssessment);
    const explanations = explanationMapper.mapFeatures(
      context.latestRun?.features || [],
      contributionMap
    );

    const scoreMovement = latestAssessment && previousAssessment
      ? latestAssessment.estimatedCreditScore - previousAssessment.estimatedCreditScore
      : 0;

    return {
      latestCreditLikelihoodScore: latestAssessment?.estimatedCreditScore || null,
      riskBucket: latestAssessment?.riskLevel || "UNKNOWN",
      confidenceScore: latestAssessment
        ? round(toNumber(latestAssessment.confidenceScore) / 100, 4)
        : 0,
      scoreHistory: context.assessments
        .slice()
        .reverse()
        .map((assessment) => ({
          assessmentId: assessment.id,
          score: assessment.estimatedCreditScore,
          riskBucket: assessment.riskLevel,
          confidence: round(toNumber(assessment.confidenceScore) / 100, 4),
          generatedAt: assessment.generatedAt,
        })),
      topPositiveFactors: this._topAssessmentFactors(latestAssessment, true),
      topNegativeFactors: this._topAssessmentFactors(latestAssessment, false),
      scoreMovementSinceLastSnapshot: {
        previousValue: previousAssessment?.estimatedCreditScore || null,
        currentValue: latestAssessment?.estimatedCreditScore || null,
        delta: scoreMovement,
        direction: directionFromDelta(scoreMovement),
      },
      improvementRoadmap: this._buildImprovementRoadmap(context, explanations),
      featureContributionSummary: explanations
        .sort((first, second) => Math.abs(second.contribution) - Math.abs(first.contribution))
        .slice(0, 10),
      boundary:
        "CreditMiners shows an educational credit-likelihood estimate, not a bureau score or lending decision.",
      metadata: await this.getInsightInputContract(userId),
      disclaimer: PHASE9_DISCLAIMER,
    };
  }

  async getTrends(userId) {
    const context = await this._loadContext(userId);
    const families = {
      incomeTrend: ["monthly_income", "income_stability_score"],
      expenseTrend: ["monthly_expenses", "expense_income_ratio"],
      savingsTrend: ["monthly_savings", "savings_ratio"],
      cashFlowTrend: ["monthly_cash_flow", "cash_flow_stability_score"],
      utilityReliabilityTrend: ["utility_reliability_score"],
      rechargeConsistencyTrend: ["recharge_reliability_score", "recharge_growth"],
      digitalPaymentAdoptionTrend: ["digital_payment_score"],
      merchantDiversityTrend: ["merchant_diversity_score", "merchant_concentration"],
      spendingStabilityTrend: ["spending_stability_score", "spending_drift"],
      investmentCapacityTrend: ["investment_capacity_score", "investment_capacity"],
    };

    return {
      generatedAt: new Date(),
      trends: Object.entries(families).map(([family, featureNames]) =>
        this._buildTrendFamily(family, featureNames, context.featureRuns)
      ),
      disclaimer: PHASE9_DISCLAIMER,
    };
  }

  async getTimeline(userId) {
    const context = await this._loadContext(userId);
    const events = [];

    for (let index = context.assessments.length - 1; index >= 0; index -= 1) {
      const assessment = context.assessments[index];
      const previous = context.assessments[index + 1];

      events.push({
        id: `credit-score-generated-${assessment.id}`,
        eventType: "CREDIT_SCORE_GENERATED",
        eventTitle: "Credit likelihood score generated",
        explanation: `CreditMiners generated an educational score of ${assessment.estimatedCreditScore} with ${assessment.riskLevel.toLowerCase()} risk.`,
        relatedFeatureIds: [],
        previousValue: previous?.estimatedCreditScore || null,
        newValue: assessment.estimatedCreditScore,
        impactDirection: previous
          ? directionFromDelta(assessment.estimatedCreditScore - previous.estimatedCreditScore)
          : "FLAT",
        computedAt: assessment.generatedAt,
      });

      if (previous && previous.riskLevel !== assessment.riskLevel) {
        events.push({
          id: `risk-bucket-changed-${assessment.id}`,
          eventType: "RISK_BUCKET_CHANGED",
          eventTitle: "Risk bucket changed",
          explanation: `Risk moved from ${previous.riskLevel.toLowerCase()} to ${assessment.riskLevel.toLowerCase()} in the latest assessment.`,
          relatedFeatureIds: [],
          previousValue: previous.riskLevel,
          newValue: assessment.riskLevel,
          impactDirection: this._riskDirection(previous.riskLevel, assessment.riskLevel),
          computedAt: assessment.generatedAt,
        });
      }
    }

    for (const featureName of [
      "savings_streak",
      "utility_reliability_score",
      "investment_capacity_score",
      "monthly_cash_flow",
    ]) {
      const trend = this._buildTrendFamily(featureName, [featureName], context.featureRuns);
      const latest = trend.chartData[trend.chartData.length - 1];
      const previous = trend.chartData[trend.chartData.length - 2];

      if (!latest) continue;

      events.push({
        id: `${featureName}-${latest.sourceRunId}`,
        eventType: this._eventTypeForFeature(featureName, latest.value, previous?.value),
        eventTitle: humanize(featureName),
        explanation: `${humanize(featureName)} is ${round(latest.value)} with ${trend.trendDirection.toLowerCase()} movement.`,
        relatedFeatureIds: latest.featureId ? [latest.featureId] : [],
        previousValue: previous?.value || null,
        newValue: latest.value,
        impactDirection: trend.trendDirection,
        computedAt: latest.computedAt,
      });
    }

    return {
      generatedAt: new Date(),
      events: events.sort((first, second) => new Date(second.computedAt) - new Date(first.computedAt)),
      disclaimer: PHASE9_DISCLAIMER,
    };
  }

  _generateInsights(context) {
    const latestFeatures = context.latestRun?.features || [];
    const feature = (name) => latestFeatures.find((item) => item.featureName === name);
    const featureValue = (name) => toNumber(feature(name)?.rawValue);
    const featureConfidence = (name) => round(toNumber(feature(name)?.confidence) / 100, 4);
    const deltas = this._featureDeltas(context.featureRuns);
    const insights = [];

    const add = (id, type, title, description, severity, category, featureNames, action, impact) => {
      const supportingFeatures = featureNames
        .map((name) => feature(name))
        .filter(Boolean)
        .map((item) => ({
          featureId: item.id,
          featureName: item.featureName,
          rawValue: round(toNumber(item.rawValue), 4),
          normalizedValue: round(toNumber(item.normalizedValue), 6),
        }));

      insights.push({
        id,
        type,
        title,
        description,
        severity,
        category,
        confidence: round(this._average(featureNames.map(featureConfidence).filter(Boolean)), 4),
        supportingFeatures,
        recommendedAction: action,
        expectedImpactLabel: impact,
        createdAt: new Date(),
        sourceTrace: {
          featureRunId: context.latestRun?.id || null,
          assessmentId: context.assessments[0]?.id || null,
          featureNames,
        },
        disclaimer: PHASE9_DISCLAIMER,
      });
    };

    if (featureValue("savings_ratio") >= 15 || deltas.savings_ratio > 2) {
      add(
        "savings-discipline-improved",
        "Positive habit insight",
        "Savings discipline is supporting financial resilience.",
        "Your savings signal is positive relative to income and helps improve financial readiness.",
        "INFO",
        "Savings behavior",
        ["savings_ratio", "savings_streak"],
        "Keep the savings habit predictable before increasing optional spending.",
        "Improves buffer and confidence"
      );
    }

    if (featureValue("expense_income_ratio") > 70 || featureValue("spending_drift") > 25) {
      add(
        "spending-drift-warning",
        "Spending drift",
        "Discretionary pressure is rising faster than income.",
        "Expense and spending-drift signals show less room for savings, repayments, or unexpected bills.",
        featureValue("expense_income_ratio") > 90 ? "HIGH" : "MEDIUM",
        "Expense discipline",
        ["expense_income_ratio", "spending_drift", "luxury_spend_ratio"],
        "Pick one non-essential category to slow down this month and review recurring charges.",
        "Can improve cash-flow stability"
      );
    }

    if (featureValue("utility_reliability_score") >= 75) {
      add(
        "utility-reliability-helps",
        "Positive habit insight",
        "Utility payment reliability is helping credit readiness.",
        "On-time utility behavior is a clear alternative signal that supports the current profile.",
        "INFO",
        "Utility reliability",
        ["utility_reliability_score"],
        "Maintain the bill-payment streak and keep due-date reminders active.",
        "Supports credit readiness"
      );
    } else if (feature("utility_reliability_score")) {
      add(
        "utility-reliability-opportunity",
        "Improvement opportunity",
        "Utility reliability can become a stronger signal.",
        "The current utility-payment pattern is not yet consistent enough to provide strong support.",
        "MEDIUM",
        "Utility reliability",
        ["utility_reliability_score"],
        "Prioritize the next utility due date before discretionary purchases when possible.",
        "Can strengthen alternative credit evidence"
      );
    }

    if (featureValue("emergency_fund_ratio") < 1 && feature("emergency_fund_ratio")) {
      add(
        "emergency-fund-low",
        "Risk warning",
        "Emergency fund coverage is below a starter buffer.",
        "Available emergency savings appear limited compared with monthly expenses.",
        "MEDIUM",
        "Savings behavior",
        ["emergency_fund_ratio", "monthly_cash_flow"],
        "Build one extra week of expenses first, then work toward one full month.",
        "Reduces financial stress"
      );
    }

    if (featureValue("recharge_reliability_score") < 60 && feature("recharge_reliability_score")) {
      add(
        "recharge-regularity-pattern",
        "Recharge regularity pattern",
        "Recharge behavior has become less predictable.",
        "Recharge timing or success signals are inconsistent, which can reduce digital-continuity confidence.",
        "LOW",
        "Recharge consistency",
        ["recharge_reliability_score", "recharge_growth"],
        "Use a stable plan or reminder if mobile access is important for income and payments.",
        "Improves continuity signal"
      );
    }

    if (featureValue("investment_capacity_score") >= 60) {
      add(
        "investment-capacity-positive",
        "Investment capacity change",
        "Investment capacity is visible, but should remain education-first.",
        "Cash-flow and savings signals suggest some room to learn about micro-investing without treating this as advice.",
        "LOW",
        "Investment capacity",
        ["investment_capacity_score", "monthly_cash_flow", "savings_ratio"],
        "Only consider small learning allocations after bills and emergency savings are protected.",
        "Education-first next step"
      );
    }

    if (!insights.length) {
      add(
        "data-depth-needed",
        "Improvement opportunity",
        "More recent financial signals will improve explanations.",
        "CreditMiners needs richer feature history to generate confident habit insights.",
        "LOW",
        "Data completeness",
        [],
        "Compute financial features after adding recent transactions, bills, and recharge data.",
        "Improves confidence"
      );
    }

    return insights;
  }

  _buildIndicators(context) {
    const latestFeatures = context.latestRun?.features || [];
    const previousRun = context.featureRuns[1] || null;
    const previousFeatures = previousRun?.features || [];

    const map = new Map(latestFeatures.map((feature) => [feature.featureName, feature]));
    const previousMap = new Map(previousFeatures.map((feature) => [feature.featureName, feature]));

    const indicatorDefinitions = [
      ["financialHealthFeatureScore", "Financial Health Feature Score", "financial_health_feature_score"],
      ["financialDisciplineScore", "Financial Discipline Score", "financial_discipline_score"],
      ["spendingStabilityScore", "Spending Stability Score", "spending_stability_score"],
      ["savingsDisciplineScore", "Savings Discipline Score", "savings_ratio"],
      ["utilityReliabilityScore", "Utility Reliability Score", "utility_reliability_score"],
      ["digitalTrustIndex", "Digital Trust Index", "digital_payment_score"],
      ["creditReadinessScore", "Credit Readiness Score", "credit_readiness_score"],
      ["investmentCapacityScore", "Investment Capacity Score", "investment_capacity_score"],
    ];

    return indicatorDefinitions.map(([key, label, featureName]) => {
      const feature = map.get(featureName);
      const previousFeature = previousMap.get(featureName);
      const currentValue = feature ? round(toNumber(feature.rawValue), 2) : null;
      const previousValue = previousFeature ? round(toNumber(previousFeature.rawValue), 2) : null;
      const delta =
        currentValue !== null && previousValue !== null
          ? round(currentValue - previousValue, 2)
          : 0;

      return {
        key,
        label,
        featureName,
        currentValue,
        previousValue,
        directionOfChange: directionFromDelta(delta),
        confidence: feature ? round(toNumber(feature.confidence) / 100, 4) : 0,
        explanation: feature
          ? explanationMapper.mapFeature(feature).reason
          : "This indicator needs a current financial feature run.",
        dataCompleteness: round(this._dataCompleteness(context), 4),
        sourceFeatureId: feature?.id || null,
      };
    });
  }

  _buildHealthSections(context, indicators) {
    const byKey = new Map(indicators.map((indicator) => [indicator.key, indicator]));

    return [
      {
        section: "Income stability",
        explanation: this._featureReason(context, "income_stability_score"),
      },
      {
        section: "Expense behavior",
        explanation: byKey.get("financialDisciplineScore")?.explanation,
      },
      {
        section: "Savings discipline",
        explanation: byKey.get("savingsDisciplineScore")?.explanation,
      },
      {
        section: "Cash flow trend",
        explanation: this._featureReason(context, "cash_flow_stability_score"),
      },
      {
        section: "Utility payment reliability",
        explanation: byKey.get("utilityReliabilityScore")?.explanation,
      },
      {
        section: "Recharge consistency",
        explanation: this._featureReason(context, "recharge_reliability_score"),
      },
      {
        section: "Digital payment behavior",
        explanation: byKey.get("digitalTrustIndex")?.explanation,
      },
      {
        section: "Investment capacity",
        explanation: byKey.get("investmentCapacityScore")?.explanation,
      },
    ];
  }

  _buildHealthSummary(context, indicators) {
    const available = indicators.filter((indicator) => indicator.currentValue !== null);
    const average = this._average(available.map((indicator) => indicator.currentValue));
    const lowConfidence = available.some((indicator) => indicator.confidence < 0.5);

    return {
      title: "Financial health summary",
      currentCompositeValue: round(average, 2),
      confidence: round(this._average(available.map((indicator) => indicator.confidence)), 4),
      dataCompleteness: round(this._dataCompleteness(context), 4),
      explanation: lowConfidence
        ? "The dashboard has useful signals, but some indicators need more complete data before confidence improves."
        : "The dashboard summarizes current financial habits using engineered behavior features.",
    };
  }

  _buildTrendFamily(family, featureNames, featureRuns) {
    const chartData = [];

    for (const run of featureRuns.slice().reverse()) {
      const matching = (run.features || []).filter((feature) =>
        featureNames.includes(feature.featureName)
      );

      if (!matching.length) continue;

      chartData.push({
        month: monthKey(run.computedAt || run.createdAt),
        value: round(this._average(matching.map((feature) => toNumber(feature.rawValue))), 2),
        confidence: round(this._average(matching.map((feature) => toNumber(feature.confidence))) / 100, 4),
        sourceRunId: run.id,
        featureId: matching[0].id,
        computedAt: run.computedAt || run.createdAt,
      });
    }

    const latest = chartData[chartData.length - 1];
    const previous = chartData[chartData.length - 2];
    const monthOverMonthChange = latest && previous
      ? round(latest.value - previous.value, 2)
      : 0;
    const values = chartData.map((item) => item.value);

    return {
      family,
      label: humanize(family),
      featureNames,
      chartData,
      monthOverMonthChange,
      threeMonthMovingAverage: movingAverage(values, 3),
      sixMonthMovingAverage: movingAverage(values, 6),
      trendDirection: directionFromDelta(monthOverMonthChange),
      volatilityFlag: this._volatilityFlag(values),
      confidence: round(this._average(chartData.map((item) => item.confidence)), 4),
    };
  }

  _buildImprovementRoadmap(context, explanations) {
    const assessmentRecommendations =
      context.assessments[0]?.recommendations?.map((item) => ({
        title: item.title,
        description: item.description,
        priority: item.priority,
        estimatedImpact: item.estimatedImpact,
        category: item.category,
        sourceId: item.id,
      })) || [];

    const featureRecommendations = explanations
      .filter((explanation) => explanation.contributionDirection === "NEGATIVE")
      .slice(0, 4)
      .map((explanation) => ({
        title: `Improve ${explanation.featureLabel}`,
        description: explanation.suggestedUserAction || explanation.reason,
        priority: explanation.contributionStrength === "HIGH" ? "HIGH" : "MEDIUM",
        estimatedImpact: "Habit-based improvement signal",
        category: explanation.featureFamily,
        sourceId: explanation.featureId,
      }));

    return [...assessmentRecommendations, ...featureRecommendations].slice(0, 6);
  }

  _featureReason(context, featureName) {
    const feature = context.latestRun?.features?.find((item) => item.featureName === featureName);
    return feature
      ? explanationMapper.mapFeature(feature).reason
      : `${humanize(featureName)} needs a current financial feature run.`;
  }

  _topAssessmentFactors(assessment, positive) {
    if (!assessment) return [];

    const factors = assessment.factors || [];
    return factors
      .filter((factor) => Boolean(factor.isPositive) === positive)
      .sort(
        (first, second) =>
          Math.abs(toNumber(second.impactScore)) - Math.abs(toNumber(first.impactScore))
      )
      .slice(0, 5)
      .map((factor) => explanationMapper.mapAssessmentFactor(factor));
  }

  _assessmentContributionMap(assessment) {
    const contributionMap = new Map();
    const localFactors = assessment?.modelParameters?.explanation?.localFactors || [];

    for (const factor of localFactors) {
      contributionMap.set(factor.featureName, {
        impactPoints: factor.impact,
        direction: factor.direction,
      });
    }

    for (const factor of assessment?.factors || []) {
      contributionMap.set(factor.factorName, {
        impact: toNumber(factor.impactScore),
        direction: factor.isPositive ? "POSITIVE" : "NEGATIVE",
      });
    }

    return contributionMap;
  }

  _featureDeltas(featureRuns) {
    const deltas = {};
    const latest = featureRuns[0]?.features || [];
    const previous = featureRuns[1]?.features || [];
    const previousMap = new Map(previous.map((feature) => [feature.featureName, feature]));

    for (const feature of latest) {
      const previousFeature = previousMap.get(feature.featureName);
      deltas[feature.featureName] = previousFeature
        ? round(toNumber(feature.rawValue) - toNumber(previousFeature.rawValue), 4)
        : 0;
    }

    return deltas;
  }

  _dataCompleteness(context) {
    const latestRunQuality = toNumber(context.latestRun?.qualityScore);
    if (latestRunQuality > 0) return clamp(latestRunQuality / 100);

    const inputSummary = context.latestRun?.inputSummary || {};
    const availableSignals = [
      inputSummary.hasFinancialProfile,
      inputSummary.transactions > 0,
      inputSummary.utilityBills > 0,
      inputSummary.mobileRecharges > 0,
      inputSummary.ecommerceOrders > 0,
      inputSummary.financialGoals > 0,
    ].filter(Boolean).length;

    return clamp(availableSignals / 6);
  }

  _sourceTrace(context) {
    return {
      latestFeatureRunId: context.latestRun?.id || null,
      latestAssessmentId: context.assessments[0]?.id || null,
      featureRunIds: context.featureRuns.map((run) => run.id),
      assessmentIds: context.assessments.map((assessment) => assessment.id),
      generatedBy: INSIGHT_ENGINE_VERSION,
    };
  }

  _volatilityFlag(values) {
    if (values.length < 3) return "INSUFFICIENT_HISTORY";
    const average = this._average(values);
    const variance =
      values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length;
    const cv = average ? Math.sqrt(variance) / Math.abs(average) : 0;

    if (cv >= 0.35) return "HIGH";
    if (cv >= 0.18) return "MEDIUM";
    return "LOW";
  }

  _riskDirection(previous, current) {
    const order = { LOW: 3, MEDIUM: 2, HIGH: 1 };
    return directionFromDelta((order[current] || 0) - (order[previous] || 0));
  }

  _eventTypeForFeature(featureName, latestValue, previousValue) {
    if (featureName === "savings_streak") {
      return latestValue > (previousValue || 0)
        ? "SAVINGS_STREAK_STARTED"
        : "SAVINGS_STREAK_BROKEN";
    }

    if (featureName === "utility_reliability_score") {
      return "BILL_PAYMENT_STREAK_IMPROVED";
    }

    if (featureName === "investment_capacity_score") {
      return "INVESTMENT_CAPACITY_CHANGED";
    }

    return latestValue < 0 ? "LARGE_EXPENSE_DETECTED" : "GOAL_MILESTONE_REACHED";
  }

  _average(values) {
    const valid = values.filter((value) => Number.isFinite(value));
    if (!valid.length) return 0;
    return valid.reduce((sum, value) => sum + value, 0) / valid.length;
  }

  async _loadContext(userId) {
    const now = new Date();
    const twelveMonthsAgo = startOfMonth(new Date(Date.UTC(now.getUTCFullYear() - 1, now.getUTCMonth(), 1)));

    const [
      user,
      featureRuns,
      assessments,
      recommendations,
      investmentRecommendations,
      goals,
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, fullName: true, email: true },
      }),
      prisma.financialFeatureRun.findMany({
        where: { userId },
        include: {
          features: {
            orderBy: [{ featureGroup: "asc" }, { featureName: "asc" }],
          },
        },
        orderBy: { computedAt: "desc" },
        take: 12,
      }),
      prisma.creditAssessment.findMany({
        where: { userId },
        include: {
          factors: { orderBy: { displayOrder: "asc" } },
          recommendations: { orderBy: [{ priority: "desc" }, { createdAt: "asc" }] },
          modelVersion: true,
        },
        orderBy: { generatedAt: "desc" },
        take: 12,
      }),
      prisma.financialRecommendation.findMany({
        where: { userId },
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
        take: 20,
      }),
      prisma.investmentRecommendation.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.financialGoal.findMany({
        where: { userId, isArchived: false },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    return {
      user,
      latestRun: featureRuns[0] || null,
      featureRuns,
      assessments,
      recommendations,
      investmentRecommendations,
      goals,
      reportWindowStart: twelveMonthsAgo,
      reportWindowEnd: now,
    };
  }
}

module.exports = new InsightService();
