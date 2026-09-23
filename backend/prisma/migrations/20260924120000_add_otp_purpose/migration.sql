-- CreateEnum
CREATE TYPE "OtpPurpose" AS ENUM ('LOGIN', 'RESET');

-- AlterTable
-- Default 'LOGIN' backfills every existing OTP row (including old, already-used/expired
-- password-reset OTPs) as LOGIN. This is safe: those rows are historical and either
-- already used or already expired, so reclassifying them doesn't open any new access.
ALTER TABLE "OtpVerification" ADD COLUMN "purpose" "OtpPurpose" NOT NULL DEFAULT 'LOGIN';

-- DropIndex
DROP INDEX "OtpVerification_studentId_staffId_isUsed_expiresAt_idx";

-- CreateIndex
CREATE INDEX "OtpVerification_studentId_staffId_purpose_isUsed_expiresAt_idx" ON "OtpVerification"("studentId", "staffId", "purpose", "isUsed", "expiresAt");
