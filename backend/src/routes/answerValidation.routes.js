const express = require("express");

const router = express.Router();


const {
    authenticate
} = require("../middleware/auth.middleware");


const answerValidationController =
    require("../controllers/answerValidation.controller");


const answerValidationValidator =
    require("../validators/answerValidation.validator");



router.use(authenticate);



router.post(
    "/answer-validation/validate",

    answerValidationValidator.validateAnswer(),

    answerValidationController.validateAnswer
);



router.post(
    "/answer-validation/validate-multiple",

    answerValidationValidator.validateMultipleAnswers(),

    answerValidationController.validateMultipleAnswers
);



router.post(
    "/answer-validation/normalize",

    answerValidationValidator.normalizeAnswer(),

    answerValidationController.normalizeAnswer
);



router.get(
    "/answer-validation/rules/:questionKey",

    answerValidationValidator.getQuestionValidationRules(),

    answerValidationController.getQuestionValidationRules
);



router.post(
    "/answer-validation/validate-assessment",

    answerValidationValidator.validateAssessmentAnswers(),

    answerValidationController.validateAssessmentAnswers
);



module.exports = router;