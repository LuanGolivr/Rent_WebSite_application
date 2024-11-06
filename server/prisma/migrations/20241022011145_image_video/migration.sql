/*
  Warnings:

  - You are about to drop the column `userId` on the `ImageVideo` table. All the data in the column will be lost.
  - Added the required column `propertyId` to the `ImageVideo` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ImageVideo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "propertyId" INTEGER NOT NULL,
    CONSTRAINT "ImageVideo_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ImageVideo" ("id", "url") SELECT "id", "url" FROM "ImageVideo";
DROP TABLE "ImageVideo";
ALTER TABLE "new_ImageVideo" RENAME TO "ImageVideo";
CREATE UNIQUE INDEX "ImageVideo_propertyId_key" ON "ImageVideo"("propertyId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
