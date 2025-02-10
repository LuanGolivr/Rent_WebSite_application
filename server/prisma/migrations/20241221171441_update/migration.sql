-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Property" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "sellOrRent" TEXT NOT NULL DEFAULT 'sell',
    "propertyType" TEXT NOT NULL DEFAULT 'apartment',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "street" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "furnished" BOOLEAN NOT NULL DEFAULT false,
    "rooms" INTEGER NOT NULL,
    "suites" INTEGER NOT NULL DEFAULT 0,
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
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Property" ("area", "available", "bathrooms", "city", "condominiumPrice", "description", "furnished", "gourmetArea", "greenArea", "gym", "id", "neighborhood", "ownerId", "parkingSpace", "playground", "pool", "price", "propertyType", "rooms", "sellOrRent", "sportCourt", "state", "street", "suites", "title", "warmPool") SELECT "area", "available", "bathrooms", "city", "condominiumPrice", "description", "furnished", "gourmetArea", "greenArea", "gym", "id", "neighborhood", "ownerId", "parkingSpace", "playground", "pool", "price", "propertyType", "rooms", "sellOrRent", "sportCourt", "state", "street", "suites", "title", "warmPool" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
