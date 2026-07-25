-- CreateEnum
CREATE TYPE "InterestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "CollateralType" AS ENUM ('NONE', 'PROPERTY', 'VEHICLE', 'GOLD', 'BUSINESS', 'MACHINERY', 'INVENTORY', 'OTHER');

-- AlterTable
ALTER TABLE "loan_media" ADD COLUMN     "collateralDescription" TEXT,
ADD COLUMN     "collateralType" "CollateralType" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "collateralValue" DECIMAL(18,2);

-- CreateTable
CREATE TABLE "loan_interests" (
    "id" UUID NOT NULL,
    "loanId" UUID NOT NULL,
    "investorId" UUID NOT NULL,
    "amountOffered" DECIMAL(18,2),
    "message" TEXT,
    "status" "InterestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_interests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "loan_interests_loanId_idx" ON "loan_interests"("loanId");

-- CreateIndex
CREATE INDEX "loan_interests_investorId_idx" ON "loan_interests"("investorId");

-- CreateIndex
CREATE UNIQUE INDEX "loan_interests_loanId_investorId_key" ON "loan_interests"("loanId", "investorId");

-- AddForeignKey
ALTER TABLE "loan_interests" ADD CONSTRAINT "loan_interests_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loan_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_interests" ADD CONSTRAINT "loan_interests_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
