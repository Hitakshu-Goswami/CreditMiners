const {
  SNAPSHOT_VERSION,
  SNAPSHOT_STATUS,
} = require("../constants/assessmentHistory.constants");

class AssessmentHistoryEngine {
  createSnapshot(data = {}) {
    return {
      sessionId: data.sessionId,
      userId: data.userId,

      conversation: data.conversation || null,
      answers: data.answers || [],
      extractedFeatures: data.extractedFeatures || {},
      behaviourSignals: data.behaviourSignals || {},
      investorPersona: data.investorPersona || {},
      riskProfile: data.riskProfile || {},
      confidence: data.confidence || {},
      goals: data.goals || {},
      recommendationPreparation:
        data.recommendationPreparation || {},
      metadata:
        data.metadata || this.buildMetadata(),

      version: SNAPSHOT_VERSION,

      status: SNAPSHOT_STATUS.CREATED,

      createdAt: new Date(),
    };
  }

  buildHistoryItem(snapshot = {}) {
    return {
      id: snapshot.id,

      sessionId: snapshot.sessionId,

      createdAt: snapshot.createdAt,

      version: snapshot.version,

      investorPersona:
        snapshot.investorPersona,

      riskProfile:
        snapshot.riskProfile,

      confidence:
        snapshot.confidence,

      goals:
        snapshot.goals,
    };
  }

  generateHistory(history = []) {
    return history.map((snapshot) =>
      this.buildHistoryItem(snapshot)
    );
  }

  compareSnapshots(
    latest = {},
    previous = {}
  ) {
    return {
      latest: {
        id: latest.id,
        createdAt: latest.createdAt,
        persona:
          latest.investorPersona,
        risk:
          latest.riskProfile,
        confidence:
          latest.confidence,
      },

      previous: {
        id: previous.id,
        createdAt: previous.createdAt,
        persona:
          previous.investorPersona,
        risk:
          previous.riskProfile,
        confidence:
          previous.confidence,
      },
    };
  }

  buildMetadata() {
    return {
      generatedAt: new Date(),
      engine: "AssessmentHistoryEngine",
      version: SNAPSHOT_VERSION,
    };
  }
}

module.exports =
  new AssessmentHistoryEngine();