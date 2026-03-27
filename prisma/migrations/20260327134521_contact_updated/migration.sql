/*
  Warnings:

  - A unique constraint covering the columns `[userId,name,id]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Contact_name_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Contact_userId_name_id_key" ON "Contact"("userId", "name", "id");
