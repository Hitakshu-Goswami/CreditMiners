-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('HIGH_SCHOOL', 'DIPLOMA', 'BACHELORS', 'MASTERS', 'DOCTORATE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "IncomeFrequency" AS ENUM ('WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY', 'IRREGULAR');

-- CreateEnum
CREATE TYPE "SavingsHabit" AS ENUM ('NONE', 'OCCASIONAL', 'REGULAR', 'AUTOMATED');

-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('LIGHT', 'DARK', 'SYSTEM');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'BANNED', 'DELETED');

-- AlterTable
ALTER TABLE "users"
  ADD COLUMN "dateOfBirth" TIMESTAMP(3),
  ADD COLUMN "gender" "Gender",
  ADD COLUMN "education" "EducationLevel",
  ADD COLUMN "city" TEXT,
  ADD COLUMN "state" TEXT,
  ADD COLUMN "country" TEXT,
  ADD COLUMN "pendingEmail" TEXT,
  ADD COLUMN "emailChangeToken" TEXT,
  ADD COLUMN "emailChangeExpires" TIMESTAMP(3),
  ADD COLUMN "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "pendingPhone" TEXT,
  ADD COLUMN "phoneVerificationToken" TEXT,
  ADD COLUMN "phoneVerificationExpires" TIMESTAMP(3),
  ADD COLUMN "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "refresh_tokens" ADD COLUMN "deviceInfo" TEXT;

-- AlterTable
ALTER TABLE "financial_profiles"
  ADD COLUMN "monthlyIncome" DECIMAL(18,2),
  ADD COLUMN "incomeFrequency" "IncomeFrequency",
  ADD COLUMN "monthlyExpenses" DECIMAL(18,2),
  ADD COLUMN "savingsHabit" "SavingsHabit",
  ADD COLUMN "existingInvestments" DECIMAL(18,2) NOT NULL DEFAULT 0,
  ADD COLUMN "emergencyFund" DECIMAL(18,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "user_preferences" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "language" TEXT NOT NULL DEFAULT 'en',
  "theme" "Theme" NOT NULL DEFAULT 'SYSTEM',
  "notificationPreferences" JSONB,
  "privacyPreferences" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onboarding" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "currentStep" INTEGER NOT NULL DEFAULT 1,
  "profileCompletionPercentage" INTEGER NOT NULL DEFAULT 0,
  "financialProfileCompletionPercentage" INTEGER NOT NULL DEFAULT 0,
  "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "onboarding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_pendingEmail_key" ON "users"("pendingEmail");
CREATE UNIQUE INDEX "users_emailChangeToken_key" ON "users"("emailChangeToken");
CREATE UNIQUE INDEX "users_pendingPhone_key" ON "users"("pendingPhone");
CREATE UNIQUE INDEX "users_phoneVerificationToken_key" ON "users"("phoneVerificationToken");
CREATE INDEX "users_status_idx" ON "users"("status");
CREATE INDEX "users_city_idx" ON "users"("city");
CREATE UNIQUE INDEX "user_preferences_userId_key" ON "user_preferences"("userId");
CREATE UNIQUE INDEX "onboarding_userId_key" ON "onboarding"("userId");
CREATE INDEX "onboarding_onboardingCompleted_idx" ON "onboarding"("onboardingCompleted");

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "onboarding" ADD CONSTRAINT "onboarding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
