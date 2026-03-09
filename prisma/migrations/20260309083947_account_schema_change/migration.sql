/*
  Warnings:

  - You are about to drop the column `atmNumber` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "atmNumber",
ADD COLUMN     "cardNumber" TEXT;
