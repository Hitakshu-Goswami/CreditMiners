-- Phase 9: Explainability and insights monthly report storage.

CREATE TYPE "MonthlyReportStatus" AS ENUM (
    'GENERATED',
    'SUPERSEDED'
);

CREATE TABLE "monthly_financial_reports" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "reportMonth" TIMESTAMP(3) NOT NULL,
    "summary" TEXT NOT NULL,
    "positiveFactors" JSONB NOT NULL,
    "negativeFactors" JSONB NOT NULL,
    "insights" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "confidence" DECIMAL(5,2) NOT NULL,
    "dataCompleteness" DECIMAL(5,2) NOT NULL,
    "disclaimer" TEXT NOT NULL,
    "sourceTrace" JSONB,
    "version" TEXT NOT NULL DEFAULT 'phase-9-report-v1',
    "status" "MonthlyReportStatus" NOT NULL DEFAULT 'GENERATED',
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monthly_financial_reports_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "monthly_financial_reports_userId_reportMonth_key"
ON "monthly_financial_reports"("userId", "reportMonth");

CREATE INDEX "monthly_financial_reports_userId_idx"
ON "monthly_financial_reports"("userId");

CREATE INDEX "monthly_financial_reports_reportMonth_idx"
ON "monthly_financial_reports"("reportMonth");

CREATE INDEX "monthly_financial_reports_userId_reportMonth_idx"
ON "monthly_financial_reports"("userId", "reportMonth");

ALTER TABLE "monthly_financial_reports"
ADD CONSTRAINT "monthly_financial_reports_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
