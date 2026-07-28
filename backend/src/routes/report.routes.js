const express = require("express");

const { authenticate } = require("../middleware/auth.middleware");
const reportController = require("../controllers/report.controller");
const {
  generateMonthlyReportValidator,
  listMonthlyReportsValidator,
} = require("../validators/report.validator");

const router = express.Router();

router.use(authenticate);

router.get(
  "/reports/monthly",
  listMonthlyReportsValidator,
  reportController.listMonthlyReports
);

router.post(
  "/reports/monthly/generate",
  generateMonthlyReportValidator,
  reportController.generateMonthlyReport
);

module.exports = router;
