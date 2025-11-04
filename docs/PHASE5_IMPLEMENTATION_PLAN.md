# 🧭 PHASE 5 IMPLEMENTATION PLAN — INTELLIGENCE & INSIGHTS LAYER

**File:** `/docs/PHASE5_IMPLEMENTATION_PLAN.md`  
**Issued by:** Apex Governance Office (Tim Bryant / Windsurf)  
**Phase:** 5 — Intelligence & Insights Layer  
**Date:** November 4, 2025  
**Status:** 🔵 Ready for Execution  
**Baseline:** `v4.5.1-verified-clean`  
**Strategy:** Hybrid (Dashboard-First + Parallel Intelligence Core)

---

## 🧭 EXECUTIVE SUMMARY

Phase 5 evolves ApexSalesAI from **operational automation** to **strategic intelligence**.

The objective is to make ApexSalesAI not only generate and execute sales actions, but also **learn, optimize, and adapt** from every campaign, channel, and customer interaction.

This phase creates the **Apex Intelligence Core** — a modular insights engine that powers:

- 📊 Predictive revenue forecasting
- 🧠 Adaptive prompt chaining
- 📈 Real-time agent learning
- 🎯 Executive dashboards with department-specific KPIs
- 🔄 Continuous optimization loops across the agentic ecosystem

By the end of Phase 5, ApexSalesAI becomes a **self-improving AI Sales OS** — capable of identifying friction points, improving agent precision, and guiding leadership decisions through autonomous intelligence.

---

## 🧩 PHASE 5 SYSTEM ARCHITECTURE OVERVIEW

### 1️⃣ Intelligence Core

**Purpose:** Central hub that aggregates agent telemetry, campaign outcomes, and CRM interactions.

**Components:**
- `lib/intelligence/core.ts` — Central orchestrator
- `lib/intelligence/learning.ts` — Learning pipeline
- `lib/intelligence/analytics.ts` — KPI aggregation engine

**Key Features:**
- Ingest agent action logs, publishing data, and prompt-to-result mappings
- Maintain "Agent Memory Graph" for contextual reasoning
- Execute prompt-chain refinements via reinforcement weighting

**Resilience Patterns:**
- Circuit breaker for Azure Cognitive Search calls
- Redis cache layer (5-minute TTL for hot data)
- Graceful degradation (show cached data with staleness indicator)
- Fallback to local aggregation if Azure unavailable

---

### 2️⃣ Observability & Telemetry

**Purpose:** Enable full visibility across campaigns, assets, and agents.

**Components:**
- `api/observability/route.ts` — Telemetry ingestion endpoint
- `lib/telemetry/collector.ts` — Event collector with sampling
- `lib/telemetry/dashboard.ts` — Dashboard data aggregator

**Data Captured:**

| Event Type | Description | Frequency | Sampling Rate |
|------------|-------------|-----------|---------------|
| `AgentTaskCompleted` | Each AI agent task outcome (success/failure/time) | Real-time | 100% (critical) |
| `PromptPerformance` | Prompt effectiveness (CTR, engagement) | Hourly | 100% |
| `PublishingStatus` | Channel result metrics (posted/scheduled/errors) | 10-min intervals | 100% |
| `CampaignSummary` | Overall campaign performance snapshot | Daily | 100% |
| `DebugTrace` | Detailed execution traces | Real-time | 10% (sampled) |
| `InfoLog` | General informational events | Real-time | 10% (sampled) |

**Visualization:**
- Integrated into Executive Dashboard (Phase 5.3)
- Real-time metrics for Sales, Marketing, and Leadership roles

**Cost Optimization:**
- Hot storage: 90 days (Azure Table Storage)
- Cold archive: 1 year (Azure Blob Storage - Cool tier)
- Estimated cost: $200-500/month at 10k campaigns/month scale

---

### 3️⃣ Adaptive Prompt Chaining (Phase 5.2)

**Purpose:** Continuously optimize content generation quality.

**Workflow:**
1. Store user-provided prompt and system-generated output
2. Capture performance signals (clicks, conversions, time-on-page)
3. Feed into fine-tuning loop to adapt future prompt construction
4. A/B test prompt variants before full rollout

**Implementation:**
- `lib/learning/promptChain.ts` — Prompt optimization engine
- `api/learning/updatePrompt.ts` — Feedback ingestion endpoint
- `prisma/models/prompt_performance` — Performance tracking table

**AgentRunner Integration:**
- Agents read `campaign.prompt` and performance history
- Apply weighted prompt templates based on historical success
- Generate variants for A/B testing (20% traffic to new variants)

**Goal:** Each campaign iteration becomes smarter — more context-aware and success-optimized.

---

### 4️⃣ Executive Dashboards (Phase 5.3)

**Purpose:** Deliver real-time, glassmorphic dashboards for decision-makers.

**Core Views:**
- **Sales View:** Pipeline velocity, win rate, agent conversion performance
- **Marketing View:** Campaign engagement, content ROI, top-performing assets
- **Operations View:** System uptime, agent latency, error telemetry
- **Executive View:** Aggregated performance intelligence with anomaly alerts

**Tech Stack:**
- Recharts + Framer Motion for dynamic graphs
- Adaptive cards with sparkline trends
- `/app/dashboard/page.tsx` → modular departmental panels
- Secure access via Microsoft 365 SSO

**Performance Budgets:**
- TTI target: ≤ 1.5s on 2019 MacBook, ≤ 2.0s mid-tier Windows
- Bundle: dashboard strict chunk ≤ 180KB gzipped
- Charts: Recharts only on visible panels (intersection observer lazy mount)
- Polling: 10s default, backoff → 30/60s if tab backgrounded

**Accessibility:**
- WCAG AA+ color contrast
- Keyboard navigation with visible focus rings
- ARIA live regions for metric updates
- Screen reader compatible

---

## ⚙️ TECHNICAL BLUEPRINT

### 🧠 Data Schema Expansion

**New Tables (Prisma):**

```prisma
model IntelligenceEvent {
  id          String   @id @default(cuid())
  eventType   String   // AgentTaskCompleted, PromptPerformance, etc.
  entityType  String   // campaign, asset, agent, channel
  entityId    String
  payload     Json
  severity    String   @default("info") // critical, high, medium, low, info, debug
  createdAt   DateTime @default(now())
  tenantId    String
  
  @@index([tenantId, eventType, createdAt])
  @@index([entityType, entityId])
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
  metricName  String   // arr_run_rate, pipeline_velocity, win_rate, etc.
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
  actionTaken String?  // prompt_adjusted, model_switched, etc.
  createdAt   DateTime @default(now())
  createdBy   String
  
  @@index([agentType, createdAt])
  @@index([taskId])
}
```

---

### 🔍 Intelligence Flow

**Inbound:**
1. Agent telemetry (time, cost, latency, success)
2. Publishing success/failure metrics
3. CRM interaction data via Microsoft Graph
4. User feedback (explicit ratings, implicit signals)

**Processing:**
1. Normalize → Vectorize → Store in Dataverse + Postgres
2. Feed data into adaptive prompt logic
3. Update KPIs + Executive dashboard
4. Trigger alerts for anomalies (sudden drop in CTR, agent errors)

**Outbound:**
1. Optimized prompt recommendations
2. Executive alerts & dashboard updates
3. Continuous learning updates to agent personas (Max, Mia, etc.)
4. A/B test results and winner declarations

---

### 🧠 Machine Learning Integration (Phase 5.4)

**Goal:** Enable Apex to "coach itself."

**Modules:**
- `lib/learning/optimizer.ts` — Reinforcement learning optimizer
- `lib/learning/rewardFunction.ts` — Reward calculation engine
- `lib/learning/abTest.ts` — A/B testing framework

**Reinforcement Learning Specification:**

```typescript
// lib/learning/optimizer.ts

/**
 * Reward Function for Prompt Performance
 * 
 * Reward = (CTR_weight * CTR_delta) + 
 *          (CVR_weight * CVR_delta) + 
 *          (Engagement_weight * Engagement_delta) - 
 *          (Cost_penalty * Cost_delta)
 * 
 * Weights (tunable):
 * - CTR_weight: 0.3
 * - CVR_weight: 0.5
 * - Engagement_weight: 0.15
 * - Cost_penalty: 0.05
 * 
 * Delta = (current_value - baseline_value) / baseline_value
 */

export interface RewardConfig {
  ctrWeight: number;
  cvrWeight: number;
  engagementWeight: number;
  costPenalty: number;
  minSampleSize: number; // Minimum impressions before updating
}

export const DEFAULT_REWARD_CONFIG: RewardConfig = {
  ctrWeight: 0.3,
  cvrWeight: 0.5,
  engagementWeight: 0.15,
  costPenalty: 0.05,
  minSampleSize: 100, // Wait for 100 impressions
};

/**
 * Training Cadence:
 * - Batch updates: Weekly (every Sunday 2 AM UTC)
 * - Minimum samples per variant: 100 impressions
 * - A/B test duration: 7 days minimum
 * - Winner threshold: 95% confidence, 10% lift minimum
 * - Rollback trigger: Performance drop > 15% for 2 consecutive days
 */

export interface LearningUpdate {
  promptId: string;
  variantId: string;
  rewardScore: number;
  confidence: number; // 0-1
  sampleSize: number;
  shouldPromote: boolean;
  shouldRollback: boolean;
  reason: string;
}
```

**A/B Testing Framework:**
- 80% traffic to current best-performing variant
- 20% traffic split across new test variants (max 3 concurrent tests)
- Statistical significance: 95% confidence interval
- Minimum effect size: 10% lift in primary metric (CVR)
- Auto-rollback if variant underperforms by >15% for 48 hours

**Overfitting Prevention:**
- Regularization: Penalize prompts with high variance
- Holdout set: 10% of campaigns reserved for validation
- Temporal validation: Test on recent data (last 30 days)
- Cross-validation: Test across different personas and channels

---

## 📊 EXECUTIVE DASHBOARD SPECIFICATION

### Information Architecture & Routing

**Entry:** `/dashboard` → default Executive view

**Tabs (top):** Executive | Sales | Marketing | Ops/IT

**Deep links:**
- `/dashboard?view=executive`
- `/dashboard?view=sales&panel=pipeline`
- `/dashboard?view=marketing&panel=content-roi`

**Global Controls (top-right):**
- Time range: `{Last 7d, 14d, 30d, QTD, YTD, Custom}`
- Environment badge: `{Prod, Staging}` (read-only)
- "Export" (PNG/PDF), "Share" (signed URL), "Alert Rules"

---

### Layout Grid & Glassmorphism

**Canvas width:** 1440px desktop target (fluid 1280–1680)  
**Grid:** 12 columns, 24px gutter, 32px outer padding  
**Panels (cards):** 16px inner padding, 20px between panels

**Elevation:**
- Panel base: `blur(16px)` + `rgba(255,255,255,0.08)`, border `1px rgba(255,255,255,0.12)`
- Hover: `scale(1.01)`, `shadow-lg`, border to `0.18` alpha

**Theme tokens:**
```css
--bg: #0A0F1A;           /* deep midnight */
--primary: #00E1C6;      /* electric teal */
--accent: #1E90FF;       /* signal blue */
--text-main: #E6F1FF;
--text-dim: #93A4BD;
--success: #14E08E;
--warn: #FFB020;
--danger: #FF4757;
```

---

### Page Anatomy (Executive View)

**Hero Row (full width, 1×12):**
- "Apex Neural Pulse" (animated node map) left
- KPI sparkline bar right
- Quick KPIs (4 tiles): ARR Run-Rate, Pipeline Velocity, Win Rate, Content CTR
- Each tile: metric → sparkline → delta vs prior period → info tooltip

**Row 2 (4×3):**
- Revenue Trajectory (Recharts area + regression line)
- Pipeline Health (stacked bar by stage; drill-downs)
- Top Performing Channels (horizontal bars; LinkedIn/X/Blog/Email)
- Agent Utilization & Cost (donut: time & cost split; hover to detail)

**Row 3 (8×4 + 4×4):**
- Left (8×4): Campaign Leaderboard (table: Campaign | Status | CTR | CVR | Cost | ROI | Owner | Aging; sortable, paginated)
- Right (4×4): Risk & Anomalies (list of red/yellow flags from Intelligence Core)

**Footer strip (full width):** Live Events ticker ("Publishing succeeded", "Variant C outperformed by +18% CTR", etc.)

---

### Data Contracts (TypeScript)

```typescript
// lib/intelligence/types.ts

export type TimeRangeKey = '7d'|'14d'|'30d'|'qtd'|'ytd'|'custom';

export interface MetricPoint { t: string; v: number; }
export interface Delta { value: number; direction: 'up'|'down'|'flat'; }

export interface KpiTileDTO {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  delta?: Delta;
  series?: MetricPoint[]; // for sparkline
  target?: number;
}

export interface RevenueTrajectoryDTO {
  series: MetricPoint[];
  forecast: MetricPoint[];
}

export interface PipelineStage {
  stage: 'MQL'|'SQL'|'Demo'|'Proposal'|'Commit'|'ClosedWon'|'ClosedLost';
  count: number;
  value: number;
  conversionToNext?: number;
}

export interface ChannelPerf {
  channel: 'linkedin'|'x'|'blog'|'email'|'youtube';
  impressions: number;
  clicks: number;
  ctr: number;
  leads: number;
  cost: number;
  roi: number;
}

export interface AgentUtilization {
  agent: 'Strategy'|'Copy'|'Visual'|'Video';
  seconds: number;
  tokensIn: number;
  tokensOut: number;
  costUsd: number;
}

export interface CampaignRow {
  id: string;
  name: string;
  owner: string;
  status: 'draft'|'running'|'paused'|'completed'|'error';
  ctr: number;
  cvr: number;
  cost: number;
  roi: number;
  ageDays: number;
}

export interface RiskItem {
  id: string;
  severity: 'critical'|'high'|'medium'|'low';
  title: string;
  detail: string;
  entityType: 'campaign'|'asset'|'agent'|'channel';
  entityId: string;
  recommendedAction?: string;
  createdAt: string;
}
```

---

### API Endpoints

**KPI bundle (single payload, cache 10s):**

```typescript
GET /api/dashboard/kpis?view=executive&range=30d

Response:
{
  "tiles": [ /* KpiTileDTO[] */ ],
  "revenueTrajectory": { "series": [...], "forecast": [...] },
  "pipeline": [ /* PipelineStage[] */ ],
  "channels": [ /* ChannelPerf[] */ ],
  "agents": [ /* AgentUtilization[] */ ],
  "campaigns": { "rows": [ /* CampaignRow[] */ ], "total": 128 },
  "risks": [ /* RiskItem[] */ ],
  "events": [ { "t": "2025-11-04T18:22:15Z", "msg": "..." } ]
}
```

**Drilldowns:**
```typescript
GET /api/dashboard/campaigns?sort=roi&dir=desc&page=1&pageSize=25
GET /api/dashboard/risks?severity=high
GET /api/dashboard/channels?range=30d
GET /api/dashboard/agents?range=7d
```

**Export/Share:**
```typescript
POST /api/dashboard/export { view, range, format: 'png'|'pdf' } → signed URL
POST /api/dashboard/share { view, range, expiresIn } → share token
```

---

### KPI Definitions (Unambiguous)

| KPI | Formula | Notes |
|-----|---------|-------|
| **ARR Run-Rate** | `sum(ClosedWon.ACV) * 12 / periodMonths` | Annualized |
| **Pipeline Velocity** | `(New MRR + Expansion MRR − Churn MRR) / days` | Daily rate |
| **Win Rate** | `ClosedWon / (ClosedWon + ClosedLost)` | For period |
| **CTR (per channel)** | `clicks / impressions` | Percentage |
| **CVR (per campaign)** | `conversions / clicks` | Percentage |
| **ROI** | `(Attributed Revenue − Cost) / Cost` | Multiplier |
| **Agent Cost** | `sum(costUsd)` from `AgentTask` table | USD |
| **Latency p95** | 95th percentile of task durations | Milliseconds |

All KPIs include time-range normalization and previous-period delta.

---

## ⏱️ EXECUTION TIMELINE (HYBRID STRATEGY)

### Phase 5.0: Data Migration & Backfill (3 days)
**Owner:** DevOps / Windsurf  
**Deliverables:**
- Migration scripts for existing campaign data
- Backfill historical telemetry (last 90 days)
- Schema validation and integrity checks
- See: `PHASE5_MIGRATION_PLAN.md`

### Phase 5.1: Intelligence Core + Telemetry (1 week)
**Owner:** Windsurf / Ops  
**Deliverables:**
- `lib/intelligence/core.ts` — Central orchestrator
- `lib/telemetry/collector.ts` — Event ingestion with sampling
- `api/observability/route.ts` — Telemetry endpoint
- Redis cache layer for hot data
- Circuit breaker for Azure Cognitive Search

### Phase 5.2: Adaptive Prompt Chaining (1 week)
**Owner:** Dev AI / Mia  
**Deliverables:**
- `lib/learning/promptChain.ts` — Prompt optimization
- `lib/learning/abTest.ts` — A/B testing framework
- `api/learning/updatePrompt.ts` — Feedback endpoint
- AgentRunner integration with prompt history

### Phase 5.3: Executive Dashboards (1 week) ← **START HERE**
**Owner:** Frontend + Design  
**Deliverables:**
- `/app/dashboard/page.tsx` — Main dashboard shell
- All components (KpiTile, TrendAreaChart, CampaignTable, etc.)
- `/api/dashboard/kpis/route.ts` — Mock data endpoint
- Glassmorphism styling + Framer Motion
- Accessibility compliance (WCAG AA+)

### Phase 5.4: Reinforcement Learning & Optimization (1.5 weeks)
**Owner:** AI / Data  
**Deliverables:**
- `lib/learning/optimizer.ts` — RL optimizer with reward function
- `lib/learning/rewardFunction.ts` — Reward calculation
- Weekly batch training pipeline
- A/B test winner promotion logic
- Rollback mechanism for underperforming variants

### Phase 5.5: QA, Governance, and Performance Testing (3 days)
**Owner:** Apex QA  
**Deliverables:**
- Unit tests (80% coverage target)
- Integration tests for learning pipeline
- Load tests (1000 concurrent users)
- Performance validation (TTI ≤ 1.5s)
- Security audit (RBAC, PII masking)
- See: `PHASE5_TESTING_PLAN.md`

**TOTAL:** Phase 5 Completion ≈ **4–5 weeks**

---

## 📈 EXPECTED OUTCOMES

| Metric | Target | Impact |
|--------|--------|--------|
| Campaign success rate | +40% | Adaptive prompt learning |
| Agent latency | -30% | Optimized parallel orchestration |
| Content engagement (CTR) | +50% | Persona-driven variants |
| Dashboard load time | <1.5s | Optimized Recharts + caching |
| Executive satisfaction (UX) | 10/10 | Tesla-grade visual polish |
| Cost per campaign | -20% | Efficient agent utilization |
| Time to insight | <5s | Real-time telemetry |

---

## 🔒 GOVERNANCE & COMPLIANCE

### Security
- SOC 2 / ISO 27001 alignment
- End-to-end encryption for telemetry payloads
- Role-based access via Microsoft Entra ID
- Audit logs for all Intelligence Core interactions

### RBAC (Role-Based Access Control)
| Role | Access | Restrictions |
|------|--------|--------------|
| **Executive** | All panels & exports | Full access |
| **Sales** | Sales view + campaigns | No cost data |
| **Marketing** | Marketing view + content | No revenue amounts |
| **Ops/IT** | Telemetry & cost | PII masked by default |

### Data Residency
- Telemetry data stored in Azure North America
- Optional EU/UK data zones for compliance
- GDPR-compliant data retention (90 days hot, 1 year cold)

### Recovery
- Daily database snapshot (Dataverse & Neon Postgres)
- Versioned model updates with rollback support
- Circuit breaker prevents cascading failures

---

## 🧾 FINAL CHECKLIST BEFORE PHASE 5 EXECUTION

- [x] `v4.5.1-verified-clean` tag pushed to GitHub
- [x] All Phase 4.5 docs committed (`/docs/PHASE4.5_VERIFICATION_SUMMARY.md`)
- [x] `.env` parity confirmed (staging + production)
- [ ] Neon Postgres schema backed up
- [ ] Redis instance provisioned (Azure Cache for Redis)
- [ ] Azure Cognitive Search index created
- [ ] Windsurf ready with telemetry collector scaffolds
- [x] `npm run build` clean pass verified

---

## 🏁 SIGN-OFF

| Role | Name | Date | Signature |
|------|------|------|-----------|
| **Founder / CEO** | Tim Bryant | 2025-11-04 | ✅ Approved |
| **DevOps / Windsurf Agent** | Claude Sonnet (Windsurf) | 2025-11-04 | ✅ Ready |
| **Apex QA / Governance** | Mia (Ops AI) | 2025-11-04 | ✅ Confirmed |

---

## ✅ NEXT COMMANDS (TO EXECUTE IN WINDSURF)

```bash
# 1) Create Phase 5 governance docs
git add docs/PHASE5_*.md
git commit -m "docs: Phase 5 Intelligence & Insights Layer - governance foundation"
git tag -a v5.0-governance-initialization -m "Phase 5 governance docs and architecture"

# 2) Initialize Intelligence Core scaffolds
mkdir -p lib/intelligence lib/learning lib/telemetry api/observability api/learning api/dashboard/{kpis,campaigns,risks,channels,agents}
touch lib/intelligence/core.ts lib/intelligence/analytics.ts lib/learning/promptChain.ts lib/learning/optimizer.ts lib/learning/rewardFunction.ts lib/learning/abTest.ts

# 3) Start with Phase 5.3 (Dashboard) using mock data
mkdir -p app/dashboard/components
touch app/dashboard/page.tsx
touch app/dashboard/components/{DashboardShell,KpiTile,KpiGroup,Panel,TrendAreaChart,StackedStageBar,DonutSplit,Sparkline,CampaignTable,RiskList,LiveEventsTicker,TimeRangePicker,ShareMenu,ExportMenu}.tsx

# 4) Create mock API endpoint
touch api/dashboard/kpis/route.ts

# 5) Verify build
npm run build

# 6) Tag dashboard scaffold
git add -A
git commit -m "feat: Phase 5.3 dashboard scaffold with mock data"
git tag -a v5.0-alpha-dashboard-ready -m "Dashboard components and mock API ready"
```

---

**Document Version:** 1.0  
**Last Updated:** November 4, 2025, 2:55 PM EST  
**Next Review:** Phase 5.1 Completion

---

**🚀 Phase 5 Ready — Intelligence & Insights Layer Execution Begins**
