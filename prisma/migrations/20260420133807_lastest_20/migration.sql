/*
  Warnings:

  - A unique constraint covering the columns `[createdAt,id]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,name,id]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,id]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transactionDate,transactionRefId]` on the table `TransactionParticipant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionDate` to the `TransactionParticipant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionRefId` to the `TransactionParticipant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "groupId" TEXT;

-- AlterTable
ALTER TABLE "TransactionParticipant" ADD COLUMN     "transactionDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "transactionRefId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Account_userId_createdAt_id_idx" ON "Account"("userId", "createdAt" DESC, "id" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Account_createdAt_id_key" ON "Account"("createdAt", "id");

-- CreateIndex
CREATE INDEX "Category_userId_name_id_idx" ON "Category"("userId", "name" ASC, "id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Category_userId_name_id_key" ON "Category"("userId", "name", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_id_key" ON "Group"("name", "id");

-- CreateIndex
CREATE INDEX "TransactionParticipant_contactId_transactionDate_transactio_idx" ON "TransactionParticipant"("contactId", "transactionDate" DESC, "transactionRefId" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "TransactionParticipant_transactionDate_transactionRefId_key" ON "TransactionParticipant"("transactionDate", "transactionRefId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
