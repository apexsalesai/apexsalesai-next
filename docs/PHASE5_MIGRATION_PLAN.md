# 🔄 PHASE 5 MIGRATION PLAN — DATA MIGRATION & BACKFILL

**File:** `/docs/PHASE5_MIGRATION_PLAN.md`  
**Issued by:** Apex DevOps & Governance (Windsurf / Tim Bryant)  
**Phase:** 5.0 — Data Migration & Backfill  
**Date:** November 4, 2025  
**Status:** 🔵 Ready for Execution  
**Baseline:** `v4.5.1-verified-clean`  
**Duration:** 3 days

---

## 🎯 MIGRATION OBJECTIVES

Migrate existing Phase 4.5 data into Phase 5 Intelligence Core schema:
- **Campaign data** → Intelligence Core with prompt history
- **Agent telemetry** → Structured intelligence events
- **Publishing metrics** → Performance tracking tables
- **Historical data backfill** (last 90 days)
- **Zero downtime** migration strategy

---

## 📊 MIGRATION SCOPE

### Data to Migrate

| Source | Destination | Volume | Priority |
|--------|-------------|--------|----------|
| `Campaign` table | Enhanced with `prompt` field | ~500 campaigns | **Critical** |
| Agent execution logs | `IntelligenceEvent` table | ~50k events | **High** |
| Publishing history | `PromptPerformance` table | ~2k publishes | **High** |
| KPI snapshots | `KPIHistory` table | ~1k records | **Medium** |
| User feedback | `AgentFeedback` table | ~100 records | **Low** |

---

## 🗂️ NEW SCHEMA ADDITIONS

### Phase 5.0 Prisma Schema Changes

```prisma
// Add to schema.prisma

model IntelligenceEvent {
  id          String   @id @default(cuid())
  eventType   String   // AgentTaskCompleted, PromptPerformance, PublishingStatus, etc.
  entityType  String   // campaign, asset, agent, channel
  entityId    String
  payload     Json
  severity    String   @default("info") // critical, high, medium, low, info, debug
  createdAt   DateTime @default(now())
  tenantId    String
  
  @@index([tenantId, eventType, createdAt])
  @@index([entityType, entityId])
  @@index([severity, createdAt])
}

model PromptPerformance {
  id              String   @id @default(cuid())
  campaignId      String
  promptText      String   @db.Text
  variantId       String?  // For A/B testing
  impressions     Int      @default(0)
  clicks          Int      @default(0)
  conversions     Int      @default(0)
  ctr             Float    @default(0)
  cvr             Float    @default(0)
  avgTimeOnPage   Float?
  bounceRate      Float?
  rewardScore     Float    @default(0) // Reinforcement learning score
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  campaign Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  
  @@index([campaignId, rewardScore])
  @@index([variantId])
}

model KPIHistory {
  id          String   @id @default(cuid())
  metricName  String   // arr_run_rate, pipeline_velocity, win_rate, content_ctr, etc.
  metricValue Float
  period      String   // 7d, 14d, 30d, qtd, ytd
  department  String?  // executive, sales, marketing, ops
  metadata    Json?
  createdAt   DateTime @default(now())
  tenantId    String
  
  @@index([tenantId, metricName, createdAt])
  @@index([period, department])
}

model AgentFeedback {
  id          String   @id @default(cuid())
  agentType   String   // Strategy, Copy, Visual, Video
  taskId      String
  feedbackType String  // human, system, automated
  rating      Int?     // 1-5 scale
  comment     String?  @db.Text
  actionTaken String?  // prompt_adjusted, model_switched, parameter_tuned, etc.
  createdAt   DateTime @default(now())
  createdBy   String
  
  @@index([agentType, createdAt])
  @@index([taskId])
}

// Enhance existing Campaign model
model Campaign {
  // ... existing fields ...
  prompt            String?  @db.Text // NEW: User-provided campaign prompt
  promptPerformance PromptPerformance[] // NEW: Relationship to performance tracking
}
```

---

## 🔄 MIGRATION PHASES

### Phase 5.0.1: Schema Migration (Day 1, 2 hours)

**Objective:** Apply Prisma schema changes without data loss

**Steps:**
1. **Backup Production Database**
   ```bash
   # Create point-in-time snapshot
   neon branches create --name "pre-phase5-migration-$(date +%Y%m%d)" --parent main
   
   # Export current data
   pg_dump $DATABASE_URL > backup_phase4.5_$(date +%Y%m%d).sql
   ```

2. **Generate Migration**
   ```bash
   npx prisma migrate dev --name add_intelligence_core_tables --create-only
   ```

3. **Review Migration SQL**
   ```sql
   -- Expected migration file: prisma/migrations/YYYYMMDD_add_intelligence_core_tables/migration.sql
   
   CREATE TABLE "IntelligenceEvent" (
     "id" TEXT NOT NULL PRIMARY KEY,
     "eventType" TEXT NOT NULL,
     "entityType" TEXT NOT NULL,
     "entityId" TEXT NOT NULL,
     "payload" JSONB NOT NULL,
     "severity" TEXT NOT NULL DEFAULT 'info',
     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
     "tenantId" TEXT NOT NULL
   );
   
   CREATE INDEX "IntelligenceEvent_tenantId_eventType_createdAt_idx" ON "IntelligenceEvent"("tenantId", "eventType", "createdAt");
   CREATE INDEX "IntelligenceEvent_entityType_entityId_idx" ON "IntelligenceEvent"("entityType", "entityId");
   CREATE INDEX "IntelligenceEvent_severity_createdAt_idx" ON "IntelligenceEvent"("severity", "createdAt");
   
   -- Similar for PromptPerformance, KPIHistory, AgentFeedback
   
   -- Add prompt column to Campaign
   ALTER TABLE "Campaign" ADD COLUMN "prompt" TEXT;
   ```

4. **Apply Migration to Staging**
   ```bash
   # Test on staging first
   DATABASE_URL=$STAGING_DATABASE_URL npx prisma migrate deploy
   
   # Verify schema
   npx prisma db pull
   npx prisma generate
   ```

5. **Apply Migration to Production**
   ```bash
   # During low-traffic window (2-4 AM UTC)
   DATABASE_URL=$PRODUCTION_DATABASE_URL npx prisma migrate deploy
   
   # Verify
   npx prisma generate
   npm run build
   ```

**Rollback Plan:**
```bash
# If migration fails, restore from snapshot
neon branches restore --branch main --snapshot pre-phase5-migration-YYYYMMDD
```

---

### Phase 5.0.2: Historical Data Backfill (Day 1-2, 8 hours)

**Objective:** Populate new tables with historical data from last 90 days

#### Step 1: Backfill IntelligenceEvent from Agent Logs

**Source:** Application logs, Vercel logs, existing agent execution records

**Script:** `scripts/migrate/backfill-intelligence-events.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { parseAgentLogs } from './parsers/agent-logs';

const prisma = new PrismaClient();

async function backfillIntelligenceEvents() {
  console.log('🔄 Backfilling IntelligenceEvent table...');
  
  // Fetch agent execution history from last 90 days
  const campaigns = await prisma.campaign.findMany({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      },
    },
    include: {
      assets: true,
    },
  });
  
  let eventsCreated = 0;
  
  for (const campaign of campaigns) {
    // Parse agent telemetry from campaign metadata
    const agentTasks = parseAgentLogs(campaign.metadata);
    
    for (const task of agentTasks) {
      await prisma.intelligenceEvent.create({
        data: {
          eventType: 'AgentTaskCompleted',
          entityType: 'agent',
          entityId: task.agentId,
          payload: {
            campaignId: campaign.id,
            assetId: task.assetId,
            duration: task.duration,
            tokensIn: task.tokensIn,
            tokensOut: task.tokensOut,
            cost: task.cost,
            success: task.success,
            model: task.model,
          },
          severity: task.success ? 'info' : 'high',
          createdAt: task.completedAt,
          tenantId: campaign.tenantId,
        },
      });
      eventsCreated++;
    }
    
    // Log progress every 100 campaigns
    if (eventsCreated % 100 === 0) {
      console.log(`  ✅ Processed ${eventsCreated} events...`);
    }
  }
  
  console.log(`✅ Backfilled ${eventsCreated} IntelligenceEvent records`);
}

backfillIntelligenceEvents()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

**Expected Output:**
```
🔄 Backfilling IntelligenceEvent table...
  ✅ Processed 100 events...
  ✅ Processed 200 events...
  ...
✅ Backfilled 2,847 IntelligenceEvent records
```

---

#### Step 2: Backfill PromptPerformance from Publishing History

**Source:** Publishing records, analytics data, channel metrics

**Script:** `scripts/migrate/backfill-prompt-performance.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function backfillPromptPerformance() {
  console.log('🔄 Backfilling PromptPerformance table...');
  
  // Fetch campaigns with publishing history
  const campaigns = await prisma.campaign.findMany({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      },
    },
    include: {
      assets: {
        include: {
          publishJobs: true,
        },
      },
    },
  });
  
  let performanceRecordsCreated = 0;
  
  for (const campaign of campaigns) {
    // Aggregate publishing metrics
    const publishJobs = campaign.assets.flatMap(a => a.publishJobs);
    const impressions = publishJobs.reduce((sum, j) => sum + (j.impressions || 0), 0);
    const clicks = publishJobs.reduce((sum, j) => sum + (j.clicks || 0), 0);
    const conversions = publishJobs.reduce((sum, j) => sum + (j.conversions || 0), 0);
    
    if (impressions > 0) {
      await prisma.promptPerformance.create({
        data: {
          campaignId: campaign.id,
          promptText: campaign.prompt || 'Legacy campaign (no prompt recorded)',
          impressions,
          clicks,
          conversions,
          ctr: clicks / impressions,
          cvr: conversions / (clicks || 1),
          rewardScore: 0, // Will be calculated by learning optimizer
          createdAt: campaign.createdAt,
        },
      });
      performanceRecordsCreated++;
    }
  }
  
  console.log(`✅ Backfilled ${performanceRecordsCreated} PromptPerformance records`);
}

backfillPromptPerformance()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

#### Step 3: Backfill KPIHistory from Snapshots

**Source:** Existing KPI calculations, historical reports

**Script:** `scripts/migrate/backfill-kpi-history.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { calculateHistoricalKPIs } from './calculators/kpis';

const prisma = new PrismaClient();

async function backfillKPIHistory() {
  console.log('🔄 Backfilling KPIHistory table...');
  
  const periods = ['7d', '14d', '30d', 'qtd', 'ytd'];
  const metrics = ['arr_run_rate', 'pipeline_velocity', 'win_rate', 'content_ctr'];
  const departments = ['executive', 'sales', 'marketing', 'ops'];
  
  let kpiRecordsCreated = 0;
  
  // Generate daily snapshots for last 90 days
  for (let i = 0; i < 90; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    
    for (const period of periods) {
      for (const metric of metrics) {
        const value = await calculateHistoricalKPIs(metric, period, date);
        
        if (value !== null) {
          await prisma.kPIHistory.create({
            data: {
              metricName: metric,
              metricValue: value,
              period,
              department: 'executive', // Default to executive view
              createdAt: date,
              tenantId: 'default', // Update with actual tenant ID
            },
          });
          kpiRecordsCreated++;
        }
      }
    }
    
    if (i % 10 === 0) {
      console.log(`  ✅ Processed ${i + 1}/90 days...`);
    }
  }
  
  console.log(`✅ Backfilled ${kpiRecordsCreated} KPIHistory records`);
}

backfillKPIHistory()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

### Phase 5.0.3: Data Validation (Day 2, 2 hours)

**Objective:** Verify migration integrity and data accuracy

**Validation Script:** `scripts/migrate/validate-migration.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function validateMigration() {
  console.log('🔍 Validating Phase 5 migration...\n');
  
  const results = {
    intelligenceEvents: 0,
    promptPerformance: 0,
    kpiHistory: 0,
    agentFeedback: 0,
    campaignsWithPrompts: 0,
  };
  
  // Count records in new tables
  results.intelligenceEvents = await prisma.intelligenceEvent.count();
  results.promptPerformance = await prisma.promptPerformance.count();
  results.kpiHistory = await prisma.kPIHistory.count();
  results.agentFeedback = await prisma.agentFeedback.count();
  
  // Count campaigns with prompts
  results.campaignsWithPrompts = await prisma.campaign.count({
    where: { prompt: { not: null } },
  });
  
  console.log('📊 Migration Results:');
  console.log(`  ✅ IntelligenceEvent: ${results.intelligenceEvents} records`);
  console.log(`  ✅ PromptPerformance: ${results.promptPerformance} records`);
  console.log(`  ✅ KPIHistory: ${results.kpiHistory} records`);
  console.log(`  ✅ AgentFeedback: ${results.agentFeedback} records`);
  console.log(`  ✅ Campaigns with prompts: ${results.campaignsWithPrompts}`);
  
  // Validate data integrity
  console.log('\n🔍 Validating data integrity...');
  
  // Check for orphaned records
  const orphanedPromptPerf = await prisma.promptPerformance.count({
    where: { campaign: null },
  });
  
  if (orphanedPromptPerf > 0) {
    console.error(`  ❌ Found ${orphanedPromptPerf} orphaned PromptPerformance records`);
  } else {
    console.log('  ✅ No orphaned PromptPerformance records');
  }
  
  // Check for negative metrics
  const negativeMetrics = await prisma.kPIHistory.count({
    where: { metricValue: { lt: 0 } },
  });
  
  if (negativeMetrics > 0) {
    console.warn(`  ⚠️  Found ${negativeMetrics} negative KPI values (may be valid)`);
  } else {
    console.log('  ✅ All KPI values are non-negative');
  }
  
  // Check for future-dated events
  const futureEvents = await prisma.intelligenceEvent.count({
    where: { createdAt: { gt: new Date() } },
  });
  
  if (futureEvents > 0) {
    console.error(`  ❌ Found ${futureEvents} future-dated events`);
  } else {
    console.log('  ✅ No future-dated events');
  }
  
  console.log('\n✅ Migration validation complete');
  
  return results;
}

validateMigration()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

**Expected Output:**
```
🔍 Validating Phase 5 migration...

📊 Migration Results:
  ✅ IntelligenceEvent: 2,847 records
  ✅ PromptPerformance: 412 records
  ✅ KPIHistory: 1,080 records
  ✅ AgentFeedback: 0 records
  ✅ Campaigns with prompts: 156

🔍 Validating data integrity...
  ✅ No orphaned PromptPerformance records
  ✅ All KPI values are non-negative
  ✅ No future-dated events

✅ Migration validation complete
```

---

### Phase 5.0.4: Cutover & Monitoring (Day 3, 4 hours)

**Objective:** Deploy Phase 5 code and monitor for issues

**Steps:**

1. **Deploy Phase 5 Code to Staging**
   ```bash
   git checkout main
   git pull origin main
   npm run build
   vercel --prod --env=staging
   ```

2. **Run Smoke Tests**
   ```bash
   npm run test:e2e -- --grep "Phase 5"
   ```

3. **Monitor Staging for 2 Hours**
   - Check dashboard loads correctly
   - Verify KPIs display accurate data
   - Test telemetry ingestion
   - Validate learning pipeline

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

5. **Post-Deployment Monitoring (24 hours)**
   - Error rate (target: <0.1%)
   - Dashboard load time (target: <1.5s)
   - API p95 latency (target: <500ms)
   - Database query performance
   - Cache hit rate (target: >85%)

---

## 🚨 ROLLBACK PROCEDURES

### Scenario 1: Migration Fails

**Symptoms:** Schema migration errors, data corruption

**Action:**
```bash
# Restore from snapshot
neon branches restore --branch main --snapshot pre-phase5-migration-YYYYMMDD

# Verify restoration
npx prisma db pull
npm run build
```

---

### Scenario 2: Backfill Errors

**Symptoms:** Incomplete data, orphaned records

**Action:**
```bash
# Truncate new tables
psql $DATABASE_URL -c "TRUNCATE TABLE \"IntelligenceEvent\", \"PromptPerformance\", \"KPIHistory\", \"AgentFeedback\" CASCADE;"

# Re-run backfill scripts
npm run migrate:backfill
```

---

### Scenario 3: Production Issues Post-Deployment

**Symptoms:** High error rate, performance degradation

**Action:**
```bash
# Revert to Phase 4.5 code
git revert HEAD
npm run build
vercel --prod

# Database remains on Phase 5 schema (backward compatible)
```

---

## 📋 MIGRATION CHECKLIST

### Pre-Migration (Day 0)
- [ ] Backup production database (Neon snapshot)
- [ ] Export data to SQL dump file
- [ ] Review migration SQL
- [ ] Test migration on staging
- [ ] Notify team of maintenance window
- [ ] Prepare rollback scripts

### Migration Day 1
- [ ] Apply schema migration to production (2-4 AM UTC)
- [ ] Verify schema changes
- [ ] Run backfill scripts (IntelligenceEvent)
- [ ] Run backfill scripts (PromptPerformance)
- [ ] Monitor database performance

### Migration Day 2
- [ ] Run backfill scripts (KPIHistory)
- [ ] Run validation scripts
- [ ] Fix any data integrity issues
- [ ] Deploy Phase 5 code to staging
- [ ] Run smoke tests on staging

### Migration Day 3
- [ ] Deploy Phase 5 code to production
- [ ] Monitor error rates (24 hours)
- [ ] Monitor performance metrics
- [ ] Verify dashboard functionality
- [ ] Document any issues

### Post-Migration (Day 4+)
- [ ] Delete old backup files (after 7 days)
- [ ] Update documentation
- [ ] Train team on new Intelligence Core features
- [ ] Schedule Phase 5.1 kickoff

---

## 🏁 SIGN-OFF

| Role | Name | Date | Signature |
|------|------|------|-----------|
| **DevOps Lead** | Windsurf Agent | 2025-11-04 | ✅ Ready |
| **Database Admin** | Apex DevOps Team | 2025-11-04 | ⏳ Pending |
| **QA Lead** | Mia (Ops AI) | 2025-11-04 | ✅ Approved |

---

**Document Version:** 1.0  
**Last Updated:** November 4, 2025  
**Next Review:** Post-Migration (Day 4)

---

**🔄 Phase 5.0 Migration Plan Complete — Ready for Execution**
