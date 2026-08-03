-- AlterTable
ALTER TABLE "User" ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN "otpCode" TEXT;
ALTER TABLE "User" ADD COLUMN "otpExpiresAt" DATETIME;

-- CreateTable
CREATE TABLE "ExamAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "trackSlug" TEXT NOT NULL,
    "stageSlug" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "questionsJson" TEXT NOT NULL,
    "answersJson" TEXT NOT NULL,
    "fingerprintsJson" TEXT NOT NULL,
    "feedbackJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExamAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ExamAttempt_userId_trackSlug_stageSlug_idx" ON "ExamAttempt"("userId", "trackSlug", "stageSlug");
