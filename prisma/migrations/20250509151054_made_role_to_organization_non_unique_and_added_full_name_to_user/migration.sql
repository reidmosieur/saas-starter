-- DropIndex
DROP INDEX "Role_organizationId_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fullName" TEXT;
