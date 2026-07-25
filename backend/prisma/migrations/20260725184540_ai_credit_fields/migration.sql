-- AlterTable
ALTER TABLE "loan_requests" ADD COLUMN     "aiConfidence" DOUBLE PRECISION,
ADD COLUMN     "aiLastEvaluatedAt" TIMESTAMP(3),
ADD COLUMN     "aiRecommendation" TEXT,
ADD COLUMN     "aiRiskLevel" "RiskLevel",
ADD COLUMN     "aiSummary" TEXT;

-- CreateIndex
CREATE INDEX "loan_requests_aiRiskLevel_idx" ON "loan_requests"("aiRiskLevel");
