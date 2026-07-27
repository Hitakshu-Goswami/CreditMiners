const prisma = require("../config/prisma");

const RiskProfilingEngine = require("../engines/riskProfiling.engine");

const behaviourSignalService = require("./behaviourSignal.service");
const goalExtractionService = require("./goalExtraction.service");
const domainService = require("./domain.service");

const NotFoundError = require("../errors/NotFoundError");

class RiskProfilingService {
  async generateRiskProfile(sessionId) {
    await this.findSession(sessionId);

    const features =
      await this.buildFeatureVector(sessionId);

    const profile =
      RiskProfilingEngine.generateRiskProfile(
        features
      );

    return {
      sessionId,
      generatedAt: new Date(),
      features,
      profile,
    };
  }

  async getOverallRisk(sessionId) {
    const { profile } =
      await this.generateRiskProfile(
        sessionId
      );

    return profile.overallRisk;
  }

  async getRiskDimension(
    sessionId,
    dimension
  ) {
    const { profile } =
      await this.generateRiskProfile(
        sessionId
      );

    const key =
      `${dimension.toLowerCase()}Risk`;

    return profile[key] || null;
  }

  async buildFeatureVector(sessionId) {
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
      ...behaviour.signals,

      goalCount:
        goals.totalGoals,

      domainCompletion:
        domains.completion,

      domainScores:
        domains.domains,
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
  new RiskProfilingService();