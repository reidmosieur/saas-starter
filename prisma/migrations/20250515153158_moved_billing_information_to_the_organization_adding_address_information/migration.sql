/*
  Warnings:

  - You are about to drop the column `stripCustomerId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeCustomerId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('BILLING', 'MAILING');

-- DropIndex
DROP INDEX "User_stripCustomerId_key";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "stripeCustomerId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "stripCustomerId";

-- CreateTable
CREATE TABLE "State" (
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "State_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "City" (
    "name" TEXT NOT NULL,
    "state_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Zip" (
    "code" INTEGER NOT NULL,
    "city_name" TEXT NOT NULL,
    "state_name" TEXT NOT NULL,

    CONSTRAINT "Zip_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "AddressType" NOT NULL,
    "borough" TEXT,
    "streetLineOne" TEXT NOT NULL,
    "streetLineTwo" TEXT,
    "city_name" TEXT NOT NULL,
    "postal_code" INTEGER NOT NULL,
    "state_name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "organizationId" INTEGER NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "State_name_key" ON "State"("name");

-- CreateIndex
CREATE UNIQUE INDEX "State_slug_key" ON "State"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "City_name_state_name_key" ON "City"("name", "state_name");

-- CreateIndex
CREATE UNIQUE INDEX "Zip_code_key" ON "Zip"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Zip_city_name_state_name_code_key" ON "Zip"("city_name", "state_name", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Address_streetLineOne_streetLineTwo_city_name_postal_code_s_key" ON "Address"("streetLineOne", "streetLineTwo", "city_name", "postal_code", "state_name", "country");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_stripeCustomerId_key" ON "Organization"("stripeCustomerId");

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_state_name_fkey" FOREIGN KEY ("state_name") REFERENCES "State"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zip" ADD CONSTRAINT "Zip_city_name_state_name_fkey" FOREIGN KEY ("city_name", "state_name") REFERENCES "City"("name", "state_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zip" ADD CONSTRAINT "Zip_state_name_fkey" FOREIGN KEY ("state_name") REFERENCES "State"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_state_name_fkey" FOREIGN KEY ("state_name") REFERENCES "State"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_city_name_state_name_fkey" FOREIGN KEY ("city_name", "state_name") REFERENCES "City"("name", "state_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_city_name_state_name_postal_code_fkey" FOREIGN KEY ("city_name", "state_name", "postal_code") REFERENCES "Zip"("city_name", "state_name", "code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
