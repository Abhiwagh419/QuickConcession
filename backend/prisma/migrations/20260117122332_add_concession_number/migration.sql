/*
  Warnings:

  - A unique constraint covering the columns `[concessionNumber]` on the table `ConcessionApplication` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ConcessionApplication" ADD COLUMN     "concessionNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ConcessionApplication_concessionNumber_key" ON "ConcessionApplication"("concessionNumber");
