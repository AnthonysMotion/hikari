-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Anime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "anilistId" INTEGER,
    "title" TEXT NOT NULL,
    "titleRomaji" TEXT,
    "titleEnglish" TEXT,
    "titleNative" TEXT,
    "description" TEXT,
    "coverImage" TEXT,
    "bannerImage" TEXT,
    "status" TEXT NOT NULL,
    "season" TEXT,
    "seasonYear" INTEGER,
    "format" TEXT,
    "episodes" INTEGER,
    "duration" INTEGER,
    "startDate" TEXT,
    "endDate" TEXT,
    "averageScore" INTEGER,
    "popularity" INTEGER,
    "source" TEXT,
    "studios" TEXT,
    "synonyms" TEXT,
    "tags" TEXT,
    "countryOfOrigin" TEXT,
    "isAdult" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Anime" ("coverImage", "createdAt", "description", "episodes", "id", "season", "status", "title", "updatedAt") SELECT "coverImage", "createdAt", "description", "episodes", "id", "season", "status", "title", "updatedAt" FROM "Anime";
DROP TABLE "Anime";
ALTER TABLE "new_Anime" RENAME TO "Anime";
CREATE UNIQUE INDEX "Anime_anilistId_key" ON "Anime"("anilistId");
CREATE TABLE "new_Manga" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "anilistId" INTEGER,
    "title" TEXT NOT NULL,
    "titleRomaji" TEXT,
    "titleEnglish" TEXT,
    "titleNative" TEXT,
    "description" TEXT,
    "coverImage" TEXT,
    "bannerImage" TEXT,
    "status" TEXT NOT NULL,
    "format" TEXT,
    "chapters" INTEGER,
    "volumes" INTEGER,
    "startDate" TEXT,
    "endDate" TEXT,
    "averageScore" INTEGER,
    "popularity" INTEGER,
    "source" TEXT,
    "synonyms" TEXT,
    "tags" TEXT,
    "countryOfOrigin" TEXT,
    "isAdult" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Manga" ("chapters", "coverImage", "createdAt", "description", "id", "status", "title", "updatedAt") SELECT "chapters", "coverImage", "createdAt", "description", "id", "status", "title", "updatedAt" FROM "Manga";
DROP TABLE "Manga";
ALTER TABLE "new_Manga" RENAME TO "Manga";
CREATE UNIQUE INDEX "Manga_anilistId_key" ON "Manga"("anilistId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
