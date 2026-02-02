-- CreateTable
CREATE TABLE "DiagnosisResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sex" TEXT NOT NULL,
    "ageRange" TEXT NOT NULL,
    "answers" TEXT NOT NULL,
    "aiResult" TEXT,
    "isUnlocked" BOOLEAN NOT NULL DEFAULT false,
    "unlockedAt" DATETIME,
    "unlockToken" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DiagnosisResult_unlockToken_key" ON "DiagnosisResult"("unlockToken");
