const fs = require("fs");
const path = require("path");

const prisma = require("../config/prisma");
const apiMetricsService = require("./apiMetrics.service");
const adminAuditService = require("./admin-audit.service");

const SYNTHETIC_DATASET_VERSION = "synthetic-creditminers-v1";
const FEATURE_FRESH_DAYS = 45;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const toNumber = (value) => {
  if (value === null || value === undefined) return 0;
  return Number(value);
};

const round = (value, places = 2) => {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(places));
};

const average = (values) => {
  const valid = values.filter((value) => Number.isFinite(value));
  if (!valid.length) return 0;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
};

const bucketScore = (score) => {
  if (score >= 760) return "760_900";
  if (score >= 680) return "680_759";
  if (score >= 600) return "600_679";
  if (score >= 500) return "500_599";
  return "300_499";
};

const dayKey = (date) => new Date(date).toISOString().slice(0, 10);

const parseCsv = (filePath) => {
  const content = fs.readFileSync(filePath, "utf8").trim();
  if (!content) return { headers: [], rows: [] };

  const lines = content.split(/\r?\n/);
  const headers = lines[0].split(",").map((header) => header.trim());
  const rows = lines.slice(1).map((line) => {
    const cells = line.split(",");
    return headers.reduce((row, header, index) => {
      row[header] = cells[index] === undefined ? "" : cells[index].trim();
      return row;
    }, {});
  });

  return { headers, rows };
};

class AdminService {
  async getDashboard() {
    const [
      userMetrics,
      datasetAnalytics,
      modelMonitoring,
      featureStatistics,
      riskDistribution,
      apiMetrics,
      systemAnalytics,
    ] = await Promise.all([
      this.getUserAnalytics(),
      this.getDatasetAnalytics(),
      this.getModelMonitoring(),
      this.getFeatureStatistics(),
      this.getRiskDistribution(),
      this.getApiMetrics(),
      this.getSystemAnalytics(),
    ]);

    return {
      generatedAt: new Date(),
      accessControl: this.getAccessControlSummary(),
      userMetrics,
      datasetAnalytics,
      modelMonitoring,
      featureStatistics,
      riskDistribution,
      apiMetrics,
      systemAnalytics,
    };
  }

  getAccessControlSummary() {
    return {
      seededRoles: ["SUPER_ADMIN", "ADMIN", "AI_ANALYST", "SUPPORT", "AUDITOR", "USER"],
      supportedAdminRoles: ["SUPER_ADMIN", "ADMIN", "AI_ANALYST", "SUPPORT", "AUDITOR"],
      activeGuard:
        "Admin routes require authentication and one of the authorized admin roles configured per route.",
      sensitiveDataPolicy:
        "Admin analytics expose aggregates and operational metadata by default; raw financial records and secrets are not returned.",
      scoreOverridePolicy:
        "Manual score edits are not implemented. Any future override requires a dedicated audited policy.",
    };
  }

  async getUserAnalytics() {
    const since30Days = new Date(Date.now() - 30 * MS_PER_DAY);
    const [
      totalUsers,
      activeUsers,
      newUsers,
      onboardingRows,
      consentUsers,
      featureUsers,
      scoredUsers,
      investmentUsers,
      statusBuckets,
      roles,
    ] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { deletedAt: null, status: "ACTIVE" } }),
      prisma.user.count({ where: { deletedAt: null, createdAt: { gte: since30Days } } }),
      prisma.onboarding.findMany({
        select: {
          profileCompletionPercentage: true,
          financialProfileCompletionPercentage: true,
          onboardingCompleted: true,
        },
      }),
      prisma.userConsent.groupBy({ by: ["userId"], where: { isGranted: true } }),
      prisma.financialFeatureRun.groupBy({ by: ["userId"] }),
      prisma.creditAssessment.groupBy({ by: ["userId"] }),
      prisma.investmentRecommendation.groupBy({ by: ["userId"] }),
      prisma.user.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.role.findMany({
        include: {
          _count: {
            select: { users: true },
          },
        },
        orderBy: { name: "asc" },
      }),
    ]);

    const profileCompletionRate = round(
      average(onboardingRows.map((row) => toNumber(row.profileCompletionPercentage))),
      2
    );
    const financialCompletionRate = round(
      average(onboardingRows.map((row) => toNumber(row.financialProfileCompletionPercentage))),
      2
    );

    return {
      totalUsers,
      activeUsers,
      newUsersLast30Days: newUsers,
      profileCompletionRate,
      financialProfileCompletionRate: financialCompletionRate,
      onboardingCompletedUsers: onboardingRows.filter((row) => row.onboardingCompleted).length,
      consentCompletionRate: totalUsers ? round(consentUsers.length / totalUsers, 4) : 0,
      usersWithCompleteFeatureData: featureUsers.length,
      usersWithGeneratedCreditScores: scoredUsers.length,
      usersWithGeneratedRiskProfiles: {
        count: 0,
        status: "Planned",
        note: "Assessment-session persistence is referenced by services but is not present in the current Prisma schema.",
      },
      usersWithGeneratedInvestmentRecommendations: investmentUsers.length,
      statusDistribution: statusBuckets.map((bucket) => ({
        status: bucket.status,
        count: bucket._count._all,
      })),
      roleDistribution: roles.map((role) => ({
        role: role.name,
        count: role._count.users,
      })),
    };
  }

  getDatasetAnalytics() {
    const datasetDir = path.join(process.cwd(), "data", "sample-data");
    const files = fs.existsSync(datasetDir)
      ? fs.readdirSync(datasetDir).filter((file) => file.endsWith(".csv"))
      : [];

    const tables = files.map((fileName) => {
      const filePath = path.join(datasetDir, fileName);
      const stats = fs.statSync(filePath);
      const parsed = parseCsv(filePath);
      const cellCount = parsed.headers.length * parsed.rows.length;
      const missingValues = parsed.rows.reduce(
        (count, row) =>
          count + parsed.headers.filter((header) => row[header] === "").length,
        0
      );
      const numericHeaders = parsed.headers.filter((header) =>
        parsed.rows.some((row) => row[header] !== "" && !Number.isNaN(Number(row[header])))
      );

      return {
        fileName,
        rowCount: parsed.rows.length,
        columnCount: parsed.headers.length,
        sizeBytes: stats.size,
        missingValueRate: cellCount ? round(missingValues / cellCount, 4) : 0,
        numericColumnCount: numericHeaders.length,
        outlierCount: this._countCsvOutliers(parsed.rows, numericHeaders),
        headers: parsed.headers,
      };
    });

    const totalRows = tables.reduce((sum, table) => sum + table.rowCount, 0);
    const averageMissingRate = average(tables.map((table) => table.missingValueRate));
    const qualityScore = round(Math.max(0, 100 - averageMissingRate * 100 - tables.reduce((sum, table) => sum + table.outlierCount, 0) * 0.2));

    return {
      datasetVersion: SYNTHETIC_DATASET_VERSION,
      sourceType: "SYNTHETIC_HACKATHON_DATA",
      status: "Implemented",
      active: true,
      datasetSize: {
        files: tables.length,
        rows: totalRows,
        bytes: tables.reduce((sum, table) => sum + table.sizeBytes, 0),
      },
      featureCoverage: tables.map((table) => ({
        source: table.fileName,
        columns: table.columnCount,
        numericColumns: table.numericColumnCount,
      })),
      labelDistribution: this._datasetLabelDistribution(tables),
      missingValueRates: tables.map((table) => ({
        source: table.fileName,
        missingValueRate: table.missingValueRate,
      })),
      outlierCounts: tables.map((table) => ({
        source: table.fileName,
        outlierCount: table.outlierCount,
      })),
      dataGenerationRules:
        "Synthetic profiles combine user demographics with consent-style recharge, utility, and e-commerce signals for hackathon demonstration only.",
      trainingTestSplitSummary: {
        status: "Planned",
        note: "No committed train/test split artifact exists in the current repository.",
      },
      datasetQualityScore: qualityScore,
      tables,
      boundary:
        "Synthetic dataset metrics are demo observability, not production model performance.",
    };
  }

  async getModelMonitoring() {
    const [
      models,
      assessments,
      lowConfidenceCount,
      riskBuckets,
      factorImportance,
    ] = await Promise.all([
      prisma.aIModelVersion.findMany({
        orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
        include: {
          _count: {
            select: { assessments: true },
          },
        },
      }),
      prisma.creditAssessment.findMany({
        include: {
          modelVersion: true,
        },
        orderBy: { generatedAt: "desc" },
        take: 500,
      }),
      prisma.creditAssessment.count({
        where: {
          confidenceScore: { lt: 50 },
        },
      }),
      prisma.creditAssessment.groupBy({
        by: ["riskLevel"],
        _count: { _all: true },
        _avg: { confidenceScore: true, estimatedCreditScore: true },
      }),
      prisma.assessmentFactor.groupBy({
        by: ["factorName"],
        _count: { _all: true },
        _avg: { importancePercentage: true, impactScore: true },
        orderBy: { _count: { factorName: "desc" } },
        take: 12,
      }),
    ]);

    const totalPredictions = assessments.length;
    const explanationCount = assessments.filter((assessment) => assessment.explainabilityScore !== null).length;

    return {
      activeCreditScoringModel:
        models.find((model) => model.isActive) || null,
      activeRiskProfilingVersion: {
        version: "risk-profile-v1",
        status: "In Progress",
        note: "Risk profiling service exists, but no dedicated model registry table is implemented.",
      },
      activeRecommendationLogicVersion: {
        version: "recommendation-baseline-v1",
        status: "Implemented baseline",
      },
      modelRegistry: models.map((model) => ({
        modelId: model.id,
        modelName: model.name,
        modelType: model.algorithm || "deterministic baseline",
        modelVersion: model.version,
        trainingDatasetVersion: model.description?.includes("synthetic")
          ? SYNTHETIC_DATASET_VERSION
          : null,
        featureVersion: this._featureVersionFromAssessments(assessments, model.version),
        evaluationMetrics: {
          status: "Planned",
          note: "Accuracy, precision, recall, F1, ROC-AUC, MAE/RMSE, and fairness require labelled holdout data.",
        },
        createdAt: model.createdAt,
        activeStatus: model.isActive,
        deploymentStatus: model.deployedAt ? "DEPLOYED" : "REGISTERED",
        predictionCount: model._count.assessments,
      })),
      predictionVolume: totalPredictions,
      averageConfidenceScore: round(
        average(assessments.map((assessment) => toNumber(assessment.confidenceScore))),
        2
      ),
      lowConfidencePredictionCount: lowConfidenceCount,
      riskBucketDistribution: riskBuckets.map((bucket) => ({
        riskLevel: bucket.riskLevel,
        count: bucket._count._all,
        averageConfidence: round(toNumber(bucket._avg.confidenceScore), 2),
        averageScore: round(toNumber(bucket._avg.estimatedCreditScore), 2),
      })),
      scoreDistribution: this._scoreDistribution(assessments),
      featureImportanceSummary: factorImportance.map((factor) => ({
        featureName: factor.factorName,
        count: factor._count._all,
        averageImportance: round(toNumber(factor._avg.importancePercentage), 2),
        averageImpact: round(toNumber(factor._avg.impactScore), 2),
      })),
      explanationGenerationSuccessRate: totalPredictions
        ? round(explanationCount / totalPredictions, 4)
        : 0,
      driftIndicators: {
        status: "Planned",
        note: "Production drift requires durable prediction history, cohort baselines, and live data windows.",
      },
    };
  }

  async getFeatureStatistics() {
    const [
      latestRuns,
      featureFamilies,
      featureVersions,
      topFeatures,
      allUsersWithFeatures,
    ] = await Promise.all([
      prisma.financialFeatureRun.findMany({
        orderBy: { computedAt: "desc" },
        take: 200,
      }),
      prisma.financialFeature.groupBy({
        by: ["featureGroup"],
        _count: { _all: true },
        _avg: { qualityScore: true, normalizedValue: true, percentile: true, confidence: true },
      }),
      prisma.financialFeatureRun.groupBy({
        by: ["version"],
        _count: { _all: true },
      }),
      prisma.financialFeature.groupBy({
        by: ["featureName"],
        _count: { _all: true },
        _avg: { qualityScore: true, normalizedValue: true, percentile: true },
        orderBy: { _count: { featureName: "desc" } },
        take: 20,
      }),
      prisma.financialFeatureRun.groupBy({ by: ["userId"] }),
    ]);

    const now = new Date();
    const staleRuns = latestRuns.filter(
      (run) => (now - new Date(run.computedAt || run.createdAt)) / MS_PER_DAY > FEATURE_FRESH_DAYS
    );

    return {
      featureFamilyCoverage: featureFamilies.map((family) => ({
        family: family.featureGroup,
        featureCount: family._count._all,
        averageQualityScore: round(toNumber(family._avg.qualityScore), 2),
        averageNormalizedValue: round(toNumber(family._avg.normalizedValue), 4),
        averagePercentile: round(toNumber(family._avg.percentile), 2),
        averageConfidence: round(toNumber(family._avg.confidence), 2),
      })),
      averageQualityScore: round(
        average(latestRuns.map((run) => toNumber(run.qualityScore))),
        2
      ),
      featureFreshness: {
        freshRunCount: latestRuns.length - staleRuns.length,
        staleRunCount: staleRuns.length,
        staleThresholdDays: FEATURE_FRESH_DAYS,
      },
      versionUsage: featureVersions.map((version) => ({
        version: version.version,
        runCount: version._count._all,
      })),
      normalizedValueDistribution: this._featureValueDistribution(topFeatures, "normalizedValue"),
      percentileDistribution: this._featureValueDistribution(topFeatures, "percentile"),
      topMissingFeatures: await this._topMissingFeatures(allUsersWithFeatures.length),
      featureDriftWarnings: this._featureDriftWarnings(latestRuns),
      sourceDataCompleteness: latestRuns.map((run) => ({
        runId: run.id,
        userId: run.userId,
        version: run.version,
        qualityScore: toNumber(run.qualityScore),
        inputSummary: run.inputSummary,
        validationIssues: run.validationIssues,
      })),
    };
  }

  async getRiskDistribution() {
    const assessments = await prisma.creditAssessment.findMany({
      include: {
        factors: true,
        user: {
          select: {
            city: true,
            state: true,
            country: true,
            gender: true,
            education: true,
          },
        },
      },
      orderBy: { generatedAt: "desc" },
      take: 1000,
    });

    const byBucket = ["LOW", "MEDIUM", "HIGH"].map((riskLevel) => {
      const rows = assessments.filter((assessment) => assessment.riskLevel === riskLevel);
      return {
        riskLevel,
        userCount: new Set(rows.map((row) => row.userId)).size,
        assessmentCount: rows.length,
        averageConfidence: round(average(rows.map((row) => toNumber(row.confidenceScore))), 2),
        scoreRange: {
          min: rows.length ? Math.min(...rows.map((row) => row.estimatedCreditScore)) : null,
          max: rows.length ? Math.max(...rows.map((row) => row.estimatedCreditScore)) : null,
        },
        topFactors: this._topFactors(rows),
      };
    });

    return {
      buckets: byBucket,
      bucketMovementOverTime: this._bucketMovement(assessments),
      segmentComparison: this._segmentComparison(assessments),
      concentrationWarning:
        byBucket.some((bucket) => assessments.length && bucket.assessmentCount / assessments.length > 0.8)
          ? "One risk bucket contains more than 80% of recent assessments; investigate dataset balance and feature quality."
          : null,
    };
  }

  getApiMetrics() {
    return apiMetricsService.getMetrics();
  }

  async getAuditLogs(query = {}) {
    return adminAuditService.list(query);
  }

  async getSystemAnalytics() {
    const [
      users,
      onboardingRows,
      featureRuns,
      assessments,
      investmentRecommendations,
      loanRequests,
      auditLogCount,
      adminAuditLogCount,
    ] = await Promise.all([
      prisma.user.findMany({ select: { id: true, createdAt: true } }),
      prisma.onboarding.findMany({
        select: { onboardingCompleted: true, createdAt: true },
      }),
      prisma.financialFeatureRun.findMany({ select: { id: true, userId: true, computedAt: true, status: true } }),
      prisma.creditAssessment.findMany({ select: { id: true, userId: true, generatedAt: true } }),
      prisma.investmentRecommendation.findMany({ select: { id: true, userId: true, createdAt: true } }),
      prisma.loanRequest.findMany({ select: { id: true, status: true, fundingStatus: true, createdAt: true } }),
      prisma.auditLog.count(),
      prisma.adminAuditLog.count(),
    ]);

    return {
      userGrowth: this._dailyCounts(users, "createdAt"),
      profileCompletionFunnel: {
        totalUsers: users.length,
        onboardingStarted: onboardingRows.length,
        onboardingCompleted: onboardingRows.filter((row) => row.onboardingCompleted).length,
      },
      consentFunnel: await this._consentFunnel(users.length),
      featureGenerationFunnel: {
        usersWithFeatureRuns: new Set(featureRuns.map((run) => run.userId)).size,
        completedRuns: featureRuns.filter((run) => run.status === "COMPLETED").length,
        failedRuns: featureRuns.filter((run) => run.status === "FAILED").length,
      },
      creditScoreGenerationFunnel: {
        usersWithAssessments: new Set(assessments.map((assessment) => assessment.userId)).size,
        totalAssessments: assessments.length,
      },
      riskProfilingCompletion: {
        status: "Planned",
        note: "Dedicated persisted risk-profile sessions are not present in the current Prisma schema.",
      },
      investmentRecommendationUsage: {
        usersWithRecommendations: new Set(investmentRecommendations.map((item) => item.userId)).size,
        totalRecommendations: investmentRecommendations.length,
      },
      growthProjectionUsage: {
        status: "In Progress",
        note: "Growth projection APIs exist, but no persisted projection table is present for aggregate usage.",
      },
      marketplaceActivity: {
        totalLoans: loanRequests.length,
        byStatus: this._countBy(loanRequests, "status"),
        byFundingStatus: this._countBy(loanRequests, "fundingStatus"),
      },
      errorTrends: {
        auditLogCount,
        adminAuditLogCount,
        apiErrorRate: apiMetricsService.getMetrics().errorRate,
      },
      chartReadyDailyMetrics: {
        users: this._dailyCounts(users, "createdAt"),
        featureRuns: this._dailyCounts(featureRuns, "computedAt"),
        creditAssessments: this._dailyCounts(assessments, "generatedAt"),
      },
    };
  }

  _countCsvOutliers(rows, numericHeaders) {
    let outliers = 0;

    for (const header of numericHeaders) {
      const values = rows
        .map((row) => Number(row[header]))
        .filter((value) => Number.isFinite(value));

      if (values.length < 4) continue;

      const avg = average(values);
      const variance = average(values.map((value) => (value - avg) ** 2));
      const sd = Math.sqrt(variance);
      outliers += values.filter((value) => sd && Math.abs(value - avg) / sd > 3).length;
    }

    return outliers;
  }

  _datasetLabelDistribution(tables) {
    const distribution = {};
    const labelColumns = ["riskLevel", "risk_level", "label", "bucket", "score"];

    for (const table of tables) {
      const filePath = path.join(process.cwd(), "data", "sample-data", table.fileName);
      const parsed = parseCsv(filePath);
      const labelColumn = parsed.headers.find((header) => labelColumns.includes(header));
      if (!labelColumn) continue;
      distribution[table.fileName] = this._countBy(parsed.rows, labelColumn);
    }

    return distribution;
  }

  _featureVersionFromAssessments(assessments, modelVersion) {
    const match = assessments.find(
      (assessment) =>
        assessment.modelVersion?.version === modelVersion &&
        assessment.modelParameters?.featureVersion
    );

    return match?.modelParameters?.featureVersion || null;
  }

  _scoreDistribution(assessments) {
    return Object.entries(
      assessments.reduce((buckets, assessment) => {
        const bucket = bucketScore(assessment.estimatedCreditScore);
        buckets[bucket] = (buckets[bucket] || 0) + 1;
        return buckets;
      }, {})
    ).map(([range, count]) => ({ range, count }));
  }

  _featureValueDistribution(features, field) {
    return features.map((feature) => ({
      featureName: feature.featureName,
      count: feature._count._all,
      averageValue: round(toNumber(feature._avg[field]), field === "normalizedValue" ? 4 : 2),
    }));
  }

  async _topMissingFeatures(totalFeatureUsers) {
    if (!totalFeatureUsers) return [];

    const featureCounts = await prisma.financialFeature.groupBy({
      by: ["featureName"],
      _count: { userId: true },
    });

    return featureCounts
      .map((feature) => ({
        featureName: feature.featureName,
        missingUserCount: Math.max(0, totalFeatureUsers - feature._count.userId),
      }))
      .filter((feature) => feature.missingUserCount > 0)
      .sort((first, second) => second.missingUserCount - first.missingUserCount)
      .slice(0, 10);
  }

  _featureDriftWarnings(runs) {
    if (runs.length < 2) return [];

    const byVersion = this._countBy(runs, "version");
    return Object.entries(byVersion).length > 1
      ? [
          {
            code: "MULTIPLE_FEATURE_VERSIONS_ACTIVE",
            severity: "MEDIUM",
            message: "Multiple feature-engine versions appear in recent runs.",
            versionUsage: byVersion,
          },
        ]
      : [];
  }

  _topFactors(assessments) {
    const counts = {};

    for (const assessment of assessments) {
      for (const factor of assessment.factors || []) {
        counts[factor.factorName] = (counts[factor.factorName] || 0) + 1;
      }
    }

    return Object.entries(counts)
      .sort((first, second) => second[1] - first[1])
      .slice(0, 5)
      .map(([featureName, count]) => ({ featureName, count }));
  }

  _bucketMovement(assessments) {
    const byMonth = {};

    for (const assessment of assessments) {
      const key = dayKey(assessment.generatedAt).slice(0, 7);
      byMonth[key] = byMonth[key] || { LOW: 0, MEDIUM: 0, HIGH: 0 };
      byMonth[key][assessment.riskLevel] += 1;
    }

    return Object.entries(byMonth)
      .sort(([first], [second]) => first.localeCompare(second))
      .map(([month, buckets]) => ({ month, ...buckets }));
  }

  _segmentComparison(assessments) {
    return ["country", "state", "city", "gender", "education"].map((segment) => {
      const rows = {};

      for (const assessment of assessments) {
        const key = assessment.user?.[segment] || "UNKNOWN";
        rows[key] = rows[key] || [];
        rows[key].push(assessment);
      }

      return {
        segment,
        values: Object.entries(rows)
          .map(([value, items]) => ({
            value,
            assessmentCount: items.length,
            averageScore: round(average(items.map((item) => item.estimatedCreditScore)), 2),
            averageConfidence: round(average(items.map((item) => toNumber(item.confidenceScore))), 2),
            riskDistribution: this._countBy(items, "riskLevel"),
          }))
          .sort((first, second) => second.assessmentCount - first.assessmentCount)
          .slice(0, 10),
      };
    });
  }

  async _consentFunnel(totalUsers) {
    const granted = await prisma.userConsent.groupBy({
      by: ["scope"],
      where: { isGranted: true },
      _count: { _all: true },
    });

    return {
      totalUsers,
      byScope: granted.map((row) => ({
        scope: row.scope,
        grantedCount: row._count._all,
      })),
    };
  }

  _dailyCounts(rows, field) {
    return Object.entries(
      rows.reduce((counts, row) => {
        if (!row[field]) return counts;
        const key = dayKey(row[field]);
        counts[key] = (counts[key] || 0) + 1;
        return counts;
      }, {})
    )
      .sort(([first], [second]) => first.localeCompare(second))
      .map(([date, count]) => ({ date, count }));
  }

  _countBy(rows, field) {
    return rows.reduce((counts, row) => {
      const key = row[field] || "UNKNOWN";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
  }
}

module.exports = new AdminService();
