/*
  Warnings:

  - You are about to drop the column `CreditLimit` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "CreditLimit",
ADD COLUMN     "creditLimit" DOUBLE PRECISION,
ALTER COLUMN "billingDate" SET DATA TYPE TEXT,
ALTER COLUMN "dueDate" SET DATA TYPE TEXT;
