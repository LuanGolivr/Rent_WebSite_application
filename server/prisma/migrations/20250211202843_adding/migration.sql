/*
  Warnings:

  - The primary key for the `ImageVideo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PropertiesOnWishList` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `WishList` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ImageVideo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "originalName" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "propertyId" TEXT NOT NULL,
    CONSTRAINT "ImageVideo_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ImageVideo" ("createdAt", "id", "mimeType", "originalName", "propertyId", "size", "updatedAt", "url") SELECT "createdAt", "id", "mimeType", "originalName", "propertyId", "size", "updatedAt", "url" FROM "ImageVideo";
DROP TABLE "ImageVideo";
ALTER TABLE "new_ImageVideo" RENAME TO "ImageVideo";
CREATE TABLE "new_PropertiesOnWishList" (
    "propertyId" TEXT NOT NULL,
    "wishListId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("propertyId", "wishListId"),
    CONSTRAINT "PropertiesOnWishList_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PropertiesOnWishList_wishListId_fkey" FOREIGN KEY ("wishListId") REFERENCES "WishList" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PropertiesOnWishList" ("assignedAt", "propertyId", "wishListId") SELECT "assignedAt", "propertyId", "wishListId" FROM "PropertiesOnWishList";
DROP TABLE "PropertiesOnWishList";
ALTER TABLE "new_PropertiesOnWishList" RENAME TO "PropertiesOnWishList";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "isAgent" BOOLEAN NOT NULL DEFAULT false,
    "phoneNumber" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "activeToken" TEXT NOT NULL DEFAULT '',
    "activeExperes" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("cpf", "createdAt", "email", "firstName", "id", "isAgent", "isVerified", "password", "phoneNumber", "surname", "updatedAt") SELECT "cpf", "createdAt", "email", "firstName", "id", "isAgent", "isVerified", "password", "phoneNumber", "surname", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");
CREATE TABLE "new_WishList" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "WishList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WishList" ("createdAt", "id", "updatedAt", "userId") SELECT "createdAt", "id", "updatedAt", "userId" FROM "WishList";
DROP TABLE "WishList";
ALTER TABLE "new_WishList" RENAME TO "WishList";
CREATE UNIQUE INDEX "WishList_userId_key" ON "WishList"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
