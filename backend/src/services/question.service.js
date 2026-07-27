const prisma = require("../config/prisma");

const QuestionEngine = require("../engines/question.engine");

const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

class QuestionService {
  async getAllQuestions(version) {
    return QuestionEngine.getAllQuestions(version);
  }

  async getQuestionByKey(key, version) {
    const question = QuestionEngine.getQuestionByKey(
      key,
      version
    );

    if (!question) {
      throw new NotFoundError(
        "Question not found."
      );
    }

    return question;
  }

  async getQuestionsBySection(
    section,
    version
  ) {
    return QuestionEngine.getQuestionsBySection(
      section,
      version
    );
  }

  async getQuestionsByCategory(
    category,
    version
  ) {
    return QuestionEngine.getQuestionsByCategory(
      category,
      version
    );
  }

  async getCurrentQuestion(
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
          answers: true,
        },
      });

    if (!session) {
      throw new NotFoundError(
        "Assessment session not found."
      );
    }

    const question =
      QuestionEngine.getQuestionByOrder(
        session.currentQuestion,
        session.version
      );

    if (!question) {
      throw new NotFoundError(
        "Current question not found."
      );
    }

    return question;
  }

  async getNextQuestion(
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
          answers: true,
        },
      });

    if (!session) {
      throw new NotFoundError(
        "Assessment session not found."
      );
    }

    const answers = {};

    session.answers.forEach((answer) => {
      answers[answer.questionKey] =
        answer.answer;
    });

    const currentQuestion =
      QuestionEngine.getQuestionByOrder(
        session.currentQuestion,
        session.version
      );

    if (!currentQuestion) {
      return null;
    }

    return QuestionEngine.getNextQuestion(
      currentQuestion.key,
      answers,
      session.version
    );
  }

  async validateAnswer(
    questionKey,
    answer,
    version
  ) {
    const question =
      QuestionEngine.getQuestionByKey(
        questionKey,
        version
      );

    if (!question) {
      throw new NotFoundError(
        "Question not found."
      );
    }

    return QuestionEngine.validateAnswer(
      question,
      answer
    );
  }
}

module.exports = new QuestionService();