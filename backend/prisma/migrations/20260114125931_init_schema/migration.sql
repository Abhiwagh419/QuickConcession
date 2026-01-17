/*
  Warnings:

  - A unique constraint covering the columns `[studentId,fromLine,toLine,fromStation,toStation,startDate]` on the table `ConcessionApplication` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fromLine` to the `ConcessionApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toLine` to the `ConcessionApplication` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ConcessionApplication_studentId_fromStation_toStation_start_key";

-- AlterTable
ALTER TABLE "ConcessionApplication" ADD COLUMN     "fromLine" TEXT NOT NULL,
ADD COLUMN     "toLine" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ConcessionApplication_studentId_fromLine_toLine_fromStation_key" ON "ConcessionApplication"("studentId", "fromLine", "toLine", "fromStation", "toStation");
