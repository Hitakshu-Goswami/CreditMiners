const prisma = require("../config/prisma");
const insightService = require("./insight.service");
const {
  MONTHLY_REPORT_VERSION,
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

const parseReportMonth = (value) => {
  const source = value ? new Date(`${value}-01T00:00:00.000Z`) : new Date();

  if (Number.isNaN(source.getTime())) {
    return new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1));
  }

  return new Date(Date.UTC(source.getUTCFullYear(), source.getUTCMonth(), 1));
};

const toJson = (value) => JSON.parse(JSON.stringify(value));

class ReportService {
  async listMonthlyReports(userId, query = {}) {
    const limit = Math.min(Number(query.limit || 12), 36);

    return prisma.monthlyFinancialReport.findMany({
      where: { userId },
      orderBy: { reportMonth: "desc" },
      take: limit,
    });
  }

  async generateMonthlyReport(userId, options = {}) {
    const reportMonth = parseReportMonth(options.reportMonth);
    const [healthDashboard, creditDashboard, trends, insightPayload, timeline] =
      await Promise.all([
        insightService.getFinancialHealthDashboard(userId),
        insightService.getCreditDashboard(userId),
        insightService.getTrends(userId),
        insightService.getInsights(userId),
        insightService.getTimeline(userId),
      ]);

    const positiveFactors = [
      ...creditDashboard.topPositiveFactors,
      ...insightPayload.insights.filter((insight) => insight.severity === "INFO"),
    ].slice(0, 6);

    const negativeFactors = [
      ...creditDashboard.topNegativeFactors,
      ...insightPayload.insights.filter((insight) =>
        ["MEDIUM", "HIGH"].includes(insight.severity)
      ),
    ].slice(0, 6);

    const recommendations = [
      ...creditDashboard.improvementRoadmap,
      ...insightPayload.insights.map((insight) => ({
        title: insight.title,
        description: insight.recommendedAction,
        category: insight.category,
        estimatedImpact: insight.expectedImpactLabel,
      })),
    ].slice(0, 8);

    const reportData = {
      userId,
      reportMonth,
      summary: this._buildSummary(healthDashboard, creditDashboard, insightPayload),
      positiveFactors: toJson(positiveFactors),
      negativeFactors: toJson(negativeFactors),
      insights: toJson(insightPayload.insights),
      recommendations: toJson(recommendations),
      confidence: round(
        (toNumber(healthDashboard.summary.confidence) +
          toNumber(creditDashboard.confidenceScore)) *
          50,
        2
      ),
      dataCompleteness: round(toNumber(healthDashboard.summary.dataCompleteness) * 100, 2),
      disclaimer: PHASE9_DISCLAIMER,
      sourceTrace: toJson({
        healthDashboard: healthDashboard.metadata,
        creditDashboard: creditDashboard.metadata,
        trends: trends.trends.map((trend) => ({
          family: trend.family,
          featureNames: trend.featureNames,
          points: trend.chartData.length,
        })),
        timelineEventCount: timeline.events.length,
      }),
      version: MONTHLY_REPORT_VERSION,
      status: "GENERATED",
      generatedAt: new Date(),
    };

    return prisma.monthlyFinancialReport.upsert({
      where: {
        userId_reportMonth: {
          userId,
          reportMonth,
        },
      },
      update: reportData,
      create: reportData,
    });
  }

  _buildSummary(healthDashboard, creditDashboard, insightPayload) {
    const currentHealth = healthDashboard.summary.currentCompositeValue;
    const score = creditDashboard.latestCreditLikelihoodScore;
    const risk = creditDashboard.riskBucket;
    const primaryInsight = insightPayload.insights[0]?.title || "More financial history will improve the next report.";

    return [
      `Financial health feature score is ${currentHealth || "not available"}.`,
      score
        ? `Educational credit-likelihood score is ${score} with ${String(risk).toLowerCase()} risk.`
        : "No credit-likelihood assessment is available yet.",
      primaryInsight,
      "All recommendations are habit-oriented and educational.",
    ].join(" ");
  }
}

module.exports = new ReportService();
