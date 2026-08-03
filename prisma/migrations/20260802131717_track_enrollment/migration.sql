-- CreateTable
CREATE TABLE "TrackEnrollment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "trackSlug" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TrackEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "TrackEnrollment_userId_idx" ON "TrackEnrollment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackEnrollment_userId_trackSlug_key" ON "TrackEnrollment"("userId", "trackSlug");
