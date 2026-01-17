-- AlterEnum
ALTER TYPE "ApplicationStatus" ADD VALUE 'ISSUED';

-- DropForeignKey
ALTER TABLE "OtpVerification" DROP CONSTRAINT "OtpVerification_studentId_fkey";

-- DropIndex
DROP INDEX "OtpVerification_studentId_isUsed_expiresAt_idx";

-- AlterTable
ALTER TABLE "OtpVerification" ADD COLUMN     "staffId" INTEGER,
ALTER COLUMN "studentId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "OtpVerification_studentId_staffId_isUsed_expiresAt_idx" ON "OtpVerification"("studentId", "staffId", "isUsed", "expiresAt");

-- AddForeignKey
ALTER TABLE "OtpVerification" ADD CONSTRAINT "OtpVerification_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtpVerification" ADD CONSTRAINT "OtpVerification_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
