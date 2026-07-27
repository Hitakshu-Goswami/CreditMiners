const {
  RECOMMENDATION_PREPARATION_TYPES,
  ASSET_ALLOCATION_MODELS,
  INVESTMENT_CATEGORIES,
  LIQUIDITY_LEVELS,
  INVESTMENT_FREQUENCIES,
  EMERGENCY_FUND_GUIDELINES,
  PREPARATION_STATUS,
} = require("../constants/recommendationPreparation.constants");

class RecommendationPreparationEngine {
  generateRecommendationProfile(profile = {}) {
    const assetAllocation =
      this.generateAssetAllocation(profile);

    const investmentCategories =
      this.generateInvestmentCategories(profile);

    const liquidityPreference =
      this.generateLiquidityPreference(profile);

    const investmentFrequency =
      this.generateInvestmentFrequency(profile);

    const goalPriorities =
      this.generateGoalPriorities(profile);

    return {
      type:
        RECOMMENDATION_PREPARATION_TYPES.RECOMMENDATION_PROFILE,

      status: PREPARATION_STATUS.GENERATED,

      assetAllocation,

      investmentCategories,

      liquidityPreference,

      investmentFrequency,

      goalPriorities,
    };
  }

  generateAssetAllocation(profile) {
    const riskLevel =
      profile.riskLevel || "MODERATE";

    let allocation =
      ASSET_ALLOCATION_MODELS.MODERATE;

    if (riskLevel === "LOW") {
      allocation =
        ASSET_ALLOCATION_MODELS.CONSERVATIVE;
    }

    if (
      riskLevel === "HIGH" ||
      riskLevel === "VERY_HIGH"
    ) {
      allocation =
        ASSET_ALLOCATION_MODELS.AGGRESSIVE;
    }

    return {
      type:
        RECOMMENDATION_PREPARATION_TYPES.ASSET_ALLOCATION,

      allocation,
    };
  }

  generateInvestmentCategories(profile) {
    const categories = [];

    const riskLevel =
      profile.riskLevel || "MODERATE";

    if (
      riskLevel === "VERY_HIGH" ||
      riskLevel === "HIGH"
    ) {
      categories.push(
        INVESTMENT_CATEGORIES.EQUITY_MUTUAL_FUNDS,
        INVESTMENT_CATEGORIES.INDEX_FUNDS,
        INVESTMENT_CATEGORIES.ETF
      );
    } else if (riskLevel === "MODERATE") {
      categories.push(
        INVESTMENT_CATEGORIES.INDEX_FUNDS,
        INVESTMENT_CATEGORIES.DEBT_MUTUAL_FUNDS,
        INVESTMENT_CATEGORIES.GOLD_ETF
      );
    } else {
      categories.push(
        INVESTMENT_CATEGORIES.FIXED_DEPOSITS,
        INVESTMENT_CATEGORIES.PPF,
        INVESTMENT_CATEGORIES.GOVERNMENT_SECURITIES
      );
    }

    return {
      type:
        RECOMMENDATION_PREPARATION_TYPES.INVESTMENT_CATEGORIES,

      categories,
    };
  }

  generateLiquidityPreference(profile) {
    const liquidity =
      profile.liquidityPreference ||
      LIQUIDITY_LEVELS.MEDIUM;

    return {
      type:
        RECOMMENDATION_PREPARATION_TYPES.LIQUIDITY_PREFERENCE,

      level: liquidity,

      emergencyReserve:
        EMERGENCY_FUND_GUIDELINES[liquidity],
    };
  }

  generateInvestmentFrequency(profile) {
    return {
      type:
        RECOMMENDATION_PREPARATION_TYPES.INVESTMENT_FREQUENCY,

      frequency:
        profile.investmentFrequency ||
        INVESTMENT_FREQUENCIES.MONTHLY,

      recommendedDay:
        profile.recommendedDay || 5,
    };
  }

  generateGoalPriorities(profile) {
    return {
      type:
        RECOMMENDATION_PREPARATION_TYPES.GOAL_PRIORITIES,

      goals:
        profile.goalPriorities || [],
    };
  }
}

module.exports =
  new RecommendationPreparationEngine();