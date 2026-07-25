const express = require("express");
const { authenticate } = require("../middleware/auth.middleware");
const controller = require("../controllers/user.controller");
const validators = require("../validators/user.validator");

const router = express.Router();

router.get("/email/verify", validators.tokenValidator, controller.verifyEmailChange);
router.get("/phone/verify", validators.tokenValidator, controller.verifyPhone);

router.use(authenticate);
router.get("/me", controller.getMe);
router.patch("/me", validators.updateProfileValidator, controller.updateMe);
router.put("/me/profile-image", validators.profileImageValidator, controller.setProfileImage);
router.delete("/me/profile-image", controller.removeProfileImage);
router.patch("/me/email", validators.changeEmailValidator, controller.changeEmail);
router.patch("/me/phone", validators.changePhoneValidator, controller.changePhone);
router.put("/me/financial-profile", validators.financialProfileValidator, controller.updateFinancialProfile);
router.get("/me/preferences", controller.getPreferences);
router.put("/me/preferences", validators.preferencesValidator, controller.updatePreferences);
router.get("/me/trust-profile", controller.getTrustProfile);
router.get("/me/goals", controller.listGoals);
router.post("/me/goals", validators.goalCreateValidator, controller.createGoal);
router.patch("/me/goals/:goalId", [...validators.goalIdValidator, ...validators.goalUpdateValidator], controller.updateGoal);
router.delete("/me/goals/:goalId", validators.goalIdValidator, controller.deleteGoal);

module.exports = router;
