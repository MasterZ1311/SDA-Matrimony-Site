-- CreateEnum
CREATE TYPE "MatchSuggestionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "MatchSuggestion" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "suggestedUserId" TEXT NOT NULL,
    "status" "MatchSuggestionStatus" NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatchSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MatchSuggestion_userId_status_idx" ON "MatchSuggestion"("userId", "status");

-- CreateIndex
CREATE INDEX "MatchSuggestion_adminId_idx" ON "MatchSuggestion"("adminId");

-- CreateIndex
CREATE INDEX "MatchSuggestion_suggestedUserId_idx" ON "MatchSuggestion"("suggestedUserId");

-- AddForeignKey
ALTER TABLE "MatchSuggestion" ADD CONSTRAINT "MatchSuggestion_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchSuggestion" ADD CONSTRAINT "MatchSuggestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchSuggestion" ADD CONSTRAINT "MatchSuggestion_suggestedUserId_fkey" FOREIGN KEY ("suggestedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
