const express = require("express");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const controller = require("../controllers/user.controller");
const validators = require("../validators/user.validator");

const router = express.Router();
router.use(authenticate, authorize("ADMIN"));
router.get("/users/analytics", controller.userAnalytics);
router.get("/users", validators.adminListValidator, controller.listUsers);
router.get("/users/:userId", validators.userIdValidator, controller.getUser);
router.patch("/users/:userId/ban", validators.userIdValidator, controller.banUser);
router.patch("/users/:userId/suspend", validators.userIdValidator, controller.suspendUser);
router.patch("/users/:userId/activate", validators.userIdValidator, controller.activateUser);
router.delete("/users/:userId", validators.userIdValidator, controller.deleteUser);
router.patch("/users/:userId/role", [...validators.userIdValidator, ...validators.roleValidator], controller.changeRole);

module.exports = router;
