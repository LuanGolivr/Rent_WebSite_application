/*
  Warnings:

  - Added the required column `mimeType` to the `ImageVideo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalName` to the `ImageVideo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `ImageVideo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ImageVideo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `WishList` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ImageVideo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "originalName" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "propertyId" INTEGER NOT NULL,
    CONSTRAINT "ImageVideo_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ImageVideo" ("id", "propertyId", "url") SELECT "id", "propertyId", "url" FROM "ImageVideo";
DROP TABLE "ImageVideo";
ALTER TABLE "new_ImageVideo" RENAME TO "ImageVideo";
CREATE UNIQUE INDEX "ImageVideo_propertyId_key" ON "ImageVideo"("propertyId");
CREATE TABLE "new_Property" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "sellOrRent" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "street" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "furnished" BOOLEAN NOT NULL DEFAULT false,
    "rooms" INTEGER NOT NULL,
    "suites" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "parkingSpace" INTEGER NOT NULL DEFAULT 0,
    "area" REAL NOT NULL,
    "condominiumPrice" REAL NOT NULL DEFAULT 0,
    "price" REAL NOT NULL,
    "playground" BOOLEAN NOT NULL DEFAULT false,
    "gym" BOOLEAN NOT NULL DEFAULT false,
    "gourmetArea" BOOLEAN NOT NULL DEFAULT false,
    "sportCourt" BOOLEAN NOT NULL DEFAULT false,
    "pool" BOOLEAN NOT NULL DEFAULT false,
    "warmPool" BOOLEAN NOT NULL DEFAULT false,
    "greenArea" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Property" ("area", "available", "bathrooms", "city", "condominiumPrice", "description", "furnished", "gourmetArea", "greenArea", "gym", "id", "neighborhood", "ownerId", "parkingSpace", "playground", "pool", "price", "propertyType", "rooms", "sellOrRent", "sportCourt", "state", "street", "suites", "title", "warmPool") SELECT "area", "available", "bathrooms", "city", "condominiumPrice", "description", "furnished", "gourmetArea", "greenArea", "gym", "id", "neighborhood", "ownerId", "parkingSpace", "playground", "pool", "price", "propertyType", "rooms", "sellOrRent", "sportCourt", "state", "street", "suites", "title", "warmPool" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
CREATE TABLE "new_WishList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "WishList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WishList" ("id", "userId") SELECT "id", "userId" FROM "WishList";
DROP TABLE "WishList";
ALTER TABLE "new_WishList" RENAME TO "WishList";
CREATE UNIQUE INDEX "WishList_userId_key" ON "WishList"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
