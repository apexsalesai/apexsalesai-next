-- CreateTable
CREATE TABLE "scheduled_publishes" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "processedAt" TIMESTAMP(3),
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scheduled_publishes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "scheduled_publishes_scheduledAt_status_idx" ON "scheduled_publishes"("scheduledAt", "status");

-- CreateIndex
CREATE INDEX "scheduled_publishes_assetId_idx" ON "scheduled_publishes"("assetId");
