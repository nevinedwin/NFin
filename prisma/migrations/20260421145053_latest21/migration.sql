/*
  Warnings:

  - A unique constraint covering the columns `[userId,name,id]` on the table `Group` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Group_name_id_key";

-- CreateIndex
CREATE INDEX "Group_userId_name_id_idx" ON "Group"("userId", "name" ASC, "id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Group_userId_name_id_key" ON "Group"("userId", "name", "id");
