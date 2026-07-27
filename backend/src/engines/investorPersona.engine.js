const {
  INVESTOR_PERSONAS,
  PERSONA_CONFIDENCE,
  PERSONA_STATUS,
  PERSONA_SCORE_THRESHOLDS,
} = require("../constants/investorPersona.constants");

class InvestorPersonaEngine {
  generatePersona(profile = {}) {
    const persona =
      this.identifyPersona(profile);

    const confidence =
      this.calculateConfidence(profile);

    return {
      name: persona,

      confidence,

      status:
        PERSONA_STATUS.GENERATED,

      summary:
        this.getSummary(persona),

      strengths:
        this.getStrengths(persona),

      weaknesses:
        this.getWeaknesses(persona),

      recommendations:
        this.getRecommendations(persona),

      suitableProducts:
        this.getSuitableProducts(persona),
    };
  }

  identifyPersona(profile) {
    const risk =
      profile.overallRisk?.level;

    const planning =
      profile.features
        ?.planningDiscipline || 0;

    const knowledge =
      profile.features
        ?.investmentKnowledgeScore || 0;

    if (
      risk === "LOW" &&
      planning >= 70
    ) {
      return INVESTOR_PERSONAS.CONSERVATIVE_SAVER;
    }

    if (
      risk === "MODERATE" &&
      planning >= 70
    ) {
      return INVESTOR_PERSONAS.BALANCED_PLANNER;
    }

    if (
      risk === "MODERATE_HIGH" &&
      knowledge >= 60
    ) {
      return INVESTOR_PERSONAS.GROWTH_INVESTOR;
    }

    if (
      risk === "HIGH" &&
      knowledge >= 80
    ) {
      return INVESTOR_PERSONAS.AGGRESSIVE_WEALTH_BUILDER;
    }

    if (knowledge < 40) {
      return INVESTOR_PERSONAS.GOAL_ORIENTED_BEGINNER;
    }

    return INVESTOR_PERSONAS.DISCIPLINED_ACCUMULATOR;
  }

  calculateConfidence(profile) {
    const score =
      profile.overallRisk?.score || 0;

    if (
      score <=
      PERSONA_SCORE_THRESHOLDS.LOW
    ) {
      return PERSONA_CONFIDENCE.LOW;
    }

    if (
      score <=
      PERSONA_SCORE_THRESHOLDS.MEDIUM
    ) {
      return PERSONA_CONFIDENCE.MEDIUM;
    }

    if (
      score <=
      PERSONA_SCORE_THRESHOLDS.HIGH
    ) {
      return PERSONA_CONFIDENCE.HIGH;
    }

    return PERSONA_CONFIDENCE.VERY_HIGH;
  }

  getSummary(persona) {
    switch (persona) {
      case INVESTOR_PERSONAS.CONSERVATIVE_SAVER:
        return "Focuses on capital preservation with minimal investment risk.";

      case INVESTOR_PERSONAS.BALANCED_PLANNER:
        return "Balances long-term growth with financial stability.";

      case INVESTOR_PERSONAS.GROWTH_INVESTOR:
        return "Prefers long-term capital appreciation through growth-oriented investments.";

      case INVESTOR_PERSONAS.AGGRESSIVE_WEALTH_BUILDER:
        return "Comfortable taking significant risks for maximum long-term wealth creation.";

      case INVESTOR_PERSONAS.GOAL_ORIENTED_BEGINNER:
        return "Has clear financial goals but needs investment guidance.";

      case INVESTOR_PERSONAS.DISCIPLINED_ACCUMULATOR:
        return "Consistently saves and invests with long-term discipline.";

      case INVESTOR_PERSONAS.HIGH_RISK_EXPLORER:
        return "Actively seeks high-risk, high-reward investment opportunities.";

      case INVESTOR_PERSONAS.INCOME_FOCUSED_INVESTOR:
        return "Prioritizes stable cash flow and recurring income.";

      default:
        return "Investor profile identified.";
    }
  }

  getStrengths(persona) {
    switch (persona) {
      case INVESTOR_PERSONAS.CONSERVATIVE_SAVER:
        return [
          "Excellent capital preservation",
          "Disciplined saving habits",
          "Strong financial stability",
        ];

      case INVESTOR_PERSONAS.BALANCED_PLANNER:
        return [
          "Good diversification mindset",
          "Long-term planning",
          "Balanced decision making",
        ];

      case INVESTOR_PERSONAS.GROWTH_INVESTOR:
        return [
          "Strong growth orientation",
          "Comfortable with market fluctuations",
          "Long investment horizon",
        ];

      case INVESTOR_PERSONAS.AGGRESSIVE_WEALTH_BUILDER:
        return [
          "High return potential",
          "Excellent confidence",
          "Growth-focused mindset",
        ];

      default:
        return [
          "Financial discipline",
          "Goal awareness",
        ];
    }
  }

  getWeaknesses(persona) {
    switch (persona) {
      case INVESTOR_PERSONAS.CONSERVATIVE_SAVER:
        return [
          "Lower wealth growth potential",
          "Inflation exposure",
        ];

      case INVESTOR_PERSONAS.BALANCED_PLANNER:
        return [
          "Moderate return expectations",
        ];

      case INVESTOR_PERSONAS.GROWTH_INVESTOR:
        return [
          "Higher market volatility",
          "Requires patience",
        ];

      case INVESTOR_PERSONAS.AGGRESSIVE_WEALTH_BUILDER:
        return [
          "Large drawdown risk",
          "Potential overconfidence",
        ];

      default:
        return [
          "Needs continuous financial education",
        ];
    }
  }

  getRecommendations(persona) {
    switch (persona) {
      case INVESTOR_PERSONAS.CONSERVATIVE_SAVER:
        return [
          "Maintain emergency savings",
          "Gradually diversify investments",
        ];

      case INVESTOR_PERSONAS.BALANCED_PLANNER:
        return [
          "Maintain diversified asset allocation",
          "Review goals annually",
        ];

      case INVESTOR_PERSONAS.GROWTH_INVESTOR:
        return [
          "Continue long-term SIP investing",
          "Rebalance portfolio periodically",
        ];

      case INVESTOR_PERSONAS.AGGRESSIVE_WEALTH_BUILDER:
        return [
          "Diversify high-risk investments",
          "Monitor portfolio concentration",
        ];

      default:
        return [
          "Increase financial knowledge",
        ];
    }
  }

  getSuitableProducts(persona) {
    switch (persona) {
      case INVESTOR_PERSONAS.CONSERVATIVE_SAVER:
        return [
          "Government Bonds",
          "Debt Mutual Funds",
          "Fixed Deposits",
        ];

      case INVESTOR_PERSONAS.BALANCED_PLANNER:
        return [
          "Hybrid Funds",
          "Index Funds",
          "ETFs",
        ];

      case INVESTOR_PERSONAS.GROWTH_INVESTOR:
        return [
          "Equity Mutual Funds",
          "Index Funds",
          "Large Cap Funds",
        ];

      case INVESTOR_PERSONAS.AGGRESSIVE_WEALTH_BUILDER:
        return [
          "Direct Equity",
          "Small Cap Funds",
          "International Equity",
        ];

      default:
        return [
          "Index Funds",
        ];
    }
  }
}

module.exports =
  new InvestorPersonaEngine();