/*
  Warnings:

  - You are about to drop the column `userAgent` on the `Session` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "expiresAt" DATETIME,
    "revokedAt" DATETIME,
    "ipAddress" TEXT,
    "context" TEXT,
    "ua" TEXT,
    "isBot" BOOLEAN,
    "browserName" TEXT,
    "browserVersion" TEXT,
    "browserMajor" TEXT,
    "deviceModel" TEXT,
    "deviceType" TEXT,
    "deviceVendor" TEXT,
    "engineName" TEXT,
    "engineVersion" TEXT,
    "osName" TEXT,
    "osVersion" TEXT,
    "cpuArchitecture" TEXT,
    "hostname" TEXT,
    "city" TEXT,
    "region" TEXT,
    "country" TEXT,
    "loc" TEXT,
    "org" TEXT,
    "postal" TEXT,
    "timezone" TEXT,
    "metadata" JSONB,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("context", "createdAt", "expiresAt", "id", "ipAddress", "metadata", "revokedAt", "updatedAt", "userId") SELECT "context", "createdAt", "expiresAt", "id", "ipAddress", "metadata", "revokedAt", "updatedAt", "userId" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
