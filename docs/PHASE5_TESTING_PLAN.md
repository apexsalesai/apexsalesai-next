# 🧪 PHASE 5 TESTING PLAN — INTELLIGENCE & INSIGHTS LAYER

**File:** `/docs/PHASE5_TESTING_PLAN.md`  
**Issued by:** Apex QA & Governance (Mia / Windsurf)  
**Phase:** 5 — Intelligence & Insights Layer  
**Date:** November 4, 2025  
**Status:** 🔵 Ready for Execution  
**Baseline:** `v4.5.1-verified-clean`

---

## 🎯 TESTING OBJECTIVES

Ensure Phase 5 Intelligence & Insights Layer meets:
- **Functional Requirements:** All features work as specified
- **Performance Requirements:** TTI ≤ 1.5s, API p95 ≤ 500ms
- **Security Requirements:** RBAC enforced, PII masked, audit logs complete
- **Reliability Requirements:** 99.9% uptime, graceful degradation
- **Accessibility Requirements:** WCAG AA+ compliance

---

## 📊 TESTING PYRAMID

```
         /\
        /  \  E2E Tests (10%)
       /____\
      /      \  Integration Tests (30%)
     /________\
    /          \  Unit Tests (60%)
   /____________\
```

**Coverage Targets:**
- Unit Tests: 80% code coverage
- Integration Tests: All API endpoints + data flows
- E2E Tests: Critical user journeys
- Load Tests: 1000 concurrent users
- Chaos Tests: Resilience under failure

---

## 🧩 UNIT TESTING STRATEGY

### Framework: Jest + TypeScript

**Target Coverage:** 80% minimum

### Test Suites

#### 1. Intelligence Core (`lib/intelligence/core.ts`)
```typescript
describe('IntelligenceCore', () => {
  it('should ingest telemetry events', async () => {
    const event = createMockTelemetryEvent();
    await core.ingest(event);
    expect(await core.getEvent(event.id)).toBeDefined();
  });

  it('should apply sampling rules', () => {
    const debugEvent = { severity: 'debug' };
    expect(core.shouldSample(debugEvent)).toBe(false); // 10% sampling
  });

  it('should trigger circuit breaker after 5 failures', async () => {
    for (let i = 0; i < 5; i++) {
      await core.callAzureSearch().catch(() => {});
    }
    expect(core.circuitBreakerOpen).toBe(true);
  });

  it('should fallback to cache when Azure unavailable', async () => {
    mockAzureSearchDown();
    const result = await core.getKPIs('executive', '30d');
    expect(result.source).toBe('cache');
    expect(result.stale).toBe(true);
  });
});
```

#### 2. Learning Optimizer (`lib/learning/optimizer.ts`)
```typescript
describe('LearningOptimizer', () => {
  it('should calculate reward score correctly', () => {
    const performance = {
      ctr: 0.05,
      cvr: 0.18,
      engagement: 120,
      cost: 50,
    };
    const baseline = {
      ctr: 0.04,
      cvr: 0.15,
      engagement: 100,
      cost: 45,
    };
    const reward = optimizer.calculateReward(performance, baseline);
    expect(reward).toBeGreaterThan(0);
  });

  it('should not promote variant without minimum samples', () => {
    const variant = { impressions: 50, rewardScore: 1.5 };
    expect(optimizer.shouldPromote(variant)).toBe(false);
  });

  it('should trigger rollback on 15% performance drop', () => {
    const variant = { rewardScore: -0.15, confidence: 0.95 };
    expect(optimizer.shouldRollback(variant)).toBe(true);
  });
});
```

#### 3. Prompt Chain (`lib/learning/promptChain.ts`)
```typescript
describe('PromptChain', () => {
  it('should select best-performing prompt variant', async () => {
    const variants = [
      { id: 'v1', rewardScore: 0.8, sampleSize: 200 },
      { id: 'v2', rewardScore: 1.2, sampleSize: 250 },
      { id: 'v3', rewardScore: 0.6, sampleSize: 180 },
    ];
    const best = await promptChain.selectBest(variants);
    expect(best.id).toBe('v2');
  });

  it('should allocate 20% traffic to test variants', () => {
    const allocation = promptChain.allocateTraffic();
    const testTraffic = allocation.filter(a => a.isTest).reduce((sum, a) => sum + a.percentage, 0);
    expect(testTraffic).toBe(20);
  });
});
```

#### 4. Dashboard KPI Aggregator (`lib/intelligence/analytics.ts`)
```typescript
describe('Analytics', () => {
  it('should calculate ARR run-rate correctly', async () => {
    const deals = [
      { acv: 100000, closedAt: '2025-10-01' },
      { acv: 150000, closedAt: '2025-10-15' },
    ];
    const arr = await analytics.calculateARR(deals, 30);
    expect(arr).toBe(3000000); // (250k * 12)
  });

  it('should calculate pipeline velocity', async () => {
    const velocity = await analytics.calculatePipelineVelocity('30d');
    expect(velocity).toHaveProperty('dailyRate');
    expect(velocity.dailyRate).toBeGreaterThan(0);
  });

  it('should normalize KPIs by time range', () => {
    const kpi = { value: 1000, period: '7d' };
    const normalized = analytics.normalize(kpi, '30d');
    expect(normalized.value).toBeCloseTo(4285.7, 1); // 1000 * (30/7)
  });
});
```

#### 5. Telemetry Collector (`lib/telemetry/collector.ts`)
```typescript
describe('TelemetryCollector', () => {
  it('should batch events before sending', async () => {
    for (let i = 0; i < 50; i++) {
      collector.collect({ type: 'test', data: i });
    }
    expect(collector.batchSize).toBe(50);
    await collector.flush();
    expect(collector.batchSize).toBe(0);
  });

  it('should apply sampling based on severity', () => {
    const criticalEvent = { severity: 'critical' };
    const debugEvent = { severity: 'debug' };
    expect(collector.shouldSample(criticalEvent)).toBe(true); // 100%
    expect(collector.shouldSample(debugEvent)).toBeLessThanOrEqual(0.1); // 10%
  });
});
```

---

## 🔗 INTEGRATION TESTING STRATEGY

### Framework: Jest + Supertest

**Target:** All API endpoints + data flows

### Test Suites

#### 1. Dashboard KPI Endpoint
```typescript
describe('GET /api/dashboard/kpis', () => {
  it('should return executive KPIs with valid auth', async () => {
    const response = await request(app)
      .get('/api/dashboard/kpis?view=executive&range=30d')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('tiles');
    expect(response.body).toHaveProperty('revenueTrajectory');
    expect(response.body).toHaveProperty('pipeline');
    expect(response.body.tiles).toHaveLength(4);
  });

  it('should enforce RBAC for sales view', async () => {
    const response = await request(app)
      .get('/api/dashboard/kpis?view=sales&range=30d')
      .set('Authorization', `Bearer ${salesToken}`)
      .expect(200);

    expect(response.body.tiles.find(t => t.id === 'arr')).toBeUndefined(); // No revenue data
  });

  it('should return cached data within TTL', async () => {
    const response1 = await request(app).get('/api/dashboard/kpis?view=executive&range=30d');
    const response2 = await request(app).get('/api/dashboard/kpis?view=executive&range=30d');
    
    expect(response1.headers['x-cache']).toBe('MISS');
    expect(response2.headers['x-cache']).toBe('HIT');
  });

  it('should handle Azure Cognitive Search failure gracefully', async () => {
    mockAzureSearchDown();
    const response = await request(app)
      .get('/api/dashboard/kpis?view=executive&range=30d')
      .expect(200);

    expect(response.body.stale).toBe(true);
    expect(response.body.source).toBe('cache');
  });
});
```

#### 2. Learning Feedback Endpoint
```typescript
describe('POST /api/learning/updatePrompt', () => {
  it('should record prompt performance feedback', async () => {
    const feedback = {
      promptId: 'prompt_123',
      impressions: 150,
      clicks: 8,
      conversions: 2,
    };

    const response = await request(app)
      .post('/api/learning/updatePrompt')
      .send(feedback)
      .expect(200);

    expect(response.body.rewardScore).toBeDefined();
  });

  it('should trigger A/B test promotion after minimum samples', async () => {
    const feedback = {
      variantId: 'variant_test',
      impressions: 250,
      clicks: 15,
      conversions: 5,
    };

    const response = await request(app)
      .post('/api/learning/updatePrompt')
      .send(feedback)
      .expect(200);

    expect(response.body.promoted).toBe(true);
  });
});
```

#### 3. Telemetry Ingestion
```typescript
describe('POST /api/observability', () => {
  it('should ingest agent telemetry event', async () => {
    const event = {
      eventType: 'AgentTaskCompleted',
      entityType: 'agent',
      entityId: 'agent_copy_123',
      payload: {
        duration: 1200,
        tokensIn: 500,
        tokensOut: 1200,
        cost: 0.05,
        success: true,
      },
    };

    await request(app)
      .post('/api/observability')
      .send(event)
      .expect(201);

    const stored = await prisma.intelligenceEvent.findFirst({
      where: { entityId: 'agent_copy_123' },
    });
    expect(stored).toBeDefined();
  });

  it('should apply sampling for debug events', async () => {
    const debugEvents = Array.from({ length: 100 }, (_, i) => ({
      eventType: 'DebugTrace',
      severity: 'debug',
      payload: { step: i },
    }));

    for (const event of debugEvents) {
      await request(app).post('/api/observability').send(event);
    }

    const stored = await prisma.intelligenceEvent.count({
      where: { eventType: 'DebugTrace' },
    });
    expect(stored).toBeLessThanOrEqual(15); // ~10% sampling
  });
});
```

---

## 🌐 END-TO-END TESTING STRATEGY

### Framework: Playwright

**Target:** Critical user journeys

### Test Scenarios

#### 1. Executive Dashboard Journey
```typescript
test('Executive views dashboard and drills into campaign', async ({ page }) => {
  // Login
  await page.goto('/dashboard');
  await page.fill('[name="email"]', 'exec@apex.ai');
  await page.fill('[name="password"]', process.env.TEST_PASSWORD);
  await page.click('button[type="submit"]');

  // Wait for dashboard load
  await page.waitForSelector('[data-testid="kpi-tiles"]');
  
  // Verify KPI tiles visible
  const tiles = await page.locator('[data-testid="kpi-tile"]').count();
  expect(tiles).toBe(4);

  // Check sparklines rendered
  const sparklines = await page.locator('svg.sparkline').count();
  expect(sparklines).toBeGreaterThan(0);

  // Click on campaign in leaderboard
  await page.click('[data-testid="campaign-row"]:first-child');
  
  // Verify navigation to campaign detail
  await page.waitForURL(/\/studio\/cmp_/);
  expect(page.url()).toContain('/studio/cmp_');
});
```

#### 2. Time Range Filter
```typescript
test('User changes time range and sees updated KPIs', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Capture initial ARR value
  const initialARR = await page.locator('[data-testid="kpi-arr"]').textContent();
  
  // Change time range to 7d
  await page.click('[data-testid="time-range-picker"]');
  await page.click('[data-testid="range-7d"]');
  
  // Wait for KPIs to update
  await page.waitForTimeout(500);
  
  const updatedARR = await page.locator('[data-testid="kpi-arr"]').textContent();
  expect(updatedARR).not.toBe(initialARR);
});
```

#### 3. Export Dashboard
```typescript
test('User exports dashboard as PDF', async ({ page }) => {
  await page.goto('/dashboard?view=executive&range=30d');
  
  // Click export button
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('[data-testid="export-button"]'),
    page.click('[data-testid="export-pdf"]'),
  ]);
  
  // Verify download
  expect(download.suggestedFilename()).toContain('apex-dashboard');
  expect(download.suggestedFilename()).toContain('.pdf');
});
```

#### 4. Accessibility Navigation
```typescript
test('Dashboard is keyboard navigable', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Tab through interactive elements
  await page.keyboard.press('Tab'); // Focus on first KPI tile
  await page.keyboard.press('Tab'); // Focus on second KPI tile
  await page.keyboard.press('Tab'); // Focus on time range picker
  
  // Verify focus visible
  const focusedElement = await page.locator(':focus');
  expect(await focusedElement.getAttribute('data-testid')).toBeTruthy();
  
  // Press Enter to activate
  await page.keyboard.press('Enter');
  
  // Verify action triggered
  await page.waitForSelector('[role="dialog"]');
});
```

---

## ⚡ PERFORMANCE TESTING STRATEGY

### Framework: K6

**Target:** 1000 concurrent users, p95 ≤ 500ms

### Load Test Scenarios

#### 1. Dashboard KPI Endpoint
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up
    { duration: '5m', target: 1000 }, // Peak load
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% under 500ms
    http_req_failed: ['rate<0.01'],   // Error rate < 1%
  },
};

export default function () {
  const response = http.get('https://apex.ai/api/dashboard/kpis?view=executive&range=30d', {
    headers: { Authorization: `Bearer ${__ENV.TEST_TOKEN}` },
  });

  check(response, {
    'status is 200': (r) => r.status === 200,
    'has tiles': (r) => JSON.parse(r.body).tiles.length === 4,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

#### 2. Telemetry Ingestion
```javascript
export default function () {
  const event = {
    eventType: 'AgentTaskCompleted',
    entityType: 'agent',
    entityId: `agent_${__VU}_${__ITER}`,
    payload: {
      duration: Math.random() * 5000,
      tokensIn: Math.floor(Math.random() * 1000),
      tokensOut: Math.floor(Math.random() * 2000),
      cost: Math.random() * 0.1,
      success: Math.random() > 0.05,
    },
  };

  const response = http.post('https://apex.ai/api/observability', JSON.stringify(event), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(response, {
    'status is 201': (r) => r.status === 201,
    'ingestion time < 200ms': (r) => r.timings.duration < 200,
  });
}
```

---

## 🔥 CHAOS TESTING STRATEGY

### Framework: Chaos Mesh / Manual

**Target:** Verify resilience under failure

### Chaos Scenarios

#### 1. Azure Cognitive Search Outage
```typescript
test('Dashboard degrades gracefully when Azure Search is down', async () => {
  // Simulate Azure Search failure
  mockAzureSearchDown();
  
  const response = await request(app).get('/api/dashboard/kpis?view=executive&range=30d');
  
  expect(response.status).toBe(200);
  expect(response.body.source).toBe('cache');
  expect(response.body.stale).toBe(true);
  expect(response.headers['x-stale-age']).toBeDefined();
});
```

#### 2. Database Connection Loss
```typescript
test('Telemetry collector buffers events when DB is unavailable', async () => {
  // Simulate DB connection loss
  await prisma.$disconnect();
  
  // Send events
  const events = Array.from({ length: 10 }, (_, i) => ({
    eventType: 'test',
    payload: { id: i },
  }));
  
  for (const event of events) {
    await collector.collect(event);
  }
  
  // Verify buffered
  expect(collector.bufferSize).toBe(10);
  
  // Reconnect DB
  await prisma.$connect();
  await collector.flush();
  
  // Verify events persisted
  const stored = await prisma.intelligenceEvent.count({ where: { eventType: 'test' } });
  expect(stored).toBe(10);
});
```

#### 3. Redis Cache Failure
```typescript
test('Dashboard falls back to direct DB query when Redis is down', async () => {
  // Simulate Redis failure
  mockRedisDown();
  
  const start = Date.now();
  const response = await request(app).get('/api/dashboard/kpis?view=executive&range=30d');
  const duration = Date.now() - start;
  
  expect(response.status).toBe(200);
  expect(response.headers['x-cache']).toBe('BYPASS');
  expect(duration).toBeLessThan(2000); // Still reasonably fast
});
```

---

## 🔒 SECURITY TESTING STRATEGY

### Test Scenarios

#### 1. RBAC Enforcement
```typescript
test('Sales user cannot access revenue data', async () => {
  const response = await request(app)
    .get('/api/dashboard/kpis?view=executive&range=30d')
    .set('Authorization', `Bearer ${salesToken}`)
    .expect(403);

  expect(response.body.error).toContain('Insufficient permissions');
});
```

#### 2. PII Masking
```typescript
test('PII is masked in executive view by default', async () => {
  const response = await request(app)
    .get('/api/dashboard/campaigns')
    .set('Authorization', `Bearer ${execToken}`)
    .expect(200);

  const campaign = response.body.rows[0];
  expect(campaign.owner).toMatch(/^[A-Z]\*{3,}$/); // "A***"
});
```

#### 3. Audit Logging
```typescript
test('Dashboard views are logged to audit trail', async () => {
  await request(app)
    .get('/api/dashboard/kpis?view=executive&range=30d')
    .set('Authorization', `Bearer ${execToken}`);

  const auditLog = await prisma.auditEvent.findFirst({
    where: {
      action: 'dashboard.view',
      userId: 'exec_user_id',
    },
  });

  expect(auditLog).toBeDefined();
  expect(auditLog.metadata).toMatchObject({
    view: 'executive',
    range: '30d',
  });
});
```

---

## ♿ ACCESSIBILITY TESTING STRATEGY

### Framework: axe-core + Manual

### Test Scenarios

#### 1. Automated Accessibility Scan
```typescript
test('Dashboard passes axe accessibility audit', async ({ page }) => {
  await page.goto('/dashboard');
  
  const results = await new AxePuppeteer(page).analyze();
  
  expect(results.violations).toHaveLength(0);
});
```

#### 2. Keyboard Navigation
```typescript
test('All interactive elements are keyboard accessible', async ({ page }) => {
  await page.goto('/dashboard');
  
  const interactiveElements = await page.locator('button, a, [tabindex="0"]').count();
  
  for (let i = 0; i < interactiveElements; i++) {
    await page.keyboard.press('Tab');
    const focused = await page.locator(':focus');
    expect(await focused.isVisible()).toBe(true);
  }
});
```

#### 3. Screen Reader Compatibility
```typescript
test('Dashboard has proper ARIA labels', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Check live regions
  const liveRegions = await page.locator('[aria-live]').count();
  expect(liveRegions).toBeGreaterThan(0);
  
  // Check KPI tiles have labels
  const kpiTiles = await page.locator('[data-testid="kpi-tile"]');
  for (const tile of await kpiTiles.all()) {
    expect(await tile.getAttribute('aria-label')).toBeTruthy();
  }
});
```

---

## 📋 TEST EXECUTION CHECKLIST

### Pre-Deployment (CI/CD)
- [ ] All unit tests pass (80% coverage)
- [ ] All integration tests pass
- [ ] E2E smoke tests pass
- [ ] Load test baseline established (p95 < 500ms)
- [ ] Security scan clean (no critical vulnerabilities)
- [ ] Accessibility audit clean (0 violations)

### Post-Deployment (Staging)
- [ ] Full E2E test suite passes
- [ ] Load test at 1000 concurrent users
- [ ] Chaos tests pass (Azure down, DB down, Redis down)
- [ ] RBAC enforcement verified
- [ ] PII masking verified
- [ ] Audit logging verified

### Production Validation
- [ ] Synthetic monitoring active (Datadog/New Relic)
- [ ] Real user monitoring (RUM) configured
- [ ] Error tracking active (Sentry)
- [ ] Performance monitoring active (p95 < 500ms)
- [ ] Uptime monitoring active (99.9% SLA)

---

## 🚨 FAILURE CRITERIA (BLOCK DEPLOYMENT)

**Critical Issues:**
- Unit test coverage < 80%
- Any E2E test failure
- Load test p95 > 1000ms
- Security vulnerability (critical/high)
- Accessibility violations (WCAG AA)
- RBAC bypass detected
- PII leak detected

**Non-Blocking Issues:**
- Load test p95 500-1000ms (warning)
- Minor accessibility issues (WCAG AAA)
- Stylistic lint warnings

---

## 📊 TEST METRICS & REPORTING

### Daily CI/CD Report
```
✅ Unit Tests: 847/847 passed (82% coverage)
✅ Integration Tests: 124/124 passed
✅ E2E Tests: 18/18 passed
⚠️  Load Test: p95 = 520ms (target: 500ms)
✅ Security Scan: 0 critical, 0 high, 2 medium
✅ Accessibility: 0 violations
```

### Weekly QA Summary
- Test execution time trends
- Flaky test identification
- Coverage trends
- Performance regression analysis
- Security vulnerability trends

---

## 🏁 SIGN-OFF

| Role | Name | Date | Signature |
|------|------|------|-----------|
| **QA Lead** | Mia (Ops AI) | 2025-11-04 | ✅ Approved |
| **DevOps** | Windsurf Agent | 2025-11-04 | ✅ Ready |
| **Security** | Apex Security Team | 2025-11-04 | ⏳ Pending |

---

**Document Version:** 1.0  
**Last Updated:** November 4, 2025  
**Next Review:** Phase 5.5 Completion

---

**🧪 Phase 5 Testing Plan Complete — Ready for QA Execution**
