-- CreateTable
CREATE TABLE "ChatFile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChatFile_userId_createdAt_idx" ON "ChatFile"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "ChatFile" ADD CONSTRAINT "ChatFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;