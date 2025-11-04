# Phase 2-3 Validation Suite — Complete Guide

**Status**: ✅ Validation Infrastructure Complete  
**Purpose**: End-to-end verification of ApexSalesAI multi-agent orchestration system

---

## 📋 What Was Built

### **1. Backend Validation Script**
**File**: `scripts/validate-phase2-3.ts`

**Tests**:
- ✅ Agent execution (all 5 agents run successfully)
- ✅ API endpoints (`/api/studio/campaigns`, `/api/studio/agents/run`, `/api/studio/assets`)
- ✅ Database persistence (Campaign, AgentTask, ContentAsset records)
- ✅ Legacy route cleanup

**Output**: `reports/validation-report.json`

### **2. UI Validation Script (Playwright)**
**File**: `scripts/validate-phase2-3-ui.ts`

**Tests**:
- ✅ `/studio` page loads
- ✅ Campaign Studio header visible
- ✅ Generated assets rendered
- ✅ No console errors
- ✅ Screenshot capture

**Output**: `reports/ui-validation-report.json` + screenshots

### **3. Command Dashboard**
**File**: `pipeline/command-dashboard.json`

**Phases**:
1. Setup (install dependencies, run migrations)
2. Backend Validation
3. Frontend Validation
4. Reports Generation
5. Maintenance (cleanup)

### **4. Dashboard Runner**
**File**: `scripts/run-dashboard.ts`

Orchestrates all phases in sequence with structured logging.

**Output**: `reports/pipeline-log.txt`

### **5. Summary Generator**
**File**: `scripts/generate-validation-summary.ts`

Merges all reports into a single executive summary.

**Output**: `reports/final-validation-summary.json`

---

## 🚀 How to Run

### **Option 1: Full Pipeline (Recommended)**

Run everything in one command:

```bash
npx tsx scripts/run-dashboard.ts
```

This will:
1. Install dependencies
2. Run Prisma migrations
3. Execute backend validation
4. Execute UI validation
5. Generate final summary
6. Clean up legacy routes

### **Option 2: Individual Components**

Run each step separately:

```bash
# Backend only
npx tsx scripts/validate-phase2-3.ts

# UI only (requires backend to pass first)
npx tsx scripts/validate-phase2-3-ui.ts

# Generate summary (requires both reports)
npx tsx scripts/generate-validation-summary.ts
```

### **Option 3: Quick Agent Test**

Just test the agents without full validation:

```bash
npx tsx scripts/test-phase2-agents.ts
```

---

## 📊 Expected Outputs

### **Success Scenario**

```
🚀 Running ApexSalesAI Phase2-3 Command Dashboard v1.0.0

=== 🧩 Phase: setup ===
✅ SUCCESS: npm install
✅ SUCCESS: prisma generate
✅ SUCCESS: prisma migrate deploy
✅ SUCCESS: playwright install chromium

=== 🧩 Phase: backendValidation ===
🔍 Running agentic test sequence...
✓ strategy completed in 2s
✓ copy completed in 9s
✓ visual completed in 2s
✓ video completed in 3s
✓ personalize completed in 6s
✅ SUCCESS: validate-phase2-3.ts

=== 🧩 Phase: frontendValidation ===
🌐 Opening /studio...
📸 Screenshot saved: reports/studio-validation-1730003550000.png
✅ SUCCESS: validate-phase2-3-ui.ts

=== 🧩 Phase: reports ===
📊 Final validation summary generated!
✅ SUCCESS: generate-validation-summary.ts

📊 Pipeline Execution Summary
Total Commands: 8
Successful: 8
Failed: 0

✅ All phases completed successfully!
```

### **Final Summary JSON**

```json
{
  "timestamp": "2025-10-22T16:55:00Z",
  "backend": "complete",
  "ui": "PASS",
  "totalPassed": 5,
  "totalFailed": 0,
  "totalTests": 5,
  "screenshots": ["reports/studio-validation-1730003550000.png"],
  "status": "PASS"
}
```

---

## 🧪 Validation Checklist

### **Phase 2: Backend** ✅

| Component | Test | Pass Condition |
|-----------|------|----------------|
| **Agents** | 5 agents execute | All return 200 + valid output |
| **Database** | Records persisted | Campaign, Task, Asset tables populated |
| **API** | `/api/studio/*` endpoints | All return 200 with valid JSON |
| **Telemetry** | Token/latency tracking | Metrics logged in AgentTask |

### **Phase 3: UI Integration** ✅

| Component | Test | Pass Condition |
|-----------|------|----------------|
| **Routing** | `/dashboard` → `/studio` | Redirect works |
| **Rendering** | Campaign cards visible | Real data from DB |
| **Preview** | Asset content displayed | Blog, Email, Social, Video |
| **Console** | No errors | Clean browser console |

---

## 🐛 Troubleshooting

### **Error: "Backend validation failed"**

**Cause**: Agents aren't executing or database isn't connected

**Fix**:
1. Verify `OPENAI_API_KEY` in `.env.local`
2. Run `npx prisma migrate dev`
3. Restart dev server: `npm run dev`
4. Run `npx tsx scripts/test-phase2-agents.ts` to isolate issue

### **Error: "UI validation failed - no assets rendered"**

**Cause**: Backend data isn't flowing to UI

**Fix**:
1. Check `reports/validation-report.json` — ensure `phase2.status === "complete"`
2. Verify assets exist: `npx prisma studio` → check `ContentAsset` table
3. Ensure `/studio` page queries `/api/studio/assets`

### **Error: "Playwright not installed"**

**Fix**:
```bash
npm install --save-dev @playwright/test
npx playwright install chromium
```

### **Error: "500/503 from /api/posts or /api/kpis"**

**Cause**: Legacy routes still exist

**Fix**: Delete these directories:
```bash
rm -rf app/api/posts
rm -rf app/api/kpis
rm -rf app/api/jobs
```

---

## 📁 Generated Files

After running the full pipeline, you'll have:

```
reports/
├── validation-report.json          # Backend test results
├── ui-validation-report.json       # UI test results
├── final-validation-summary.json   # Executive summary
├── studio-validation-*.png         # Screenshot evidence
└── pipeline-log.txt                # Full execution log
```

---

## ✅ Success Criteria

**Phase 2-3 is complete when**:

1. ✅ All 5 agents execute without errors
2. ✅ Database contains ≥1 campaign, ≥10 assets, ≥5 tasks
3. ✅ `/api/studio/*` endpoints return 200
4. ✅ `/studio` renders real campaign data
5. ✅ Console has zero 500/503 errors
6. ✅ `final-validation-summary.json` shows `"status": "PASS"`

---

## 🎯 Next Steps

Once validation passes:

### **Immediate**:
- Commit validation suite to git
- Run on CI/CD pipeline
- Share `final-validation-summary.json` with stakeholders

### **Phase 3 Completion**:
- Build full `/studio` UI workspace (campaign creator, timeline, preview)
- Add word count controls
- Implement publishing modal

### **Phase 4 Preparation**:
- Content DNA system
- Talent marketplace
- Commercialization features

---

## 🔧 Maintenance

### **Re-run Validation Anytime**

```bash
# Full pipeline
npx tsx scripts/run-dashboard.ts

# Quick check
npx tsx scripts/validate-phase2-3.ts
```

### **Update Command Dashboard**

Edit `pipeline/command-dashboard.json` to add new phases or commands.

### **Add New Tests**

1. Add test logic to `validate-phase2-3.ts` or `validate-phase2-3-ui.ts`
2. Update success criteria in `generate-validation-summary.ts`
3. Re-run pipeline

---

**Status**: ✅ Validation suite ready for execution  
**Next Action**: Run `npx tsx scripts/run-dashboard.ts` to validate Phase 2-3
