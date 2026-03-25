/*
  Warnings:

  - You are about to drop the column `toAccountId` on the `Transaction` table. All the data in the column will be lost.
  - Made the column `accountId` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "TransferType" AS ENUM ('TRANSFER_OUT', 'TRANSFER_IN');

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_toAccountId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "toAccountId",
ADD COLUMN     "transferGroupId" TEXT,
ADD COLUMN     "transferType" "TransferType",
ALTER COLUMN "accountId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
