const prisma = require("../config/prisma");

const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

const SESSION_EXPIRY_HOURS = 24;
const DEFAULT_VERSION = "v1";
const DEFAULT_TOTAL_QUESTIONS = 25;

class RiskAssessmentService {
  async startAssessment(userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const existingSession =
      await prisma.riskAssessmentSession.findFirst({
        where: {
          userId,
          status: "IN_PROGRESS",
        },
        include: {
          answers: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    if (existingSession) {
      return this._formatSession(existingSession);
    }

    const expiresAt = new Date(
      Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000
    );

    const session =
      await prisma.riskAssessmentSession.create({
        data: {
          userId,

          status: "IN_PROGRESS",

          currentQuestion: 1,

          answeredQuestions: 0,

          totalQuestions: DEFAULT_TOTAL_QUESTIONS,

          completionPercent: 0,

          version: DEFAULT_VERSION,

          startedAt: new Date(),

          expiresAt,
        },

        include: {
          answers: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    return this._formatSession(session);
  }

  async getCurrentAssessment(userId) {
    const session =
      await prisma.riskAssessmentSession.findFirst({
        where: {
          userId,

          status: "IN_PROGRESS",
        },

        include: {
          answers: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    if (!session) {
      throw new NotFoundError(
        "No active assessment session found."
      );
    }

    return this._formatSession(session);
  }

  async getAssessment(userId, sessionId) {
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

    return this._formatSession(session);
  }

  async getHistory(userId) {
    const sessions =
      await prisma.riskAssessmentSession.findMany({
        where: {
          userId,
        },

        include: {
          answers: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return {
      total: sessions.length,

      sessions: sessions.map((session) =>
        this._formatSession(session)
      ),
    };
  }
    async completeAssessment(userId, sessionId) {
    const session =
      await prisma.riskAssessmentSession.findFirst({
        where: {
          id: sessionId,
          userId,
        },
        include: {
          answers: true,
        },
      });

    if (!session) {
      throw new NotFoundError(
        "Risk assessment session not found."
      );
    }

    if (session.status !== "IN_PROGRESS") {
      throw new BadRequestError(
        "Assessment has already been completed."
      );
    }

    const completedSession =
      await prisma.riskAssessmentSession.update({
        where: {
          id: session.id,
        },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
          completionPercent: 100,
          answeredQuestions: session.answers.length,
          currentQuestion:
            session.totalQuestions,
        },
        include: {
          answers: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    return this._formatSession(completedSession);
  }

  async cancelAssessment(userId, sessionId) {
    const session =
      await prisma.riskAssessmentSession.findFirst({
        where: {
          id: sessionId,
          userId,
        },
      });

    if (!session) {
      throw new NotFoundError(
        "Risk assessment session not found."
      );
    }

    if (session.status !== "IN_PROGRESS") {
      throw new BadRequestError(
        "Assessment cannot be cancelled."
      );
    }

    const cancelled =
      await prisma.riskAssessmentSession.update({
        where: {
          id: session.id,
        },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
        },
        include: {
          answers: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    return this._formatSession(cancelled);
  }

  async saveAnswer(
    userId,
    sessionId,
    questionKey,
    answer
  ) {
    const session =
      await prisma.riskAssessmentSession.findFirst({
        where: {
          id: sessionId,
          userId,
          status: "IN_PROGRESS",
        },
      });

    if (!session) {
      throw new NotFoundError(
        "Active assessment session not found."
      );
    }

    if (!questionKey) {
      throw new BadRequestError(
        "Question key is required."
      );
    }

    if (
      answer === undefined ||
      answer === null
    ) {
      throw new BadRequestError(
        "Answer is required."
      );
    }

    await prisma.riskAssessmentAnswer.upsert({
      where: {
        sessionId_questionKey: {
          sessionId,
          questionKey,
        },
      },

      update: {
        answer,
      },

      create: {
        sessionId,
        questionKey,
        answer,
      },
    });

    const totalAnswers =
      await prisma.riskAssessmentAnswer.count({
        where: {
          sessionId,
        },
      });

    const completion =
      Number(
        (
          (totalAnswers /
            session.totalQuestions) *
          100
        ).toFixed(2)
      );

    const nextQuestion =
      Math.min(
        totalAnswers + 1,
        session.totalQuestions
      );

    const updatedSession =
      await prisma.riskAssessmentSession.update({
        where: {
          id: session.id,
        },
        data: {
          answeredQuestions:
            totalAnswers,

          completionPercent:
            completion,

          currentQuestion:
            nextQuestion,
        },
        include: {
          answers: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    return this._formatSession(updatedSession);
  }
    async updateAnswer(
    userId,
    sessionId,
    questionKey,
    answer
  ) {
    const session =
      await prisma.riskAssessmentSession.findFirst({
        where: {
          id: sessionId,
          userId,
          status: "IN_PROGRESS",
        },
      });

    if (!session) {
      throw new NotFoundError(
        "Active assessment session not found."
      );
    }

    const existingAnswer =
      await prisma.riskAssessmentAnswer.findUnique({
        where: {
          sessionId_questionKey: {
            sessionId,
            questionKey,
          },
        },
      });

    if (!existingAnswer) {
      throw new NotFoundError(
        "Answer not found."
      );
    }

    await prisma.riskAssessmentAnswer.update({
      where: {
        sessionId_questionKey: {
          sessionId,
          questionKey,
        },
      },
      data: {
        answer,
      },
    });

    const updatedSession =
      await prisma.riskAssessmentSession.findUnique({
        where: {
          id: sessionId,
        },
        include: {
          answers: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    return this._formatSession(updatedSession);
  }

  async deleteAnswer(
    userId,
    sessionId,
    questionKey
  ) {
    const session =
      await prisma.riskAssessmentSession.findFirst({
        where: {
          id: sessionId,
          userId,
          status: "IN_PROGRESS",
        },
      });

    if (!session) {
      throw new NotFoundError(
        "Active assessment session not found."
      );
    }

    const existingAnswer =
      await prisma.riskAssessmentAnswer.findUnique({
        where: {
          sessionId_questionKey: {
            sessionId,
            questionKey,
          },
        },
      });

    if (!existingAnswer) {
      throw new NotFoundError(
        "Answer not found."
      );
    }

    await prisma.riskAssessmentAnswer.delete({
      where: {
        sessionId_questionKey: {
          sessionId,
          questionKey,
        },
      },
    });

    const totalAnswers =
      await prisma.riskAssessmentAnswer.count({
        where: {
          sessionId,
        },
      });

    const completion =
      Number(
        (
          (totalAnswers /
            session.totalQuestions) *
          100
        ).toFixed(2)
      );

    await prisma.riskAssessmentSession.update({
      where: {
        id: sessionId,
      },
      data: {
        answeredQuestions:
          totalAnswers,

        completionPercent:
          completion,

        currentQuestion:
          Math.min(
            totalAnswers + 1,
            session.totalQuestions
          ),
      },
    });

    const updatedSession =
      await prisma.riskAssessmentSession.findUnique({
        where: {
          id: sessionId,
        },
        include: {
          answers: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    return this._formatSession(updatedSession);
  }

  async getAnswers(
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

    return {
      sessionId: session.id,

      status: session.status,

      totalAnswers:
        session.answers.length,

      answers: session.answers.map(
        (answer) => ({
          id: answer.id,
          questionKey:
            answer.questionKey,
          answer: answer.answer,
          createdAt:
            answer.createdAt,
          updatedAt:
            answer.updatedAt,
        })
      ),
    };
  }

  async getProgress(
    userId,
    sessionId
  ) {
    const session =
      await prisma.riskAssessmentSession.findFirst({
        where: {
          id: sessionId,
          userId,
        },
      });

    if (!session) {
      throw new NotFoundError(
        "Risk assessment session not found."
      );
    }

    return {
      sessionId: session.id,

      currentQuestion:
        session.currentQuestion,

      answeredQuestions:
        session.answeredQuestions,

      totalQuestions:
        session.totalQuestions,

      completionPercent:
        session.completionPercent,

      status: session.status,
    };
  }
    async resumeAssessment(userId, sessionId) {
    const session = await this._findSession(userId, sessionId);

    if (session.status === "COMPLETED") {
      throw new BadRequestError(
        "Completed assessment cannot be resumed."
      );
    }

    if (session.status === "CANCELLED") {
      throw new BadRequestError(
        "Cancelled assessment cannot be resumed."
      );
    }

    if (this._isExpired(session)) {
      await prisma.riskAssessmentSession.update({
        where: {
          id: session.id,
        },
        data: {
          status: "EXPIRED",
        },
      });

      throw new BadRequestError(
        "Assessment session has expired."
      );
    }

    return this._formatSession(session);
  }

  async _findSession(userId, sessionId) {
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

  async _findActiveSession(userId, sessionId) {
    const session = await this._findSession(
      userId,
      sessionId
    );

    if (session.status !== "IN_PROGRESS") {
      throw new BadRequestError(
        "Assessment session is not active."
      );
    }

    if (this._isExpired(session)) {
      await prisma.riskAssessmentSession.update({
        where: {
          id: session.id,
        },
        data: {
          status: "EXPIRED",
        },
      });

      throw new BadRequestError(
        "Assessment session has expired."
      );
    }

    return session;
  }

  _isExpired(session) {
    if (!session.expiresAt) {
      return false;
    }

    return new Date() > new Date(session.expiresAt);
  }

  _formatSession(session) {
    return {
      id: session.id,
      userId: session.userId,
      status: session.status,
      version: session.version,
      currentQuestion: session.currentQuestion,
      answeredQuestions: session.answeredQuestions,
      totalQuestions: session.totalQuestions,
      completionPercent: session.completionPercent,
      startedAt: session.startedAt,
      completedAt: session.completedAt,
      cancelledAt: session.cancelledAt,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      answers: session.answers || [],
    };
  }
    async _updateProgress(sessionId) {
    const session = await prisma.riskAssessmentSession.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        answers: true,
      },
    });

    if (!session) {
      throw new NotFoundError(
        "Risk assessment session not found."
      );
    }

    const answeredQuestions = session.answers.length;

    const completionPercent = Number(
      (
        (answeredQuestions / session.totalQuestions) *
        100
      ).toFixed(2)
    );

    const currentQuestion = Math.min(
      answeredQuestions + 1,
      session.totalQuestions
    );

    const updatedSession =
      await prisma.riskAssessmentSession.update({
        where: {
          id: sessionId,
        },
        data: {
          answeredQuestions,
          completionPercent,
          currentQuestion,
        },
        include: {
          answers: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    return updatedSession;
  }

  async _completeIfFinished(sessionId) {
    const session = await prisma.riskAssessmentSession.findUnique({
      where: {
        id: sessionId,
      },
    });

    if (!session) {
      throw new NotFoundError(
        "Risk assessment session not found."
      );
    }

    if (
      session.answeredQuestions >=
      session.totalQuestions
    ) {
      return prisma.riskAssessmentSession.update({
        where: {
          id: sessionId,
        },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
          completionPercent: 100,
        },
      });
    }

    return session;
  }

  _calculateCompletion(
    answeredQuestions,
    totalQuestions
  ) {
    if (!totalQuestions) {
      return 0;
    }

    return Number(
      (
        (answeredQuestions / totalQuestions) *
        100
      ).toFixed(2)
    );
  }

  _getNextQuestion(
    answeredQuestions,
    totalQuestions
  ) {
    return Math.min(
      answeredQuestions + 1,
      totalQuestions
    );
  }
}

module.exports = new RiskAssessmentService();