const {
  RISK_DIMENSIONS,
  RISK_LEVELS,
  RISK_STATUS,
  SCORE_RANGE,
  RISK_THRESHOLDS,
  DIMENSION_WEIGHTS,
  INVESTMENT_FACTORS,
  BEHAVIOUR_FACTORS,
  LIQUIDITY_FACTORS,
  INCOME_FACTORS,
  GOAL_FACTORS,
  EMOTIONAL_FACTORS,
  KNOWLEDGE_FACTORS,
} = require("../constants/riskProfiling.constants");

class RiskProfilingEngine {
  generateRiskProfile(features = {}) {
    const profile = {
      investmentRisk: this.evaluateInvestmentRisk(features),
      behaviourRisk: this.evaluateBehaviourRisk(features),
      liquidityRisk: this.evaluateLiquidityRisk(features),
      incomeRisk: this.evaluateIncomeRisk(features),
      goalRisk: this.evaluateGoalRisk(features),
      emotionalRisk: this.evaluateEmotionalRisk(features),
      knowledgeRisk: this.evaluateKnowledgeRisk(features),
    };

    profile.overallRisk =
      this.calculateOverallRisk(profile);

    return profile;
  }

  evaluateInvestmentRisk(features) {
    return this.buildRiskDimension(
      RISK_DIMENSIONS.INVESTMENT,
      INVESTMENT_FACTORS,
      features
    );
  }

  evaluateBehaviourRisk(features) {
    return this.buildRiskDimension(
      RISK_DIMENSIONS.BEHAVIOUR,
      BEHAVIOUR_FACTORS,
      features
    );
  }

  evaluateLiquidityRisk(features) {
    return this.buildRiskDimension(
      RISK_DIMENSIONS.LIQUIDITY,
      LIQUIDITY_FACTORS,
      features
    );
  }

  evaluateIncomeRisk(features) {
    return this.buildRiskDimension(
      RISK_DIMENSIONS.INCOME,
      INCOME_FACTORS,
      features
    );
  }

  evaluateGoalRisk(features) {
    return this.buildRiskDimension(
      RISK_DIMENSIONS.GOAL,
      GOAL_FACTORS,
      features
    );
  }

  evaluateEmotionalRisk(features) {
    return this.buildRiskDimension(
      RISK_DIMENSIONS.EMOTIONAL,
      EMOTIONAL_FACTORS,
      features
    );
  }

  evaluateKnowledgeRisk(features) {
    return this.buildRiskDimension(
      RISK_DIMENSIONS.KNOWLEDGE,
      KNOWLEDGE_FACTORS,
      features
    );
  }

  buildRiskDimension(
    dimension,
    factors,
    features
  ) {
    const score =
      this.calculateAverageScore(
        factors,
        features
      );

    return {
      dimension,
      score,
      level:
        this.determineRiskLevel(score),
      status:
        RISK_STATUS.CALCULATED,
      factors,
    };
  }

  calculateAverageScore(
    factors,
    features
  ) {
    const values = factors
      .map((factor) => features[factor])
      .filter(
        (value) =>
          typeof value === "number"
      );

    if (values.length === 0) {
      return 0;
    }

    const total = values.reduce(
      (sum, value) => sum + value,
      0
    );

    return Math.round(
      total / values.length
    );
  }

  calculateOverallRisk(profile) {
    const weightedScore =
      Object.entries(
        DIMENSION_WEIGHTS
      ).reduce(
        (total, [key, weight]) => {
          const dimension =
            profile[
              `${key.toLowerCase()}Risk`
            ];

          if (!dimension) {
            return total;
          }

          return (
            total +
            dimension.score * weight
          );
        },
        0
      );

    const score = Math.round(
      Math.max(
        SCORE_RANGE.MIN,
        Math.min(
          SCORE_RANGE.MAX,
          weightedScore
        )
      )
    );

    return {
      dimension:
        RISK_DIMENSIONS.OVERALL,
      score,
      level:
        this.determineRiskLevel(score),
      status:
        RISK_STATUS.CALCULATED,
    };
  }

  determineRiskLevel(score) {
    if (
      score <=
      RISK_THRESHOLDS.VERY_LOW_MAX
    ) {
      return RISK_LEVELS.VERY_LOW;
    }

    if (
      score <=
      RISK_THRESHOLDS.LOW_MAX
    ) {
      return RISK_LEVELS.LOW;
    }

    if (
      score <=
      RISK_THRESHOLDS.MODERATE_MAX
    ) {
      return RISK_LEVELS.MODERATE;
    }

    if (
      score <=
      RISK_THRESHOLDS.MODERATE_HIGH_MAX
    ) {
      return RISK_LEVELS.MODERATE_HIGH;
    }

    return RISK_LEVELS.HIGH;
  }
}

module.exports =
  new RiskProfilingEngine();