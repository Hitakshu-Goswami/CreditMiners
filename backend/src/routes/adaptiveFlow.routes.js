const express = require("express");

const router = express.Router();


const {
    authenticate
} = require("../middleware/auth.middleware");


const adaptiveFlowController =
    require("../controllers/adaptiveFlow.controller");


const adaptiveFlowValidator =
    require("../validators/adaptiveFlow.validator");



router.use(authenticate);



router.get(
    "/adaptive-flow/:sessionId",

    adaptiveFlowValidator.getFlowSummary(),

    adaptiveFlowController.getFlowSummary
);



router.get(
    "/adaptive-flow/:sessionId/next-question",

    adaptiveFlowValidator.getNextQuestion(),

    adaptiveFlowController.getNextQuestion
);



router.get(
    "/adaptive-flow/:sessionId/visible-questions",

    adaptiveFlowValidator.getVisibleQuestions(),

    adaptiveFlowController.getVisibleQuestions
);



router.get(
    "/adaptive-flow/:sessionId/remaining-questions",

    adaptiveFlowValidator.getRemainingQuestions(),

    adaptiveFlowController.getRemainingQuestions
);



router.get(
    "/adaptive-flow/:sessionId/progress",

    adaptiveFlowValidator.calculateProgress(),

    adaptiveFlowController.calculateProgress
);



router.get(
    "/adaptive-flow/:sessionId/prediction",

    adaptiveFlowValidator.predictCompletion(),

    adaptiveFlowController.predictCompletion
);



router.get(
    "/adaptive-flow/:sessionId/question/:questionKey/status",

    adaptiveFlowValidator.getQuestionStatus(),

    adaptiveFlowController.getQuestionStatus
);



module.exports = router;