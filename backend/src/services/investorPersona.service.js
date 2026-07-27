const prisma = require("../config/prisma");

const InvestorPersonaEngine = require("../engines/investorPersona.engine");

const riskProfilingService = require("./riskProfiling.service");
const behaviourSignalService = require("./behaviourSignal.service");
const goalExtractionService = require("./goalExtraction.service");
const domainService = require("./domain.service");

const NotFoundError = require("../errors/NotFoundError");

class InvestorPersonaService {
  async generatePersona(sessionId) {
    await this.findSession(sessionId);

    const profile =
      await this.buildInvestorProfile(sessionId);

    const persona =
      InvestorPersonaEngine.generatePersona(
        profile
      );

    return {
      sessionId,
      generatedAt: new Date(),
      persona,
    };
  }

  async getPersonaSummary(sessionId) {
    const { persona } =
      await this.generatePersona(sessionId);

    return {
      name: persona.name,
      confidence: persona.confidence,
      summary: persona.summary,
    };
  }

  async getRecommendations(sessionId) {
    const { persona } =
      await this.generatePersona(sessionId);

    return persona.recommendations;
  }

  async getSuitableProducts(sessionId) {
    const { persona } =
      await this.generatePersona(sessionId);

    return persona.suitableProducts;
  }

  async buildInvestorProfile(sessionId) {
    const riskProfile =
      await riskProfilingService.generateRiskProfile(
        sessionId
      );

    const behaviour =
      await behaviourSignalService.generateBehaviourSignals(
        sessionId
      );

    const goals =
      await goalExtractionService.extractGoals(
        sessionId
      );

    const domains =
      await domainService.getAssessmentProfile(
        sessionId
      );

    return {
      overallRisk:
        riskProfile.profile.overallRisk,

      riskProfile:
        riskProfile.profile,

      features:
        behaviour.signals,

      goals:
        goals.goals,

      domains,
    };
  }

  async findSession(sessionId) {
    const session =
      await prisma.riskAssessmentSession.findUnique(
        {
          where: {
            id: sessionId,
          },
        }
      );

    if (!session) {
      throw new NotFoundError(
        "Assessment session not found."
      );
    }

    return session;
  }
}

module.exports =
  new InvestorPersonaService();