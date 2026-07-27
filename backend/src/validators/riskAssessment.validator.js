const { body, param } = require("express-validator");

const uuidMessage = "A valid session ID is required.";

const sessionIdValidation = [
  param("id")
    .isUUID()
    .withMessage(uuidMessage),
];

const questionKeyValidation = [
  param("questionKey")
    .trim()
    .notEmpty()
    .withMessage("Question key is required.")
    .isLength({ max: 100 })
    .withMessage(
      "Question key cannot exceed 100 characters."
    ),
];

const answerValidation = [
  body("answer")
    .exists({
      checkNull: true,
    })
    .withMessage("Answer is required."),
];

module.exports = {
  startAssessment: [],

  getCurrentAssessment: [],

  getHistory: [],

  getAssessment: [
    ...sessionIdValidation,
  ],

  completeAssessment: [
    ...sessionIdValidation,
  ],

  cancelAssessment: [
    ...sessionIdValidation,
  ],

  resumeAssessment: [
    ...sessionIdValidation,
  ],

  getProgress: [
    ...sessionIdValidation,
  ],

  getAnswers: [
    ...sessionIdValidation,
  ],

  saveAnswer: [
    ...sessionIdValidation,

    body("questionKey")
      .trim()
      .notEmpty()
      .withMessage("Question key is required.")
      .isLength({ max: 100 })
      .withMessage(
        "Question key cannot exceed 100 characters."
      ),

    ...answerValidation,
  ],

  updateAnswer: [
    ...sessionIdValidation,

    ...questionKeyValidation,

    ...answerValidation,
  ],

  deleteAnswer: [
    ...sessionIdValidation,

    ...questionKeyValidation,
  ],
};
