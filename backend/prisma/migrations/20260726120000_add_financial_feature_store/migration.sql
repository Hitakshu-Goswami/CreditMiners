-- Phase 4: Versioned financial feature store for ML-ready engineered features.

CREATE TYPE "FeatureDataType" AS ENUM (
    'NUMERIC',
    'SCORE',
    'RATIO',
    'COUNT',
    'DAYS',
    'AMOUNT',
    'PERCENTAGE'
);

CREATE TYPE "FeatureRunStatus" AS ENUM (
    'COMPLETED',
    'FAILED'
);

CREATE TABLE "financial_feature_runs" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "version" TEXT NOT NULL,
    "window" TEXT NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "windowEnd" TIMESTAMP(3) NOT NULL,
    "status" "FeatureRunStatus" NOT NULL DEFAULT 'COMPLETED',
    "featureCount" INTEGER NOT NULL DEFAULT 0,
    "qualityScore" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "inputSummary" JSONB,
    "validationIssues" JSONB,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financial_feature_runs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "financial_features" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "runId" UUID NOT NULL,
    "featureName" TEXT NOT NULL,
    "featureGroup" TEXT NOT NULL,
    "rawValue" DECIMAL(18,6) NOT NULL,
    "normalizedValue" DECIMAL(8,6) NOT NULL,
    "percentile" DECIMAL(5,2) NOT NULL,
    "bucket" TEXT NOT NULL,
    "dataType" "FeatureDataType" NOT NULL,
    "window" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "qualityScore" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "confidence" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "definition" TEXT NOT NULL,
    "formula" TEXT NOT NULL,
    "dependencies" JSONB,
    "source" JSONB,
    "metadata" JSONB,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financial_features_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "financial_feature_runs_userId_idx" ON "financial_feature_runs"("userId");
CREATE INDEX "financial_feature_runs_version_idx" ON "financial_feature_runs"("version");
CREATE INDEX "financial_feature_runs_computedAt_idx" ON "financial_feature_runs"("computedAt");
CREATE INDEX "financial_feature_runs_userId_computedAt_idx" ON "financial_feature_runs"("userId", "computedAt");

CREATE INDEX "financial_features_userId_idx" ON "financial_features"("userId");
CREATE INDEX "financial_features_runId_idx" ON "financial_features"("runId");
CREATE INDEX "financial_features_featureName_idx" ON "financial_features"("featureName");
CREATE INDEX "financial_features_featureGroup_idx" ON "financial_features"("featureGroup");
CREATE INDEX "financial_features_version_idx" ON "financial_features"("version");
CREATE INDEX "financial_features_userId_featureName_idx" ON "financial_features"("userId", "featureName");
CREATE INDEX "financial_features_userId_featureGroup_idx" ON "financial_features"("userId", "featureGroup");

ALTER TABLE "financial_feature_runs"
ADD CONSTRAINT "financial_feature_runs_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "financial_features"
ADD CONSTRAINT "financial_features_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "financial_features"
ADD CONSTRAINT "financial_features_runId_fkey"
FOREIGN KEY ("runId") REFERENCES "financial_feature_runs"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
