const {
  ANSWER_TYPES,
  VALIDATION_STATUS,
  VALIDATION_ERROR_CODES,
  SANITIZATION_OPTIONS,
  NUMBER_LIMITS,
  PERCENTAGE_LIMITS,
  TEXT_LIMITS,
} = require("../constants/answerValidation.constants");

class AnswerValidationEngine {
  validateAnswer(question, answer) {
    const errors = [];
    const warnings = [];

    const normalizedValue = this.normalizeAnswer(
      question,
      answer
    );

    if (
      question.required &&
      this.isEmpty(normalizedValue)
    ) {
      errors.push({
        code:
          VALIDATION_ERROR_CODES.REQUIRED,
        message:
          "Answer is required.",
      });
    }

    if (
      !this.isEmpty(normalizedValue)
    ) {
      const validation =
        this.validateByType(
          question,
          normalizedValue
        );

      errors.push(...validation.errors);
      warnings.push(
        ...validation.warnings
      );
    }

    return {
      valid: errors.length === 0,

      status:
        errors.length === 0
          ? VALIDATION_STATUS.VALID
          : VALIDATION_STATUS.INVALID,

      normalizedValue,

      errors,

      warnings,
    };
  }

  validateByType(
    question,
    value
  ) {
    switch (question.type) {
      case ANSWER_TYPES.NUMBER:
      case ANSWER_TYPES.DECIMAL:
      case ANSWER_TYPES.CURRENCY:
        return this.validateNumber(
          question,
          value
        );

      case ANSWER_TYPES.PERCENTAGE:
        return this.validatePercentage(
          question,
          value
        );

      case ANSWER_TYPES.TEXT:
        return this.validateText(
          question,
          value
        );

      case ANSWER_TYPES.EMAIL:
        return this.validateEmail(
          value
        );

      case ANSWER_TYPES.PHONE:
        return this.validatePhone(
          value
        );

      case ANSWER_TYPES.DATE:
        return this.validateDate(
          value
        );

      case ANSWER_TYPES.BOOLEAN:
        return this.validateBoolean(
          value
        );

      case ANSWER_TYPES.SINGLE_SELECT:
        return this.validateSingleChoice(
          question,
          value
        );

      case ANSWER_TYPES.MULTI_SELECT:
        return this.validateMultipleChoice(
          question,
          value
        );

      default:
        return {
          errors: [],
          warnings: [],
        };
    }
  }

  normalizeAnswer(
    question,
    value
  ) {
    if (
      value === undefined ||
      value === null
    ) {
      return null;
    }

    switch (question.type) {
      case ANSWER_TYPES.NUMBER:
      case ANSWER_TYPES.DECIMAL:
      case ANSWER_TYPES.CURRENCY:
      case ANSWER_TYPES.PERCENTAGE:
        return Number(value);

      case ANSWER_TYPES.BOOLEAN:
        return Boolean(value);

      case ANSWER_TYPES.TEXT:
      case ANSWER_TYPES.EMAIL:
      case ANSWER_TYPES.PHONE:
        return this.sanitizeText(
          String(value)
        );

      case ANSWER_TYPES.MULTI_SELECT:
        return Array.isArray(value)
          ? [...new Set(value)]
          : [];

      default:
        return value;
    }
  }

  sanitizeText(text) {
    let value = text;

    if (
      SANITIZATION_OPTIONS.TRIM_TEXT
    ) {
      value = value.trim();
    }

    if (
      SANITIZATION_OPTIONS.REMOVE_EXTRA_SPACES
    ) {
      value = value.replace(
        /\s+/g,
        " "
      );
    }

    if (
      SANITIZATION_OPTIONS.REMOVE_HTML
    ) {
      value = value.replace(
        /<[^>]*>/g,
        ""
      );
    }

    if (
      SANITIZATION_OPTIONS.REMOVE_SCRIPT_TAGS
    ) {
      value = value.replace(
        /<script.*?>.*?<\/script>/gi,
        ""
      );
    }

    if (
      SANITIZATION_OPTIONS.CONVERT_EMPTY_TO_NULL &&
      value === ""
    ) {
      return null;
    }

    return value;
  }

  validateNumber(
    question,
    value
  ) {
    const errors = [];

    if (Number.isNaN(value)) {
      errors.push({
        code:
          VALIDATION_ERROR_CODES.INVALID_TYPE,
        message:
          "A valid number is required.",
      });

      return {
        errors,
        warnings: [],
      };
    }

    const min =
      question.validation?.min ??
      NUMBER_LIMITS.MIN;

    const max =
      question.validation?.max ??
      NUMBER_LIMITS.MAX;

    if (value < min) {
      errors.push({
        code:
          VALIDATION_ERROR_CODES.BELOW_MINIMUM,
        message: `Minimum value is ${min}.`,
      });
    }

    if (value > max) {
      errors.push({
        code:
          VALIDATION_ERROR_CODES.ABOVE_MAXIMUM,
        message: `Maximum value is ${max}.`,
      });
    }

    return {
      errors,
      warnings: [],
    };
  }

  validatePercentage(value) {
    const errors = [];

    if (
      Number.isNaN(value) ||
      value <
        PERCENTAGE_LIMITS.MIN ||
      value >
        PERCENTAGE_LIMITS.MAX
    ) {
      errors.push({
        code:
          VALIDATION_ERROR_CODES.OUT_OF_RANGE,
        message:
          "Percentage must be between 0 and 100.",
      });
    }

    return {
      errors,
      warnings: [],
    };
  }

  validateText(
    question,
    value
  ) {
    const errors = [];

    const min =
      question.validation
        ?.minLength ??
      TEXT_LIMITS.MIN_LENGTH;

    const max =
      question.validation
        ?.maxLength ??
      TEXT_LIMITS.MAX_LENGTH;

    if (value.length < min) {
      errors.push({
        code:
          VALIDATION_ERROR_CODES.BELOW_MINIMUM,
        message: `Minimum length is ${min}.`,
      });
    }

    if (value.length > max) {
      errors.push({
        code:
          VALIDATION_ERROR_CODES.ABOVE_MAXIMUM,
        message: `Maximum length is ${max}.`,
      });
    }

    return {
      errors,
      warnings: [],
    };
  }

  validateEmail(value) {
    const errors = [];

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(value)
    ) {
      errors.push({
        code:
          VALIDATION_ERROR_CODES.INVALID_EMAIL,
        message:
          "Invalid email address.",
      });
    }

    return {
      errors,
      warnings: [],
    };
  }

  validatePhone(value) {
    const errors = [];

    const phoneRegex =
      /^[6-9]\d{9}$/;

    if (
      !phoneRegex.test(value)
    ) {
      errors.push({
        code:
          VALIDATION_ERROR_CODES.INVALID_PHONE,
        message:
          "Invalid phone number.",
      });
    }

    return {
      errors,
      warnings: [],
    };
  }

  validateDate(value) {
    const errors = [];

    if (
      Number.isNaN(
        Date.parse(value)
      )
    ) {
      errors.push({
        code:
          VALIDATION_ERROR_CODES.INVALID_DATE,
        message:
          "Invalid date.",
      });
    }

    return {
      errors,
      warnings: [],
    };
  }

  validateBoolean(value) {
    return {
      errors:
        typeof value === "boolean"
          ? []
          : [
              {
                code:
                  VALIDATION_ERROR_CODES.INVALID_TYPE,
                message:
                  "Boolean value expected.",
              },
            ],
      warnings: [],
    };
  }

  validateSingleChoice(
    question,
    value
  ) {
    const errors = [];

    const allowed =
      question.options?.map(
        (option) => option.value
      ) || [];

    if (
      !allowed.includes(value)
    ) {
      errors.push({
        code:
          VALIDATION_ERROR_CODES.INVALID_OPTION,
        message:
          "Invalid option selected.",
      });
    }

    return {
      errors,
      warnings: [],
    };
  }

  validateMultipleChoice(
    question,
    values
  ) {
    const errors = [];

    const allowed =
      question.options?.map(
        (option) => option.value
      ) || [];

    for (const value of values) {
      if (
        !allowed.includes(value)
      ) {
        errors.push({
          code:
            VALIDATION_ERROR_CODES.INVALID_OPTION,
          message: `${value} is not a valid option.`,
        });
      }
    }

    return {
      errors,
      warnings: [],
    };
  }

  isEmpty(value) {
    return (
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) &&
        value.length === 0)
    );
  }
}

module.exports = new AnswerValidationEngine();