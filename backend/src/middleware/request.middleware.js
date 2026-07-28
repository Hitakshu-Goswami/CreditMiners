const logger = require("../utils/logger");
const apiMetricsService = require("../services/apiMetrics.service");

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - start;

    apiMetricsService.record(req, res, durationMs);

    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${durationMs}ms`,
      ip: req.ip,
    });
  });

  next();
};

module.exports = requestLogger;
