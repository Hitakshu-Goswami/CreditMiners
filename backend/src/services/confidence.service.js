const prisma = require("../config/prisma");

const ConfidenceEngine = require("../engines/confidence.engine");

const assessmentService = require("./assessment.service");
const domainService = require("./domain.service");
const answerValidationService = require("./answerValidation.service");
const behaviourSignalService = require("./behaviourSignal.service");

class ConfidenceService {
  async generateConfidence(sessionId) {
    const session = await this.findSession(sessionId);

    const featureVector = await this.buildFeatureVector(session);

    return ConfidenceEngine.generateConfidence(featureVector);
  }

  async getOverallConfidence(sessionId) {
    const confidence = await this.generateConfidence(sessionId);

    return confidence.overallConfidence;
  }

  async getConfidenceDimension(sessionId, dimension) {
    const confidence = await this.generateConfidence(sessionId);

    return (
      confidence[dimension] ||
      confidence.overallConfidence
    );
  }

  async getConfidenceSummary(sessionId) {
    const confidence = await this.generateConfidence(sessionId);

    return {
      score: confidence.overallConfidence.score,
      level: confidence.overallConfidence.level,
      status: confidence.overallConfidence.status,
    };
  }

  async buildFeatureVector(session) {
    const domains =
      await domainService.getAssessmentDomains(session.id);

    const validation =
      await answerValidationService.validateAssessment(session.id);

    const behaviour =
      await behaviourSignalService.generateBehaviourSignals(
        session.id
      );

    return {
      completenessScore:
        this.calculateCompletenessScore(
          session,
          validation
        ),

      consistencyScore:
        this.calculateConsistencyScore(validation),

      behaviourScore:
        behaviour?.overallBehaviour?.score ?? 100,

      timingScore:
        this.calculateTimingScore(session),

      qualityScore:
        this.calculateQualityScore(validation),
    };
  }

  calculateCompletenessScore(session, validation) {
    const total =
      session.totalQuestions || 0;

    const answered =
      session.answeredQuestions || 0;

    if (!total) {
      return 0;
    }

    return Math.round(
      (answered / total) * 100
    );
  }

  calculateConsistencyScore(validation) {
    if (!validation) {
      return 100;
    }

    return validation.consistencyScore ?? 100;
  }

  calculateTimingScore(session) {
    return session.timingScore ?? 100;
  }

  calculateQualityScore(validation) {
    if (!validation) {
      return 100;
    }

    return validation.qualityScore ?? 100;
  }

  async findSession(sessionId) {
    const session =
      await prisma.assessmentSession.findUnique({
        where: {
          id: sessionId,
        },
      });

    if (!session) {
      throw new Error("Assessment session not found.");
    }

    return session;
  }
}

module.exports = new ConfidenceService();