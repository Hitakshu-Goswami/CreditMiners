const { validationResult } = require("express-validator");
const asyncHandler = require("../middleware/async.middleware");
const response = require("../utils/response");
const BadRequestError = require("../errors/BadRequestError");
const userService = require("../services/user.service");

const validateRequest = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new BadRequestError(errors.array().map((error) => error.msg).join(", "));
};

const contextFrom = (req) => ({ ipAddress: req.ip, userAgent: req.headers["user-agent"] });
const pick = (source, keys) => keys.reduce((result, key) => {
  if (source[key] !== undefined) result[key] = source[key];
  return result;
}, {});

const getMe = asyncHandler(async (req, res) => response.success(res, "Profile fetched successfully.", await userService.getProfile(req.user.id)));
const updateMe = asyncHandler(async (req, res) => {
  validateRequest(req);
  const data = pick(req.body, ["fullName", "dateOfBirth", "gender", "education", "city", "state", "country"]);
  response.success(res, "Profile updated successfully.", await userService.updateProfile(req.user.id, data, contextFrom(req)));
});
const setProfileImage = asyncHandler(async (req, res) => {
  validateRequest(req);
  response.success(res, "Profile image updated successfully.", await userService.setProfileImage(req.user.id, req.body.profileImage, contextFrom(req)));
});
const removeProfileImage = asyncHandler(async (req, res) => {
  response.success(res, "Profile image removed successfully.", await userService.removeProfileImage(req.user.id, contextFrom(req)));
});
const updateFinancialProfile = asyncHandler(async (req, res) => {
  validateRequest(req);
  const data = pick(req.body, ["occupation", "employmentType", "monthlyIncome", "incomeFrequency", "monthlyExpenses", "savingsHabit", "existingInvestments", "existingLiabilities", "emergencyFund", "dependents", "preferredCurrency", "notes"]);
  response.success(res, "Financial identity updated successfully.", await userService.updateFinancialProfile(req.user.id, data, contextFrom(req)));
});
const getPreferences = asyncHandler(async (req, res) => response.success(res, "Preferences fetched successfully.", await userService.getPreferences(req.user.id)));
const updatePreferences = asyncHandler(async (req, res) => {
  validateRequest(req);
  response.success(res, "Preferences updated successfully.", await userService.updatePreferences(req.user.id, pick(req.body, ["language", "theme", "notificationPreferences", "privacyPreferences"]), contextFrom(req)));
});
const getTrustProfile = asyncHandler(async (req, res) => response.success(res, "Trust profile fetched successfully.", await userService.getTrustProfile(req.user.id)));
const changeEmail = asyncHandler(async (req, res) => {
  validateRequest(req);
  const result = await userService.changeEmail(req.user.id, req.body.email, req.body.currentPassword, contextFrom(req));
  response.success(res, result.message);
});
const verifyEmailChange = asyncHandler(async (req, res) => {
  validateRequest(req);
  const result = await userService.verifyEmailChange(req.query.token, contextFrom(req));
  response.success(res, result.message);
});
const changePhone = asyncHandler(async (req, res) => {
  validateRequest(req);
  const result = await userService.changePhone(req.user.id, req.body.phone, req.body.currentPassword, contextFrom(req));
  response.success(res, result.message, result.verificationToken ? { verificationToken: result.verificationToken } : null);
});
const verifyPhone = asyncHandler(async (req, res) => {
  validateRequest(req);
  const result = await userService.verifyPhone(req.query.token, contextFrom(req));
  response.success(res, result.message);
});
const listGoals = asyncHandler(async (req, res) => response.success(res, "Financial goals fetched successfully.", await userService.listGoals(req.user.id)));
const createGoal = asyncHandler(async (req, res) => {
  validateRequest(req);
  response.success(res, "Financial goal created successfully.", await userService.createGoal(req.user.id, pick(req.body, ["title", "description", "targetAmount", "currentAmount", "targetDate", "priority"]), contextFrom(req)), 201);
});
const updateGoal = asyncHandler(async (req, res) => {
  validateRequest(req);
  response.success(res, "Financial goal updated successfully.", await userService.updateGoal(req.user.id, req.params.goalId, pick(req.body, ["title", "description", "targetAmount", "currentAmount", "targetDate", "priority", "status"]), contextFrom(req)));
});
const deleteGoal = asyncHandler(async (req, res) => {
  validateRequest(req);
  await userService.deleteGoal(req.user.id, req.params.goalId, contextFrom(req));
  response.success(res, "Financial goal archived successfully.");
});
const listUsers = asyncHandler(async (req, res) => {
  validateRequest(req);
  response.success(res, "Users fetched successfully.", await userService.listUsers(req.query));
});
const getUser = asyncHandler(async (req, res) => {
  validateRequest(req);
  response.success(res, "User fetched successfully.", await userService.getUserForAdmin(req.params.userId));
});
const setStatus = (status, message) => asyncHandler(async (req, res) => {
  validateRequest(req);
  response.success(res, message, await userService.changeUserStatus(req.user.id, req.params.userId, status, contextFrom(req)));
});
const changeRole = asyncHandler(async (req, res) => {
  validateRequest(req);
  response.success(res, "User role updated successfully.", await userService.changeUserRole(req.user.id, req.params.userId, req.body.role, contextFrom(req)));
});
const userAnalytics = asyncHandler(async (req, res) => response.success(res, "User analytics fetched successfully.", await userService.getUserAnalytics()));

module.exports = {
  getMe, updateMe, setProfileImage, removeProfileImage, updateFinancialProfile, getPreferences, updatePreferences,
  getTrustProfile, changeEmail, verifyEmailChange, changePhone, verifyPhone, listGoals, createGoal, updateGoal,
  deleteGoal, listUsers, getUser, banUser: setStatus("BANNED", "User banned successfully."),
  suspendUser: setStatus("SUSPENDED", "User suspended successfully."),
  activateUser: setStatus("ACTIVE", "User activated successfully."),
  deleteUser: setStatus("DELETED", "User deleted successfully."), changeRole, userAnalytics,
};
