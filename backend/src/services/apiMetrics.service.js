const MAX_EVENTS = 5000;

const startedAt = new Date();
const events = [];

const normalizeRoute = (req) => {
  const baseUrl = req.baseUrl || "";
  const routePath = req.route?.path || req.path || "";
  const combined = `${baseUrl}${routePath}`;

  return combined.replace(/\/+/g, "/") || req.originalUrl.split("?")[0];
};

const percentile = (values, target) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((first, second) => first - second);
  const index = Math.ceil((target / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
};

const round = (value, places = 2) => {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(places));
};

class ApiMetricsService {
  record(req, res, durationMs) {
    const event = {
      method: req.method,
      path: normalizeRoute(req),
      originalUrl: req.originalUrl,
      statusCode: res.statusCode,
      durationMs,
      isAiEndpoint: this._isAiEndpoint(req.originalUrl),
      isValidationFailure: res.statusCode === 400,
      isAuthenticationFailure: res.statusCode === 401,
      isAuthorizationFailure: res.statusCode === 403,
      isTimeout: res.statusCode === 408 || durationMs >= 30000,
      createdAt: new Date(),
    };

    events.push(event);

    if (events.length > MAX_EVENTS) {
      events.splice(0, events.length - MAX_EVENTS);
    }
  }

  getMetrics() {
    const requestCount = events.length;
    const errorEvents = events.filter((event) => event.statusCode >= 500);
    const durations = events.map((event) => event.durationMs);

    return {
      startedAt,
      generatedAt: new Date(),
      retention: {
        mode: "in-memory",
        maxEvents: MAX_EVENTS,
        productionNote:
          "Future Production should persist request metrics through OpenTelemetry or an APM backend.",
      },
      requestCount,
      errorRate: requestCount ? round(errorEvents.length / requestCount, 4) : 0,
      latency: {
        averageMs: requestCount
          ? round(durations.reduce((sum, value) => sum + value, 0) / requestCount)
          : 0,
        p50Ms: percentile(durations, 50),
        p95Ms: percentile(durations, 95),
        p99Ms: percentile(durations, 99),
      },
      timeoutCount: events.filter((event) => event.isTimeout).length,
      validationFailureCount: events.filter((event) => event.isValidationFailure).length,
      authenticationFailureCount: events.filter((event) => event.isAuthenticationFailure).length,
      authorizationFailureCount: events.filter((event) => event.isAuthorizationFailure).length,
      mostUsedEndpoints: this._topEndpoints(events, "count").slice(0, 10),
      slowestEndpoints: this._topEndpoints(events, "latency").slice(0, 10),
      aiMetrics: this._aiMetrics(),
    };
  }

  _topEndpoints(sourceEvents, mode) {
    const buckets = new Map();

    for (const event of sourceEvents) {
      const key = `${event.method} ${event.path}`;
      const current = buckets.get(key) || {
        endpoint: key,
        count: 0,
        averageLatencyMs: 0,
        errorCount: 0,
      };

      current.count += 1;
      current.averageLatencyMs += event.durationMs;
      if (event.statusCode >= 400) current.errorCount += 1;
      buckets.set(key, current);
    }

    return [...buckets.values()]
      .map((item) => ({
        ...item,
        averageLatencyMs: round(item.averageLatencyMs / item.count),
        errorRate: round(item.errorCount / item.count, 4),
      }))
      .sort((first, second) =>
        mode === "latency"
          ? second.averageLatencyMs - first.averageLatencyMs
          : second.count - first.count
      );
  }

  _aiMetrics() {
    const aiEvents = events.filter((event) => event.isAiEndpoint);
    const byKind = (pattern) =>
      aiEvents.filter((event) => event.originalUrl.includes(pattern));

    const latencyFor = (label, sourceEvents) => ({
      label,
      requestCount: sourceEvents.length,
      averageLatencyMs: sourceEvents.length
        ? round(sourceEvents.reduce((sum, event) => sum + event.durationMs, 0) / sourceEvents.length)
        : 0,
    });

    return {
      predictionFailureRate: aiEvents.length
        ? round(aiEvents.filter((event) => event.statusCode >= 500).length / aiEvents.length, 4)
        : 0,
      creditScoreGenerationLatency: latencyFor("Credit score", byKind("/ai/credit-score")),
      explanationGenerationLatency: latencyFor("Explanation", byKind("/explainability")),
      recommendationGenerationLatency: latencyFor("Recommendation", byKind("/recommendation")),
      projectionGenerationLatency: latencyFor("Growth projection", byKind("/growth-projection")),
      lowConfidenceOutputCount: 0,
      lowConfidenceSource:
        "Runtime confidence values are stored with assessments; aggregate low-confidence counts are exposed from AI monitoring.",
    };
  }

  _isAiEndpoint(url) {
    return [
      "/ai/",
      "/explainability",
      "/recommendation",
      "/growth-projection",
      "/dashboard/credit",
      "/insights",
    ].some((pattern) => url.includes(pattern));
  }
}

module.exports = new ApiMetricsService();
