/*
  Warnings:

  - Added the required column `username` to the `Connection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Connection" ADD COLUMN     "username" TEXT NOT NULL;
