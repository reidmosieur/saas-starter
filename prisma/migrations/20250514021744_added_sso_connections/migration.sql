-- CreateEnum
CREATE TYPE "ConnectionProvider" AS ENUM ('GOOGLE');

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "owner" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Connection" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "raw" JSONB NOT NULL,
    "provider" "ConnectionProvider" NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
