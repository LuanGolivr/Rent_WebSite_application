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
    CONSTRAINT "ImageVideo_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ImageVideo" ("createdAt", "id", "mimeType", "originalName", "propertyId", "size", "updatedAt", "url") SELECT "createdAt", "id", "mimeType", "originalName", "propertyId", "size", "updatedAt", "url" FROM "ImageVideo";
DROP TABLE "ImageVideo";
ALTER TABLE "new_ImageVideo" RENAME TO "ImageVideo";
CREATE TABLE "new_Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Property" ("area", "available", "bathrooms", "city", "condominiumPrice", "createdAt", "description", "furnished", "gourmetArea", "greenArea", "gym", "id", "neighborhood", "ownerId", "parkingSpace", "playground", "pool", "price", "propertyType", "rooms", "sellOrRent", "sportCourt", "state", "street", "suites", "title", "updatedAt", "warmPool") SELECT "area", "available", "bathrooms", "city", "condominiumPrice", "createdAt", "description", "furnished", "gourmetArea", "greenArea", "gym", "id", "neighborhood", "ownerId", "parkingSpace", "playground", "pool", "price", "propertyType", "rooms", "sellOrRent", "sportCourt", "state", "street", "suites", "title", "updatedAt", "warmPool" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
CREATE TABLE "new_WishList" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "WishList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_WishList" ("createdAt", "id", "updatedAt", "userId") SELECT "createdAt", "id", "updatedAt", "userId" FROM "WishList";
DROP TABLE "WishList";
ALTER TABLE "new_WishList" RENAME TO "WishList";
CREATE UNIQUE INDEX "WishList_userId_key" ON "WishList"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
