-- CreateEnum
CREATE TYPE "BlogPostStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED');

-- DropForeignKey
ALTER TABLE "SequenceExecution" DROP CONSTRAINT "SequenceExecution_sequenceStateId_fkey";

-- DropForeignKey
ALTER TABLE "SequenceExecution" DROP CONSTRAINT "SequenceExecution_sequenceStepId_fkey";

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "company" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "status" TEXT,
ALTER COLUMN "tenantId" DROP NOT NULL,
ALTER COLUMN "industry" DROP NOT NULL,
ALTER COLUMN "stage" DROP NOT NULL,
ALTER COLUMN "confidence_score" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ObservabilityEvent" ADD COLUMN     "data" JSONB,
ADD COLUMN     "level" TEXT,
ADD COLUMN     "occurredAt" TIMESTAMP(3),
ADD COLUMN     "source" TEXT,
ALTER COLUMN "tenantId" DROP NOT NULL,
ALTER COLUMN "type" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SequenceDefinition" ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "tenantId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SequenceExecution" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "leadId" INTEGER,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "sequenceDefinitionId" INTEGER,
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "status" TEXT,
ALTER COLUMN "sequenceStateId" DROP NOT NULL,
ALTER COLUMN "sequenceStepId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SequenceStep" ADD COLUMN     "delayHours" INTEGER,
ADD COLUMN     "order" INTEGER,
ADD COLUMN     "type" TEXT,
ALTER COLUMN "stepId" DROP NOT NULL,
ALTER COLUMN "action" DROP NOT NULL;

-- CreateTable
CREATE TABLE "agent_profiles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "image" TEXT,
    "generatedBy" TEXT,
    "generatedByUserId" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdByEmail" TEXT,
    "lastModifiedBy" TEXT,
    "lastModifiedAt" TIMESTAMP(3),
    "generationModel" TEXT,
    "generationCost" DECIMAL(8,4),
    "generationTokens" INTEGER,
    "generationTime" INTEGER,
    "complianceChecked" BOOLEAN NOT NULL DEFAULT false,
    "complianceStatus" TEXT,
    "complianceNotes" TEXT,
    "author" TEXT NOT NULL DEFAULT 'ApexSalesAI Editorial Team',
    "authorEmail" TEXT,
    "publishedAt" TIMESTAMP(3),
    "publishedBy" TEXT,
    "status" "BlogPostStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduledFor" TIMESTAMP(3),
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "canonicalUrl" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "category" TEXT,
    "syndicatedTo" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "syndicationUrls" JSONB,
    "version" INTEGER NOT NULL DEFAULT 1,
    "previousVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_engagement" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "uniqueViews" INTEGER NOT NULL DEFAULT 0,
    "avgTimeOnPage" INTEGER NOT NULL DEFAULT 0,
    "bounceRate" DECIMAL(5,4) NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "leadConversions" INTEGER NOT NULL DEFAULT 0,
    "demoRequests" INTEGER NOT NULL DEFAULT 0,
    "revenueInfluence" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "organicTraffic" INTEGER NOT NULL DEFAULT 0,
    "socialTraffic" INTEGER NOT NULL DEFAULT 0,
    "directTraffic" INTEGER NOT NULL DEFAULT 0,
    "referralTraffic" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_engagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_analytics_events" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "metadata" JSONB,
    "appInsightsEventId" TEXT,
    "appInsightsSent" BOOLEAN NOT NULL DEFAULT false,
    "dataverseRecordId" TEXT,
    "dataverseSynced" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "brandVoice" TEXT NOT NULL,
    "channels" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'draft',
    "targetLength" TEXT NOT NULL DEFAULT 'medium',
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_tasks" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "agentType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "input" JSONB NOT NULL,
    "output" JSONB,
    "costTokensIn" INTEGER NOT NULL DEFAULT 0,
    "costTokensOut" INTEGER NOT NULL DEFAULT 0,
    "latencyMs" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "agent_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_assets" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "parentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "publishedTo" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metric_events" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "metric" TEXT,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT,
    "dims" JSONB,
    "dimensions" JSONB,
    "occurredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metric_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_action_logs" (
    "id" TEXT NOT NULL,
    "agentId" TEXT,
    "sequenceExecutionId" INTEGER,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "input" JSONB NOT NULL,
    "output" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_action_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integrations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "instanceUrl" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publish_jobs" (
    "id" TEXT NOT NULL,
    "orgId" TEXT,
    "userId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "scheduledAt" TIMESTAMP(3),
    "postedAt" TIMESTAMP(3),
    "postUrl" TEXT,
    "errorMessage" TEXT,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "engagement" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "publish_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oauth_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "skills" TEXT[],
    "portfolioUrls" TEXT[],
    "socialLinks" JSONB,
    "resumeUrl" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'private',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "career_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_performance" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "engagement" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "spendUsd" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "insights" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_performance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_status_publishedAt_idx" ON "blog_posts"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "blog_posts_slug_idx" ON "blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_generatedBy_idx" ON "blog_posts"("generatedBy");

-- CreateIndex
CREATE INDEX "blog_posts_approvedBy_idx" ON "blog_posts"("approvedBy");

-- CreateIndex
CREATE INDEX "blog_posts_createdBy_idx" ON "blog_posts"("createdBy");

-- CreateIndex
CREATE INDEX "blog_posts_complianceStatus_idx" ON "blog_posts"("complianceStatus");

-- CreateIndex
CREATE INDEX "post_engagement_date_idx" ON "post_engagement"("date");

-- CreateIndex
CREATE UNIQUE INDEX "post_engagement_postId_date_key" ON "post_engagement"("postId", "date");

-- CreateIndex
CREATE INDEX "blog_analytics_events_postId_eventType_idx" ON "blog_analytics_events"("postId", "eventType");

-- CreateIndex
CREATE INDEX "blog_analytics_events_createdAt_idx" ON "blog_analytics_events"("createdAt");

-- CreateIndex
CREATE INDEX "blog_analytics_events_appInsightsSent_idx" ON "blog_analytics_events"("appInsightsSent");

-- CreateIndex
CREATE INDEX "blog_analytics_events_dataverseSynced_idx" ON "blog_analytics_events"("dataverseSynced");

-- CreateIndex
CREATE INDEX "campaigns_status_createdAt_idx" ON "campaigns"("status", "createdAt");

-- CreateIndex
CREATE INDEX "campaigns_createdById_idx" ON "campaigns"("createdById");

-- CreateIndex
CREATE INDEX "agent_tasks_campaignId_agentType_idx" ON "agent_tasks"("campaignId", "agentType");

-- CreateIndex
CREATE INDEX "agent_tasks_status_idx" ON "agent_tasks"("status");

-- CreateIndex
CREATE INDEX "content_assets_campaignId_type_idx" ON "content_assets"("campaignId", "type");

-- CreateIndex
CREATE INDEX "content_assets_status_idx" ON "content_assets"("status");

-- CreateIndex
CREATE INDEX "metric_events_name_createdAt_idx" ON "metric_events"("name", "createdAt");

-- CreateIndex
CREATE INDEX "metric_events_metric_createdAt_idx" ON "metric_events"("metric", "createdAt");

-- CreateIndex
CREATE INDEX "integrations_userId_idx" ON "integrations"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "integrations_userId_provider_key" ON "integrations"("userId", "provider");

-- CreateIndex
CREATE INDEX "publish_jobs_userId_idx" ON "publish_jobs"("userId");

-- CreateIndex
CREATE INDEX "publish_jobs_assetId_idx" ON "publish_jobs"("assetId");

-- CreateIndex
CREATE INDEX "publish_jobs_status_idx" ON "publish_jobs"("status");

-- CreateIndex
CREATE INDEX "publish_jobs_scheduledAt_idx" ON "publish_jobs"("scheduledAt");

-- CreateIndex
CREATE INDEX "oauth_tokens_userId_idx" ON "oauth_tokens"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_tokens_userId_platform_key" ON "oauth_tokens"("userId", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "career_profiles_userId_key" ON "career_profiles"("userId");

-- CreateIndex
CREATE INDEX "career_profiles_userId_idx" ON "career_profiles"("userId");

-- CreateIndex
CREATE INDEX "career_profiles_visibility_idx" ON "career_profiles"("visibility");

-- CreateIndex
CREATE INDEX "content_performance_assetId_idx" ON "content_performance"("assetId");

-- CreateIndex
CREATE INDEX "content_performance_platform_idx" ON "content_performance"("platform");

-- CreateIndex
CREATE INDEX "content_performance_periodStart_idx" ON "content_performance"("periodStart");

-- AddForeignKey
ALTER TABLE "SequenceExecution" ADD CONSTRAINT "SequenceExecution_sequenceStateId_fkey" FOREIGN KEY ("sequenceStateId") REFERENCES "SequenceState"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SequenceExecution" ADD CONSTRAINT "SequenceExecution_sequenceStepId_fkey" FOREIGN KEY ("sequenceStepId") REFERENCES "SequenceStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SequenceExecution" ADD CONSTRAINT "SequenceExecution_sequenceDefinitionId_fkey" FOREIGN KEY ("sequenceDefinitionId") REFERENCES "SequenceDefinition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SequenceExecution" ADD CONSTRAINT "SequenceExecution_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_previousVersionId_fkey" FOREIGN KEY ("previousVersionId") REFERENCES "blog_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_engagement" ADD CONSTRAINT "post_engagement_postId_fkey" FOREIGN KEY ("postId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_analytics_events" ADD CONSTRAINT "blog_analytics_events_postId_fkey" FOREIGN KEY ("postId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_tasks" ADD CONSTRAINT "agent_tasks_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_assets" ADD CONSTRAINT "content_assets_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_action_logs" ADD CONSTRAINT "agent_action_logs_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agent_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_action_logs" ADD CONSTRAINT "agent_action_logs_sequenceExecutionId_fkey" FOREIGN KEY ("sequenceExecutionId") REFERENCES "SequenceExecution"("id") ON DELETE SET NULL ON UPDATE CASCADE;
