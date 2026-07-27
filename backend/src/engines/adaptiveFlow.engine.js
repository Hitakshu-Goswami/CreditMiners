const QuestionEngine = require("./question.engine");

const {
  FLOW_OPERATORS,
  FLOW_ACTIONS,
  VISIBILITY_STATUS,
  SKIP_REASONS,
  DEFAULT_FLOW_CONFIGURATION,
} = require("../constants/adaptiveFlow.constants");

class AdaptiveFlowEngine {
  constructor() {
    this.config = DEFAULT_FLOW_CONFIGURATION;
  }

  getNextQuestion(answers = {}) {
    const questions = this.getVisibleQuestions(answers);

    return (
      questions.find(
        (question) =>
          !Object.prototype.hasOwnProperty.call(
            answers,
            question.key
          )
      ) || null
    );
  }

  getVisibleQuestions(answers = {}) {
    return QuestionEngine.getAllQuestions().filter((question) =>
      this.shouldAskQuestion(question, answers)
    );
  }

  shouldAskQuestion(question, answers = {}) {
    if (!question.active) {
      return false;
    }

    if (
      Object.prototype.hasOwnProperty.call(
        answers,
        question.key
      )
    ) {
      return false;
    }

    if (
      !this.evaluateDependencies(
        question,
        answers
      )
    ) {
      return false;
    }

    return true;
  }

  evaluateDependencies(
    question,
    answers = {}
  ) {
    if (
      !question.dependencies ||
      question.dependencies.length === 0
    ) {
      return true;
    }

    return question.dependencies.every((dependency) =>
      this.evaluateCondition(
        dependency,
        answers
      )
    );
  }

  evaluateCondition(
    condition,
    answers = {}
  ) {
    const answer =
      answers[condition.question];

    switch (condition.operator) {
      case FLOW_OPERATORS.EQUALS:
        return answer === condition.value;

      case FLOW_OPERATORS.NOT_EQUALS:
        return answer !== condition.value;

      case FLOW_OPERATORS.GREATER_THAN:
        return answer > condition.value;

      case FLOW_OPERATORS.GREATER_THAN_OR_EQUAL:
        return answer >= condition.value;

      case FLOW_OPERATORS.LESS_THAN:
        return answer < condition.value;

      case FLOW_OPERATORS.LESS_THAN_OR_EQUAL:
        return answer <= condition.value;

      case FLOW_OPERATORS.INCLUDES:
        return (
          Array.isArray(answer) &&
          answer.includes(condition.value)
        );

      case FLOW_OPERATORS.NOT_INCLUDES:
        return (
          !Array.isArray(answer) ||
          !answer.includes(condition.value)
        );

      case FLOW_OPERATORS.EXISTS:
        return (
          answer !== undefined &&
          answer !== null
        );

      case FLOW_OPERATORS.NOT_EXISTS:
        return (
          answer === undefined ||
          answer === null
        );

      default:
        return false;
    }
  }

  getQuestionStatus(
    question,
    answers = {}
  ) {
    if (
      Object.prototype.hasOwnProperty.call(
        answers,
        question.key
      )
    ) {
      return {
        status:
          VISIBILITY_STATUS.SKIPPED,
        action:
          FLOW_ACTIONS.SKIP,
        reason:
          SKIP_REASONS.ALREADY_ANSWERED,
      };
    }

    if (
      !this.evaluateDependencies(
        question,
        answers
      )
    ) {
      return {
        status:
          VISIBILITY_STATUS.HIDDEN,
        action:
          FLOW_ACTIONS.SKIP,
        reason:
          SKIP_REASONS.DEPENDENCY_FAILED,
      };
    }

    return {
      status:
        VISIBILITY_STATUS.VISIBLE,
      action:
        FLOW_ACTIONS.ASK,
      reason: null,
    };
  }

  getRemainingQuestions(
    answers = {}
  ) {
    return this.getVisibleQuestions(
      answers
    ).filter(
      (question) =>
        !Object.prototype.hasOwnProperty.call(
          answers,
          question.key
        )
    );
  }

  calculateProgress(
    answers = {}
  ) {
    const visibleQuestions =
      this.getVisibleQuestions(
        answers
      );

    if (
      visibleQuestions.length === 0
    ) {
      return 100;
    }

    const answered =
      visibleQuestions.filter((question) =>
        Object.prototype.hasOwnProperty.call(
          answers,
          question.key
        )
      ).length;

    return Number(
      (
        (answered /
          visibleQuestions.length) *
        100
      ).toFixed(2)
    );
  }

  predictCompletion(
    answers = {}
  ) {
    const remaining =
      this.getRemainingQuestions(
        answers
      ).length;

    return {
      remainingQuestions:
        remaining,

      estimatedSeconds:
        remaining *
        this.config
          .estimatedSecondsPerQuestion,

      estimatedMinutes:
        Number(
          (
            (remaining *
              this.config
                .estimatedSecondsPerQuestion) /
            60
          ).toFixed(1)
        ),
    };
  }

  getFlowSummary(
    answers = {}
  ) {
    const nextQuestion =
      this.getNextQuestion(
        answers
      );

    return {
      nextQuestion,

      progress:
        this.calculateProgress(
          answers
        ),

      prediction:
        this.predictCompletion(
          answers
        ),

      remainingQuestions:
        this.getRemainingQuestions(
          answers
        ),
    };
  }
}

module.exports =
  new AdaptiveFlowEngine();