const {
  CONFIDENCE_DIMENSIONS,
  CONFIDENCE_LEVELS,
  CONFIDENCE_STATUS,
  SCORE_RANGE,
  CONFIDENCE_THRESHOLDS,
  DIMENSION_WEIGHTS,
} = require("../constants/confidence.constants");

class ConfidenceEngine {
  generateConfidence(assessment = {}) {
    const completeness = this.evaluateCompleteness(assessment);

    const consistency = this.evaluateConsistency(assessment);

    const behaviour = this.evaluateBehaviour(assessment);

    const timing = this.evaluateTiming(assessment);

    const quality = this.evaluateQuality(assessment);

    const overallScore = this.calculateOverallScore([
      completeness,
      consistency,
      behaviour,
      timing,
      quality,
    ]);

    return {
      completeness,
      consistency,
      behaviour,
      timing,
      quality,
      overallConfidence: {
        dimension: CONFIDENCE_DIMENSIONS.OVERALL,
        score: overallScore,
        level: this.determineConfidenceLevel(overallScore),
        status: this.determineConfidenceStatus(overallScore),
      },
    };
  }

  evaluateCompleteness(assessment) {
    const score = assessment.completenessScore ?? SCORE_RANGE.MAX;

    return this.buildDimension(
      CONFIDENCE_DIMENSIONS.COMPLETENESS,
      score
    );
  }

  evaluateConsistency(assessment) {
    const score = assessment.consistencyScore ?? SCORE_RANGE.MAX;

    return this.buildDimension(
      CONFIDENCE_DIMENSIONS.CONSISTENCY,
      score
    );
  }

  evaluateBehaviour(assessment) {
    const score = assessment.behaviourScore ?? SCORE_RANGE.MAX;

    return this.buildDimension(
      CONFIDENCE_DIMENSIONS.BEHAVIOUR,
      score
    );
  }

  evaluateTiming(assessment) {
    const score = assessment.timingScore ?? SCORE_RANGE.MAX;

    return this.buildDimension(
      CONFIDENCE_DIMENSIONS.TIMING,
      score
    );
  }

  evaluateQuality(assessment) {
    const score = assessment.qualityScore ?? SCORE_RANGE.MAX;

    return this.buildDimension(
      CONFIDENCE_DIMENSIONS.QUALITY,
      score
    );
  }

  buildDimension(dimension, score) {
    return {
      dimension,
      score,
      level: this.determineConfidenceLevel(score),
      status: this.determineConfidenceStatus(score),
    };
  }

  calculateOverallScore(dimensions) {
    const weights = {
      [CONFIDENCE_DIMENSIONS.COMPLETENESS]:
        DIMENSION_WEIGHTS.COMPLETENESS,

      [CONFIDENCE_DIMENSIONS.CONSISTENCY]:
        DIMENSION_WEIGHTS.CONSISTENCY,

      [CONFIDENCE_DIMENSIONS.BEHAVIOUR]:
        DIMENSION_WEIGHTS.BEHAVIOUR,

      [CONFIDENCE_DIMENSIONS.TIMING]:
        DIMENSION_WEIGHTS.TIMING,

      [CONFIDENCE_DIMENSIONS.QUALITY]:
        DIMENSION_WEIGHTS.QUALITY,
    };

    const total = dimensions.reduce((sum, dimension) => {
      const weight = weights[dimension.dimension] || 0;

      return sum + dimension.score * weight;
    }, 0);

    return Math.round(total);
  }

  determineConfidenceLevel(score) {
    if (score <= CONFIDENCE_THRESHOLDS.VERY_LOW_MAX)
      return CONFIDENCE_LEVELS.VERY_LOW;

    if (score <= CONFIDENCE_THRESHOLDS.LOW_MAX)
      return CONFIDENCE_LEVELS.LOW;

    if (score <= CONFIDENCE_THRESHOLDS.MODERATE_MAX)
      return CONFIDENCE_LEVELS.MODERATE;

    if (score <= CONFIDENCE_THRESHOLDS.HIGH_MAX)
      return CONFIDENCE_LEVELS.HIGH;

    return CONFIDENCE_LEVELS.VERY_HIGH;
  }

  determineConfidenceStatus(score) {
    if (score >= 80)
      return CONFIDENCE_STATUS.RELIABLE;

    if (score >= 50)
      return CONFIDENCE_STATUS.MODERATELY_RELIABLE;

    return CONFIDENCE_STATUS.UNRELIABLE;
  }
}

module.exports = new ConfidenceEngine();