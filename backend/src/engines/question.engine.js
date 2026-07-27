const {
  assessmentQuestions,
  QUESTION_VERSION,
  QUESTION_TYPES,
  OPERATORS,
} = require("../constants/assessmentQuestions");

class QuestionEngine {
  getAllQuestions(version = QUESTION_VERSION) {
    return assessmentQuestions
      .filter(
        (question) =>
          question.version === version &&
          question.active
      )
      .sort((a, b) => a.order - b.order);
  }

  getQuestionByKey(
    key,
    version = QUESTION_VERSION
  ) {
    return this.getAllQuestions(version).find(
      (question) => question.key === key
    );
  }

  getQuestionsBySection(
    section,
    version = QUESTION_VERSION
  ) {
    return this.getAllQuestions(version).filter(
      (question) =>
        question.section === section
    );
  }

  getQuestionsByCategory(
    category,
    version = QUESTION_VERSION
  ) {
    return this.getAllQuestions(version).filter(
      (question) =>
        question.category === category
    );
  }

  getQuestionByOrder(
    order,
    version = QUESTION_VERSION
  ) {
    return this.getAllQuestions(version).find(
      (question) => question.order === order
    );
  }

  validateAnswer(question, answer) {
    if (!question) {
      return {
        valid: false,
        message: "Question not found.",
      };
    }

    if (
      question.required &&
      (answer === undefined ||
        answer === null ||
        answer === "")
    ) {
      return {
        valid: false,
        message: "Answer is required.",
      };
    }

    switch (question.type) {
      case QUESTION_TYPES.NUMBER:
      case QUESTION_TYPES.CURRENCY:
      case QUESTION_TYPES.PERCENTAGE:
        return this.validateNumber(
          question,
          answer
        );

      case QUESTION_TYPES.TEXT:
        return this.validateText(
          question,
          answer
        );

      case QUESTION_TYPES.EMAIL:
        return this.validateEmail(
          answer
        );

      case QUESTION_TYPES.PHONE:
        return this.validatePhone(
          answer
        );

      case QUESTION_TYPES.BOOLEAN:
        return this.validateBoolean(
          answer
        );

      case QUESTION_TYPES.SELECT:
      case QUESTION_TYPES.RADIO:
        return this.validateSelect(
          question,
          answer
        );

      case QUESTION_TYPES.MULTI_SELECT:
      case QUESTION_TYPES.CHECKBOX:
        return this.validateMultiSelect(
          question,
          answer
        );

      default:
        return {
          valid: true,
        };
    }
  }

  validateNumber(question, answer) {
    if (typeof answer !== "number") {
      return {
        valid: false,
        message:
          "Answer must be a number.",
      };
    }

    const validation =
      question.validation || {};

    if (
      validation.min !== undefined &&
      answer < validation.min
    ) {
      return {
        valid: false,
        message: `Minimum allowed value is ${validation.min}.`,
      };
    }

    if (
      validation.max !== undefined &&
      answer > validation.max
    ) {
      return {
        valid: false,
        message: `Maximum allowed value is ${validation.max}.`,
      };
    }

    return {
      valid: true,
    };
  }

  validateText(question, answer) {
    if (typeof answer !== "string") {
      return {
        valid: false,
        message:
          "Answer must be text.",
      };
    }

    const validation =
      question.validation || {};

    if (
      validation.minLength &&
      answer.length <
        validation.minLength
    ) {
      return {
        valid: false,
        message:
          "Text is too short.",
      };
    }

    if (
      validation.maxLength &&
      answer.length >
        validation.maxLength
    ) {
      return {
        valid: false,
        message:
          "Text is too long.",
      };
    }

    return {
      valid: true,
    };
  }

  validateEmail(answer) {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return {
      valid: emailRegex.test(answer),
      message: emailRegex.test(answer)
        ? undefined
        : "Invalid email address.",
    };
  }

  validatePhone(answer) {
    const phoneRegex =
      /^[6-9]\d{9}$/;

    return {
      valid: phoneRegex.test(answer),
      message: phoneRegex.test(answer)
        ? undefined
        : "Invalid phone number.",
    };
  }

  validateBoolean(answer) {
    return {
      valid:
        typeof answer === "boolean",
      message:
        typeof answer === "boolean"
          ? undefined
          : "Answer must be true or false.",
    };
  }

  validateSelect(question, answer) {
    return {
      valid:
        question.options.includes(
          answer
        ),
      message:
        question.options.includes(
          answer
        )
          ? undefined
          : "Invalid option selected.",
    };
  }

  validateMultiSelect(
    question,
    answer
  ) {
    if (!Array.isArray(answer)) {
      return {
        valid: false,
        message:
          "Answer must be an array.",
      };
    }

    const valid =
      answer.every((option) =>
        question.options.includes(option)
      );

    return {
      valid,
      message: valid
        ? undefined
        : "One or more selected options are invalid.",
    };
  }

  isQuestionVisible(
    question,
    answers = {}
  ) {
    if (
      !question.dependencies ||
      question.dependencies.length === 0
    ) {
      return true;
    }

    return question.dependencies.every(
      (dependency) => {
        const answer =
          answers[
            dependency.questionKey
          ];

        switch (
          dependency.operator
        ) {
          case OPERATORS.EQUALS:
            return (
              answer ===
              dependency.value
            );

          case OPERATORS.NOT_EQUALS:
            return (
              answer !==
              dependency.value
            );

          case OPERATORS.GREATER_THAN:
            return (
              answer >
              dependency.value
            );

          case OPERATORS.GREATER_THAN_EQUAL:
            return (
              answer >=
              dependency.value
            );

          case OPERATORS.LESS_THAN:
            return (
              answer <
              dependency.value
            );

          case OPERATORS.LESS_THAN_EQUAL:
            return (
              answer <=
              dependency.value
            );

          case OPERATORS.IN:
            return dependency.value.includes(
              answer
            );

          case OPERATORS.NOT_IN:
            return !dependency.value.includes(
              answer
            );

          default:
            return true;
        }
      }
    );
  }

  getNextQuestion(
    currentQuestionKey,
    answers = {},
    version = QUESTION_VERSION
  ) {
    const questions =
      this.getAllQuestions(version);

    const currentIndex =
      questions.findIndex(
        (question) =>
          question.key ===
          currentQuestionKey
      );

    for (
      let i = currentIndex + 1;
      i < questions.length;
      i++
    ) {
      if (
        this.isQuestionVisible(
          questions[i],
          answers
        )
      ) {
        return questions[i];
      }
    }

    return null;
  }
}

module.exports = new QuestionEngine();