const express = require("express");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const adminAudit = require("../middleware/adminAudit.middleware");
const adminController = require("../controllers/admin.controller");
const userController = require("../controllers/user.controller");
const adminValidators = require("../validators/admin.validator");
const userValidators = require("../validators/user.validator");

const router = express.Router();

const ADMIN_READ_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "AI_ANALYST",
  "SUPPORT",
  "AUDITOR",
];

const ADMIN_OPERATIONS_ROLES = ["SUPER_ADMIN", "ADMIN"];
const AI_MONITORING_ROLES = ["SUPER_ADMIN", "ADMIN", "AI_ANALYST"];
const AUDIT_ROLES = ["SUPER_ADMIN", "ADMIN", "AUDITOR"];

router.use(authenticate);

router.get(
  "/dashboard",
  authorize(...ADMIN_READ_ROLES),
  adminAudit("ADMIN_DASHBOARD"),
  adminController.getDashboard
);

router.get(
  "/datasets",
  authorize(...AI_MONITORING_ROLES),
  adminAudit("DATASET"),
  adminController.getDatasets
);

router.get(
  "/models",
  authorize(...AI_MONITORING_ROLES),
  adminAudit("AI_MODEL"),
  adminController.getModels
);

router.get(
  "/features/statistics",
  authorize(...AI_MONITORING_ROLES),
  adminAudit("FINANCIAL_FEATURE"),
  adminController.getFeatureStatistics
);

router.get(
  "/risk-distribution",
  authorize(...AI_MONITORING_ROLES),
  adminAudit("RISK_DISTRIBUTION"),
  adminController.getRiskDistribution
);

router.get(
  "/api-metrics",
  authorize(...ADMIN_READ_ROLES),
  adminAudit("API_METRIC"),
  adminController.getApiMetrics
);

router.get(
  "/audit-logs",
  authorize(...AUDIT_ROLES),
  adminValidators.auditLogValidator,
  adminAudit("ADMIN_AUDIT_LOG"),
  adminController.getAuditLogs
);

router.get(
  "/system-analytics",
  authorize(...ADMIN_READ_ROLES),
  adminAudit("SYSTEM_ANALYTICS"),
  adminController.getSystemAnalytics
);

router.get(
  "/users/analytics",
  authorize(...ADMIN_READ_ROLES),
  adminAudit("USER_ANALYTICS"),
  userController.userAnalytics
);

router.get(
  "/users",
  authorize(...ADMIN_READ_ROLES),
  userValidators.adminListValidator,
  adminAudit("USER"),
  userController.listUsers
);

router.get(
  "/users/:userId",
  authorize(...ADMIN_READ_ROLES),
  userValidators.userIdValidator,
  adminAudit("USER"),
  userController.getUser
);

router.patch(
  "/users/:userId/ban",
  authorize(...ADMIN_OPERATIONS_ROLES),
  userValidators.userIdValidator,
  adminAudit("USER"),
  userController.banUser
);

router.patch(
  "/users/:userId/suspend",
  authorize(...ADMIN_OPERATIONS_ROLES),
  userValidators.userIdValidator,
  adminAudit("USER"),
  userController.suspendUser
);

router.patch(
  "/users/:userId/activate",
  authorize(...ADMIN_OPERATIONS_ROLES),
  userValidators.userIdValidator,
  adminAudit("USER"),
  userController.activateUser
);

router.delete(
  "/users/:userId",
  authorize(...ADMIN_OPERATIONS_ROLES),
  userValidators.userIdValidator,
  adminAudit("USER"),
  userController.deleteUser
);

router.patch(
  "/users/:userId/role",
  authorize(...ADMIN_OPERATIONS_ROLES),
  [...userValidators.userIdValidator, ...userValidators.roleValidator],
  adminAudit("USER_ROLE"),
  userController.changeRole
);

module.exports = router;
