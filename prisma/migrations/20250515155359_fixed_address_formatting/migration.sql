/*
  Warnings:

  - You are about to drop the column `city_name` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `postal_code` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `state_name` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `state_name` on the `City` table. All the data in the column will be lost.
  - You are about to drop the column `city_name` on the `Zip` table. All the data in the column will be lost.
  - You are about to drop the column `state_name` on the `Zip` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[streetLineOne,streetLineTwo,cityName,zipCode,stateName,country]` on the table `Address` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,stateName]` on the table `City` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cityName,stateName,code]` on the table `Zip` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cityName` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stateName` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stateName` to the `City` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cityName` to the `Zip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stateName` to the `Zip` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_city_name_state_name_fkey";

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_city_name_state_name_postal_code_fkey";

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_state_name_fkey";

-- DropForeignKey
ALTER TABLE "City" DROP CONSTRAINT "City_state_name_fkey";

-- DropForeignKey
ALTER TABLE "Zip" DROP CONSTRAINT "Zip_city_name_state_name_fkey";

-- DropForeignKey
ALTER TABLE "Zip" DROP CONSTRAINT "Zip_state_name_fkey";

-- DropIndex
DROP INDEX "Address_streetLineOne_streetLineTwo_city_name_postal_code_s_key";

-- DropIndex
DROP INDEX "City_name_state_name_key";

-- DropIndex
DROP INDEX "Zip_city_name_state_name_code_key";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "city_name",
DROP COLUMN "postal_code",
DROP COLUMN "state_name",
ADD COLUMN     "cityName" TEXT NOT NULL,
ADD COLUMN     "stateName" TEXT NOT NULL,
ADD COLUMN     "zipCode" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "City" DROP COLUMN "state_name",
ADD COLUMN     "stateName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Zip" DROP COLUMN "city_name",
DROP COLUMN "state_name",
ADD COLUMN     "cityName" TEXT NOT NULL,
ADD COLUMN     "stateName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Address_streetLineOne_streetLineTwo_cityName_zipCode_stateN_key" ON "Address"("streetLineOne", "streetLineTwo", "cityName", "zipCode", "stateName", "country");

-- CreateIndex
CREATE UNIQUE INDEX "City_name_stateName_key" ON "City"("name", "stateName");

-- CreateIndex
CREATE UNIQUE INDEX "Zip_cityName_stateName_code_key" ON "Zip"("cityName", "stateName", "code");

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_stateName_fkey" FOREIGN KEY ("stateName") REFERENCES "State"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zip" ADD CONSTRAINT "Zip_cityName_stateName_fkey" FOREIGN KEY ("cityName", "stateName") REFERENCES "City"("name", "stateName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zip" ADD CONSTRAINT "Zip_stateName_fkey" FOREIGN KEY ("stateName") REFERENCES "State"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_stateName_fkey" FOREIGN KEY ("stateName") REFERENCES "State"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_cityName_stateName_fkey" FOREIGN KEY ("cityName", "stateName") REFERENCES "City"("name", "stateName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_cityName_stateName_zipCode_fkey" FOREIGN KEY ("cityName", "stateName", "zipCode") REFERENCES "Zip"("cityName", "stateName", "code") ON DELETE RESTRICT ON UPDATE CASCADE;
