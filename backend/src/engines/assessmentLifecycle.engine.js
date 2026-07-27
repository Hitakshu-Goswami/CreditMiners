const {
  ASSESSMENT_STATUS,
  ASSESSMENT_ACTIONS,
  ASSESSMENT_VERSION_STATUS,
  RESUME_STATUS,
  VERSION,
} = require("../constants/assessmentLifecycle.constants");

class AssessmentLifecycleEngine {
  startAssessment(data = {}) {
    return {
      action: ASSESSMENT_ACTIONS.START,
      status: ASSESSMENT_STATUS.IN_PROGRESS,
      version: VERSION.CURRENT,
      startedAt: new Date(),
      assessmentType: data.assessmentType,
      metadata: data.metadata || {},
    };
  }

  resumeAssessment(assessment = {}) {
    return {
      action: ASSESSMENT_ACTIONS.RESUME,
      resumeStatus: assessment
        ? RESUME_STATUS.AVAILABLE
        : RESUME_STATUS.NOT_AVAILABLE,
      assessment,
    };
  }

  restartAssessment(previousAssessment = {}) {
    return {
      action: ASSESSMENT_ACTIONS.RESTART,
      previousAssessmentId:
        previousAssessment.id || null,
      status: ASSESSMENT_STATUS.RESTARTED,
      restartedAt: new Date(),
      version: VERSION.CURRENT,
    };
  }

  completeAssessment(assessment = {}) {
    return {
      action: ASSESSMENT_ACTIONS.COMPLETE,
      assessmentId: assessment.id,
      status: ASSESSMENT_STATUS.COMPLETED,
      completedAt: new Date(),
    };
  }

  archiveAssessment(assessment = {}) {
    return {
      action: ASSESSMENT_ACTIONS.ARCHIVE,
      assessmentId: assessment.id,
      status: ASSESSMENT_STATUS.ARCHIVED,
      archivedAt: new Date(),
    };
  }

  restoreAssessment(assessment = {}) {
    return {
      action: ASSESSMENT_ACTIONS.RESTORE,
      assessmentId: assessment.id,
      status: ASSESSMENT_STATUS.IN_PROGRESS,
      restoredAt: new Date(),
    };
  }

  generateAssessmentHistory(
    assessments = []
  ) {
    return assessments.map((assessment) =>
      this.buildHistoryItem(assessment)
    );
  }

  compareAssessments(
    currentAssessment = {},
    previousAssessment = {}
  ) {
    return {
      currentAssessmentId:
        currentAssessment.id || null,

      previousAssessmentId:
        previousAssessment.id || null,

      comparison: {
        riskLevel: {
          previous:
            previousAssessment.riskLevel || null,

          current:
            currentAssessment.riskLevel || null,
        },

        investorPersona: {
          previous:
            previousAssessment.investorPersona ||
            null,

          current:
            currentAssessment.investorPersona ||
            null,
        },

        confidenceScore: {
          previous:
            previousAssessment.confidenceScore ||
            null,

          current:
            currentAssessment.confidenceScore ||
            null,
        },
      },
    };
  }

  getVersionInformation() {
    return {
      currentVersion: VERSION.CURRENT,
      supportedVersions:
        VERSION.SUPPORTED,
      status:
        ASSESSMENT_VERSION_STATUS.ACTIVE,
    };
  }

  buildHistoryItem(assessment = {}) {
    return {
      assessmentId: assessment.id,
      startedAt: assessment.startedAt,
      completedAt: assessment.completedAt,
      status: assessment.status,
      version: assessment.version,
      riskLevel: assessment.riskLevel,
      investorPersona:
        assessment.investorPersona,
      confidenceScore:
        assessment.confidenceScore,
    };
  }
}

module.exports =
  new AssessmentLifecycleEngine();