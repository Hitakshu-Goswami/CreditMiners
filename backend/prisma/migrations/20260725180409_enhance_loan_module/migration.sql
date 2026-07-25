-- CreateEnum
CREATE TYPE "LoanVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "FundingStatus" AS ENUM ('OPEN', 'PARTIALLY_FUNDED', 'FULLY_FUNDED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'FUNDED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LoanCategory" AS ENUM ('PERSONAL', 'EDUCATION', 'BUSINESS', 'MEDICAL', 'AGRICULTURE', 'HOME', 'VEHICLE', 'EMERGENCY', 'OTHER');

-- CreateEnum
CREATE TYPE "LoanPurpose" AS ENUM ('PERSONAL', 'EDUCATION', 'BUSINESS', 'MEDICAL', 'AGRICULTURE', 'HOME_RENOVATION', 'VEHICLE', 'DEBT_CONSOLIDATION', 'EMERGENCY', 'OTHER');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateTable
CREATE TABLE "loan_requests" (
    "id" UUID NOT NULL,
    "borrowerId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(18,2) NOT NULL,
    "durationMonths" INTEGER NOT NULL,
    "purpose" "LoanPurpose" NOT NULL,
    "category" "LoanCategory" NOT NULL,
    "status" "LoanStatus" NOT NULL DEFAULT 'DRAFT',
    "aiCreditScore" INTEGER,
    "riskLevel" "RiskLevel",
    "interestRate" DECIMAL(5,2),
    "minimumInvestment" DECIMAL(12,2),
    "fundingDeadline" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "bookmarkCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "trendingScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "slug" TEXT,
    "visibility" "LoanVisibility" NOT NULL DEFAULT 'PUBLIC',
    "fundingStatus" "FundingStatus" NOT NULL DEFAULT 'OPEN',
    "lastActivityAt" TIMESTAMP(3),
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "fundingProgress" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "requiredFundingDate" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "loan_requests_slug_key" ON "loan_requests"("slug");

-- CreateIndex
CREATE INDEX "loan_requests_borrowerId_idx" ON "loan_requests"("borrowerId");

-- CreateIndex
CREATE INDEX "loan_requests_status_idx" ON "loan_requests"("status");

-- CreateIndex
CREATE INDEX "loan_requests_category_idx" ON "loan_requests"("category");

-- CreateIndex
CREATE INDEX "loan_requests_riskLevel_idx" ON "loan_requests"("riskLevel");

-- CreateIndex
CREATE INDEX "loan_requests_createdAt_idx" ON "loan_requests"("createdAt");

-- CreateIndex
CREATE INDEX "loan_requests_status_category_idx" ON "loan_requests"("status", "category");

-- CreateIndex
CREATE INDEX "loan_requests_city_idx" ON "loan_requests"("city");

-- CreateIndex
CREATE INDEX "loan_requests_state_idx" ON "loan_requests"("state");

-- CreateIndex
CREATE INDEX "loan_requests_country_idx" ON "loan_requests"("country");

-- CreateIndex
CREATE INDEX "loan_requests_interestRate_idx" ON "loan_requests"("interestRate");

-- CreateIndex
CREATE INDEX "loan_requests_fundingStatus_idx" ON "loan_requests"("fundingStatus");

-- CreateIndex
CREATE INDEX "loan_requests_publishedAt_idx" ON "loan_requests"("publishedAt");

-- CreateIndex
CREATE INDEX "loan_requests_viewCount_idx" ON "loan_requests"("viewCount");

-- CreateIndex
CREATE INDEX "loan_requests_trendingScore_idx" ON "loan_requests"("trendingScore");

-- CreateIndex
CREATE INDEX "loan_requests_latitude_longitude_idx" ON "loan_requests"("latitude", "longitude");

-- AddForeignKey
ALTER TABLE "loan_requests" ADD CONSTRAINT "loan_requests_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
