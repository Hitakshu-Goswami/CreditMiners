const prisma = require("../config/prisma");

const DomainEngine = require("../engines/domain.engine");

const NotFoundError = require("../errors/NotFoundError");

class DomainService {
  async getAssessmentProfile(userId, sessionId) {
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

    const answers = this.transformAnswers(
      session.answers
    );

    return {
      sessionId: session.id,

      version: session.version,

      status: session.status,

      profile:
        DomainEngine.buildProfile(
          answers
        ),
    };
  }

  async getDomainProfile(
    userId,
    sessionId,
    domainKey
  ) {
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

    const answers = this.transformAnswers(
      session.answers
    );

    const domain =
      DomainEngine.getDomain(
        domainKey
      );

    if (!domain) {
      throw new NotFoundError(
        "Assessment domain not found."
      );
    }

    return DomainEngine.evaluateDomain(
      domain,
      answers
    );
  }

  async getAllDomains() {
    return DomainEngine.getAllDomains();
  }

  async getDomain(domainKey) {
    const domain =
      DomainEngine.getDomain(
        domainKey
      );

    if (!domain) {
      throw new NotFoundError(
        "Assessment domain not found."
      );
    }

    return domain;
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
  new DomainService();