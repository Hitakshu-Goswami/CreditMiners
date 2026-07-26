const prisma = require("../config/prisma");

const financialFeatureService = require("./financialFeature.service");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

const CREDIT_MODEL_VERSION = "credit-intelligence-v1.0";
const CREDIT_SCORE_VERSION = "score-scale-v1.0";
const SUPPORTED_FEATURE_VERSIONS = ["feature-engine-v2", "feature-engine-v1"];
const FEATURE_STALE_DAYS = 45;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const CORE_FEATURES = [
  "expense_income_ratio",
  "savings_ratio",
  "income_stability_score",
  "utility_reliability_score",
  "recharge_reliability_score",
  "monthly_cash_flow",
  "digital_payment_score",
  "spending_stability_score",
  "merchant_diversity_score",
  "financial_discipline_score",
];

const SECONDARY_FEATURES = [
  "weekend_spending_ratio",
  "repeat_merchant_ratio",
  "night_spending_ratio",
  "merchant_switching_frequency",
  "spending_drift",
  "average_recharge_amount",
  "cash_flow_stability_score",
  "emergency_fund_ratio",
  "luxury_spend_ratio",
  "savings_streak",
  "salary_delay_days",
  "utility_seasonality",
  "recharge_growth",
];

const EXPERIMENTAL_FEATURES = [
  "device_stability",
  "geo_stability",
  "app_engagement",
  "consent_derived_signal",
];

const MODEL_WEIGHTS = {
  expense_income_ratio: -1.15,
  savings_ratio: 0.9,
  income_stability_score: 0.75,
  utility_reliability_score: 0.85,
  recharge_reliability_score: 0.45,
  monthly_cash_flow: 0.55,
  digital_payment_score: 0.35,
  spending_stability_score: 0.55,
  merchant_diversity_score: 0.3,
  financial_discipline_score: 1.25,
  weekend_spending_ratio: -0.2,
  repeat_merchant_ratio: 0.15,
  night_spending_ratio: -0.25,
  merchant_switching_frequency: -0.2,
  spending_drift: -0.35,
  average_recharge_amount: 0.1,
  cash_flow_stability_score: 0.55,
  emergency_fund_ratio: 0.55,
  luxury_spend_ratio: -0.4,
  savings_streak: 0.35,
  salary_delay_days: -0.25,
  utility_seasonality: -0.2,
  recharge_growth: 0.12,
};

const SCORE_ANCHORS = [
  [0.1, 320],
  [0.25, 430],
  [0.4, 560],
  [0.55, 640],
  [0.72, 735],
  [0.9, 860],
];

const clamp = (value, min = 0, max = 1) => {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
};

const round = (value, places = 2) => {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(places));
};

const toNumber = (value) => {
  if (value === null || value === undefined) return 0;
  return Number(value);
};

const sigmoid = (value) => 1 / (1 + Math.exp(-value));

const daysBetween = (first, second) =>
  Math.abs((new Date(second) - new Date(first)) / MS_PER_DAY);

const humanizeFeature = (featureName) =>
  featureName
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

class AICreditService {
  async generateCreditScore(userId, options = {}) {
    const featurePayload = await this._loadLatestFeaturePayload(userId, options);
    const readinessReport = this._validateFeatureReadiness(featurePayload);

    if (!readinessReport.ready) {
      throw new BadRequestError(
        `Feature readiness failed: ${readinessReport.blockers.join("; ")}`
      );
    }

    const selectedFeatures = this._selectFeatures(featurePayload.features);
    const scoring = this._scoreFeatureVector(selectedFeatures);
    const risk = this._buildRiskAssessment(featurePayload.features, readinessReport, scoring);
    const confidence = this._estimateConfidence(featurePayload, readinessReport, scoring);
    const explanation = this._buildExplanation(selectedFeatures, scoring);
    const narrative = this._buildNarrative(scoring, risk, explanation);
    const improvementPlan = this._buildImprovementPlan(explanation, risk);
    const modelVersion = await this._ensureModelVersion();
    const snapshot = await this._ensureAssessmentSnapshot(userId, featurePayload.features);

    const assessment = await prisma.$transaction(async (tx) => {
      const created = await tx.creditAssessment.create({
        data: {
          userId,
          snapshotId: snapshot.id,
          modelVersionId: modelVersion.id,
          financialHealthScore: scoring.creditScore,
          estimatedCreditScore: scoring.creditScore,
          confidenceScore: round(confidence.score * 100),
          riskLevel: risk.overallRisk,
          assessmentType: options.assessmentType || "ON_DEMAND",
          explainabilityScore: explanation.explainabilityScore,
          summary: narrative.summary,
          modelParameters: {
            scoreVersion: CREDIT_SCORE_VERSION,
            modelVersion: CREDIT_MODEL_VERSION,
            featureVersion: featurePayload.run.version,
            featureRunId: featurePayload.run.id,
            rawProbability: scoring.rawProbability,
            calibratedProbability: scoring.calibratedProbability,
            creditLikelihood: scoring.creditLikelihood,
            readinessReport,
            selectedFeatures: selectedFeatures.summary,
            risk,
            confidence,
            explanation,
            narrative,
            improvementPlan,
            modelRegistry: this._modelRegistryMetadata(),
          },
        },
      });

      await tx.assessmentFactor.createMany({
        data: explanation.localFactors.map((factor, index) => ({
          assessmentId: created.id,
          factorName: factor.feature,
          featureValue: String(factor.value),
          description: factor.reason,
          impactScore: factor.impact,
          importancePercentage: factor.importancePercentage,
          isPositive: factor.impact >= 0,
          displayOrder: index + 1,
        })),
      });

      await tx.financialRecommendation.createMany({
        data: improvementPlan.map((item) => ({
          userId,
          assessmentId: created.id,
          title: item.action,
          description: item.reason,
          category: item.category,
          priority: item.priority,
          estimatedImpact: item.expectedImpact,
        })),
      });

      return tx.creditAssessment.findUnique({
        where: { id: created.id },
        include: {
          factors: { orderBy: { displayOrder: "asc" } },
          recommendations: { orderBy: [{ priority: "desc" }, { createdAt: "asc" }] },
          modelVersion: true,
        },
      });
    });

    return this._formatAssessment(assessment);
  }

  async getCreditAssessment(userId, assessmentId) {
    const assessment = await this._findAssessment(userId, assessmentId);
    return this._formatAssessment(assessment);
  }

  async getCreditHistory(userId, query = {}) {
    const limit = Math.min(Number(query.limit || 20), 100);
    const assessments = await prisma.creditAssessment.findMany({
      where: { userId },
      include: {
        factors: { orderBy: { displayOrder: "asc" } },
        recommendations: { orderBy: [{ priority: "desc" }, { createdAt: "asc" }] },
        modelVersion: true,
      },
      orderBy: { generatedAt: "desc" },
      take: limit,
    });

    return {
      assessments: assessments.map((assessment) => this._formatAssessment(assessment)),
      count: assessments.length,
    };
  }

  async getLatestCreditAssessment(userId) {
    const assessment = await prisma.creditAssessment.findFirst({
      where: { userId },
      include: {
        factors: { orderBy: { displayOrder: "asc" } },
        recommendations: { orderBy: [{ priority: "desc" }, { createdAt: "asc" }] },
        modelVersion: true,
      },
      orderBy: { generatedAt: "desc" },
    });

    if (!assessment) {
      throw new NotFoundError("Credit assessment not found.");
    }

    return this._formatAssessment(assessment);
  }

  async getAssessmentSection(userId, section) {
    const assessment = await this.getLatestCreditAssessment(userId);

    if (section === "factors") {
      return {
        assessmentId: assessment.id,
        topPositiveFactors: assessment.topPositiveFactors,
        topNegativeFactors: assessment.topNegativeFactors,
        allFactors: assessment.factors,
      };
    }

    if (section === "improvementPlan") {
      return {
        assessmentId: assessment.id,
        improvementPlan: assessment.improvementPlan,
      };
    }

    if (section === "confidence") {
      return {
        assessmentId: assessment.id,
        confidence: assessment.confidence,
        confidenceReasons: assessment.confidenceReasons,
        dataConfidenceRisk: assessment.riskAssessment.dataConfidenceRisk,
      };
    }

    return {
      assessmentId: assessment.id,
      summary: assessment.summary,
      narrative: assessment.narrative,
      globalExplanation: assessment.globalExplanation,
      localExplanation: assessment.localExplanation,
    };
  }

  async analyzeLoan(userId, loanId) {
    const loan = await prisma.loanRequest.findFirst({
      where: {
        id: loanId,
        borrowerId: userId,
      },
    });

    if (!loan) {
      throw new NotFoundError("Loan request not found.");
    }

    let score = 700;

    if (Number(loan.amount) > 1000000) score -= 40;
    else if (Number(loan.amount) > 500000) score -= 20;

    if (loan.durationMonths > 60) score -= 30;
    else if (loan.durationMonths > 36) score -= 15;

    if (loan.interestRate) {
      const rate = Number(loan.interestRate);

      if (rate <= 10) score += 20;
      else if (rate >= 20) score -= 20;
    }

    const collateral = await prisma.loanMedia.count({
      where: {
        loanId,
        collateralType: {
          not: "NONE",
        },
      },
    });

    if (collateral > 0) {
      score += 35;
    }

    score = Math.max(300, Math.min(score, 850));

    let riskLevel = "LOW";

    if (score < 550) riskLevel = "HIGH";
    else if (score < 700) riskLevel = "MEDIUM";

    const recommendation =
      riskLevel === "LOW"
        ? "Recommended for funding."
        : riskLevel === "MEDIUM"
          ? "Fund with caution."
          : "High investment risk.";

    const summary =
      riskLevel === "LOW"
        ? "Strong financial indicators."
        : riskLevel === "MEDIUM"
          ? "Moderate repayment risk."
          : "Higher probability of repayment issues.";

    const confidence = 0.92;

    const updated = await prisma.loanRequest.update({
      where: {
        id: loanId,
      },
      data: {
        aiCreditScore: score,
        riskLevel,
        aiRecommendation: recommendation,
        aiSummary: summary,
        aiConfidence: confidence,
        aiLastEvaluatedAt: new Date(),
      },
    });

    return {
      score: updated.aiCreditScore,
      riskLevel: updated.riskLevel,
      confidence: updated.aiConfidence,
      recommendation: updated.aiRecommendation,
      summary: updated.aiSummary,
      evaluatedAt: updated.aiLastEvaluatedAt,
    };
  }

  async getAnalysis(userId, loanId) {
    const loan = await prisma.loanRequest.findFirst({
      where: {
        id: loanId,
        borrowerId: userId,
      },
      select: {
        aiCreditScore: true,
        riskLevel: true,
        aiRecommendation: true,
        aiSummary: true,
        aiConfidence: true,
        aiLastEvaluatedAt: true,
      },
    });

    if (!loan) {
      throw new NotFoundError("Loan request not found.");
    }

    return loan;
  }

  async _loadLatestFeaturePayload(userId, options) {
    let run = await prisma.financialFeatureRun.findFirst({
      where: {
        userId,
        ...(options.featureVersion ? { version: options.featureVersion } : {}),
      },
      orderBy: { computedAt: "desc" },
    });

    if (!run && options.computeIfMissing === true) {
      const computed = await financialFeatureService.computeFeatures(userId, {
        windowMonths: options.windowMonths || 6,
        persist: true,
      });
      run = computed.run;
    }

    if (!run) {
      throw new BadRequestError("No Phase 4 feature run found. Compute financial features first.");
    }

    const features = await prisma.financialFeature.findMany({
      where: { userId, runId: run.id },
      orderBy: [{ featureGroup: "asc" }, { featureName: "asc" }],
    });

    return { run, features };
  }

  _validateFeatureReadiness({ run, features }, now = new Date()) {
    const issues = [];
    const blockers = [];
    const featureMap = new Map();
    const duplicateFeatures = [];
    let invalidValueCount = 0;
    let outOfRangeCount = 0;

    for (const feature of features) {
      const rawValue = toNumber(feature.rawValue);
      const normalizedValue = toNumber(feature.normalizedValue);

      if (featureMap.has(feature.featureName)) {
        duplicateFeatures.push(feature.featureName);
      }

      featureMap.set(feature.featureName, feature);

      if (!Number.isFinite(rawValue) || !Number.isFinite(normalizedValue)) {
        invalidValueCount += 1;
      }

      if (normalizedValue < 0 || normalizedValue > 1) {
        outOfRangeCount += 1;
      }
    }

    const missingCoreFeatures = CORE_FEATURES.filter((name) => !featureMap.has(name));
    const windows = new Set(features.map((feature) => feature.window));
    const staleDays = daysBetween(run.computedAt || run.createdAt, now);
    const featureCompleteness = round(
      (CORE_FEATURES.length - missingCoreFeatures.length) / CORE_FEATURES.length,
      4
    );

    if (missingCoreFeatures.length) {
      blockers.push(`Missing core features: ${missingCoreFeatures.join(", ")}`);
    }

    if (invalidValueCount) {
      blockers.push(`${invalidValueCount} features contain invalid numeric values`);
    }

    if (outOfRangeCount) {
      blockers.push(`${outOfRangeCount} normalized values are outside 0..1`);
    }

    if (!SUPPORTED_FEATURE_VERSIONS.includes(run.version)) {
      blockers.push(`Unsupported feature version: ${run.version}`);
    }

    if (features.length === 0) {
      blockers.push("Feature run contains no features");
    }

    if (duplicateFeatures.length) {
      issues.push({
        code: "DUPLICATE_FEATURE_RECORDS",
        severity: "MEDIUM",
        features: [...new Set(duplicateFeatures)],
      });
    }

    if (windows.size > 1) {
      issues.push({
        code: "INCONSISTENT_TIME_WINDOWS",
        severity: "MEDIUM",
        windows: [...windows],
      });
    }

    if (staleDays > FEATURE_STALE_DAYS) {
      issues.push({
        code: "STALE_FEATURE_SNAPSHOT",
        severity: "MEDIUM",
        staleDays: round(staleDays),
      });
    }

    return {
      ready: blockers.length === 0,
      status: blockers.length ? "FAILED" : issues.length ? "READY_WITH_WARNINGS" : "READY",
      blockers,
      issues,
      featureCompleteness,
      missingCoreFeatures,
      duplicateFeatureCount: duplicateFeatures.length,
      invalidValueCount,
      outOfRangeCount,
      staleDays: round(staleDays),
      supportedFeatureVersions: SUPPORTED_FEATURE_VERSIONS,
    };
  }

  _selectFeatures(features) {
    const featureMap = new Map(features.map((feature) => [feature.featureName, feature]));
    const select = (names, category) =>
      names
        .filter((name) => featureMap.has(name))
        .map((name) => ({
          name,
          category,
          feature: featureMap.get(name),
        }));

    const core = select(CORE_FEATURES, "CORE");
    const secondary = select(SECONDARY_FEATURES, "SECONDARY");
    const experimental = select(EXPERIMENTAL_FEATURES, "EXPERIMENTAL");

    return {
      core,
      secondary,
      experimental,
      usable: [...core, ...secondary],
      summary: {
        core: core.map((item) => item.name),
        secondary: secondary.map((item) => item.name),
        experimental: experimental.map((item) => item.name),
      },
    };
  }

  _scoreFeatureVector(selectedFeatures) {
    const contributions = [];
    let logit = -0.15;

    for (const selected of selectedFeatures.usable) {
      const weight = MODEL_WEIGHTS[selected.name] || 0;
      const normalizedValue = toNumber(selected.feature.normalizedValue);
      const centeredValue = normalizedValue - 0.5;
      const contribution = centeredValue * weight;
      logit += contribution;

      contributions.push({
        featureName: selected.name,
        featureLabel: humanizeFeature(selected.name),
        category: selected.category,
        rawValue: toNumber(selected.feature.rawValue),
        normalizedValue: round(normalizedValue, 6),
        weight,
        contribution: round(contribution, 6),
        impactPoints: round(contribution * 42),
      });
    }

    const rawProbability = round(sigmoid(logit), 6);
    const calibratedProbability = round(clamp(rawProbability * 0.92 + 0.04), 6);
    const creditScore = this._scoreFromProbability(calibratedProbability);

    return {
      rawProbability,
      calibratedProbability,
      creditScore,
      creditLikelihood: this._creditLikelihood(calibratedProbability),
      contributions,
      scoreVersion: CREDIT_SCORE_VERSION,
      modelVersion: CREDIT_MODEL_VERSION,
    };
  }

  _scoreFromProbability(probability) {
    if (probability <= SCORE_ANCHORS[0][0]) return SCORE_ANCHORS[0][1];
    if (probability >= SCORE_ANCHORS[SCORE_ANCHORS.length - 1][0]) {
      return SCORE_ANCHORS[SCORE_ANCHORS.length - 1][1];
    }

    for (let index = 1; index < SCORE_ANCHORS.length; index += 1) {
      const [lowerProbability, lowerScore] = SCORE_ANCHORS[index - 1];
      const [upperProbability, upperScore] = SCORE_ANCHORS[index];

      if (probability <= upperProbability) {
        const position =
          (probability - lowerProbability) / (upperProbability - lowerProbability);
        return Math.round(lowerScore + position * (upperScore - lowerScore));
      }
    }

    return 600;
  }

  _creditLikelihood(probability) {
    if (probability >= 0.72) return "High";
    if (probability >= 0.5) return "Moderate";
    return "Low";
  }

  _buildRiskAssessment(features, readinessReport, scoring) {
    const value = (name) => {
      const feature = features.find((item) => item.featureName === name);
      return feature ? toNumber(feature.rawValue) : 0;
    };

    const level = (score) => {
      if (score >= 67) return "HIGH";
      if (score >= 34) return "MEDIUM";
      return "LOW";
    };

    const dimensions = {
      defaultRisk: level(100 - scoring.calibratedProbability * 100),
      incomeRisk: level(
        (100 - value("income_stability_score")) * 0.65 +
          Math.min(value("salary_delay_days") * 4, 35)
      ),
      spendingRisk: level(
        Math.min(value("expense_income_ratio"), 100) * 0.45 +
          Math.min(value("luxury_spend_ratio"), 100) * 0.25 +
          Math.max(value("spending_drift"), 0) * 0.3
      ),
      paymentBehaviourRisk: level(
        (100 - value("utility_reliability_score")) * 0.6 +
          (100 - value("recharge_reliability_score")) * 0.4
      ),
      savingsRisk: level(
        Math.max(0, 30 - value("savings_ratio")) * 2 +
          Math.max(0, 3 - value("savings_streak")) * 8
      ),
      cashFlowRisk: level(
        (100 - value("cash_flow_stability_score")) * 0.45 +
          (value("monthly_cash_flow") < 0 ? 45 : 0)
      ),
      dataConfidenceRisk: level(
        (1 - readinessReport.featureCompleteness) * 80 +
          Math.min(readinessReport.staleDays, 60) * 0.4 +
          readinessReport.issues.length * 8
      ),
    };

    const highCount = Object.values(dimensions).filter((risk) => risk === "HIGH").length;
    const mediumCount = Object.values(dimensions).filter((risk) => risk === "MEDIUM").length;
    const overallRisk =
      highCount >= 2 || scoring.creditScore < 560
        ? "HIGH"
        : highCount === 1 || mediumCount >= 3 || scoring.creditScore < 700
          ? "MEDIUM"
          : "LOW";

    return {
      overallRisk,
      ...dimensions,
    };
  }

  _estimateConfidence(featurePayload, readinessReport, scoring) {
    const observedMonths = this._observedMonths(featurePayload.features);
    const runQuality = clamp(toNumber(featurePayload.run.qualityScore) / 100);
    const historyScore = clamp(observedMonths / 12);
    const completenessScore = readinessReport.featureCompleteness;
    const modelCertainty = Math.abs(scoring.calibratedProbability - 0.5) * 2;
    const warningPenalty = readinessReport.issues.length * 0.04;

    const score = clamp(
      completenessScore * 0.35 +
        runQuality * 0.25 +
        historyScore * 0.2 +
        modelCertainty * 0.2 -
        warningPenalty,
      0.05,
      0.98
    );

    const reasons = [];

    reasons.push(`${Math.max(observedMonths, 1)} month feature window`);
    reasons.push(`${Math.round(runQuality * 100)}% feature quality score`);
    reasons.push(`${Math.round(completenessScore * 100)}% core feature completeness`);

    if (modelCertainty >= 0.5) {
      reasons.push("Model output is away from the decision boundary");
    } else {
      reasons.push("Model output is close to the decision boundary");
    }

    if (readinessReport.issues.length) {
      reasons.push(`${readinessReport.issues.length} feature readiness warning(s)`);
    }

    return {
      score: round(score, 4),
      percentage: round(score * 100),
      reasons,
      observedMonths,
      missingDataRatio: round(1 - completenessScore, 4),
      modelCertainty: round(modelCertainty, 4),
    };
  }

  _buildExplanation(selectedFeatures, scoring) {
    const factors = scoring.contributions
      .filter((item) => item.weight !== 0)
      .sort((first, second) => Math.abs(second.impactPoints) - Math.abs(first.impactPoints));
    const totalImpact = factors.reduce(
      (sum, factor) => sum + Math.abs(factor.impactPoints),
      0
    ) || 1;

    const localFactors = factors.slice(0, 10).map((factor) => ({
      feature: factor.featureLabel,
      featureName: factor.featureName,
      impact: factor.impactPoints,
      value: factor.rawValue,
      normalizedValue: factor.normalizedValue,
      importancePercentage: round((Math.abs(factor.impactPoints) / totalImpact) * 100),
      direction: factor.impactPoints >= 0 ? "POSITIVE" : "NEGATIVE",
      reason: this._factorReason(factor),
    }));

    return {
      explainabilityMethod: "deterministic additive feature attribution baseline",
      productionMethod: "SHAP or LIME over the selected trained model",
      explainabilityScore: round(
        clamp(selectedFeatures.usable.length / (CORE_FEATURES.length + SECONDARY_FEATURES.length)) * 100
      ),
      globalFactors: Object.entries(MODEL_WEIGHTS)
        .sort((first, second) => Math.abs(second[1]) - Math.abs(first[1]))
        .slice(0, 10)
        .map(([featureName, weight]) => ({
          feature: humanizeFeature(featureName),
          featureName,
          importance: round(Math.abs(weight)),
          direction: weight >= 0 ? "POSITIVE" : "NEGATIVE",
        })),
      localFactors,
      topPositiveFactors: localFactors
        .filter((factor) => factor.impact > 0)
        .slice(0, 3),
      topNegativeFactors: localFactors
        .filter((factor) => factor.impact < 0)
        .slice(0, 3),
    };
  }

  _factorReason(factor) {
    const direction = factor.impactPoints >= 0 ? "improved" : "reduced";
    return `${factor.featureLabel} ${direction} the score by ${Math.abs(factor.impactPoints)} point(s).`;
  }

  _buildNarrative(scoring, risk, explanation) {
    const positive = explanation.topPositiveFactors
      .map((factor) => factor.feature.toLowerCase())
      .slice(0, 2)
      .join(" and ");
    const negative = explanation.topNegativeFactors
      .map((factor) => factor.feature.toLowerCase())
      .slice(0, 2)
      .join(" and ");

    const summary = negative
      ? `Your score is primarily supported by ${positive || "stable financial behavior"}. ${negative} is the largest area limiting further improvement.`
      : `Your score is primarily supported by ${positive || "stable financial behavior"} and shows limited negative pressure from the selected features.`;

    return {
      summary,
      plainLanguage:
        `CreditMiners estimates a ${scoring.creditLikelihood.toLowerCase()} credit likelihood with ${risk.overallRisk.toLowerCase()} overall risk. ` +
        "This is an explainable prototype assessment, not a regulated lending decision.",
      disclaimer:
        "This output is educational financial intelligence and should not be treated as loan approval, denial, or investment advice.",
    };
  }

  _buildImprovementPlan(explanation, risk) {
    const negativeNames = new Set(
      explanation.topNegativeFactors.map((factor) => factor.featureName)
    );
    const plan = [];

    const add = (featureName, item) => {
      if (!negativeNames.has(featureName) && item.priority !== "HIGH") return;
      plan.push(item);
    };

    add("luxury_spend_ratio", {
      action: "Reduce discretionary and luxury spending by 15%",
      priority: "HIGH",
      expectedImpact: "+8 to +15 points",
      difficulty: "Medium",
      estimatedTimeToBenefit: "30 to 60 days",
      category: "Spending",
      reason: "Lower discretionary spend improves spending-risk and cash-flow signals.",
    });

    add("expense_income_ratio", {
      action: "Bring monthly expenses below 60% of income",
      priority: "HIGH",
      expectedImpact: "+10 to +20 points",
      difficulty: "Medium",
      estimatedTimeToBenefit: "1 to 3 months",
      category: "Budget",
      reason: "Expense headroom is one of the strongest credit-readiness drivers.",
    });

    add("savings_ratio", {
      action: "Increase monthly savings by 500",
      priority: "MEDIUM",
      expectedImpact: "+4 to +8 points",
      difficulty: "Low",
      estimatedTimeToBenefit: "30 to 90 days",
      category: "Savings",
      reason: "A higher savings ratio improves resilience and confidence.",
    });

    add("utility_reliability_score", {
      action: "Maintain a utility payment streak",
      priority: "MEDIUM",
      expectedImpact: "+5 to +12 points",
      difficulty: "Low",
      estimatedTimeToBenefit: "2 to 4 billing cycles",
      category: "Payments",
      reason: "On-time utility payments are a transparent alternative credit signal.",
    });

    if (risk.cashFlowRisk !== "LOW") {
      plan.push({
        action: "Maintain positive monthly cash flow for three consecutive months",
        priority: "HIGH",
        expectedImpact: "+8 to +18 points",
        difficulty: "Medium",
        estimatedTimeToBenefit: "3 months",
        category: "Cash Flow",
        reason: "Positive cash flow reduces default and savings risk.",
      });
    }

    if (!plan.length) {
      plan.push({
        action: "Continue current payment and savings habits",
        priority: "MEDIUM",
        expectedImpact: "+2 to +5 points",
        difficulty: "Low",
        estimatedTimeToBenefit: "1 to 2 months",
        category: "Maintenance",
        reason: "Maintaining positive behavior preserves score stability.",
      });
    }

    return plan.slice(0, 5);
  }

  async _ensureModelVersion() {
    return prisma.aIModelVersion.upsert({
      where: { version: CREDIT_MODEL_VERSION },
      update: {
        isActive: true,
        deployedAt: new Date(),
      },
      create: {
        name: "CreditMiners Explainable Credit Intelligence Baseline",
        version: CREDIT_MODEL_VERSION,
        description:
          "Deterministic explainable baseline over Phase 4 engineered features. Future Production should replace with trained and calibrated ML plus SHAP/LIME.",
        algorithm: "Calibrated additive logistic baseline",
        isActive: true,
        trainedAt: new Date("2026-07-26T00:00:00.000Z"),
        deployedAt: new Date(),
      },
    });
  }

  async _ensureAssessmentSnapshot(userId, features) {
    const latestSnapshot = await prisma.financialSnapshot.findFirst({
      where: { userId },
      orderBy: { snapshotDate: "desc" },
    });

    if (latestSnapshot) return latestSnapshot;

    const profile = await prisma.financialProfile.findUnique({ where: { userId } });

    if (!profile) {
      throw new BadRequestError("Financial profile is required to store credit history.");
    }

    const featureValue = (name) => {
      const feature = features.find((item) => item.featureName === name);
      return feature ? toNumber(feature.rawValue) : 0;
    };

    const monthlyIncome = toNumber(profile.monthlyIncome) || featureValue("monthly_income");
    const monthlyExpenses = toNumber(profile.monthlyExpenses) || featureValue("monthly_expenses");
    const monthlySavings = featureValue("monthly_savings") || monthlyIncome - monthlyExpenses;

    return prisma.financialSnapshot.create({
      data: {
        userId,
        profileId: profile.id,
        monthlyIncome,
        monthlyExpenses,
        monthlySavings,
        emergencyFund: toNumber(profile.emergencyFund),
        investmentCapacity: featureValue("investment_capacity"),
        currentInvestments: toNumber(profile.existingInvestments),
        liabilities: toNumber(profile.existingLiabilities),
        savingsRatio: featureValue("savings_ratio"),
        expenseRatio: featureValue("expense_income_ratio"),
        cashFlow: featureValue("monthly_cash_flow"),
        financialStabilityIndex: featureValue("financial_health_feature_score"),
        snapshotDate: new Date(),
      },
    });
  }

  async _findAssessment(userId, assessmentId) {
    const assessment = await prisma.creditAssessment.findFirst({
      where: {
        id: assessmentId,
        userId,
      },
      include: {
        factors: { orderBy: { displayOrder: "asc" } },
        recommendations: { orderBy: [{ priority: "desc" }, { createdAt: "asc" }] },
        modelVersion: true,
      },
    });

    if (!assessment) {
      throw new NotFoundError("Credit assessment not found.");
    }

    return assessment;
  }

  _formatAssessment(assessment) {
    const params = assessment.modelParameters || {};
    const explanation = params.explanation || {};
    const confidence = params.confidence || {};
    const narrative = params.narrative || {};

    return {
      id: assessment.id,
      creditScore: assessment.estimatedCreditScore,
      creditLikelihood: params.creditLikelihood,
      riskLevel: assessment.riskLevel,
      confidence: round(toNumber(assessment.confidenceScore) / 100, 4),
      confidenceReasons: confidence.reasons || [],
      modelVersion: params.modelVersion || assessment.modelVersion?.version,
      scoreVersion: params.scoreVersion || CREDIT_SCORE_VERSION,
      featureVersion: params.featureVersion,
      featureRunId: params.featureRunId,
      rawProbability: params.rawProbability,
      calibratedProbability: params.calibratedProbability,
      readinessReport: params.readinessReport,
      riskAssessment: params.risk || {},
      topPositiveFactors: (explanation.topPositiveFactors || []).map((factor) => ({
        feature: factor.feature,
        impact: `+${Math.abs(factor.impact)}`,
      })),
      topNegativeFactors: (explanation.topNegativeFactors || []).map((factor) => ({
        feature: factor.feature,
        impact: `-${Math.abs(factor.impact)}`,
      })),
      factors: assessment.factors,
      globalExplanation: explanation.globalFactors || [],
      localExplanation: explanation.localFactors || [],
      summary: assessment.summary,
      narrative,
      improvementPlan: (params.improvementPlan || assessment.recommendations || []).map((item) => ({
        action: item.action || item.title,
        priority: this._displayPriority(item.priority),
        expectedImpact: item.expectedImpact,
        difficulty: item.difficulty,
        estimatedTimeToBenefit: item.estimatedTimeToBenefit,
        category: item.category,
        reason: item.reason || item.description,
      })),
      generatedAt: assessment.generatedAt,
    };
  }

  _displayPriority(priority) {
    if (!priority) return priority;
    return priority.charAt(0) + priority.slice(1).toLowerCase();
  }

  _observedMonths(features) {
    const window = features[0]?.window || "";
    const match = window.match(/^(\d+)M$/);
    return match ? Number(match[1]) : 1;
  }

  _modelRegistryMetadata() {
    return {
      modelVersion: CREDIT_MODEL_VERSION,
      scoreVersion: CREDIT_SCORE_VERSION,
      trainingDatasetVersion: "synthetic-creditminers-v1",
      featureVersionSupport: SUPPORTED_FEATURE_VERSIONS,
      hyperparameters: {
        intercept: -0.15,
        weights: MODEL_WEIGHTS,
        calibration: "probability * 0.92 + 0.04",
      },
      metrics: {
        status: "Planned",
        note: "Offline model metrics require a labelled training/evaluation dataset.",
      },
      deploymentStatus: "Implemented baseline; Future Production trained model pending.",
    };
  }
}

module.exports = new AICreditService();
