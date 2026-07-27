const prisma = require("../config/prisma");

const RecommendationPreparationEngine = require("../engines/recommendationPreparation.engine");

const riskProfilingService = require("./riskProfiling.service");
const investorPersonaService = require("./investorPersona.service");
const goalExtractionService = require("./goalExtraction.service");
const confidenceService = require("./confidence.service");
const behaviourSignalService = require("./behaviourSignal.service");

class RecommendationPreparationService {
  async generateRecommendationProfile(sessionId) {
    const session = await this.findSession(sessionId);

    const profile = await this.buildRecommendationProfile(
      session
    );

    return RecommendationPreparationEngine.generateRecommendationProfile(
      profile
    );
  }

  async getAssetAllocation(sessionId) {
    const recommendation =
      await this.generateRecommendationProfile(
        sessionId
      );

    return recommendation.assetAllocation;
  }

  async getInvestmentCategories(sessionId) {
    const recommendation =
      await this.generateRecommendationProfile(
        sessionId
      );

    return recommendation.investmentCategories;
  }

  async getLiquidityPreference(sessionId) {
    const recommendation =
      await this.generateRecommendationProfile(
        sessionId
      );

    return recommendation.liquidityPreference;
  }

  async getInvestmentFrequency(sessionId) {
    const recommendation =
      await this.generateRecommendationProfile(
        sessionId
      );

    return recommendation.investmentFrequency;
  }

  async getGoalPriorities(sessionId) {
    const recommendation =
      await this.generateRecommendationProfile(
        sessionId
      );

    return recommendation.goalPriorities;
  }

  async buildRecommendationProfile(session) {
    const risk =
      await riskProfilingService.generateRiskProfile(
        session.id
      );

    const persona =
      await investorPersonaService.generatePersona(
        session.id
      );

    const goals =
      await goalExtractionService.extractGoals(
        session.id
      );

    const confidence =
      await confidenceService.generateConfidence(
        session.id
      );

    const behaviour =
      await behaviourSignalService.generateBehaviourSignals(
        session.id
      );

    return {
      riskLevel:
        risk.overallRisk?.level || "MODERATE",

      liquidityPreference:
        risk.liquidityRisk?.level || "MEDIUM",

      investmentFrequency:
        behaviour.investmentFrequency || "MONTHLY",

      recommendedDay: 5,

      goalPriorities:
        goals.goals || [],

      investorPersona:
        persona.persona || null,

      confidence:
        confidence.overallConfidence || null,
    };
  }

  async findSession(sessionId) {
    const session =
      await prisma.assessmentSession.findUnique({
        where: {
          id: sessionId,
        },
      });

    if (!session) {
      throw new Error(
        "Assessment session not found."
      );
    }

    return session;
  }
}

module.exports =
  new RecommendationPreparationService();