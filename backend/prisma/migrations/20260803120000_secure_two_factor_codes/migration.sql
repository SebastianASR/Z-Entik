-- CreateEnum
CREATE TYPE "TwoFactorCodePurpose" AS ENUM ('LOGIN', 'ENABLE', 'DISABLE');

-- Existing TwoFactorCode rows may contain plaintext codes from the old shape.
-- The table is not used in production yet, so invalidate them before reshaping.
DELETE FROM "TwoFactorCode";

-- DropForeignKey
ALTER TABLE "TwoFactorCode" DROP CONSTRAINT "TwoFactorCode_userId_fkey";

-- AlterTable
ALTER TABLE "TwoFactorCode"
  DROP COLUMN "code",
  DROP COLUMN "used",
  ADD COLUMN "codeHash" TEXT NOT NULL,
  ADD COLUMN "purpose" "TwoFactorCodePurpose" NOT NULL,
  ADD COLUMN "usedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "TwoFactorCode_userId_purpose_idx" ON "TwoFactorCode"("userId", "purpose");

-- CreateIndex
CREATE INDEX "TwoFactorCode_expiresAt_idx" ON "TwoFactorCode"("expiresAt");

-- AddForeignKey
ALTER TABLE "TwoFactorCode" ADD CONSTRAINT "TwoFactorCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
