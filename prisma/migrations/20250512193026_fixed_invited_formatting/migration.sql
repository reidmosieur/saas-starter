/*
  Warnings:

  - You are about to drop the column `invited` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "invited",
ADD COLUMN     "invitedAt" TIMESTAMP(3);
