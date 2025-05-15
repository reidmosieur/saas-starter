/*
  Warnings:

  - A unique constraint covering the columns `[stripCustomerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "OnboardingSteps" ADD VALUE 'BILLING';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripCustomerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_stripCustomerId_key" ON "User"("stripCustomerId");
