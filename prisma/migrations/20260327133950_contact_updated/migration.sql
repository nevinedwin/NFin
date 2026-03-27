/*
  Warnings:

  - A unique constraint covering the columns `[name,id]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Contact_name_idx" ON "Contact"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_name_id_key" ON "Contact"("name", "id");
