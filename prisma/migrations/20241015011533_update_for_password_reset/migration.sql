/*
  Warnings:

  - You are about to drop the column `passwordResetToken` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "passwordResetToken",
ADD COLUMN     "passwordResetExpiresIn" TIMESTAMP(3),
ADD COLUMN     "passwordResetString" TEXT;
