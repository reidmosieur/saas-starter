-- AlterTable
ALTER TABLE "User" ADD COLUMN     "invitationDeclined" TIMESTAMP(3),
ADD COLUMN     "invitationRescinded" TIMESTAMP(3),
ADD COLUMN     "invited" TIMESTAMP(3),
ADD COLUMN     "lastActivity" TIMESTAMP(3),
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "lastPasswordChange" TIMESTAMP(3),
ADD COLUMN     "suspended" TIMESTAMP(3);
