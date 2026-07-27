const prisma = require("../config/prisma");

const ExplainabilityEngine = require("../engines/explainability.engine");

const riskProfilingService = require("./riskProfiling.service");
const investorPersonaService = require("./investorPersona.service");
const goalExtractionService = require("./goalExtraction.service");
const confidenceService = require("./confidence.service");
const behaviourSignalService = require("./behaviourSignal.service");

class ExplainabilityService {
  async generateExplanations(sessionId) {
    const session = await this.findSession(sessionId);

    const profile = await this.buildExplainabilityProfile(session);

    return ExplainabilityEngine.generateExplanations(profile);
  }

  async getRiskExplanation(sessionId) {
    const explanations =
      await this.generateExplanations(sessionId);

    return explanations.riskExplanation;
  }

  async getPersonaExplanation(sessionId) {
    const explanations =
      await this.generateExplanations(sessionId);

    return explanations.personaExplanation;
  }

  async getGoalExplanation(sessionId) {
    const explanations =
      await this.generateExplanations(sessionId);

    return explanations.goalExplanation;
  }

  async getConfidenceExplanation(sessionId) {
    const explanations =
      await this.generateExplanations(sessionId);

    return explanations.confidenceExplanation;
  }

  async getRecommendationExplanation(sessionId) {
    const explanations =
      await this.generateExplanations(sessionId);

    return explanations.recommendationExplanation;
  }

  async buildExplainabilityProfile(session) {
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
      riskFactors: risk.factors || [],
      riskStrengths: risk.strengths || [],
      riskWeaknesses: risk.weaknesses || [],
      riskRecommendations: risk.recommendations || [],
      riskNextSteps: risk.nextSteps || [],

      personaFactors: persona.factors || [],
      personaStrengths: persona.strengths || [],
      personaWeaknesses: persona.weaknesses || [],
      personaRecommendations:
        persona.recommendations || [],
      personaNextSteps: persona.nextSteps || [],

      goalFactors: goals.factors || [],
      goalStrengths: goals.strengths || [],
      goalWeaknesses: goals.weaknesses || [],
      goalRecommendations:
        goals.recommendations || [],
      goalNextSteps: goals.nextSteps || [],

      confidenceFactors:
        confidence.completeness
          ? [
              confidence.completeness,
              confidence.consistency,
              confidence.behaviour,
              confidence.timing,
              confidence.quality,
            ]
          : [],

      confidenceStrengths:
        confidence.strengths || [],

      confidenceWeaknesses:
        confidence.weaknesses || [],

      confidenceRecommendations:
        confidence.recommendations || [],

      confidenceNextSteps:
        confidence.nextSteps || [],

      recommendationFactors: [
        risk.overallRisk,
        persona.persona,
        confidence.overallConfidence,
      ].filter(Boolean),

      recommendationStrengths:
        behaviour.strengths || [],

      recommendationWeaknesses:
        behaviour.weaknesses || [],

      recommendationRecommendations: [
        ...(risk.recommendations || []),
        ...(persona.recommendations || []),
      ],

      recommendationNextSteps: [
        ...(goals.nextSteps || []),
      ],
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
      throw new Error("Assessment session not found.");
    }

    return session;
  }
}

module.exports = new ExplainabilityService();