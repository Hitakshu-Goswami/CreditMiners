const prisma = require("../config/prisma");

const GoalExtractionEngine = require("../engines/goalExtraction.engine");

const NotFoundError = require("../errors/NotFoundError");

class GoalExtractionService {
  async extractGoals(sessionId) {
    const session = await this.findSession(sessionId);

    const answers = this.transformAnswers(
      session.answers
    );

    const goals =
      GoalExtractionEngine.extractGoals(
        answers
      );

    return {
      sessionId,
      totalGoals: goals.length,
      goals,
    };
  }

  async getGoalSummary(sessionId) {
    const { goals } =
      await this.extractGoals(sessionId);

    return {
      totalGoals: goals.length,

      criticalGoals: goals.filter(
        (goal) =>
          goal.priority === "CRITICAL"
      ).length,

      highPriorityGoals: goals.filter(
        (goal) =>
          goal.priority === "HIGH"
      ).length,

      mediumPriorityGoals: goals.filter(
        (goal) =>
          goal.priority === "MEDIUM"
      ).length,

      lowPriorityGoals: goals.filter(
        (goal) =>
          goal.priority === "LOW"
      ).length,
    };
  }

  async getGoalsByPriority(
    sessionId,
    priority
  ) {
    const { goals } =
      await this.extractGoals(sessionId);

    return goals.filter(
      (goal) =>
        goal.priority === priority
    );
  }

  async getGoalsByCategory(
    sessionId,
    category
  ) {
    const { goals } =
      await this.extractGoals(sessionId);

    return goals.filter(
      (goal) =>
        goal.category === category
    );
  }

  async getGoalsByHorizon(
    sessionId,
    horizon
  ) {
    const { goals } =
      await this.extractGoals(sessionId);

    return goals.filter(
      (goal) =>
        goal.horizon === horizon
    );
  }

  async findSession(sessionId) {
    const session =
      await prisma.riskAssessmentSession.findUnique(
        {
          where: {
            id: sessionId,
          },
          include: {
            answers: true,
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

  transformAnswers(answers = []) {
    return answers.reduce(
      (result, answer) => {
        result[answer.questionKey] =
          answer.answer;

        return result;
      },
      {}
    );
  }
}

module.exports =
  new GoalExtractionService();