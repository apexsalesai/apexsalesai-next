-- AlterTable
ALTER TABLE "AgentAction" ADD COLUMN     "executionDuration" INTEGER,
ADD COLUMN     "executionResult" TEXT,
ADD COLUMN     "overriddenBy" INTEGER,
ADD COLUMN     "overrideReason" TEXT,
ADD COLUMN     "roiImpact" DOUBLE PRECISION,
ADD COLUMN     "sequenceExecutionId" INTEGER,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'executed';

-- AlterTable
ALTER TABLE "AuthToken" ADD COLUMN     "metadata" TEXT;

-- CreateTable
CREATE TABLE "SequenceDefinition" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SequenceDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SequenceStep" (
    "id" SERIAL NOT NULL,
    "sequenceDefinitionId" INTEGER NOT NULL,
    "stepId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "action" TEXT NOT NULL,
    "conditions" JSONB,
    "nextSteps" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SequenceStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SequenceState" (
    "id" SERIAL NOT NULL,
    "sequenceDefinitionId" INTEGER NOT NULL,
    "leadId" INTEGER NOT NULL,
    "currentStepId" TEXT NOT NULL,
    "context" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SequenceState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SequenceExecution" (
    "id" SERIAL NOT NULL,
    "sequenceStateId" INTEGER NOT NULL,
    "sequenceStepId" INTEGER NOT NULL,
    "executionTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "result" JSONB,
    "nextStepId" TEXT,

    CONSTRAINT "SequenceExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SequenceMetrics" (
    "id" SERIAL NOT NULL,
    "sequenceExecutionId" INTEGER NOT NULL,
    "timeSavedMinutes" DOUBLE PRECISION,
    "revenueImpact" DOUBLE PRECISION,
    "costSavings" DOUBLE PRECISION,
    "confidenceScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SequenceMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SequenceMetrics_sequenceExecutionId_key" ON "SequenceMetrics"("sequenceExecutionId");

-- AddForeignKey
ALTER TABLE "AgentAction" ADD CONSTRAINT "AgentAction_sequenceExecutionId_fkey" FOREIGN KEY ("sequenceExecutionId") REFERENCES "SequenceExecution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SequenceDefinition" ADD CONSTRAINT "SequenceDefinition_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SequenceStep" ADD CONSTRAINT "SequenceStep_sequenceDefinitionId_fkey" FOREIGN KEY ("sequenceDefinitionId") REFERENCES "SequenceDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SequenceState" ADD CONSTRAINT "SequenceState_sequenceDefinitionId_fkey" FOREIGN KEY ("sequenceDefinitionId") REFERENCES "SequenceDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SequenceState" ADD CONSTRAINT "SequenceState_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SequenceExecution" ADD CONSTRAINT "SequenceExecution_sequenceStateId_fkey" FOREIGN KEY ("sequenceStateId") REFERENCES "SequenceState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SequenceExecution" ADD CONSTRAINT "SequenceExecution_sequenceStepId_fkey" FOREIGN KEY ("sequenceStepId") REFERENCES "SequenceStep"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SequenceMetrics" ADD CONSTRAINT "SequenceMetrics_sequenceExecutionId_fkey" FOREIGN KEY ("sequenceExecutionId") REFERENCES "SequenceExecution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
