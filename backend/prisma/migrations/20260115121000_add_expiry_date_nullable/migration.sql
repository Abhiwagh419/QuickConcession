-- DropIndex
DROP INDEX "ConcessionApplication_studentId_fromLine_toLine_fromStation_key";

-- AlterTable
ALTER TABLE "ConcessionApplication" ADD COLUMN     "expiryDate" TIMESTAMP(3);
