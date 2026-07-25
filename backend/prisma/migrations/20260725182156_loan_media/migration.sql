-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('ID_PROOF', 'ADDRESS_PROOF', 'BANK_STATEMENT', 'SALARY_SLIP', 'BUSINESS_PROOF', 'COLLATERAL_PROOF', 'OTHER');

-- CreateTable
CREATE TABLE "loan_media" (
    "id" UUID NOT NULL,
    "loanId" UUID NOT NULL,
    "mediaType" "MediaType" NOT NULL,
    "documentType" "DocumentType",
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "publicId" TEXT,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loan_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "loan_media_loanId_idx" ON "loan_media"("loanId");

-- AddForeignKey
ALTER TABLE "loan_media" ADD CONSTRAINT "loan_media_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loan_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
