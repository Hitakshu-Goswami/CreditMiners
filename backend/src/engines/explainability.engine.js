const {
  EXPLANATION_TYPES,
  EXPLANATION_SECTIONS,
  EXPLANATION_STATUS,
  EXPLANATION_TEMPLATES,
  EXPLANATION_FACTORS,
} = require("../constants/explainability.constants");

class ExplainabilityEngine {
  generateExplanations(profile = {}) {
    return {
      riskExplanation: this.generateRiskExplanation(profile),

      personaExplanation: this.generatePersonaExplanation(profile),

      goalExplanation: this.generateGoalExplanation(profile),

      confidenceExplanation:
        this.generateConfidenceExplanation(profile),

      recommendationExplanation:
        this.generateRecommendationExplanation(profile),
    };
  }

  generateRiskExplanation(profile) {
    return this.buildExplanation(
      EXPLANATION_TYPES.RISK,
      EXPLANATION_TEMPLATES.RISK,
      profile.riskFactors || [],
      profile.riskStrengths || [],
      profile.riskWeaknesses || [],
      profile.riskRecommendations || [],
      profile.riskNextSteps || []
    );
  }

  generatePersonaExplanation(profile) {
    return this.buildExplanation(
      EXPLANATION_TYPES.PERSONA,
      EXPLANATION_TEMPLATES.PERSONA,
      profile.personaFactors || [],
      profile.personaStrengths || [],
      profile.personaWeaknesses || [],
      profile.personaRecommendations || [],
      profile.personaNextSteps || []
    );
  }

  generateGoalExplanation(profile) {
    return this.buildExplanation(
      EXPLANATION_TYPES.GOAL,
      EXPLANATION_TEMPLATES.GOAL,
      profile.goalFactors || [],
      profile.goalStrengths || [],
      profile.goalWeaknesses || [],
      profile.goalRecommendations || [],
      profile.goalNextSteps || []
    );
  }

  generateConfidenceExplanation(profile) {
    return this.buildExplanation(
      EXPLANATION_TYPES.CONFIDENCE,
      EXPLANATION_TEMPLATES.CONFIDENCE,
      profile.confidenceFactors || [],
      profile.confidenceStrengths || [],
      profile.confidenceWeaknesses || [],
      profile.confidenceRecommendations || [],
      profile.confidenceNextSteps || []
    );
  }

  generateRecommendationExplanation(profile) {
    return this.buildExplanation(
      EXPLANATION_TYPES.RECOMMENDATION,
      EXPLANATION_TEMPLATES.RECOMMENDATION,
      profile.recommendationFactors || [],
      profile.recommendationStrengths || [],
      profile.recommendationWeaknesses || [],
      profile.recommendationRecommendations || [],
      profile.recommendationNextSteps || []
    );
  }

  buildExplanation(
    type,
    summary,
    factors,
    strengths,
    weaknesses,
    recommendations,
    nextSteps
  ) {
    return {
      type,

      status: EXPLANATION_STATUS.GENERATED,

      sections: {
        [EXPLANATION_SECTIONS.SUMMARY]: summary,

        [EXPLANATION_SECTIONS.FACTORS]:
          factors.length
            ? factors
            : EXPLANATION_FACTORS[type] || [],

        [EXPLANATION_SECTIONS.STRENGTHS]:
          strengths,

        [EXPLANATION_SECTIONS.WEAKNESSES]:
          weaknesses,

        [EXPLANATION_SECTIONS.RECOMMENDATIONS]:
          recommendations,

        [EXPLANATION_SECTIONS.NEXT_STEPS]:
          nextSteps,
      },
    };
  }
}

module.exports = new ExplainabilityEngine();