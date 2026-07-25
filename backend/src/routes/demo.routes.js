const express = require("express");
const demoController = require("../controllers/demo.controller");

const router = express.Router();

router.get("/summary", demoController.getSummary);
router.get("/profiles", demoController.getProfiles);
router.get("/profiles/:userId/assessment", demoController.getAssessment);
router.post("/score", demoController.scoreProfile);
router.get("/investment/questions", demoController.getInvestmentQuestions);
router.post("/investment/assess", demoController.assessInvestmentRisk);

module.exports = router;
