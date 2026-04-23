/*
  Warnings:

  - A unique constraint covering the columns `[userId,contactId]` on the table `ContactBalance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ContactBalance_userId_contactId_key" ON "ContactBalance"("userId", "contactId");
