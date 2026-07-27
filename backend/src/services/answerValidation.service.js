const QuestionEngine = require("../engines/question.engine");

const AnswerValidationEngine = require("../engines/answerValidation.engine");

const NotFoundError = require("../errors/NotFoundError");

class AnswerValidationService {
  async validateAnswer(questionKey, answer) {
    const question =
      QuestionEngine.getQuestionByKey(questionKey);

    if (!question) {
      throw new NotFoundError(
        "Question not found."
      );
    }

    const validation =
      AnswerValidationEngine.validateAnswer(
        question,
        answer
      );

    return {
      questionKey: question.key,
      questionTitle: question.title,
      questionType: question.type,
      required: question.required,
      ...validation,
    };
  }

  async validateMultipleAnswers(answers = []) {
    const results = [];

    for (const item of answers) {
      results.push(
        await this.validateAnswer(
          item.questionKey,
          item.answer
        )
      );
    }

    return {
      totalAnswers: results.length,
      validAnswers: results.filter(
        (result) => result.valid
      ).length,
      invalidAnswers: results.filter(
        (result) => !result.valid
      ).length,
      results,
    };
  }

  async normalizeAnswer(questionKey, answer) {
    const question =
      QuestionEngine.getQuestionByKey(questionKey);

    if (!question) {
      throw new NotFoundError(
        "Question not found."
      );
    }

    return {
      questionKey: question.key,
      normalizedValue:
        AnswerValidationEngine.normalizeAnswer(
          question,
          answer
        ),
    };
  }

  async getQuestionValidationRules(questionKey) {
    const question =
      QuestionEngine.getQuestionByKey(questionKey);

    if (!question) {
      throw new NotFoundError(
        "Question not found."
      );
    }

    return {
      questionKey: question.key,
      type: question.type,
      required: question.required,
      validation:
        question.validation || {},
      options: question.options || [],
    };
  }

  async validateAssessmentAnswers(
    assessmentAnswers = {}
  ) {
    const results = [];

    for (const [questionKey, answer] of Object.entries(
      assessmentAnswers
    )) {
      results.push(
        await this.validateAnswer(
          questionKey,
          answer
        )
      );
    }

    const validAnswers = results.filter(
      (result) => result.valid
    );

    const invalidAnswers = results.filter(
      (result) => !result.valid
    );

    return {
      totalAnswers: results.length,
      validAnswers: validAnswers.length,
      invalidAnswers: invalidAnswers.length,
      isValid: invalidAnswers.length === 0,
      results,
    };
  }
}

module.exports =
  new AnswerValidationService();