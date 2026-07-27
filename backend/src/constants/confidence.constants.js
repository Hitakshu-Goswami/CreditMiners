const CONFIDENCE_DIMENSIONS = Object.freeze({
  COMPLETENESS: "COMPLETENESS",
  CONSISTENCY: "CONSISTENCY",
  BEHAVIOUR: "BEHAVIOUR",
  TIMING: "TIMING",
  QUALITY: "QUALITY",
  OVERALL: "OVERALL",
});

const CONFIDENCE_LEVELS = Object.freeze({
  VERY_LOW: "VERY_LOW",
  LOW: "LOW",
  MODERATE: "MODERATE",
  HIGH: "HIGH",
  VERY_HIGH: "VERY_HIGH",
});

const CONFIDENCE_STATUS = Object.freeze({
  RELIABLE: "RELIABLE",
  MODERATELY_RELIABLE: "MODERATELY_RELIABLE",
  UNRELIABLE: "UNRELIABLE",
  PENDING: "PENDING",
});

const SCORE_RANGE = Object.freeze({
  MIN: 0,
  MAX: 100,
});

const CONFIDENCE_THRESHOLDS = Object.freeze({
  VERY_LOW_MAX: 20,
  LOW_MAX: 40,
  MODERATE_MAX: 60,
  HIGH_MAX: 80,
  VERY_HIGH_MAX: 100,
});

const DIMENSION_WEIGHTS = Object.freeze({
  COMPLETENESS: 0.30,
  CONSISTENCY: 0.25,
  BEHAVIOUR: 0.15,
  TIMING: 0.15,
  QUALITY: 0.15,
});

const COMPLETENESS_FACTORS = Object.freeze([
  "answeredQuestions",
  "requiredQuestionsAnswered",
  "optionalQuestionsAnswered",
  "criticalQuestionsAnswered",
]);

const CONSISTENCY_FACTORS = Object.freeze([
  "contradictions",
  "answerConsistency",
  "decisionConsistency",
]);

const BEHAVIOUR_FACTORS = Object.freeze([
  "planningDiscipline",
  "financialConfidence",
  "behaviourConfidence",
]);

const TIMING_FACTORS = Object.freeze([
  "assessmentDuration",
  "averageResponseTime",
  "fastResponses",
  "slowResponses",
]);

const QUALITY_FACTORS = Object.freeze([
  "emptyAnswers",
  "duplicateAnswers",
  "invalidCorrections",
  "responseQuality",
]);

const CONFIDENCE_REASONS = Object.freeze({
  HIGH_COMPLETENESS:
    "Most assessment questions were answered.",

  LOW_COMPLETENESS:
    "Several assessment questions were skipped.",

  HIGH_CONSISTENCY:
    "Responses were internally consistent.",

  LOW_CONSISTENCY:
    "Contradictory responses were detected.",

  GOOD_TIMING:
    "Assessment was completed with consistent response timing.",

  POOR_TIMING:
    "Response timing indicates reduced assessment reliability.",

  HIGH_QUALITY:
    "Responses were complete and meaningful.",

  LOW_QUALITY:
    "Several responses were incomplete or duplicated.",
});

module.exports = {
  CONFIDENCE_DIMENSIONS,
  CONFIDENCE_LEVELS,
  CONFIDENCE_STATUS,
  SCORE_RANGE,
  CONFIDENCE_THRESHOLDS,
  DIMENSION_WEIGHTS,
  COMPLETENESS_FACTORS,
  CONSISTENCY_FACTORS,
  BEHAVIOUR_FACTORS,
  TIMING_FACTORS,
  QUALITY_FACTORS,
  CONFIDENCE_REASONS,
};