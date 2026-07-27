const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const path = require("path");

const requestLogger = require("./middleware/request.middleware");
const errorHandler = require("./middleware/error.middleware");

const demoRoutes = require("./routes/demo.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const loanRoutes = require("./routes/loan.routes");
const loanMediaRoutes = require("./routes/loanMedia.routes");
const loanInterestRoutes = require("./routes/loanInterest.routes");
const aiCreditRoutes = require("./routes/aiCredit.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const transactionRoutes = require("./routes/transaction.routes");
const utilityBillRoutes = require("./routes/utilityBill.routes");
const mobileRechargeRoutes = require("./routes/mobileRecharge.routes");
const ecommerceOrderRoutes = require("./routes/ecommerceOrder.routes");
const categoryRoutes = require("./routes/category.routes");
const merchantRoutes = require("./routes/merchant.routes");
const tagRoutes = require("./routes/tag.routes");
const financialFeatureRoutes = require("./routes/financialFeature.routes");
const { swaggerSpec, swaggerUi } = require("./docs/swagger");
const { apiLimiter } = require("./middleware/rateLimit.middleware");
const riskAssessmentRoutes = require("./routes/riskAssessment.routes");
const answerValidationRoutes = require("./routes/answerValidation.routes");

const app = express();
const questionRoutes = require("./routes/question.routes");
const adaptiveFlowRoutes = require("./routes/adaptiveFlow.routes");
const goalExtractionRoutes = require("./routes/goalExtraction.routes");
const investorPersonaRoutes = require("./routes/investorPersona.routes");
const confidenceRoutes = require("./routes/confidence.routes");
const explainabilityRoutes = require("./routes/explainability.routes");

/* ---------------- Security ---------------- */

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

/* ---------------- Parsers ---------------- */

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ---------------- Performance ---------------- */

app.use(compression());

/* ---------------- Request Logging ---------------- */

app.use(requestLogger);
app.use(apiLimiter);

/* ---------------- Health Check ---------------- */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CreditMiners API is running.",
    timestamp: new Date().toISOString(),
  });
});

/* ---------------- API Routes ---------------- */

app.use("/api/demo", demoRoutes);
app.use("/api/auth", (req, res, next) => {
  const authRoutes = require("./routes/auth.routes");
  return authRoutes(req, res, next);
});
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api", loanMediaRoutes);
app.use("/api", loanInterestRoutes);
app.use("/api", aiCreditRoutes);
app.use("/api", riskAssessmentRoutes);
app.use("/api", dashboardRoutes);
app.use("/api/financial/transactions", transactionRoutes);
app.use("/api/financial/utility-bills", utilityBillRoutes);
app.use("/api/financial/mobile-recharges", mobileRechargeRoutes);
app.use("/api/financial/ecommerce-orders", ecommerceOrderRoutes);
app.use("/api/financial/categories", categoryRoutes);
app.use("/api/financial/merchants", merchantRoutes);
app.use("/api/financial/tags", tagRoutes);
app.use("/api/financial/features", financialFeatureRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/openapi.json", (req, res) => res.status(200).json(swaggerSpec));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

/* ---------------- 404 Handler ---------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

app.use("/api", questionRoutes);

app.use("/api", adaptiveFlowRoutes);

app.use("/api", answerValidationRoutes);

app.use("/api", goalExtractionRoutes);

/* ---------------- Global Error Handler ---------------- */

app.use(errorHandler);
app.use("/api", investorPersonaRoutes);

app.use("/api", confidenceRoutes);

app.use("/api", explainabilityRoutes);


module.exports = app;
