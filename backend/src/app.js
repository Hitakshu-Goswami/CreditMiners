const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const requestLogger = require("./middleware/request.middleware");
const errorHandler = require("./middleware/error.middleware");

const demoRoutes = require("./routes/demo.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const { swaggerSpec, swaggerUi } = require("./docs/swagger");

const app = express();
const { apiLimiter } = require("./middleware/rateLimit.middleware");

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
app.get("/api/openapi.json", (req, res) => res.status(200).json(swaggerSpec));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

/* ---------------- 404 Handler ---------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

/* ---------------- Global Error Handler ---------------- */

app.use(errorHandler);

module.exports = app;
