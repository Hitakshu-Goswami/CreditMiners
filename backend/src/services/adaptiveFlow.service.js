const prisma = require("../config/prisma");

const AdaptiveFlowEngine = require("../engines/adaptiveFlow.engine");

const NotFoundError = require("../errors/NotFoundError");

class AdaptiveFlowService {
  async getFlowSummary(userId, sessionId) {
    const session = await this.findSession(
      userId,
      sessionId
    );

    const answers = this.transformAnswers(
      session.answers
    );

    return {
      sessionId: session.id,

      status: session.status,

      version: session.version,

      flow: AdaptiveFlowEngine.getFlowSummary(
        answers
      ),
    };
  }

  async getNextQuestion(userId, sessionId) {
    const session = await this.findSession(
      userId,
      sessionId
    );

    const answers = this.transformAnswers(
      session.answers
    );

    return AdaptiveFlowEngine.getNextQuestion(
      answers
    );
  }

  async getVisibleQuestions(userId, sessionId) {
    const session = await this.findSession(
      userId,
      sessionId
    );

    const answers = this.transformAnswers(
      session.answers
    );

    return AdaptiveFlowEngine.getVisibleQuestions(
      answers
    );
  }

  async getRemainingQuestions(
    userId,
    sessionId
  ) {
    const session = await this.findSession(
      userId,
      sessionId
    );

    const answers = this.transformAnswers(
      session.answers
    );

    return AdaptiveFlowEngine.getRemainingQuestions(
      answers
    );
  }

  async calculateProgress(
    userId,
    sessionId
  ) {
    const session = await this.findSession(
      userId,
      sessionId
    );

    const answers = this.transformAnswers(
      session.answers
    );

    return {
      progress:
        AdaptiveFlowEngine.calculateProgress(
          answers
        ),
    };
  }

  async predictCompletion(
    userId,
    sessionId
  ) {
    const session = await this.findSession(
      userId,
      sessionId
    );

    const answers = this.transformAnswers(
      session.answers
    );

    return AdaptiveFlowEngine.predictCompletion(
      answers
    );
  }

  async getQuestionStatus(
    userId,
    sessionId,
    questionKey
  ) {
    const session = await this.findSession(
      userId,
      sessionId
    );

    const answers = this.transformAnswers(
      session.answers
    );

    const question =
      AdaptiveFlowEngine
        .getVisibleQuestions(answers)
        .find(
          (item) =>
            item.key === questionKey
        );

    if (!question) {
      throw new NotFoundError(
        "Question not found."
      );
    }

    return AdaptiveFlowEngine.getQuestionStatus(
      question,
      answers
    );
  }

  async findSession(
    userId,
    sessionId
  ) {
    const session =
      await prisma.riskAssessmentSession.findFirst({
        where: {
          id: sessionId,
          userId,
        },
        include: {
          answers: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    if (!session) {
      throw new NotFoundError(
        "Risk assessment session not found."
      );
    }

    return session;
  }

  transformAnswers(
    assessmentAnswers
  ) {
    return assessmentAnswers.reduce(
      (result, answer) => {
        result[
          answer.questionKey
        ] = answer.answer;

        return result;
      },
      {}
    );
  }
}

module.exports =
  new AdaptiveFlowService();