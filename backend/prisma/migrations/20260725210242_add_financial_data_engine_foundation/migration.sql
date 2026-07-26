/*
  Warnings:

  - You are about to drop the column `aiRiskLevel` on the `loan_requests` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FinancialSource" AS ENUM ('MANUAL', 'CSV', 'ACCOUNT_AGGREGATOR', 'BANK_STATEMENT', 'UTILITY_PROVIDER', 'RECHARGE_PROVIDER', 'ECOMMERCE_PLATFORM');

-- CreateEnum
CREATE TYPE "ImportStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "UtilityType" AS ENUM ('ELECTRICITY', 'WATER', 'GAS', 'INTERNET', 'MOBILE_POSTPAID', 'OTHER');

-- CreateEnum
CREATE TYPE "BillStatus" AS ENUM ('PAID', 'PARTIAL', 'MISSED', 'PENDING');

-- CreateEnum
CREATE TYPE "RechargeStatus" AS ENUM ('SUCCESS', 'FAILED', 'PENDING');

-- CreateEnum
CREATE TYPE "RechargeProvider" AS ENUM ('AIRTEL', 'JIO', 'VI', 'BSNL', 'OTHER');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('DELIVERED', 'RETURNED', 'CANCELLED', 'REFUNDED', 'PENDING', 'SHIPPED');

-- CreateEnum
CREATE TYPE "ConsentScope" AS ENUM ('ALL', 'ACCOUNT_AGGREGATOR', 'UTILITY_BILL', 'MOBILE_RECHARGE', 'ECOMMERCE', 'BANK_STATEMENT');

-- DropIndex
DROP INDEX "loan_requests_aiRiskLevel_idx";

-- AlterTable
ALTER TABLE "loan_requests" DROP COLUMN "aiRiskLevel";

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "categoryRefId" UUID,
ADD COLUMN     "importId" UUID,
ADD COLUMN     "merchantId" UUID;

-- CreateTable
CREATE TABLE "financial_imports" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "source" "FinancialSource" NOT NULL,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "recordCount" INTEGER NOT NULL DEFAULT 0,
    "status" "ImportStatus" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "metadata" JSONB,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_imports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_consents" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "scope" "ConsentScope" NOT NULL,
    "isGranted" BOOLEAN NOT NULL DEFAULT true,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "consentVersion" TEXT NOT NULL DEFAULT '1.0',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchants" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "category" TEXT,
    "logoUrl" TEXT,
    "website" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merchants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "parentId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_tags" (
    "id" UUID NOT NULL,
    "transactionId" UUID NOT NULL,
    "tagId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "utility_bills" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "importId" UUID,
    "transactionId" UUID,
    "utilityType" "UtilityType" NOT NULL,
    "providerName" TEXT NOT NULL,
    "accountNumber" TEXT,
    "billNumber" TEXT,
    "billMonth" TEXT NOT NULL,
    "billDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidDate" TIMESTAMP(3),
    "amountDue" DECIMAL(18,2) NOT NULL,
    "amountPaid" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" "BillStatus" NOT NULL DEFAULT 'PENDING',
    "paymentDelayDays" INTEGER,
    "receiptUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "utility_bills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mobile_recharges" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "importId" UUID,
    "transactionId" UUID,
    "provider" "RechargeProvider" NOT NULL,
    "mobileNumber" TEXT,
    "amount" DECIMAL(18,2) NOT NULL,
    "rechargeDate" TIMESTAMP(3) NOT NULL,
    "validityDays" INTEGER,
    "status" "RechargeStatus" NOT NULL DEFAULT 'SUCCESS',
    "isEmergencyRecharge" BOOLEAN NOT NULL DEFAULT false,
    "planType" TEXT,
    "referenceNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mobile_recharges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ecommerce_orders" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "importId" UUID,
    "transactionId" UUID,
    "merchantId" UUID,
    "categoryId" UUID,
    "platform" TEXT NOT NULL,
    "orderId" TEXT,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'DELIVERED',
    "isReturned" BOOLEAN NOT NULL DEFAULT false,
    "isRefunded" BOOLEAN NOT NULL DEFAULT false,
    "paymentMode" "PaymentMethod" NOT NULL,
    "itemCount" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ecommerce_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "financial_imports_userId_idx" ON "financial_imports"("userId");

-- CreateIndex
CREATE INDEX "financial_imports_status_idx" ON "financial_imports"("status");

-- CreateIndex
CREATE INDEX "financial_imports_source_idx" ON "financial_imports"("source");

-- CreateIndex
CREATE INDEX "user_consents_userId_idx" ON "user_consents"("userId");

-- CreateIndex
CREATE INDEX "user_consents_scope_idx" ON "user_consents"("scope");

-- CreateIndex
CREATE INDEX "user_consents_userId_scope_idx" ON "user_consents"("userId", "scope");

-- CreateIndex
CREATE UNIQUE INDEX "merchants_name_key" ON "merchants"("name");

-- CreateIndex
CREATE UNIQUE INDEX "merchants_code_key" ON "merchants"("code");

-- CreateIndex
CREATE INDEX "merchants_name_idx" ON "merchants"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_name_idx" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE INDEX "tags_name_idx" ON "tags"("name");

-- CreateIndex
CREATE INDEX "transaction_tags_transactionId_idx" ON "transaction_tags"("transactionId");

-- CreateIndex
CREATE INDEX "transaction_tags_tagId_idx" ON "transaction_tags"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_tags_transactionId_tagId_key" ON "transaction_tags"("transactionId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "utility_bills_transactionId_key" ON "utility_bills"("transactionId");

-- CreateIndex
CREATE INDEX "utility_bills_userId_idx" ON "utility_bills"("userId");

-- CreateIndex
CREATE INDEX "utility_bills_utilityType_idx" ON "utility_bills"("utilityType");

-- CreateIndex
CREATE INDEX "utility_bills_status_idx" ON "utility_bills"("status");

-- CreateIndex
CREATE INDEX "utility_bills_dueDate_idx" ON "utility_bills"("dueDate");

-- CreateIndex
CREATE INDEX "utility_bills_userId_billMonth_idx" ON "utility_bills"("userId", "billMonth");

-- CreateIndex
CREATE UNIQUE INDEX "mobile_recharges_transactionId_key" ON "mobile_recharges"("transactionId");

-- CreateIndex
CREATE INDEX "mobile_recharges_userId_idx" ON "mobile_recharges"("userId");

-- CreateIndex
CREATE INDEX "mobile_recharges_provider_idx" ON "mobile_recharges"("provider");

-- CreateIndex
CREATE INDEX "mobile_recharges_status_idx" ON "mobile_recharges"("status");

-- CreateIndex
CREATE INDEX "mobile_recharges_rechargeDate_idx" ON "mobile_recharges"("rechargeDate");

-- CreateIndex
CREATE INDEX "mobile_recharges_userId_rechargeDate_idx" ON "mobile_recharges"("userId", "rechargeDate");

-- CreateIndex
CREATE UNIQUE INDEX "ecommerce_orders_transactionId_key" ON "ecommerce_orders"("transactionId");

-- CreateIndex
CREATE INDEX "ecommerce_orders_userId_idx" ON "ecommerce_orders"("userId");

-- CreateIndex
CREATE INDEX "ecommerce_orders_platform_idx" ON "ecommerce_orders"("platform");

-- CreateIndex
CREATE INDEX "ecommerce_orders_status_idx" ON "ecommerce_orders"("status");

-- CreateIndex
CREATE INDEX "ecommerce_orders_orderDate_idx" ON "ecommerce_orders"("orderDate");

-- CreateIndex
CREATE INDEX "ecommerce_orders_userId_orderDate_idx" ON "ecommerce_orders"("userId", "orderDate");

-- CreateIndex
CREATE INDEX "transactions_importId_idx" ON "transactions"("importId");

-- CreateIndex
CREATE INDEX "transactions_merchantId_idx" ON "transactions"("merchantId");

-- CreateIndex
CREATE INDEX "transactions_categoryRefId_idx" ON "transactions"("categoryRefId");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_importId_fkey" FOREIGN KEY ("importId") REFERENCES "financial_imports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_categoryRefId_fkey" FOREIGN KEY ("categoryRefId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_imports" ADD CONSTRAINT "financial_imports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_consents" ADD CONSTRAINT "user_consents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_tags" ADD CONSTRAINT "transaction_tags_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_tags" ADD CONSTRAINT "transaction_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "utility_bills" ADD CONSTRAINT "utility_bills_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "utility_bills" ADD CONSTRAINT "utility_bills_importId_fkey" FOREIGN KEY ("importId") REFERENCES "financial_imports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "utility_bills" ADD CONSTRAINT "utility_bills_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mobile_recharges" ADD CONSTRAINT "mobile_recharges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mobile_recharges" ADD CONSTRAINT "mobile_recharges_importId_fkey" FOREIGN KEY ("importId") REFERENCES "financial_imports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mobile_recharges" ADD CONSTRAINT "mobile_recharges_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ecommerce_orders" ADD CONSTRAINT "ecommerce_orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ecommerce_orders" ADD CONSTRAINT "ecommerce_orders_importId_fkey" FOREIGN KEY ("importId") REFERENCES "financial_imports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ecommerce_orders" ADD CONSTRAINT "ecommerce_orders_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ecommerce_orders" ADD CONSTRAINT "ecommerce_orders_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ecommerce_orders" ADD CONSTRAINT "ecommerce_orders_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
