/*
  Warnings:

  - A unique constraint covering the columns `[date,id]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Transaction_userId_date_id_idx" ON "Transaction"("userId", "date" DESC, "id" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_date_id_key" ON "Transaction"("date", "id");
