-- AlterTable
ALTER TABLE "User" ADD COLUMN "resetPasswordExpires" BIGINT;
ALTER TABLE "User" ADD COLUMN "resetPasswordToken" TEXT;
