const prisma = require("../config/prisma");
const { comparePassword } = require("../utils/bcrypt");
const { hashToken } = require("../utils/crypto");
const { generateVerificationToken } = require("../utils/verificationToken");
const { sendEmailChangeVerification } = require("../utils/email");
const auditService = require("./audit.service");
const ConflictError = require("../errors/ConflictError");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const ForbiddenError = require("../errors/ForbiddenError");
const {
  calculateProfileCompletion,
  calculateFinancialProfileCompletion,
  buildTrustProfile,
} = require("../utils/profileCompletion");

const USER_INCLUDE = {
  role: true,
  financialProfile: true,
  preferences: true,
  onboarding: true,
  financialGoals: { where: { isArchived: false }, orderBy: { createdAt: "desc" } },
};

const toUserDto = (user) => {
  const profileCompletion = calculateProfileCompletion(user);
  const financialProfileCompletion = calculateFinancialProfileCompletion(user.financialProfile, user.financialGoals);
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    profileImage: user.profileImage,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    education: user.education,
    city: user.city,
    state: user.state,
    country: user.country,
    status: user.status,
    role: { id: user.role.id, name: user.role.name },
    financialProfile: user.financialProfile,
    financialGoals: user.financialGoals,
    preferences: user.preferences,
    onboarding: user.onboarding,
    trustProfile: buildTrustProfile({ user, profileCompletion, financialProfileCompletion }),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

class UserService {
  async getProfile(userId) {
    await this.syncOnboarding(userId);
    const user = await prisma.user.findFirst({ where: { id: userId, deletedAt: null }, include: USER_INCLUDE });
    if (!user) throw new NotFoundError("User not found.");
    return toUserDto(user);
  }

  async updateProfile(userId, data, context = {}) {
    await prisma.user.update({ where: { id: userId }, data });
    await this.syncOnboarding(userId);
    await auditService.log({ userId, action: "PROFILE_UPDATED", description: "User profile updated.", ...context });
    return this.getProfile(userId);
  }

  async setProfileImage(userId, profileImage, context = {}) {
    return this.updateProfile(userId, { profileImage }, context);
  }

  async removeProfileImage(userId, context = {}) {
    return this.updateProfile(userId, { profileImage: null }, context);
  }

  async updateFinancialProfile(userId, data, context = {}) {
    const existing = await prisma.financialProfile.findUnique({ where: { userId } });
    if (!existing && !data.employmentType) {
      throw new ConflictError("Employment type is required to create a financial profile.");
    }
    await prisma.financialProfile.upsert({ where: { userId }, create: { userId, ...data }, update: data });
    await this.syncOnboarding(userId);
    await auditService.log({ userId, action: "FINANCIAL_PROFILE_UPDATED", description: "Financial identity updated.", ...context });
    return this.getProfile(userId);
  }

  async getPreferences(userId) {
    return prisma.userPreference.upsert({
      where: { userId },
      create: { userId, notificationPreferences: {}, privacyPreferences: {} },
      update: {},
    });
  }

  async updatePreferences(userId, data, context = {}) {
    const preferences = await prisma.userPreference.upsert({
      where: { userId },
      create: { userId, notificationPreferences: {}, privacyPreferences: {}, ...data },
      update: data,
    });
    await auditService.log({ userId, action: "PREFERENCES_UPDATED", description: "User preferences updated.", ...context });
    return preferences;
  }

  async getTrustProfile(userId) {
    return (await this.getProfile(userId)).trustProfile;
  }

  async changeEmail(userId, newEmail, currentPassword, context = {}) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("User not found.");
    if (!(await comparePassword(currentPassword, user.passwordHash))) throw new UnauthorizedError("Current password is incorrect.");
    const conflict = await prisma.user.findFirst({ where: { OR: [{ email: newEmail }, { pendingEmail: newEmail }], NOT: { id: userId } } });
    if (conflict) throw new ConflictError("Email address is already in use.");
    const { token, hashedToken } = generateVerificationToken();
    await prisma.user.update({
      where: { id: userId },
      data: { pendingEmail: newEmail, emailChangeToken: hashedToken, emailChangeExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    });
    await sendEmailChangeVerification(newEmail, token);
    await auditService.log({ userId, action: "EMAIL_CHANGE_REQUESTED", description: "Email change verification requested.", ...context });
    return { message: "Verification link sent to the new email address." };
  }

  async verifyEmailChange(token, context = {}) {
    const user = await prisma.user.findFirst({ where: { emailChangeToken: hashToken(token), emailChangeExpires: { gt: new Date() } } });
    if (!user || !user.pendingEmail) throw new UnauthorizedError("Email change link is invalid or expired.");
    await prisma.user.update({
      where: { id: user.id },
      data: { email: user.pendingEmail, pendingEmail: null, emailVerified: true, emailChangeToken: null, emailChangeExpires: null },
    });
    await auditService.log({ userId: user.id, action: "EMAIL_CHANGED", description: "Email address changed and verified.", ...context });
    return { message: "Email address changed successfully." };
  }

  async changePhone(userId, phone, currentPassword, context = {}) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("User not found.");
    if (!(await comparePassword(currentPassword, user.passwordHash))) throw new UnauthorizedError("Current password is incorrect.");
    const conflict = await prisma.user.findFirst({ where: { OR: [{ phone }, { pendingPhone: phone }], NOT: { id: userId } } });
    if (conflict) throw new ConflictError("Phone number is already in use.");
    const { token, hashedToken } = generateVerificationToken();
    await prisma.user.update({
      where: { id: userId },
      data: {
        pendingPhone: phone,
        phoneVerified: false,
        phoneVerificationToken: hashedToken,
        phoneVerificationExpires: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
    await auditService.log({ userId, action: "PHONE_CHANGE_REQUESTED", description: "Phone change verification requested.", ...context });
    const result = { message: "Phone verification is pending." };
    if (process.env.NODE_ENV !== "production") result.verificationToken = token;
    return result;
  }

  async verifyPhone(token, context = {}) {
    const user = await prisma.user.findFirst({ where: { phoneVerificationToken: hashToken(token), phoneVerificationExpires: { gt: new Date() } } });
    if (!user || !user.pendingPhone) throw new UnauthorizedError("Phone verification token is invalid or expired.");
    await prisma.user.update({
      where: { id: user.id },
      data: { phone: user.pendingPhone, pendingPhone: null, phoneVerified: true, phoneVerificationToken: null, phoneVerificationExpires: null },
    });
    await this.syncOnboarding(user.id);
    await auditService.log({ userId: user.id, action: "PHONE_VERIFIED", description: "Phone number verified.", ...context });
    return { message: "Phone number verified successfully." };
  }

  async listGoals(userId) {
    return prisma.financialGoal.findMany({ where: { userId, isArchived: false }, orderBy: { createdAt: "desc" } });
  }

  async createGoal(userId, data, context = {}) {
    const goal = await prisma.financialGoal.create({ data: { userId, ...data } });
    await this.syncOnboarding(userId);
    await auditService.log({ userId, action: "FINANCIAL_GOAL_CREATED", description: "Financial goal created.", ...context });
    return goal;
  }

  async updateGoal(userId, goalId, data, context = {}) {
    const goal = await prisma.financialGoal.findFirst({ where: { id: goalId, userId, isArchived: false } });
    if (!goal) throw new NotFoundError("Financial goal not found.");
    const updated = await prisma.financialGoal.update({ where: { id: goalId }, data });
    await this.syncOnboarding(userId);
    await auditService.log({ userId, action: "FINANCIAL_GOAL_UPDATED", description: "Financial goal updated.", ...context });
    return updated;
  }

  async deleteGoal(userId, goalId, context = {}) {
    const goal = await prisma.financialGoal.findFirst({ where: { id: goalId, userId, isArchived: false } });
    if (!goal) throw new NotFoundError("Financial goal not found.");
    await prisma.financialGoal.update({ where: { id: goalId }, data: { isArchived: true } });
    await this.syncOnboarding(userId);
    await auditService.log({ userId, action: "FINANCIAL_GOAL_ARCHIVED", description: "Financial goal archived.", ...context });
  }

  async listUsers(query) {
    const page = Number(query.page || 1);
    const limit = Math.min(Number(query.limit || 20), 100);
    const where = { deletedAt: query.includeDeleted === "true" ? undefined : null };
    if (query.status) where.status = query.status;
    if (query.role) where.role = { name: query.role };
    if (query.emailVerified !== undefined) where.emailVerified = query.emailVerified === "true";
    if (query.phoneVerified !== undefined) where.phoneVerified = query.phoneVerified === "true";
    if (query.search) where.OR = [{ fullName: { contains: query.search } }, { email: { contains: query.search } }, { phone: { contains: query.search } }];
    const [total, users] = await prisma.$transaction([
      prisma.user.count({ where }),
      prisma.user.findMany({ where, include: USER_INCLUDE, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
    ]);
    return { users: users.map(toUserDto), pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getUserForAdmin(userId) {
    await this.syncOnboarding(userId);
    const user = await prisma.user.findUnique({ where: { id: userId }, include: USER_INCLUDE });
    if (!user) throw new NotFoundError("User not found.");
    return toUserDto(user);
  }

  async changeUserStatus(adminId, userId, status, context = {}) {
    if (adminId === userId) throw new ForbiddenError("You cannot change your own account status.");
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("User not found.");
    const isActive = status === "ACTIVE";
    const updated = await prisma.user.update({ where: { id: userId }, data: { status, isActive, deletedAt: status === "DELETED" ? new Date() : user.deletedAt } });
    await auditService.log({ userId: adminId, action: `USER_${status}`, description: `Admin updated user ${userId} status to ${status}.`, ...context });
    return updated;
  }

  async changeUserRole(adminId, userId, roleName, context = {}) {
    if (adminId === userId) throw new ForbiddenError("You cannot change your own role.");
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) throw new NotFoundError("Role not found.");
    const user = await prisma.user.update({ where: { id: userId }, data: { roleId: role.id }, include: { role: true } });
    await auditService.log({ userId: adminId, action: "USER_ROLE_CHANGED", description: `Admin changed user ${userId} role to ${roleName}.`, ...context });
    return { id: user.id, role: user.role.name };
  }

  async getUserAnalytics() {
    const [totalUsers, activeUsers, verifiedEmails, verifiedPhones, statusBuckets, roleBuckets] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { deletedAt: null, status: "ACTIVE" } }),
      prisma.user.count({ where: { deletedAt: null, emailVerified: true } }),
      prisma.user.count({ where: { deletedAt: null, phoneVerified: true } }),
      prisma.user.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.user.groupBy({ by: ["roleId"], _count: { _all: true } }),
    ]);
    return { totalUsers, activeUsers, verifiedEmails, verifiedPhones, statusBuckets, roleBuckets };
  }

  async syncOnboarding(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { financialProfile: true, financialGoals: { where: { isArchived: false } } } });
    if (!user) return null;
    const profileCompletion = calculateProfileCompletion(user);
    const financialCompletion = calculateFinancialProfileCompletion(user.financialProfile, user.financialGoals);
    const onboardingCompleted = profileCompletion === 100 && financialCompletion === 100;
    const currentStep = onboardingCompleted ? 4 : profileCompletion < 100 ? 1 : financialCompletion < 100 ? 2 : 3;
    return prisma.onboarding.upsert({
      where: { userId },
      create: { userId, currentStep, profileCompletionPercentage: profileCompletion, financialProfileCompletionPercentage: financialCompletion, onboardingCompleted, completedAt: onboardingCompleted ? new Date() : null },
      update: { currentStep, profileCompletionPercentage: profileCompletion, financialProfileCompletionPercentage: financialCompletion, onboardingCompleted, completedAt: onboardingCompleted ? new Date() : null },
    });
  }
}

module.exports = new UserService();
