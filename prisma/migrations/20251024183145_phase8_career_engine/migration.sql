/*
  Warnings:

  - You are about to drop the column `bio` on the `career_profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,label]` on the table `career_profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `career_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Agent" DROP CONSTRAINT "Agent_userId_fkey";

-- DropIndex
DROP INDEX "career_profiles_userId_key";

-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "model" SET DEFAULT 'gpt-4o-mini',
ALTER COLUMN "status" SET DEFAULT 'active';

-- AlterTable
ALTER TABLE "career_profiles" DROP COLUMN "bio",
ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "summary" TEXT,
ALTER COLUMN "headline" DROP NOT NULL;

-- CreateTable
CREATE TABLE "resumes" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "parsedJson" JSONB NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "bytes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_analyses" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "jobSource" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "parsedJson" JSONB NOT NULL,
    "fitScore" INTEGER,
    "matchSummary" JSONB,
    "generated" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "resumes_profileId_idx" ON "resumes"("profileId");

-- CreateIndex
CREATE INDEX "job_analyses_profileId_idx" ON "job_analyses"("profileId");

-- CreateIndex
CREATE INDEX "job_analyses_createdAt_idx" ON "job_analyses"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "career_profiles_userId_label_key" ON "career_profiles"("userId", "label");

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "career_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_analyses" ADD CONSTRAINT "job_analyses_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "career_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
