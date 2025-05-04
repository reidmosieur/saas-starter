-- CreateTable
CREATE TABLE "PhoneNumber" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "countryCode" TEXT NOT NULL,
    "number" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "passwordId" INTEGER,
    "phoneNumberId" INTEGER,
    CONSTRAINT "User_passwordId_fkey" FOREIGN KEY ("passwordId") REFERENCES "Password" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_phoneNumberId_fkey" FOREIGN KEY ("phoneNumberId") REFERENCES "PhoneNumber" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "email", "firstName", "id", "lastName", "passwordId", "updatedAt", "username") SELECT "createdAt", "email", "firstName", "id", "lastName", "passwordId", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_passwordId_key" ON "User"("passwordId");
CREATE UNIQUE INDEX "User_phoneNumberId_key" ON "User"("phoneNumberId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "PhoneNumber_countryCode_number_key" ON "PhoneNumber"("countryCode", "number");
