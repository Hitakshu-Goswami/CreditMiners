const prisma = require("../config/prisma");

const assessmentHistoryEngine = require("../engines/assessmentHistory.engine");

const behaviourSignalService = require("./behaviourSignal.service");
const confidenceService = require("./confidence.service");
const goalExtractionService = require("./goalExtraction.service");
const investorPersonaService = require("./investorPersona.service");
const recommendationPreparationService = require("./recommendationPreparation.service");
const riskProfilingService = require("./riskProfiling.service");

class AssessmentHistoryService {
  async createSnapshot(sessionId) {
    const session = await this.findSession(sessionId);

    const [
      behaviourSignals,
      confidence,
      goals,
      investorPersona,
      recommendationPreparation,
      riskProfile,
      answers,
    ] = await Promise.all([
      behaviourSignalService.getBehaviourSignals(sessionId),
      confidenceService.getOverallConfidence(sessionId),
      goalExtractionService.extractGoals(sessionId),
      investorPersonaService.generateInvestorPersona(sessionId),
      recommendationPreparationService.generateRecommendationProfile(sessionId),
      riskProfilingService.generateRiskProfile(sessionId),
      this.getAnswers(sessionId),
    ]);

    const snapshot =
      assessmentHistoryEngine.createSnapshot({
        sessionId: session.id,
        userId: session.userId,

        answers,

        behaviourSignals,

        confidence,

        goals,

        investorPersona,

        recommendationPreparation,

        riskProfile,
      });

    return prisma.assessmentHistory.create({
      data: snapshot,
    });
  }

  async getLatestSnapshot(userId) {
    return prisma.assessmentHistory.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getHistory(userId) {
    const history =
      await prisma.assessmentHistory.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return assessmentHistoryEngine.generateHistory(
      history
    );
  }

  async compareSnapshots(
    latestId,
    previousId
  ) {
    const latest =
      await prisma.assessmentHistory.findUnique({
        where: {
          id: latestId,
        },
      });

    const previous =
      await prisma.assessmentHistory.findUnique({
        where: {
          id: previousId,
        },
      });

    return assessmentHistoryEngine.compareSnapshots(
      latest,
      previous
    );
  }

  async deleteSnapshot(snapshotId) {
    return prisma.assessmentHistory.delete({
      where: {
        id: snapshotId,
      },
    });
  }

  async findSession(sessionId) {
    const session =
      await prisma.riskAssessmentSession.findUnique({
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

  async getAnswers(sessionId) {
    return prisma.riskAssessmentAnswer.findMany({
      where: {
        sessionId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }
}

module.exports =
  new AssessmentHistoryService();