const prisma = require("../config/prisma");

const AssessmentLifecycleEngine = require("../engines/assessmentLifecycle.engine");

const {
  ASSESSMENT_STATUS,
  VERSION,
} = require("../constants/assessmentLifecycle.constants");

class AssessmentLifecycleService {
  async startAssessment(userId, data = {}) {
    const assessment =
      AssessmentLifecycleEngine.startAssessment(data);

    return {
      ...assessment,
      userId,
    };
  }

  async resumeAssessment(sessionId) {
    const assessment =
      await this.findAssessment(sessionId);

    return AssessmentLifecycleEngine.resumeAssessment(
      assessment
    );
  }

  async restartAssessment(sessionId) {
    const assessment =
      await this.findAssessment(sessionId);

    return AssessmentLifecycleEngine.restartAssessment(
      assessment
    );
  }

  async completeAssessment(sessionId) {
    const assessment =
      await this.findAssessment(sessionId);

    return AssessmentLifecycleEngine.completeAssessment(
      assessment
    );
  }

  async archiveAssessment(sessionId) {
    const assessment =
      await this.findAssessment(sessionId);

    return AssessmentLifecycleEngine.archiveAssessment(
      assessment
    );
  }

  async restoreAssessment(sessionId) {
    const assessment =
      await this.findAssessment(sessionId);

    return AssessmentLifecycleEngine.restoreAssessment(
      assessment
    );
  }

  async getAssessmentHistory(userId) {
    const assessments =
      await prisma.assessmentSession.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return AssessmentLifecycleEngine.generateAssessmentHistory(
      assessments
    );
  }

  async compareAssessments(
    currentSessionId,
    previousSessionId
  ) {
    const currentAssessment =
      await this.findAssessment(currentSessionId);

    const previousAssessment =
      await this.findAssessment(previousSessionId);

    return AssessmentLifecycleEngine.compareAssessments(
      currentAssessment,
      previousAssessment
    );
  }

  async getVersionInformation() {
    return AssessmentLifecycleEngine.getVersionInformation();
  }

  async getCurrentAssessment(userId) {
    return prisma.assessmentSession.findFirst({
      where: {
        userId,
        status: ASSESSMENT_STATUS.IN_PROGRESS,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getLatestCompletedAssessment(userId) {
    return prisma.assessmentSession.findFirst({
      where: {
        userId,
        status: ASSESSMENT_STATUS.COMPLETED,
      },
      orderBy: {
        completedAt: "desc",
      },
    });
  }

  async buildAssessmentMetadata() {
    return {
      version: VERSION.CURRENT,
      generatedAt: new Date(),
    };
  }

  async findAssessment(sessionId) {
    const assessment =
      await prisma.assessmentSession.findUnique({
        where: {
          id: sessionId,
        },
      });

    if (!assessment) {
      throw new Error(
        "Assessment session not found."
      );
    }

    return assessment;
  }
}

module.exports =
  new AssessmentLifecycleService(); 