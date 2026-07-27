const { body, param, query } = require("express-validator");

const {
  QUESTION_SECTIONS,
  QUESTION_CATEGORIES,
} = require("../constants/assessmentQuestions");

const versionValidation = query("version")
  .optional()
  .trim()
  .isString()
  .withMessage("Version must be a string.");

const sessionIdValidation = param("sessionId")
  .isUUID()
  .withMessage("A valid session ID is required.");

const questionKeyValidation = param("key")
  .trim()
  .notEmpty()
  .withMessage("Question key is required.")
  .isLength({ max: 100 })
  .withMessage(
    "Question key cannot exceed 100 characters."
  );

const sectionValidation = param("section")
  .trim()
  .isIn(Object.values(QUESTION_SECTIONS))
  .withMessage("Invalid question section.");

const categoryValidation = param("category")
  .trim()
  .isIn(Object.values(QUESTION_CATEGORIES))
  .withMessage("Invalid question category.");

module.exports = {
  getAllQuestions: [versionValidation],

  getQuestionByKey: [
    questionKeyValidation,
    versionValidation,
  ],

  getQuestionsBySection: [
    sectionValidation,
    versionValidation,
  ],

  getQuestionsByCategory: [
    categoryValidation,
    versionValidation,
  ],

  getCurrentQuestion: [sessionIdValidation],

  getNextQuestion: [sessionIdValidation],

  validateAnswer: [
    body("questionKey")
      .trim()
      .notEmpty()
      .withMessage("Question key is required.")
      .isLength({ max: 100 })
      .withMessage(
        "Question key cannot exceed 100 characters."
      ),

    body("answer")
      .exists({
        checkNull: true,
      })
      .withMessage("Answer is required."),

    body("version")
      .optional()
      .trim()
      .isString()
      .withMessage("Version must be a string."),
  ],
};