-- CreateEnum
CREATE TYPE "TransferType" AS ENUM ('TRANSFER_OUT', 'TRANSFER_IN');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "transferType" "TransferType";
