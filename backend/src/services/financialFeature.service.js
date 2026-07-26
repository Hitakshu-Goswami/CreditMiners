const { randomUUID } = require("crypto");

const prisma = require("../config/prisma");
const auditService = require("./audit.service");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");

const DEFAULT_VERSION = "feature-engine-v2";
const DEFAULT_WINDOW_MONTHS = 6;
const MAX_WINDOW_MONTHS = 24;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MAX_BACKGROUND_JOBS = 500;

const POPULATION_BENCHMARK_SOURCE = {
  name: "CreditMiners synthetic population benchmark v1",
  description:
    "Hackathon prototype benchmarks from synthetic inclusive-finance profiles; replace with consented cohort benchmarks before production use.",
};

const FEATURE_BENCHMARKS = {
  monthly_income: { direction: "high", points: [[5, 8000], [25, 18000], [50, 35000], [75, 70000], [95, 150000]] },
  income_stability_score: { direction: "high", points: [[5, 20], [25, 45], [50, 65], [75, 82], [95, 96]] },
  income_volatility: { direction: "low", points: [[5, 5], [25, 18], [50, 35], [75, 65], [95, 120]] },
  income_seasonality: { direction: "low", points: [[5, 4], [25, 12], [50, 28], [75, 55], [95, 110]] },
  salary_delay_days: { direction: "low", points: [[5, 0], [25, 1], [50, 3], [75, 7], [95, 15]] },
  expense_income_ratio: { direction: "low", points: [[5, 25], [25, 40], [50, 55], [75, 75], [95, 110]] },
  spending_stability_score: { direction: "high", points: [[5, 20], [25, 45], [50, 65], [75, 82], [95, 96]] },
  night_spending_ratio: { direction: "low", points: [[5, 0], [25, 4], [50, 12], [75, 24], [95, 45]] },
  spending_drift: { direction: "low", points: [[5, -40], [25, -10], [50, 8], [75, 35], [95, 90]] },
  savings_ratio: { direction: "high", points: [[5, -10], [25, 3], [50, 12], [75, 25], [95, 45]] },
  savings_streak: { direction: "high", points: [[5, 0], [25, 1], [50, 3], [75, 5], [95, 9]] },
  cash_flow_stability_score: { direction: "high", points: [[5, 15], [25, 40], [50, 62], [75, 80], [95, 95]] },
  utility_reliability_score: { direction: "high", points: [[5, 20], [25, 50], [50, 72], [75, 88], [95, 99]] },
  utility_seasonality: { direction: "low", points: [[5, 5], [25, 15], [50, 30], [75, 55], [95, 100]] },
  recharge_reliability_score: { direction: "high", points: [[5, 25], [25, 50], [50, 70], [75, 86], [95, 98]] },
  recharge_growth: { direction: "high", points: [[5, -50], [25, -10], [50, 5], [75, 30], [95, 80]] },
  digital_payment_score: { direction: "high", points: [[5, 10], [25, 35], [50, 58], [75, 78], [95, 95]] },
  merchant_concentration: { direction: "low", points: [[5, 12], [25, 25], [50, 42], [75, 65], [95, 90]] },
  merchant_switching_frequency: { direction: "low", points: [[5, 5], [25, 18], [50, 35], [75, 58], [95, 85]] },
  essential_spend_ratio: { direction: "high", points: [[5, 20], [25, 40], [50, 58], [75, 75], [95, 92]] },
  luxury_spend_ratio: { direction: "low", points: [[5, 2], [25, 8], [50, 18], [75, 32], [95, 55]] },
  financial_discipline_score: { direction: "high", points: [[5, 20], [25, 45], [50, 65], [75, 82], [95, 95]] },
  credit_readiness_score: { direction: "high", points: [[5, 18], [25, 42], [50, 62], [75, 80], [95, 94]] },
  investment_capacity_score: { direction: "high", points: [[5, 5], [25, 25], [50, 48], [75, 70], [95, 90]] },
  financial_behaviour_score: { direction: "high", points: [[5, 20], [25, 45], [50, 65], [75, 82], [95, 95]] },
  financial_health_feature_score: { direction: "high", points: [[5, 18], [25, 42], [50, 62], [75, 80], [95, 94]] },
};

const featureJobs = new Map();

const ESSENTIAL_KEYWORDS = [
  "grocery",
  "food",
  "rent",
  "utility",
  "electricity",
  "water",
  "gas",
  "internet",
  "education",
  "health",
  "medical",
  "insurance",
  "transport",
];

const LUXURY_KEYWORDS = [
  "luxury",
  "entertainment",
  "travel",
  "shopping",
  "fashion",
  "electronics",
  "restaurant",
  "hotel",
  "subscription",
  "gaming",
];

const round = (value, places = 2) => {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(places));
};

const clamp = (value, min = 0, max = 1) => {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
};

const toNumber = (value) => {
  if (value === null || value === undefined) return 0;
  return Number(value);
};

const mean = (values) => {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const median = (values) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
};

const standardDeviation = (values) => {
  if (values.length < 2) return 0;
  const avg = mean(values);
  const variance =
    values.reduce((sum, value) => sum + (value - avg) ** 2, 0) /
    values.length;
  return Math.sqrt(variance);
};

const coefficientOfVariation = (values) => {
  const avg = mean(values);
  if (avg <= 0) return values.length ? 1 : 0;
  return standardDeviation(values) / avg;
};

const uniqueCount = (values) =>
  new Set(values.filter((value) => value !== null && value !== undefined && value !== "")).size;

const monthKey = (date) => {
  const parsed = new Date(date);
  return `${parsed.getUTCFullYear()}-${String(parsed.getUTCMonth() + 1).padStart(2, "0")}`;
};

const daysBetween = (first, second) =>
  Math.abs((new Date(second) - new Date(first)) / MS_PER_DAY);

const ratio = (numerator, denominator) => {
  if (!denominator || denominator <= 0) return 0;
  return numerator / denominator;
};

const scoreFromCv = (values) => round(clamp(1 - coefficientOfVariation(values), 0, 1) * 100);

const normalizeValue = (rawValue, { min = 0, max = 100, direction = "high" } = {}) => {
  const spread = max - min || 1;
  const normalized = clamp((rawValue - min) / spread);
  return direction === "low" ? round(1 - normalized, 6) : round(normalized, 6);
};

const percentileFromBenchmark = (rawValue, benchmark) => {
  const points = benchmark.points
    .map(([percentile, value]) => ({ percentile, value }))
    .sort((first, second) => first.value - second.value);

  let distributionPercentile = points[0].percentile;

  if (rawValue >= points[points.length - 1].value) {
    distributionPercentile = points[points.length - 1].percentile;
  } else {
    for (let index = 1; index < points.length; index += 1) {
      const lower = points[index - 1];
      const upper = points[index];

      if (rawValue <= upper.value) {
        const spread = upper.value - lower.value || 1;
        const position = clamp((rawValue - lower.value) / spread);
        distributionPercentile =
          lower.percentile + position * (upper.percentile - lower.percentile);
        break;
      }
    }
  }

  const performancePercentile =
    benchmark.direction === "low"
      ? 100 - distributionPercentile
      : distributionPercentile;

  return round(clamp(performancePercentile, 1, 99));
};

const bucketFor = (normalizedValue) => {
  if (normalizedValue >= 0.8) return "VERY_HIGH";
  if (normalizedValue >= 0.6) return "HIGH";
  if (normalizedValue >= 0.4) return "MEDIUM";
  if (normalizedValue >= 0.2) return "LOW";
  return "VERY_LOW";
};

const safeDate = (date, fallback = new Date()) => {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
};

class FinancialFeatureService {
  async computeFeatures(userId, options = {}, context = {}) {
    const windowMonths = Math.min(
      Number(options.windowMonths || DEFAULT_WINDOW_MONTHS),
      MAX_WINDOW_MONTHS
    );

    if (!Number.isInteger(windowMonths) || windowMonths < 1) {
      throw new BadRequestError("windowMonths must be between 1 and 24.");
    }

    const version = options.version || DEFAULT_VERSION;
    const persist = options.persist !== false;
    const windowEnd = options.windowEnd
      ? safeDate(options.windowEnd)
      : new Date();
    const windowStart = new Date(windowEnd);
    windowStart.setUTCMonth(windowStart.getUTCMonth() - windowMonths);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const dataset = await this._loadDataset(userId, windowStart, windowEnd);
    const validationIssues = this._validateDataset(dataset, windowEnd);
    const inputSummary = this._buildInputSummary(dataset);
    const qualityScore = this._scoreDatasetQuality(dataset, validationIssues);
    const features = this._buildFeatures({
      dataset,
      validationIssues,
      qualityScore,
      version,
      window: `${windowMonths}M`,
      windowStart,
      windowEnd,
    });

    if (!persist) {
      return {
        run: {
          version,
          window: `${windowMonths}M`,
          windowStart,
          windowEnd,
          status: "COMPLETED",
          featureCount: features.length,
          qualityScore,
          inputSummary,
          validationIssues,
        },
        features,
        summary: this._summarizeFeatures(features),
      };
    }

    const persisted = await prisma.$transaction(async (tx) => {
      const run = await tx.financialFeatureRun.create({
        data: {
          userId,
          version,
          window: `${windowMonths}M`,
          windowStart,
          windowEnd,
          status: "COMPLETED",
          featureCount: features.length,
          qualityScore,
          inputSummary,
          validationIssues,
        },
      });

      await tx.financialFeature.createMany({
        data: features.map((feature) => ({
          ...feature,
          userId,
          runId: run.id,
        })),
      });

      return tx.financialFeatureRun.findUnique({
        where: { id: run.id },
        include: {
          features: {
            orderBy: [{ featureGroup: "asc" }, { featureName: "asc" }],
          },
        },
      });
    });

    await auditService.log({
      userId,
      action: "FINANCIAL_FEATURES_COMPUTED",
      description: `Computed ${features.length} financial features for ${windowMonths}M window.`,
      ...context,
    });

    return {
      run: {
        ...persisted,
        features: undefined,
      },
      features: persisted.features,
      summary: this._summarizeFeatures(persisted.features),
    };
  }

  async listFeatures(userId, query = {}) {
    const latestRun = await this._getLatestRun(userId, query.version);

    const where = {
      userId,
      ...(query.group ? { featureGroup: query.group } : {}),
      ...(query.name ? { featureName: query.name } : {}),
      ...(query.version ? { version: query.version } : {}),
      ...(query.latestOnly !== "false" && latestRun ? { runId: latestRun.id } : {}),
    };

    const features = await prisma.financialFeature.findMany({
      where,
      orderBy: [{ featureGroup: "asc" }, { featureName: "asc" }],
    });

    return {
      run: latestRun,
      features,
      summary: this._summarizeFeatures(features),
    };
  }

  async listRuns(userId, query = {}) {
    const limit = Math.min(Number(query.limit || 20), 100);

    return prisma.financialFeatureRun.findMany({
      where: {
        userId,
        ...(query.version ? { version: query.version } : {}),
      },
      orderBy: { computedAt: "desc" },
      take: limit,
    });
  }

  async getRun(userId, runId) {
    const run = await prisma.financialFeatureRun.findFirst({
      where: {
        id: runId,
        userId,
      },
      include: {
        features: {
          orderBy: [{ featureGroup: "asc" }, { featureName: "asc" }],
        },
      },
    });

    if (!run) {
      throw new NotFoundError("Feature run not found.");
    }

    return {
      run: {
        ...run,
        features: undefined,
      },
      features: run.features,
      summary: this._summarizeFeatures(run.features),
    };
  }

  async getSummary(userId) {
    const latestRun = await this._getLatestRun(userId);

    if (!latestRun) {
      return {
        run: null,
        groups: [],
        composites: {},
        message: "No engineered features found. Run feature computation first.",
      };
    }

    const features = await prisma.financialFeature.findMany({
      where: {
        userId,
        runId: latestRun.id,
      },
      orderBy: [{ featureGroup: "asc" }, { featureName: "asc" }],
    });

    return {
      run: latestRun,
      ...this._summarizeFeatures(features),
    };
  }

  getFeatureDocumentation() {
    const windowEnd = new Date("2026-01-01T00:00:00.000Z");
    const windowStart = new Date(windowEnd);
    windowStart.setUTCMonth(windowStart.getUTCMonth() - DEFAULT_WINDOW_MONTHS);

    const documentationDataset = {
      profile: {
        incomeFrequency: "MONTHLY",
        savingsHabit: "REGULAR",
        monthlyIncome: 0,
        monthlyExpenses: 0,
        emergencyFund: 0,
        existingInvestments: 0,
      },
      snapshots: [],
      transactions: [],
      utilityBills: [],
      mobileRecharges: [],
      ecommerceOrders: [],
      goals: [],
    };

    const features = this._buildFeatures({
      dataset: documentationDataset,
      validationIssues: [],
      qualityScore: 100,
      version: DEFAULT_VERSION,
      window: `${DEFAULT_WINDOW_MONTHS}M`,
      windowStart,
      windowEnd,
    });

    const groups = {};

    for (const feature of features) {
      if (!groups[feature.featureGroup]) {
        groups[feature.featureGroup] = {
          featureGroup: feature.featureGroup,
          features: [],
        };
      }

      groups[feature.featureGroup].features.push({
        featureName: feature.featureName,
        dataType: feature.dataType,
        definition: feature.definition,
        formula: feature.formula,
        dependencies: feature.dependencies,
        percentileBenchmark: feature.metadata?.percentileBenchmark || null,
      });
    }

    return {
      version: DEFAULT_VERSION,
      status: "Implemented",
      benchmarkSource: POPULATION_BENCHMARK_SOURCE,
      featureCount: features.length,
      groups: Object.values(groups),
      productionNote:
        "Benchmarks are synthetic prototype thresholds and are not regulated credit-decision criteria.",
    };
  }

  enqueueFeatureComputation(userId, options = {}, context = {}) {
    const jobId = randomUUID();
    const jobOptions = { ...options, persist: true };
    delete jobOptions.async;

    const job = {
      id: jobId,
      userId,
      status: "QUEUED",
      options: jobOptions,
      createdAt: new Date(),
      startedAt: null,
      completedAt: null,
      runId: null,
      featureCount: 0,
      summary: null,
      error: null,
    };

    featureJobs.set(jobId, job);
    this._trimFeatureJobs();

    setImmediate(async () => {
      job.status = "RUNNING";
      job.startedAt = new Date();

      try {
        const result = await this.computeFeatures(userId, jobOptions, context);
        job.status = "COMPLETED";
        job.completedAt = new Date();
        job.runId = result.run.id || null;
        job.featureCount = result.features.length;
        job.summary = result.summary;
      } catch (error) {
        job.status = "FAILED";
        job.completedAt = new Date();
        job.error = error.message || "Feature computation failed.";
      }
    });

    return this._serializeJob(job);
  }

  getFeatureJob(userId, jobId) {
    const job = featureJobs.get(jobId);

    if (!job || job.userId !== userId) {
      throw new NotFoundError("Feature computation job not found.");
    }

    return this._serializeJob(job);
  }

  async _loadDataset(userId, windowStart, windowEnd) {
    const dateRange = { gte: windowStart, lte: windowEnd };

    const [
      profile,
      snapshots,
      transactions,
      utilityBills,
      mobileRecharges,
      ecommerceOrders,
      goals,
    ] = await Promise.all([
      prisma.financialProfile.findUnique({ where: { userId } }),
      prisma.financialSnapshot.findMany({
        where: { userId, snapshotDate: dateRange },
        orderBy: { snapshotDate: "asc" },
      }),
      prisma.transaction.findMany({
        where: { userId, transactionDate: dateRange },
        include: {
          category: true,
          categoryRef: true,
          merchantRef: true,
        },
        orderBy: { transactionDate: "asc" },
      }),
      prisma.utilityBill.findMany({
        where: { userId, dueDate: dateRange },
        orderBy: { dueDate: "asc" },
      }),
      prisma.mobileRecharge.findMany({
        where: { userId, rechargeDate: dateRange },
        orderBy: { rechargeDate: "asc" },
      }),
      prisma.ecommerceOrder.findMany({
        where: { userId, orderDate: dateRange },
        include: {
          merchant: true,
          category: true,
        },
        orderBy: { orderDate: "asc" },
      }),
      prisma.financialGoal.findMany({
        where: { userId, isArchived: false },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      profile,
      snapshots,
      transactions,
      utilityBills,
      mobileRecharges,
      ecommerceOrders,
      goals,
    };
  }

  _validateDataset(dataset, windowEnd) {
    const issues = [];

    if (!dataset.profile) {
      issues.push(this._issue("MISSING_FINANCIAL_PROFILE", "Financial profile is missing.", "HIGH"));
    }

    const profileIncome = toNumber(dataset.profile?.monthlyIncome);
    if (profileIncome <= 0 && !dataset.transactions.some((tx) => tx.transactionType === "INCOME")) {
      issues.push(this._issue("MISSING_INCOME", "No monthly income or income transactions found.", "HIGH"));
    }

    this._validateAmounts(dataset.transactions, "TRANSACTION", "amount", issues);
    this._validateAmounts(dataset.utilityBills, "UTILITY_BILL", "amountDue", issues);
    this._validateAmounts(dataset.mobileRecharges, "MOBILE_RECHARGE", "amount", issues);
    this._validateAmounts(dataset.ecommerceOrders, "ECOMMERCE_ORDER", "amount", issues);

    this._validateFutureDates(dataset.transactions, "TRANSACTION", "transactionDate", windowEnd, issues);
    this._validateFutureDates(dataset.utilityBills, "UTILITY_BILL", "dueDate", windowEnd, issues);
    this._validateFutureDates(dataset.mobileRecharges, "MOBILE_RECHARGE", "rechargeDate", windowEnd, issues);
    this._validateFutureDates(dataset.ecommerceOrders, "ECOMMERCE_ORDER", "orderDate", windowEnd, issues);

    this._validateDuplicates(
      dataset.transactions,
      (tx) => `${tx.referenceNumber || ""}:${tx.amount}:${monthKey(tx.transactionDate)}:${tx.merchant || ""}`,
      "DUPLICATE_TRANSACTION",
      issues
    );

    this._validateDuplicates(
      dataset.utilityBills,
      (bill) => `${bill.providerName}:${bill.billNumber || ""}:${bill.billMonth}:${bill.amountDue}`,
      "DUPLICATE_UTILITY_BILL",
      issues
    );

    this._validateDuplicates(
      dataset.mobileRecharges,
      (recharge) => `${recharge.referenceNumber || ""}:${recharge.mobileNumber || ""}:${recharge.amount}:${monthKey(recharge.rechargeDate)}`,
      "DUPLICATE_RECHARGE",
      issues
    );

    const monthlyIncome = profileIncome || this._monthlyIncomeFromTransactions(dataset.transactions);
    const outlierThreshold = Math.max(monthlyIncome * 10, 1000000);
    const outliers = dataset.transactions.filter((tx) => toNumber(tx.amount) > outlierThreshold);

    if (outliers.length) {
      issues.push(
        this._issue(
          "EXTREME_TRANSACTION_OUTLIERS",
          `${outliers.length} transactions exceed the large-outlier threshold.`,
          "MEDIUM",
          { threshold: outlierThreshold }
        )
      );
    }

    return issues;
  }

  _buildFeatures({ dataset, validationIssues, qualityScore, version, window, windowStart, windowEnd }) {
    const transactions = dataset.transactions;
    const incomeTransactions = transactions.filter((tx) => tx.transactionType === "INCOME");
    const expenseTransactions = transactions.filter((tx) => tx.transactionType === "EXPENSE");
    const investmentTransactions = transactions.filter((tx) => tx.transactionType === "INVESTMENT");

    const monthlyIncome = this._monthlyIncome(dataset, incomeTransactions);
    const monthlyExpenses = this._monthlyExpenses(dataset, expenseTransactions);
    const monthlySavings = this._monthlySavings(dataset, monthlyIncome, monthlyExpenses);
    const monthlyCashFlow = monthlyIncome - monthlyExpenses;

    const incomeByMonth = this._sumTransactionsByMonth(incomeTransactions);
    const expenseByMonth = this._sumTransactionsByMonth(expenseTransactions);
    const cashFlowByMonth = this._mergeMonthlyCashFlow(incomeByMonth, expenseByMonth);
    const incomeMonthlyValues = Object.values(incomeByMonth);
    const expenseMonthlyValues = Object.values(expenseByMonth);
    const cashFlowMonthlyValues = Object.values(cashFlowByMonth);
    const expenseAmounts = expenseTransactions.map((tx) => toNumber(tx.amount));
    const incomeSeasonality = coefficientOfVariation(incomeMonthlyValues) * 100;
    const spendingDrift = this._monthlyGrowthRate(
      expenseTransactions,
      "transactionDate",
      "amount",
      windowStart,
      windowEnd
    );
    const utilitySeasonality = this._utilitySeasonality(dataset.utilityBills);
    const incomeTimingScores = this._incomeTimingScores(incomeTransactions);
    const savingsStreak = this._savingsStreak(cashFlowByMonth, dataset.snapshots);

    const utilityScores = this._utilityScores(dataset.utilityBills);
    const rechargeScores = this._rechargeScores(dataset.mobileRecharges, windowStart, windowEnd);
    const paymentScores = this._digitalPaymentScores(transactions);
    const ecommerceScores = this._ecommerceScores(dataset.ecommerceOrders);
    const spendingScores = this._spendingScores(expenseTransactions);
    const merchantScores = this._merchantScores(expenseTransactions, dataset.ecommerceOrders);

    const incomeStabilityScore = incomeMonthlyValues.length
      ? scoreFromCv(incomeMonthlyValues)
      : dataset.profile?.incomeFrequency === "MONTHLY"
        ? 70
        : 35;
    const spendingStabilityScore = expenseMonthlyValues.length
      ? scoreFromCv(expenseMonthlyValues)
      : 50;
    const cashFlowStabilityScore = cashFlowMonthlyValues.length
      ? scoreFromCv(cashFlowMonthlyValues.map((value) => Math.max(value, 0)))
      : 50;
    const savingsRatio = ratio(monthlySavings, monthlyIncome) * 100;
    const expenseIncomeRatio = ratio(monthlyExpenses, monthlyIncome) * 100;
    const emergencyFundRatio = ratio(toNumber(dataset.profile?.emergencyFund), monthlyExpenses) * 100;
    const emergencyBufferMonths = ratio(toNumber(dataset.profile?.emergencyFund), monthlyExpenses);
    const investmentCapacity =
      toNumber(dataset.profile?.existingInvestments) +
      Math.max(monthlyCashFlow * 0.3, 0) +
      investmentTransactions.reduce((sum, tx) => sum + toNumber(tx.amount), 0);

    const savingsDisciplineScore = round(
      clamp(savingsRatio / 30) * 55 +
      clamp(emergencyBufferMonths / 6) * 25 +
      (dataset.profile?.savingsHabit === "AUTOMATED"
        ? 20
        : dataset.profile?.savingsHabit === "REGULAR"
          ? 15
          : dataset.profile?.savingsHabit === "OCCASIONAL"
            ? 8
            : 0)
    );

    const budgetDisciplineScore = round(
      clamp(1 - expenseIncomeRatio / 100) * 60 +
      clamp(spendingStabilityScore / 100) * 25 +
      clamp(merchantScores.merchantDiversityScore / 100) * 15
    );

    const financialDisciplineScore = round(
      mean([
        utilityScores.utilityReliabilityScore,
        rechargeScores.rechargeReliabilityScore,
        savingsDisciplineScore,
        budgetDisciplineScore,
        incomeStabilityScore,
        cashFlowStabilityScore,
      ])
    );

    const creditReadinessScore = round(
      mean([
        clamp(100 - expenseIncomeRatio, 0, 100),
        savingsDisciplineScore,
        incomeStabilityScore,
        utilityScores.utilityReliabilityScore,
        paymentScores.digitalAdoptionScore,
        financialDisciplineScore,
      ])
    );

    const investmentCapacityScore = round(
      mean([
        clamp(ratio(monthlyCashFlow, monthlyIncome) * 100 * 2, 0, 100),
        clamp(emergencyBufferMonths / 6, 0, 1) * 100,
        clamp(investmentCapacity / Math.max(monthlyIncome, 1), 0, 1) * 100,
      ])
    );

    const financialBehaviourScore = round(
      mean([
        creditReadinessScore,
        financialDisciplineScore,
        spendingStabilityScore,
        utilityScores.utilityReliabilityScore,
        rechargeScores.rechargeReliabilityScore,
        paymentScores.digitalAdoptionScore,
      ])
    );

    const financialHealthFeatureScore = round(
      mean([
        financialBehaviourScore,
        savingsDisciplineScore,
        cashFlowStabilityScore,
        investmentCapacityScore,
        incomeStabilityScore,
      ])
    );

    const source = this._sourceMetadata(dataset, validationIssues);
    const featureQuality = qualityScore;

    const features = [];
    const addFeature = (feature) => {
      features.push(
        this._feature({
          version,
          window,
          qualityScore: featureQuality,
          confidence: feature.confidence ?? featureQuality,
          source,
          ...feature,
        })
      );
    };

    addFeature(this._amountFeature("monthly_income", "Income", monthlyIncome, "Profile monthly income or average monthly income transactions.", "profile.monthlyIncome OR avg(monthly income transactions)", ["FinancialProfile.monthlyIncome", "Transaction.amount"], { max: 200000 }));
    addFeature(this._amountFeature("average_income", "Income", mean(incomeMonthlyValues) || monthlyIncome, "Average observed monthly income.", "avg(monthly income by month)", ["Transaction.amount"], { max: 200000 }));
    addFeature(this._amountFeature("median_income", "Income", median(incomeMonthlyValues) || monthlyIncome, "Median observed monthly income.", "median(monthly income by month)", ["Transaction.amount"], { max: 200000 }));
    addFeature(this._scoreFeature("income_stability_score", "Income", incomeStabilityScore, "Consistency of income over the feature window.", "100 - coefficient_of_variation(monthly income)", ["Transaction.amount", "FinancialProfile.incomeFrequency"]));
    addFeature(this._ratioFeature("income_volatility", "Income", coefficientOfVariation(incomeMonthlyValues) * 100, "Volatility of monthly income.", "stddev(monthly income) / avg(monthly income)", ["Transaction.amount"], { direction: "low", max: 100 }));
    addFeature(this._ratioFeature("income_seasonality", "Income", incomeSeasonality, "Seasonal variation in observed monthly income.", "stddev(monthly income) / avg(monthly income)", ["Transaction.amount"], { direction: "low", max: 120 }));
    addFeature(this._daysFeature("salary_delay_days", "Income", incomeTimingScores.salaryDelayDays, "Average delay from the typical salary deposit day.", "avg(abs(observed income deposit day - median income deposit day))", ["Transaction.transactionDate"], { max: 15, direction: "low" }));
    addFeature(this._countFeature("income_source_diversity", "Income", uniqueCount(incomeTransactions.map((tx) => tx.merchant || tx.merchantRef?.name || tx.description || "income")), "Count of distinct income sources.", "count(distinct income source)", ["Transaction.merchant"], { max: 8 }));
    addFeature(this._amountFeature("average_deposit_size", "Income", mean(incomeTransactions.map((tx) => toNumber(tx.amount))), "Average income deposit size.", "avg(income transaction amount)", ["Transaction.amount"], { max: 100000 }));
    addFeature(this._amountFeature("largest_deposit", "Income", Math.max(0, ...incomeTransactions.map((tx) => toNumber(tx.amount))), "Largest observed income deposit.", "max(income transaction amount)", ["Transaction.amount"], { max: 200000 }));

    addFeature(this._amountFeature("monthly_expenses", "Expense", monthlyExpenses, "Profile monthly expenses or average observed monthly expenses.", "profile.monthlyExpenses OR avg(monthly expense transactions)", ["FinancialProfile.monthlyExpenses", "Transaction.amount"], { max: 150000, direction: "low" }));
    addFeature(this._ratioFeature("expense_income_ratio", "Expense", expenseIncomeRatio, "Share of monthly income spent.", "monthly expenses / monthly income", ["Transaction.amount", "FinancialProfile.monthlyIncome"], { direction: "low", max: 100 }));
    addFeature(this._amountFeature("average_transaction_amount", "Expense", mean(expenseAmounts), "Average expense transaction size.", "avg(expense transaction amount)", ["Transaction.amount"], { max: 20000, direction: "low" }));
    addFeature(this._amountFeature("median_transaction_amount", "Expense", median(expenseAmounts), "Median expense transaction size.", "median(expense transaction amount)", ["Transaction.amount"], { max: 20000, direction: "low" }));
    addFeature(this._amountFeature("largest_expense", "Expense", Math.max(0, ...expenseAmounts), "Largest expense transaction.", "max(expense transaction amount)", ["Transaction.amount"], { max: 100000, direction: "low" }));
    addFeature(this._countFeature("expense_frequency", "Expense", expenseTransactions.length, "Number of expenses in the feature window.", "count(expense transactions)", ["Transaction.id"], { max: 180, direction: "low" }));
    addFeature(this._scoreFeature("spending_stability_score", "Expense", spendingStabilityScore, "Stability of month-to-month spending.", "100 - coefficient_of_variation(monthly expenses)", ["Transaction.amount"]));
    addFeature(this._ratioFeature("weekend_spending_ratio", "Expense", spendingScores.weekendSpendingRatio, "Expense share occurring on weekends.", "weekend expenses / total expenses", ["Transaction.transactionDate"], { max: 60, direction: "low" }));
    addFeature(this._ratioFeature("night_spending_ratio", "Expense", spendingScores.nightSpendingRatio, "Expense share occurring between 10 PM and 6 AM UTC.", "night expenses / total expenses", ["Transaction.transactionDate"], { max: 60, direction: "low" }));
    addFeature(this._ratioFeature("spending_drift", "Expense", spendingDrift, "Recent monthly spending drift versus the earlier half of the window.", "(recent avg monthly expenses - earlier avg monthly expenses) / earlier avg monthly expenses", ["Transaction.amount", "Transaction.transactionDate"], { min: -100, max: 100, direction: "low" }));
    addFeature(this._ratioFeature("cash_spending_ratio", "Expense", paymentScores.cashRatio, "Expense share paid in cash.", "cash expenses / total expenses", ["Transaction.paymentMethod"], { max: 80, direction: "low" }));
    addFeature(this._ratioFeature("digital_spending_ratio", "Expense", paymentScores.digitalRatio, "Expense share paid through digital methods.", "digital expenses / total expenses", ["Transaction.paymentMethod"]));

    addFeature(this._amountFeature("monthly_savings", "Savings", monthlySavings, "Estimated monthly savings.", "monthly income - monthly expenses", ["FinancialProfile.monthlyIncome", "FinancialProfile.monthlyExpenses"], { max: 80000 }));
    addFeature(this._ratioFeature("savings_ratio", "Savings", savingsRatio, "Share of monthly income saved.", "monthly savings / monthly income", ["FinancialProfile.monthlyIncome", "FinancialProfile.monthlyExpenses"], { max: 50 }));
    addFeature(this._ratioFeature("emergency_fund_ratio", "Savings", emergencyFundRatio, "Emergency fund coverage against monthly expenses.", "emergency fund / monthly expenses", ["FinancialProfile.emergencyFund"], { max: 600 }));
    addFeature(this._scoreFeature("savings_discipline_score", "Savings", savingsDisciplineScore, "Strength of recurring savings behaviour.", "weighted savings ratio + emergency buffer + savings habit", ["FinancialProfile.savingsHabit"]));
    addFeature(this._amountFeature("average_monthly_savings", "Savings", mean(dataset.snapshots.map((snapshot) => toNumber(snapshot.monthlySavings))) || monthlySavings, "Average savings from financial snapshots.", "avg(snapshot.monthlySavings)", ["FinancialSnapshot.monthlySavings"], { max: 80000 }));
    addFeature(this._countFeature("savings_streak", "Savings", savingsStreak, "Consecutive latest months with positive savings or observed cash flow.", "count(latest consecutive months where savings or cash flow > 0)", ["FinancialSnapshot.monthlySavings", "Transaction.amount"], { max: 12 }));

    addFeature(this._amountFeature("monthly_cash_flow", "Cash Flow", monthlyCashFlow, "Estimated monthly surplus or deficit.", "monthly income - monthly expenses", ["FinancialProfile.monthlyIncome", "FinancialProfile.monthlyExpenses"], { min: -50000, max: 100000 }));
    addFeature(this._countFeature("positive_cash_flow_months", "Cash Flow", cashFlowMonthlyValues.filter((value) => value > 0).length, "Months with positive observed cash flow.", "count(months where income > expenses)", ["Transaction.amount"], { max: 12 }));
    addFeature(this._countFeature("negative_cash_flow_months", "Cash Flow", cashFlowMonthlyValues.filter((value) => value < 0).length, "Months with negative observed cash flow.", "count(months where expenses > income)", ["Transaction.amount"], { max: 12, direction: "low" }));
    addFeature(this._scoreFeature("cash_flow_stability_score", "Cash Flow", cashFlowStabilityScore, "Stability of monthly cash-flow surplus.", "100 - coefficient_of_variation(positive monthly cash flow)", ["Transaction.amount"]));
    addFeature(this._amountFeature("burn_rate", "Cash Flow", Math.max(monthlyExpenses - monthlyIncome, 0), "Monthly deficit if expenses exceed income.", "max(monthly expenses - monthly income, 0)", ["FinancialProfile.monthlyExpenses"], { max: 50000, direction: "low" }));

    addFeature(this._scoreFeature("utility_reliability_score", "Utility Payments", utilityScores.utilityReliabilityScore, "Reliability of utility bill payments.", "weighted on-time ratio, missed bills, delay days", ["UtilityBill.status", "UtilityBill.paymentDelayDays"]));
    addFeature(this._ratioFeature("utility_on_time_ratio", "Utility Payments", utilityScores.onTimeRatio, "Share of bills paid on time.", "on-time utility bills / total utility bills", ["UtilityBill.status", "UtilityBill.paymentDelayDays"]));
    addFeature(this._daysFeature("average_utility_delay_days", "Utility Payments", utilityScores.averageDelayDays, "Average delay on paid utility bills.", "avg(paymentDelayDays)", ["UtilityBill.paymentDelayDays"], { max: 30, direction: "low" }));
    addFeature(this._countFeature("missed_bills", "Utility Payments", utilityScores.missedBills, "Count of missed utility bills.", "count(status = MISSED)", ["UtilityBill.status"], { max: 12, direction: "low" }));
    addFeature(this._countFeature("utility_diversity", "Utility Payments", utilityScores.utilityDiversity, "Distinct utility types represented.", "count(distinct utilityType)", ["UtilityBill.utilityType"], { max: 5 }));
    addFeature(this._ratioFeature("utility_seasonality", "Utility Payments", utilitySeasonality, "Seasonal variation in monthly utility obligations.", "stddev(monthly utility bills) / avg(monthly utility bills)", ["UtilityBill.amountDue", "UtilityBill.billMonth"], { direction: "low", max: 120 }));

    addFeature(this._scoreFeature("recharge_reliability_score", "Recharge Behaviour", rechargeScores.rechargeReliabilityScore, "Consistency and success of mobile recharge behaviour.", "weighted interval consistency and success ratio", ["MobileRecharge.status", "MobileRecharge.rechargeDate"]));
    addFeature(this._amountFeature("average_recharge_amount", "Recharge Behaviour", rechargeScores.averageAmount, "Average mobile recharge amount.", "avg(recharge amount)", ["MobileRecharge.amount"], { max: 2000 }));
    addFeature(this._countFeature("recharge_frequency", "Recharge Behaviour", dataset.mobileRecharges.length, "Recharge count in the feature window.", "count(mobile recharges)", ["MobileRecharge.id"], { max: 24 }));
    addFeature(this._daysFeature("average_recharge_interval_days", "Recharge Behaviour", rechargeScores.averageIntervalDays, "Average number of days between recharges.", "avg(days between consecutive recharges)", ["MobileRecharge.rechargeDate"], { max: 90, direction: "low" }));
    addFeature(this._ratioFeature("recharge_growth", "Recharge Behaviour", rechargeScores.rechargeGrowth, "Recent recharge spend growth versus the earlier half of the window.", "(recent avg monthly recharge amount - earlier avg monthly recharge amount) / earlier avg monthly recharge amount", ["MobileRecharge.amount", "MobileRecharge.rechargeDate"], { min: -100, max: 100 }));
    addFeature(this._countFeature("recharge_provider_diversity", "Recharge Behaviour", rechargeScores.providerDiversity, "Distinct recharge providers used.", "count(distinct provider)", ["MobileRecharge.provider"], { max: 4 }));

    addFeature(this._scoreFeature("digital_payment_score", "Digital Payments", paymentScores.digitalAdoptionScore, "Adoption of digital payment rails.", "weighted UPI, wallet, card and bank transfer usage", ["Transaction.paymentMethod"]));
    addFeature(this._ratioFeature("upi_ratio", "Digital Payments", paymentScores.upiRatio, "Expense share paid with UPI.", "UPI expenses / total expenses", ["Transaction.paymentMethod"]));
    addFeature(this._ratioFeature("wallet_ratio", "Digital Payments", paymentScores.walletRatio, "Expense share paid with wallets.", "wallet expenses / total expenses", ["Transaction.paymentMethod"]));
    addFeature(this._ratioFeature("card_ratio", "Digital Payments", paymentScores.cardRatio, "Expense share paid with cards.", "card expenses / total expenses", ["Transaction.paymentMethod"]));
    addFeature(this._countFeature("payment_diversity", "Digital Payments", paymentScores.paymentDiversity, "Distinct payment methods used.", "count(distinct paymentMethod)", ["Transaction.paymentMethod"], { max: 5 }));

    addFeature(this._countFeature("merchant_diversity", "Merchant Behaviour", merchantScores.merchantDiversity, "Distinct merchants observed.", "count(distinct merchant)", ["Transaction.merchant", "Merchant.name"], { max: 40 }));
    addFeature(this._scoreFeature("merchant_diversity_score", "Merchant Behaviour", merchantScores.merchantDiversityScore, "Healthy merchant spread without excessive concentration.", "normalized merchant diversity adjusted for concentration", ["Transaction.merchant"]));
    addFeature(this._ratioFeature("merchant_concentration", "Merchant Behaviour", merchantScores.merchantConcentration, "Share of spend at top merchant.", "top merchant spend / total merchant spend", ["Transaction.merchant"], { direction: "low" }));
    addFeature(this._ratioFeature("repeat_merchant_ratio", "Merchant Behaviour", merchantScores.repeatMerchantRatio, "Share of merchants used more than once.", "repeat merchants / total merchants", ["Transaction.merchant"]));
    addFeature(this._ratioFeature("merchant_switching_frequency", "Merchant Behaviour", merchantScores.merchantSwitchingFrequency, "Share of consecutive merchant transitions that switch merchants.", "merchant switches / consecutive merchant transitions", ["Transaction.merchant", "Transaction.transactionDate"], { direction: "low" }));

    addFeature(this._ratioFeature("essential_spend_ratio", "Spending Behaviour", spendingScores.essentialSpendRatio, "Spend share for essential categories.", "essential expenses / total expenses", ["Transaction.category", "Category.name"]));
    addFeature(this._ratioFeature("luxury_spend_ratio", "Spending Behaviour", spendingScores.luxurySpendRatio, "Spend share for luxury/discretionary categories.", "luxury expenses / total expenses", ["Transaction.category", "Category.name"], { direction: "low" }));
    addFeature(this._scoreFeature("budget_discipline_score", "Spending Behaviour", budgetDisciplineScore, "Budget health from expense ratio, stability and merchant spread.", "weighted expense headroom + stability + diversity", ["Transaction.amount"]));
    addFeature(this._ratioFeature("ecommerce_refund_ratio", "Spending Behaviour", ecommerceScores.refundRatio, "Share of ecommerce orders refunded.", "refunded ecommerce orders / total ecommerce orders", ["EcommerceOrder.isRefunded"], { direction: "low" }));
    addFeature(this._amountFeature("average_order_value", "Spending Behaviour", ecommerceScores.averageOrderValue, "Average ecommerce order amount.", "avg(ecommerce order amount)", ["EcommerceOrder.amount"], { max: 20000, direction: "low" }));

    addFeature(this._scoreFeature("financial_discipline_score", "Financial Discipline", financialDisciplineScore, "Composite financial discipline across bills, savings, recharge, income and cash flow.", "mean(core discipline sub-scores)", ["UtilityBill", "MobileRecharge", "FinancialProfile", "Transaction"]));
    addFeature(this._scoreFeature("credit_readiness_score", "Credit Readiness", creditReadinessScore, "ML-ready readiness signal, not a credit decision.", "mean(expense headroom, savings, stability, reliability, digital score, discipline)", ["FinancialFeature"]));
    addFeature(this._amountFeature("disposable_income", "Investment Capacity", Math.max(monthlyCashFlow, 0), "Income remaining after estimated expenses.", "max(monthly income - monthly expenses, 0)", ["FinancialProfile.monthlyIncome", "FinancialProfile.monthlyExpenses"], { max: 100000 }));
    addFeature(this._amountFeature("investment_capacity", "Investment Capacity", investmentCapacity, "Estimated available investment capacity.", "existing investments + positive cash-flow allocation + observed investment transactions", ["FinancialProfile.existingInvestments", "Transaction.amount"], { max: 200000 }));
    addFeature(this._scoreFeature("investment_capacity_score", "Investment Capacity", investmentCapacityScore, "Capacity to take educational micro-investment guidance.", "mean(disposable income ratio, emergency buffer, investment capacity ratio)", ["FinancialProfile"]));
    addFeature(this._scoreFeature("financial_behaviour_score", "Composite Scores", financialBehaviourScore, "Composite score summarizing observed financial behaviour.", "mean(readiness, discipline, stability, utility, recharge, digital)", ["FinancialFeature"]));
    addFeature(this._scoreFeature("financial_health_feature_score", "Composite Scores", financialHealthFeatureScore, "Dashboard-ready feature health index.", "mean(behaviour, savings, cash flow, capacity, income stability)", ["FinancialFeature"]));

    return features;
  }

  _feature(feature) {
    const fallbackNormalizedValue =
      feature.normalizedValue !== undefined
        ? clamp(feature.normalizedValue)
        : normalizeValue(feature.rawValue, feature.normalization);
    const benchmark = feature.benchmark || FEATURE_BENCHMARKS[feature.featureName];
    const percentile = benchmark
      ? percentileFromBenchmark(feature.rawValue, benchmark)
      : round(fallbackNormalizedValue * 100);
    const normalizedValue = benchmark
      ? round(percentile / 100, 6)
      : fallbackNormalizedValue;

    return {
      featureName: feature.featureName,
      featureGroup: feature.featureGroup,
      rawValue: round(feature.rawValue, 6),
      normalizedValue,
      percentile,
      bucket: bucketFor(normalizedValue),
      dataType: feature.dataType,
      window: feature.window,
      version: feature.version,
      qualityScore: round(feature.qualityScore),
      confidence: round(feature.confidence),
      definition: feature.definition,
      formula: feature.formula,
      dependencies: feature.dependencies,
      source: feature.source,
      metadata: {
        ...(feature.metadata || {}),
        percentileBenchmark: benchmark
          ? {
              ...POPULATION_BENCHMARK_SOURCE,
              direction: benchmark.direction,
              points: benchmark.points,
            }
          : {
              name: "normalized feature scale fallback",
              description: "No population benchmark configured; percentile derived from normalized feature scale.",
            },
      },
    };
  }

  _amountFeature(featureName, featureGroup, rawValue, definition, formula, dependencies, normalization = {}) {
    return {
      featureName,
      featureGroup,
      rawValue,
      definition,
      formula,
      dependencies,
      dataType: "AMOUNT",
      normalization: { min: 0, max: 100000, ...normalization },
    };
  }

  _scoreFeature(featureName, featureGroup, rawValue, definition, formula, dependencies) {
    return {
      featureName,
      featureGroup,
      rawValue,
      normalizedValue: clamp(rawValue / 100),
      definition,
      formula,
      dependencies,
      dataType: "SCORE",
    };
  }

  _ratioFeature(featureName, featureGroup, rawValue, definition, formula, dependencies, normalization = {}) {
    return {
      featureName,
      featureGroup,
      rawValue,
      definition,
      formula,
      dependencies,
      dataType: "RATIO",
      normalization: { min: 0, max: 100, ...normalization },
    };
  }

  _countFeature(featureName, featureGroup, rawValue, definition, formula, dependencies, normalization = {}) {
    return {
      featureName,
      featureGroup,
      rawValue,
      definition,
      formula,
      dependencies,
      dataType: "COUNT",
      normalization: { min: 0, max: 20, ...normalization },
    };
  }

  _daysFeature(featureName, featureGroup, rawValue, definition, formula, dependencies, normalization = {}) {
    return {
      featureName,
      featureGroup,
      rawValue,
      definition,
      formula,
      dependencies,
      dataType: "DAYS",
      normalization: { min: 0, max: 60, direction: "low", ...normalization },
    };
  }

  _utilityScores(bills) {
    const total = bills.length;
    const paid = bills.filter((bill) => bill.status === "PAID" || bill.status === "PARTIAL");
    const onTime = paid.filter((bill) => toNumber(bill.paymentDelayDays) === 0).length;
    const missedBills = bills.filter((bill) => bill.status === "MISSED").length;
    const delays = paid.map((bill) => toNumber(bill.paymentDelayDays));
    const averageDelayDays = mean(delays);
    const onTimeRatio = ratio(onTime, total) * 100;
    const missedRatio = ratio(missedBills, total) * 100;

    return {
      onTimeRatio,
      averageDelayDays,
      missedBills,
      utilityDiversity: uniqueCount(bills.map((bill) => bill.utilityType)),
      utilityReliabilityScore: total
        ? round(clamp(onTimeRatio / 100) * 65 + clamp(1 - averageDelayDays / 30) * 25 + clamp(1 - missedRatio / 100) * 10)
        : 50,
    };
  }

  _rechargeScores(recharges, windowStart, windowEnd) {
    const successful = recharges.filter((recharge) => recharge.status === "SUCCESS");
    const amounts = successful.map((recharge) => toNumber(recharge.amount));
    const intervals = [];

    for (let index = 1; index < successful.length; index += 1) {
      intervals.push(daysBetween(successful[index - 1].rechargeDate, successful[index].rechargeDate));
    }

    const intervalScore = intervals.length ? scoreFromCv(intervals) : 50;
    const successRatio = ratio(successful.length, recharges.length) * 100;

    return {
      averageAmount: mean(amounts),
      averageIntervalDays: mean(intervals),
      providerDiversity: uniqueCount(recharges.map((recharge) => recharge.provider)),
      rechargeGrowth: this._monthlyGrowthRate(
        successful,
        "rechargeDate",
        "amount",
        windowStart,
        windowEnd
      ),
      rechargeReliabilityScore: recharges.length
        ? round(clamp(successRatio / 100) * 55 + clamp(intervalScore / 100) * 45)
        : 50,
    };
  }

  _digitalPaymentScores(transactions) {
    const expenses = transactions.filter((tx) => tx.transactionType === "EXPENSE");
    const totalExpense = expenses.reduce((sum, tx) => sum + toNumber(tx.amount), 0);
    const spendByMethod = {};

    for (const tx of expenses) {
      spendByMethod[tx.paymentMethod] = (spendByMethod[tx.paymentMethod] || 0) + toNumber(tx.amount);
    }

    const upiRatio = ratio(spendByMethod.UPI || 0, totalExpense) * 100;
    const walletRatio = ratio(spendByMethod.WALLET || 0, totalExpense) * 100;
    const cardRatio = ratio(spendByMethod.CARD || 0, totalExpense) * 100;
    const bankTransferRatio = ratio(spendByMethod.BANK_TRANSFER || 0, totalExpense) * 100;
    const cashRatio = ratio(spendByMethod.CASH || 0, totalExpense) * 100;
    const digitalRatio = 100 - cashRatio;
    const paymentDiversity = uniqueCount(expenses.map((tx) => tx.paymentMethod));

    return {
      upiRatio,
      walletRatio,
      cardRatio,
      bankTransferRatio,
      cashRatio,
      digitalRatio,
      paymentDiversity,
      digitalAdoptionScore: round(
        clamp(digitalRatio / 100) * 70 +
        clamp(paymentDiversity / 5) * 20 +
        clamp((upiRatio + walletRatio + cardRatio + bankTransferRatio) / 100) * 10
      ),
    };
  }

  _ecommerceScores(orders) {
    const total = orders.length;
    return {
      refundRatio: ratio(orders.filter((order) => order.isRefunded).length, total) * 100,
      returnRatio: ratio(orders.filter((order) => order.isReturned).length, total) * 100,
      averageOrderValue: mean(orders.map((order) => toNumber(order.amount))),
      platformDiversity: uniqueCount(orders.map((order) => order.platform)),
    };
  }

  _spendingScores(expenseTransactions) {
    const totalSpend = expenseTransactions.reduce((sum, tx) => sum + toNumber(tx.amount), 0);
    const weekendSpend = expenseTransactions
      .filter((tx) => [0, 6].includes(new Date(tx.transactionDate).getUTCDay()))
      .reduce((sum, tx) => sum + toNumber(tx.amount), 0);
    const nightSpend = expenseTransactions
      .filter((tx) => {
        const hour = new Date(tx.transactionDate).getUTCHours();
        return hour >= 22 || hour < 6;
      })
      .reduce((sum, tx) => sum + toNumber(tx.amount), 0);
    const essentialSpend = expenseTransactions
      .filter((tx) => this._matchesKeywords(tx, ESSENTIAL_KEYWORDS))
      .reduce((sum, tx) => sum + toNumber(tx.amount), 0);
    const luxurySpend = expenseTransactions
      .filter((tx) => this._matchesKeywords(tx, LUXURY_KEYWORDS))
      .reduce((sum, tx) => sum + toNumber(tx.amount), 0);

    return {
      weekendSpendingRatio: ratio(weekendSpend, totalSpend) * 100,
      nightSpendingRatio: ratio(nightSpend, totalSpend) * 100,
      essentialSpendRatio: ratio(essentialSpend, totalSpend) * 100,
      luxurySpendRatio: ratio(luxurySpend, totalSpend) * 100,
    };
  }

  _merchantScores(expenseTransactions, ecommerceOrders) {
    const merchantSpend = {};
    const merchantTransactionCounts = {};
    const orderedExpenseMerchants = [...expenseTransactions]
      .sort((first, second) => new Date(first.transactionDate) - new Date(second.transactionDate))
      .map((tx) => tx.merchantRef?.name || tx.merchant || tx.description || "Unknown");

    for (const tx of expenseTransactions) {
      const merchant = tx.merchantRef?.name || tx.merchant || tx.description || "Unknown";
      merchantSpend[merchant] = (merchantSpend[merchant] || 0) + toNumber(tx.amount);
      merchantTransactionCounts[merchant] = (merchantTransactionCounts[merchant] || 0) + 1;
    }

    for (const order of ecommerceOrders) {
      const merchant = order.merchant?.name || order.platform || "Ecommerce";
      merchantSpend[merchant] = (merchantSpend[merchant] || 0) + toNumber(order.amount);
      merchantTransactionCounts[merchant] = (merchantTransactionCounts[merchant] || 0) + 1;
    }

    const values = Object.values(merchantSpend);
    const totalSpend = values.reduce((sum, value) => sum + value, 0);
    const topSpend = values.length ? Math.max(...values) : 0;
    const repeatMerchants = Object.values(merchantTransactionCounts).filter((count) => count > 1).length;
    const merchantDiversity = Object.keys(merchantSpend).length;
    const merchantConcentration = ratio(topSpend, totalSpend) * 100;
    const merchantSwitches = orderedExpenseMerchants.reduce((count, merchant, index) => {
      if (index === 0) return count;
      return merchant !== orderedExpenseMerchants[index - 1] ? count + 1 : count;
    }, 0);

    return {
      merchantDiversity,
      merchantConcentration,
      repeatMerchantRatio: ratio(repeatMerchants, merchantDiversity) * 100,
      merchantSwitchingFrequency: ratio(
        merchantSwitches,
        Math.max(orderedExpenseMerchants.length - 1, 0)
      ) * 100,
      merchantDiversityScore: round(clamp(merchantDiversity / 30) * 65 + clamp(1 - merchantConcentration / 100) * 35),
    };
  }

  _incomeTimingScores(incomeTransactions) {
    const largestIncomeByMonth = {};

    for (const tx of incomeTransactions) {
      const key = monthKey(tx.transactionDate);
      const amount = toNumber(tx.amount);

      if (!largestIncomeByMonth[key] || amount > largestIncomeByMonth[key].amount) {
        largestIncomeByMonth[key] = {
          amount,
          dayOfMonth: new Date(tx.transactionDate).getUTCDate(),
        };
      }
    }

    const depositDays = Object.values(largestIncomeByMonth).map((income) => income.dayOfMonth);
    const expectedDay = median(depositDays);
    const salaryDelayDays = mean(depositDays.map((day) => Math.abs(day - expectedDay)));

    return {
      salaryDelayDays,
    };
  }

  _monthlyGrowthRate(records, dateField, amountField, windowStart, windowEnd) {
    if (!records.length || !windowStart || !windowEnd) return 0;

    const midpoint = new Date((new Date(windowStart).getTime() + new Date(windowEnd).getTime()) / 2);
    const earlierByMonth = {};
    const recentByMonth = {};

    for (const record of records) {
      const date = new Date(record[dateField]);
      const target = date < midpoint ? earlierByMonth : recentByMonth;
      const key = monthKey(date);
      target[key] = (target[key] || 0) + toNumber(record[amountField]);
    }

    const earlierAverage = mean(Object.values(earlierByMonth));
    const recentAverage = mean(Object.values(recentByMonth));

    if (earlierAverage <= 0) return recentAverage > 0 ? 100 : 0;
    return round(((recentAverage - earlierAverage) / earlierAverage) * 100);
  }

  _savingsStreak(cashFlowByMonth, snapshots) {
    const savingsByMonth = {};

    for (const snapshot of snapshots) {
      savingsByMonth[monthKey(snapshot.snapshotDate)] = toNumber(snapshot.monthlySavings);
    }

    const sourceByMonth = Object.keys(savingsByMonth).length ? savingsByMonth : cashFlowByMonth;
    const months = Object.keys(sourceByMonth).sort();
    let streak = 0;

    for (let index = months.length - 1; index >= 0; index -= 1) {
      if (toNumber(sourceByMonth[months[index]]) <= 0) break;
      streak += 1;
    }

    return streak;
  }

  _utilitySeasonality(bills) {
    const utilityByMonth = {};

    for (const bill of bills) {
      const key = bill.billMonth || monthKey(bill.dueDate);
      utilityByMonth[key] = (utilityByMonth[key] || 0) + toNumber(bill.amountDue);
    }

    return coefficientOfVariation(Object.values(utilityByMonth)) * 100;
  }

  _monthlyIncome(dataset, incomeTransactions) {
    const profileIncome = toNumber(dataset.profile?.monthlyIncome);
    if (profileIncome > 0) return profileIncome;
    return this._monthlyIncomeFromTransactions(incomeTransactions);
  }

  _monthlyIncomeFromTransactions(transactions) {
    const incomeByMonth = this._sumTransactionsByMonth(
      transactions.filter
        ? transactions.filter((tx) => tx.transactionType === "INCOME")
        : transactions
    );
    return mean(Object.values(incomeByMonth));
  }

  _monthlyExpenses(dataset, expenseTransactions) {
    const profileExpenses = toNumber(dataset.profile?.monthlyExpenses);
    if (profileExpenses > 0) return profileExpenses;
    return mean(Object.values(this._sumTransactionsByMonth(expenseTransactions)));
  }

  _monthlySavings(dataset, monthlyIncome, monthlyExpenses) {
    const latestSnapshot = dataset.snapshots[dataset.snapshots.length - 1];
    if (latestSnapshot) return toNumber(latestSnapshot.monthlySavings);
    return monthlyIncome - monthlyExpenses;
  }

  _sumTransactionsByMonth(transactions) {
    return transactions.reduce((acc, transaction) => {
      const key = monthKey(transaction.transactionDate);
      acc[key] = (acc[key] || 0) + toNumber(transaction.amount);
      return acc;
    }, {});
  }

  _mergeMonthlyCashFlow(incomeByMonth, expenseByMonth) {
    const keys = new Set([...Object.keys(incomeByMonth), ...Object.keys(expenseByMonth)]);
    return [...keys].reduce((acc, key) => {
      acc[key] = (incomeByMonth[key] || 0) - (expenseByMonth[key] || 0);
      return acc;
    }, {});
  }

  _matchesKeywords(transaction, keywords) {
    const text = [
      transaction.category?.name,
      transaction.categoryRef?.name,
      transaction.merchantRef?.name,
      transaction.merchant,
      transaction.description,
      transaction.tags,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return keywords.some((keyword) => text.includes(keyword));
  }

  _scoreDatasetQuality(dataset, issues) {
    const totalRecords =
      dataset.transactions.length +
      dataset.utilityBills.length +
      dataset.mobileRecharges.length +
      dataset.ecommerceOrders.length +
      dataset.snapshots.length;
    const completeness = clamp(totalRecords / 40);
    const highPenalty = issues.filter((issue) => issue.severity === "HIGH").length * 15;
    const mediumPenalty = issues.filter((issue) => issue.severity === "MEDIUM").length * 7;
    const lowPenalty = issues.filter((issue) => issue.severity === "LOW").length * 3;
    const profileBoost = dataset.profile ? 15 : 0;

    return round(clamp((completeness * 85 + profileBoost - highPenalty - mediumPenalty - lowPenalty) / 100) * 100);
  }

  _buildInputSummary(dataset) {
    return {
      hasFinancialProfile: Boolean(dataset.profile),
      snapshots: dataset.snapshots.length,
      transactions: dataset.transactions.length,
      utilityBills: dataset.utilityBills.length,
      mobileRecharges: dataset.mobileRecharges.length,
      ecommerceOrders: dataset.ecommerceOrders.length,
      financialGoals: dataset.goals.length,
    };
  }

  _sourceMetadata(dataset, validationIssues) {
    return {
      inputSummary: this._buildInputSummary(dataset),
      validationIssueCount: validationIssues.length,
      generatedBy: "CreditMiners Financial Feature Engineering Engine",
    };
  }

  _summarizeFeatures(features) {
    const groups = {};

    for (const feature of features) {
      if (!groups[feature.featureGroup]) {
        groups[feature.featureGroup] = {
          featureGroup: feature.featureGroup,
          featureCount: 0,
          averageNormalizedValue: 0,
          averageQualityScore: 0,
          features: [],
        };
      }

      groups[feature.featureGroup].featureCount += 1;
      groups[feature.featureGroup].averageNormalizedValue += toNumber(feature.normalizedValue);
      groups[feature.featureGroup].averageQualityScore += toNumber(feature.qualityScore);
      groups[feature.featureGroup].features.push(feature.featureName);
    }

    const groupSummaries = Object.values(groups).map((group) => ({
      ...group,
      averageNormalizedValue: round(group.averageNormalizedValue / group.featureCount, 4),
      averageQualityScore: round(group.averageQualityScore / group.featureCount),
    }));

    const findRaw = (name) => {
      const feature = features.find((item) => item.featureName === name);
      return feature ? toNumber(feature.rawValue) : null;
    };

    return {
      groups: groupSummaries,
      composites: {
        financialBehaviourScore: findRaw("financial_behaviour_score"),
        financialDisciplineScore: findRaw("financial_discipline_score"),
        creditReadinessScore: findRaw("credit_readiness_score"),
        investmentCapacityScore: findRaw("investment_capacity_score"),
        financialHealthFeatureScore: findRaw("financial_health_feature_score"),
      },
    };
  }

  async _getLatestRun(userId, version) {
    return prisma.financialFeatureRun.findFirst({
      where: {
        userId,
        ...(version ? { version } : {}),
      },
      orderBy: { computedAt: "desc" },
    });
  }

  _serializeJob(job) {
    return {
      id: job.id,
      status: job.status,
      options: job.options,
      createdAt: job.createdAt,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
      runId: job.runId,
      featureCount: job.featureCount,
      summary: job.summary,
      error: job.error,
      implementationStatus: "In Progress",
      productionNote:
        "In-process background jobs are prototype infrastructure; use durable queue workers for Future Production.",
    };
  }

  _trimFeatureJobs() {
    if (featureJobs.size <= MAX_BACKGROUND_JOBS) return;

    const oldestJobIds = [...featureJobs.values()]
      .sort((first, second) => first.createdAt - second.createdAt)
      .slice(0, featureJobs.size - MAX_BACKGROUND_JOBS)
      .map((job) => job.id);

    for (const jobId of oldestJobIds) {
      featureJobs.delete(jobId);
    }
  }

  _validateAmounts(records, type, amountField, issues) {
    const invalid = records.filter((record) => toNumber(record[amountField]) < 0);
    if (invalid.length) {
      issues.push(this._issue(`NEGATIVE_${type}_AMOUNT`, `${invalid.length} ${type.toLowerCase()} records have negative amounts.`, "HIGH"));
    }
  }

  _validateFutureDates(records, type, dateField, windowEnd, issues) {
    const invalid = records.filter((record) => new Date(record[dateField]) > windowEnd);
    if (invalid.length) {
      issues.push(this._issue(`FUTURE_${type}_DATE`, `${invalid.length} ${type.toLowerCase()} records are dated in the future.`, "HIGH"));
    }
  }

  _validateDuplicates(records, keyBuilder, code, issues) {
    const seen = new Set();
    let duplicates = 0;

    for (const record of records) {
      const key = keyBuilder(record);
      if (!key || key.startsWith(":")) continue;
      if (seen.has(key)) duplicates += 1;
      seen.add(key);
    }

    if (duplicates) {
      issues.push(this._issue(code, `${duplicates} possible duplicate records detected.`, "MEDIUM"));
    }
  }

  _issue(code, message, severity, metadata = {}) {
    return {
      code,
      message,
      severity,
      metadata,
    };
  }
}

module.exports = new FinancialFeatureService();
