const adminAuditService = require("../services/admin-audit.service");

const actionFor = (req) =>
  `ADMIN_${req.method}_${req.originalUrl
    .split("?")[0]
    .replace(/^\/api\/admin\/?/, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase() || "ROOT"}`;

const adminAudit = (entityType = "ADMIN_ROUTE") => (req, res, next) => {
  res.on("finish", () => {
    if (!req.user) return;

    adminAuditService
      .log({
        actorUserId: req.user.id,
        actorRole: req.user.role?.name,
        action: actionFor(req),
        entityType,
        entityId: req.params.userId || req.params.id || null,
        metadata: {
          method: req.method,
          path: req.originalUrl.split("?")[0],
          statusCode: res.statusCode,
          query: req.query,
        },
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      })
      .catch(() => {});
  });

  next();
};

module.exports = adminAudit;
