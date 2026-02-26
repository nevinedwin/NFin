/*
  Warnings:

  - Added the required column `type` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('BANK', 'WALLET', 'CREDIT', 'POST_OFFICE');

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "type" "AccountType" NOT NULL;
