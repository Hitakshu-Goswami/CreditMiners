-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('STUDENT', 'EMPLOYED', 'SELF_EMPLOYED', 'FREELANCER', 'BUSINESS_OWNER', 'UNEMPLOYED', 'RETIRED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER', 'INVESTMENT');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'UPI', 'CARD', 'NET_BANKING', 'BANK_TRANSFER', 'WALLET');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "InvestmentType" AS ENUM ('SIP', 'MUTUAL_FUND', 'ETF', 'STOCK', 'FIXED_DEPOSIT', 'GOLD');

-- CreateEnum
CREATE TYPE "RecommendationPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "RecommendationStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AssessmentType" AS ENUM ('INITIAL', 'MONTHLY', 'ON_DEMAND', 'SIMULATION');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('REGISTER', 'LOGIN', 'LOGOUT', 'PASSWORD_CHANGE', 'PROFILE_UPDATE', 'TRANSACTION_CREATE', 'TRANSACTION_UPDATE', 'TRANSACTION_DELETE', 'ASSESSMENT_GENERATED', 'RECOMMENDATION_VIEWED', 'GOAL_CREATED', 'GOAL_UPDATED');

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "profileImage" TEXT,
    "passwordHash" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "roleId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_profiles" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "occupation" TEXT,
    "employmentType" "EmploymentType" NOT NULL,
    "annualIncome" DECIMAL(18,2),
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'MEDIUM',
    "investmentExperience" INTEGER,
    "dependents" INTEGER NOT NULL DEFAULT 0,
    "existingLiabilities" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "preferredCurrency" TEXT NOT NULL DEFAULT 'INR',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_snapshots" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "monthlyIncome" DECIMAL(18,2) NOT NULL,
    "monthlyExpenses" DECIMAL(18,2) NOT NULL,
    "monthlySavings" DECIMAL(18,2) NOT NULL,
    "emergencyFund" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "investmentCapacity" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "currentInvestments" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "liabilities" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "netWorth" DECIMAL(18,2),
    "savingsRatio" DECIMAL(6,2),
    "expenseRatio" DECIMAL(6,2),
    "investmentRatio" DECIMAL(6,2),
    "debtIncomeRatio" DECIMAL(6,2),
    "cashFlow" DECIMAL(18,2),
    "financialStabilityIndex" DECIMAL(6,2),
    "snapshotDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financial_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_categories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "transactionType" "TransactionType" NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "merchant" TEXT,
    "description" TEXT,
    "location" TEXT,
    "referenceNumber" TEXT,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "receiptUrl" TEXT,
    "tags" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_goals" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "targetAmount" DECIMAL(18,2) NOT NULL,
    "currentAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "targetDate" TIMESTAMP(3),
    "priority" "RecommendationPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "GoalStatus" NOT NULL DEFAULT 'ACTIVE',
    "progressPercentage" DECIMAL(5,2),
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_model_versions" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "description" TEXT,
    "algorithm" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "trainedAt" TIMESTAMP(3),
    "deployedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_model_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_assessments" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "snapshotId" UUID NOT NULL,
    "modelVersionId" UUID NOT NULL,
    "financialHealthScore" DECIMAL(5,2) NOT NULL,
    "estimatedCreditScore" INTEGER NOT NULL,
    "confidenceScore" DECIMAL(5,2) NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL,
    "assessmentType" "AssessmentType" NOT NULL DEFAULT 'INITIAL',
    "explainabilityScore" DECIMAL(5,2),
    "summary" TEXT,
    "modelParameters" JSONB,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_factors" (
    "id" UUID NOT NULL,
    "assessmentId" UUID NOT NULL,
    "factorName" TEXT NOT NULL,
    "featureValue" TEXT,
    "description" TEXT,
    "impactScore" DECIMAL(6,2) NOT NULL,
    "importancePercentage" DECIMAL(5,2) NOT NULL,
    "isPositive" BOOLEAN NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessment_factors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_recommendations" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "assessmentId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "priority" "RecommendationPriority" NOT NULL,
    "status" "RecommendationStatus" NOT NULL DEFAULT 'PENDING',
    "estimatedImpact" TEXT,
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investment_recommendations" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "assessmentId" UUID NOT NULL,
    "investmentType" "InvestmentType" NOT NULL,
    "recommendationTitle" TEXT NOT NULL,
    "recommendationText" TEXT NOT NULL,
    "suggestedAmount" DECIMAL(18,2),
    "expectedReturn" DECIMAL(5,2),
    "investmentDuration" INTEGER,
    "riskLevel" "RiskLevel" NOT NULL,
    "expectedRisk" TEXT,
    "confidenceScore" DECIMAL(5,2),
    "status" "RecommendationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investment_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "severity" "Severity" NOT NULL DEFAULT 'LOW',
    "status" "NotificationStatus" NOT NULL DEFAULT 'UNREAD',
    "actionUrl" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "action" "AuditAction" NOT NULL,
    "entity" TEXT,
    "entityId" TEXT,
    "requestMethod" TEXT,
    "endpoint" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_roleId_idx" ON "users"("roleId");

-- CreateIndex
CREATE INDEX "users_isActive_idx" ON "users"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON "refresh_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_expiresAt_idx" ON "refresh_tokens"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "financial_profiles_userId_key" ON "financial_profiles"("userId");

-- CreateIndex
CREATE INDEX "financial_profiles_employmentType_idx" ON "financial_profiles"("employmentType");

-- CreateIndex
CREATE INDEX "financial_profiles_riskLevel_idx" ON "financial_profiles"("riskLevel");

-- CreateIndex
CREATE INDEX "financial_snapshots_userId_idx" ON "financial_snapshots"("userId");

-- CreateIndex
CREATE INDEX "financial_snapshots_profileId_idx" ON "financial_snapshots"("profileId");

-- CreateIndex
CREATE INDEX "financial_snapshots_snapshotDate_idx" ON "financial_snapshots"("snapshotDate");

-- CreateIndex
CREATE INDEX "financial_snapshots_userId_snapshotDate_idx" ON "financial_snapshots"("userId", "snapshotDate");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_categories_name_key" ON "transaction_categories"("name");

-- CreateIndex
CREATE INDEX "transaction_categories_transactionType_idx" ON "transaction_categories"("transactionType");

-- CreateIndex
CREATE INDEX "transactions_userId_idx" ON "transactions"("userId");

-- CreateIndex
CREATE INDEX "transactions_categoryId_idx" ON "transactions"("categoryId");

-- CreateIndex
CREATE INDEX "transactions_transactionDate_idx" ON "transactions"("transactionDate");

-- CreateIndex
CREATE INDEX "transactions_userId_transactionDate_idx" ON "transactions"("userId", "transactionDate");

-- CreateIndex
CREATE INDEX "transactions_transactionType_idx" ON "transactions"("transactionType");

-- CreateIndex
CREATE INDEX "transactions_paymentMethod_idx" ON "transactions"("paymentMethod");

-- CreateIndex
CREATE INDEX "financial_goals_userId_idx" ON "financial_goals"("userId");

-- CreateIndex
CREATE INDEX "financial_goals_status_idx" ON "financial_goals"("status");

-- CreateIndex
CREATE INDEX "financial_goals_userId_status_idx" ON "financial_goals"("userId", "status");

-- CreateIndex
CREATE INDEX "financial_goals_targetDate_idx" ON "financial_goals"("targetDate");

-- CreateIndex
CREATE UNIQUE INDEX "ai_model_versions_version_key" ON "ai_model_versions"("version");

-- CreateIndex
CREATE INDEX "ai_model_versions_isActive_idx" ON "ai_model_versions"("isActive");

-- CreateIndex
CREATE INDEX "credit_assessments_userId_idx" ON "credit_assessments"("userId");

-- CreateIndex
CREATE INDEX "credit_assessments_snapshotId_idx" ON "credit_assessments"("snapshotId");

-- CreateIndex
CREATE INDEX "credit_assessments_modelVersionId_idx" ON "credit_assessments"("modelVersionId");

-- CreateIndex
CREATE INDEX "credit_assessments_generatedAt_idx" ON "credit_assessments"("generatedAt");

-- CreateIndex
CREATE INDEX "credit_assessments_userId_generatedAt_idx" ON "credit_assessments"("userId", "generatedAt");

-- CreateIndex
CREATE INDEX "assessment_factors_assessmentId_idx" ON "assessment_factors"("assessmentId");

-- CreateIndex
CREATE INDEX "assessment_factors_displayOrder_idx" ON "assessment_factors"("displayOrder");

-- CreateIndex
CREATE INDEX "financial_recommendations_userId_idx" ON "financial_recommendations"("userId");

-- CreateIndex
CREATE INDEX "financial_recommendations_assessmentId_idx" ON "financial_recommendations"("assessmentId");

-- CreateIndex
CREATE INDEX "financial_recommendations_priority_idx" ON "financial_recommendations"("priority");

-- CreateIndex
CREATE INDEX "financial_recommendations_status_idx" ON "financial_recommendations"("status");

-- CreateIndex
CREATE INDEX "financial_recommendations_userId_status_idx" ON "financial_recommendations"("userId", "status");

-- CreateIndex
CREATE INDEX "investment_recommendations_userId_idx" ON "investment_recommendations"("userId");

-- CreateIndex
CREATE INDEX "investment_recommendations_assessmentId_idx" ON "investment_recommendations"("assessmentId");

-- CreateIndex
CREATE INDEX "investment_recommendations_investmentType_idx" ON "investment_recommendations"("investmentType");

-- CreateIndex
CREATE INDEX "investment_recommendations_riskLevel_idx" ON "investment_recommendations"("riskLevel");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_status_idx" ON "notifications"("status");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_userId_status_idx" ON "notifications"("userId", "status");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_profiles" ADD CONSTRAINT "financial_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_snapshots" ADD CONSTRAINT "financial_snapshots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_snapshots" ADD CONSTRAINT "financial_snapshots_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "financial_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "transaction_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_goals" ADD CONSTRAINT "financial_goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_assessments" ADD CONSTRAINT "credit_assessments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_assessments" ADD CONSTRAINT "credit_assessments_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "financial_snapshots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_assessments" ADD CONSTRAINT "credit_assessments_modelVersionId_fkey" FOREIGN KEY ("modelVersionId") REFERENCES "ai_model_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_factors" ADD CONSTRAINT "assessment_factors_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "credit_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_recommendations" ADD CONSTRAINT "financial_recommendations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_recommendations" ADD CONSTRAINT "financial_recommendations_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "credit_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investment_recommendations" ADD CONSTRAINT "investment_recommendations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investment_recommendations" ADD CONSTRAINT "investment_recommendations_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "credit_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
