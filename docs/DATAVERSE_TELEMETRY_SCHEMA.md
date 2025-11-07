# Dataverse Telemetry Schema — Phase 5.1

**Purpose:** Live intelligence and KPI tracking using existing Dataverse infrastructure  
**Date:** November 7, 2025  
**Architecture:** Dataverse-only (no Redis required)

---

## 📊 Table Definitions

### 1. apex_telemetry_events

**Purpose:** Store all telemetry events (agent tasks, campaigns, assets, etc.)

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `apex_telemetryeventid` | guid | Primary key | Yes |
| `apex_eventtype` | choice | Event type (see choices below) | Yes |
| `apex_severity` | choice | debug, info, warn, error, critical | Yes |
| `apex_timestamp` | datetime | Event timestamp (UTC) | Yes |
| `apex_campaignid` | lookup | Link to campaign | No |
| `apex_userid` | lookup | Link to user | No |
| `apex_tenantid` | lookup | Link to tenant | No |
| `apex_assetid` | string | Asset identifier | No |
| `apex_taskid` | string | Task identifier | No |
| `apex_payload` | text | JSON payload with event details | No |
| `apex_requestid` | string | Request correlation ID | No |

**Event Type Choices:**
- `campaign_created`
- `campaign_updated`
- `agent_task_started`
- `agent_task_completed`
- `agent_task_error`
- `asset_created`
- `asset_published`
- `asset_publish_failed`
- `kpi_ping`

**Indexes:**
- `apex_eventtype` (for filtering by type)
- `apex_timestamp` (for time-based queries)
- `apex_campaignid` (for campaign-specific queries)

---

### 2. apex_kpi_counters

**Purpose:** Aggregated KPI metrics for dashboard

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `apex_kpicounterid` | guid | Primary key | Yes |
| `apex_metricname` | string | Metric identifier | Yes |
| `apex_value` | integer | Current count | Yes |
| `apex_lastupdated` | datetime | Last update timestamp | Yes |
| `apex_period` | choice | daily, weekly, monthly, all_time | Yes |
| `apex_tenantid` | lookup | Link to tenant | No |

**Metric Names:**
- `campaigns_created`
- `agent_tasks_completed`
- `agent_tasks_errors`
- `assets_published`
- `assets_created`

**Indexes:**
- `apex_metricname` (for fast lookups)
- `apex_period` (for time-based aggregations)

---

### 3. apex_agent_metrics (Optional Enhancement)

**Purpose:** Detailed agent performance tracking

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `apex_agentmetricid` | guid | Primary key | Yes |
| `apex_taskid` | string | Task identifier | Yes |
| `apex_campaignid` | lookup | Link to campaign | No |
| `apex_agentname` | string | Agent name (Max, Mia, etc.) | Yes |
| `apex_model` | string | LLM model used | No |
| `apex_tokensin` | integer | Input tokens | No |
| `apex_tokensout` | integer | Output tokens | No |
| `apex_latencyms` | integer | Execution time (ms) | No |
| `apex_costusd` | decimal | Cost in USD | No |
| `apex_timestamp` | datetime | Execution timestamp | Yes |
| `apex_status` | choice | success, error, timeout | Yes |
| `apex_errormessage` | text | Error details if failed | No |

---

## 🔧 Implementation Strategy

### Phase 1: Core Tables (Immediate)
1. Create `apex_telemetry_events` table
2. Create `apex_kpi_counters` table
3. Seed initial counter records

### Phase 2: Integration (Next)
1. Wire agent runner to write events
2. Wire publish routes to write events
3. Implement counter increment logic

### Phase 3: Dashboard (Final)
1. Create KPI aggregation endpoint
2. Query counters from Dataverse
3. Wire dashboard to live data

---

## 📝 Sample Queries

### Get All KPI Counters
```typescript
const counters = await dataverseClient.retrieveMultiple(
  'apex_kpi_counters',
  { filter: "apex_period eq 'all_time'" }
);
```

### Record Agent Task Completion
```typescript
await dataverseClient.create('apex_telemetry_events', {
  apex_eventtype: 'agent_task_completed',
  apex_severity: 'info',
  apex_timestamp: new Date().toISOString(),
  apex_campaignid: campaignId,
  apex_payload: JSON.stringify({
    tokens_in: 1200,
    tokens_out: 800,
    latency_ms: 2500,
    cost_usd: 0.05
  })
});
```

### Increment Counter
```typescript
const counter = await dataverseClient.retrieve(
  'apex_kpi_counters',
  counterId,
  ['apex_value']
);

await dataverseClient.update('apex_kpi_counters', counterId, {
  apex_value: counter.apex_value + 1,
  apex_lastupdated: new Date().toISOString()
});
```

---

## 🎯 Performance Considerations

### Expected Latency
- **Write Event:** 100-200ms
- **Read Counters:** 50-150ms
- **Dashboard Refresh:** 200-400ms total

### Optimization Strategies
1. **Batch Writes:** Group multiple events in single request
2. **Caching:** Cache counter values for 15 seconds
3. **Async Writes:** Don't block agent execution on telemetry
4. **Indexes:** Ensure proper indexing on frequently queried fields

### Scaling Limits
- **Events/Day:** Up to 10,000 (well within Dataverse limits)
- **Concurrent Writes:** Up to 100/sec (Dataverse throttling applies)
- **Storage:** Unlimited (Dataverse handles automatically)

---

## 🔐 Security & Governance

### Data Retention
- **Telemetry Events:** Retain for 90 days, then archive
- **KPI Counters:** Retain indefinitely
- **Agent Metrics:** Retain for 1 year

### Access Control
- **Read:** All authenticated users
- **Write:** System service account only
- **Admin:** Tenant administrators

### PII Compliance
- ❌ Never store: emails, phone numbers, SSNs
- ✅ Store only: user IDs, tenant IDs (pseudonymous)
- ✅ All payloads: JSON with non-PII data only

---

## 📋 Migration Path (Future)

If Redis becomes necessary later:

1. **Keep Dataverse as source of truth**
2. **Add Redis as cache layer**
3. **Write to both** (dual-write pattern)
4. **Read from Redis first** (fallback to Dataverse)
5. **Zero code changes** in dashboard

---

**Status:** ✅ Schema designed and ready for implementation  
**Next:** Create TypeScript types and Zod schemas
