# 🔒 ApexSalesAI Phase 2-3 Security & Validation Checklist

**Status**: Ready for Execution  
**Last Updated**: 2025-10-22  
**Purpose**: Ensure production-grade security, reliability, and data integrity

---

## 🚨 CRITICAL: Security Remediation (DO THIS FIRST)

### **API Key Exposure Incident**

An OpenAI API key was exposed in previous chat messages. **You must take immediate action**:

### **Required Actions** ✅

1. **Rotate the OpenAI API Key**
   - Go to: https://platform.openai.com/api-keys
   - Delete the exposed key: `sk-proj-4TKJDlCDQhYd1xHH-...`
   - Generate a new key
   - Update `.env.local` with the new key

2. **Clear Shell History**
   ```powershell
   # PowerShell
   Clear-History
   Remove-Item (Get-PSReadlineOption).HistorySavePath
   ```

3. **Check Git History**
   ```bash
   # Check if .env.local was ever committed
   git log --all --full-history -- .env.local
   
   # If found, purge it
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env.local" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (if necessary)
   git push origin --force --all
   ```

4. **Verify .gitignore**
   ```bash
   # Ensure these are in .gitignore
   .env.local
   .env*.local
   *.env
   ```

5. **Audit Logs**
   - Check OpenAI dashboard for any unauthorized usage
   - Review billing for unexpected charges

---

## 📋 Enhanced Validation Suite Components

### **1. Backend Validation** (`validate-phase2-3-enhanced.ts`)

**Tests**:
- ✅ Environment variables present (redacted in logs)
- ✅ Database connectivity
- ✅ ≥1 Campaign created
- ✅ ≥5 AgentTask records with telemetry
- ✅ ≥10 ContentAsset records
- ✅ Blog assets ≥800 words
- ✅ Token usage tracking (tokensIn/tokensOut per task)
- ✅ Cost calculation (model pricing applied)
- ✅ P95 latency ≤ 12s
- ✅ Total tokens ≤ 200k
- ✅ 3x retry with exponential backoff (1s/2s/4s)
- ✅ Continue on failure (mark failed agents, don't abort)

**Outputs**:
- `reports/validation-report.json`
- `reports/usage-metrics.json`

### **2. UI Validation** (`validate-ui-enhanced.ts`)

**Tests**:
- ✅ Create campaign via API
- ✅ Run all 5 agents
- ✅ Navigate to `/studio/[id]`
- ✅ Verify 5 tabs present: Blog | Email | Social | Video | Visual Prompts
- ✅ Each tab has non-empty content (>500 chars)
- ✅ Word/char/reading time displayed
- ✅ Publish button present
- ✅ No console errors
- ✅ No 500/503 network errors
- ✅ No placeholder text ("Coming Soon", etc.)

**Outputs**:
- `reports/ui-validation-report.json`
- `reports/screenshots/studio-*.png`

### **3. Legacy Cleanup** (`cleanup-legacy-routes.ts`)

**Removes**:
- `app/api/posts` (causes 500)
- `app/api/kpis` (causes 503)
- `app/api/jobs` (causes 500)

### **4. Summary Generator** (`generate-validation-summary.ts`)

**Merges**:
- Backend validation results
- UI validation results
- Usage metrics
- SLO compliance status

**Output**:
- `reports/final-validation-summary.json`

### **5. Pipeline Runner** (`run-enhanced-validation.ts`)

**Phases**:
1. Environment Setup (npm install, prisma generate, playwright install)
2. Legacy Cleanup (remove old routes)
3. Backend Validation (agents, DB, SLOs)
4. UI Validation (rendering, data binding)
5. Report Generation (final summary)

---

## 🎯 Definition of Done (Phase 2-3)

### **Backend** ✅

| Requirement | Pass Condition | Status |
|-------------|----------------|--------|
| **Agents** | All 5 execute successfully | ⏳ Pending |
| **Database** | ≥1 Campaign, ≥5 Tasks, ≥10 Assets | ⏳ Pending |
| **Content** | Blog ≥800 words, non-empty body | ⏳ Pending |
| **Telemetry** | tokensIn/Out, latencyMs captured | ⏳ Pending |
| **Cost** | Cost calculated per task | ⏳ Pending |
| **SLO: Latency** | P95 ≤ 12s | ⏳ Pending |
| **SLO: Tokens** | Total ≤ 200k | ⏳ Pending |
| **Retry** | 3x retry with backoff implemented | ✅ Complete |
| **Resilience** | Continue on failure | ✅ Complete |

### **API** ✅

| Endpoint | Test | Pass Condition | Status |
|----------|------|----------------|--------|
| `/api/studio/campaigns` | POST create | 200 + valid ID | ⏳ Pending |
| `/api/studio/agents/run` | POST execute | 200 + task IDs | ⏳ Pending |
| `/api/studio/assets` | GET retrieve | 200 + asset array | ⏳ Pending |

### **UI** ✅

| Component | Test | Pass Condition | Status |
|-----------|------|----------------|--------|
| **Routing** | `/studio/[id]` loads | Page renders | ⏳ Pending |
| **Data Binding** | Campaign data visible | No placeholders | ⏳ Pending |
| **Tabs** | 5 tabs present | Blog, Email, Social, Video, Visual | ⏳ Pending |
| **Content** | Each tab non-empty | >500 chars per tab | ⏳ Pending |
| **Metrics** | Word/char count shown | Visible per asset | ⏳ Pending |
| **Actions** | Publish button | Present and clickable | ⏳ Pending |

### **Stability** ✅

| Check | Pass Condition | Status |
|-------|----------------|--------|
| **Console** | No errors | ⏳ Pending |
| **Network** | No 500/503 | ⏳ Pending |
| **Legacy Routes** | Removed | ⏳ Pending |

### **Reports** ✅

| File | Required | Status |
|------|----------|--------|
| `validation-report.json` | ✅ | ⏳ Pending |
| `usage-metrics.json` | ✅ | ⏳ Pending |
| `ui-validation-report.json` | ✅ | ⏳ Pending |
| `final-validation-summary.json` | ✅ | ⏳ Pending |
| `screenshots/studio-*.png` | ✅ | ⏳ Pending |

---

## 🚀 Execution Instructions

### **Prerequisites**

1. ✅ **Rotate OpenAI API key** (see Security Remediation above)
2. ✅ **Update `.env.local`** with new key
3. ✅ **Dev server running** (`npm run dev`)
4. ✅ **Database migrated** (`npx prisma migrate dev`)

### **Run Validation**

```bash
# Single command to run everything
npx tsx scripts/run-enhanced-validation.ts
```

**Expected Duration**: 5-10 minutes

### **What Happens**

1. **Setup** (2-3 min): Install dependencies, generate Prisma client, install Playwright
2. **Cleanup** (5 sec): Remove legacy routes
3. **Backend** (2-3 min): Run agents, check DB, calculate metrics
4. **UI** (2-3 min): Create campaign, run agents, test UI rendering
5. **Reports** (5 sec): Generate final summary

### **Success Output**

```
🚀 ApexSalesAI Phase 2-3 Enhanced Validation Pipeline
================================================================================

✅ All phases completed successfully!

📁 Generated Artifacts:
  ✅ validation-report.json
  ✅ usage-metrics.json
  ✅ ui-validation-report.json
  ✅ final-validation-summary.json
  ✅ screenshots/

✅ VALIDATION PASSED - Phase 2-3 complete and ready for Phase 4
```

---

## 📊 Expected Artifacts

After successful validation, you'll have:

```
reports/
├── validation-report.json          # Backend results (secrets redacted)
├── usage-metrics.json              # Token usage, cost, latency
├── ui-validation-report.json       # UI test results
├── final-validation-summary.json   # Executive summary
├── pipeline-log.txt                # Full execution log
└── screenshots/
    ├── studio-initial-*.png        # Initial page load
    └── studio-final-*.png          # After all tabs checked
```

---

## 🐛 Troubleshooting

### **Error: "OPENAI_API_KEY not set"**

**Fix**: Add to `.env.local`:
```bash
OPENAI_API_KEY=sk-...your-new-key...
```

### **Error: "Database connection failed"**

**Fix**:
```bash
npx prisma migrate dev
npx prisma generate
```

### **Error: "Playwright not installed"**

**Fix**:
```bash
npx playwright install chromium --with-deps
```

### **Error: "P95 latency exceeds SLO"**

**Cause**: Agents taking >12s

**Fix**: Check OpenAI API status, network latency, or increase SLO threshold

### **Error: "Total tokens exceed SLO"**

**Cause**: Agents using >200k tokens

**Fix**: Review agent prompts, reduce content length targets, or increase threshold

---

## 🔐 Security Best Practices

### **Never Log Secrets**

All validation scripts use `redactSecret()` function:
```typescript
function redactSecret(value: string | undefined): string {
  if (!value) return '[NOT_SET]';
  if (value.length < 8) return '[REDACTED]';
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}
```

### **Environment Variables**

Always use `.env.local` for secrets:
- ✅ `OPENAI_API_KEY`
- ✅ `DATABASE_URL`
- ✅ `DIRECT_URL`

Never commit:
- ❌ `.env.local`
- ❌ `.env`
- ❌ Any file with secrets

### **Git Hygiene**

Ensure `.gitignore` includes:
```
.env.local
.env*.local
*.env
reports/
```

---

## 🎯 Next Steps After PASS

Once `final-validation-summary.json` shows `"status": "PASS"`:

### **Immediate** (Day 3-4)

1. ✅ Wire Blog Publish to actual blog list page
2. ✅ Add word/character target selector (Short/Medium/Long/Custom)
3. ✅ Add Export actions (Copy, Download .md, Send to CRM)
4. ✅ Add missing content types (Chat/DM, Q&A, SMS) - UI stubs only

### **Phase 3 Completion** (Day 5-6)

1. ✅ Timeline visualization (agent progress animation)
2. ✅ Preview panel with live updates
3. ✅ Asset library with version history
4. ✅ Publishing modal with destination selection

### **Phase 4 Preparation** (Day 7+)

1. Content DNA system
2. Talent marketplace
3. Commercialization features

---

## ✅ Validation Checklist Summary

Before running validation:
- [ ] OpenAI API key rotated
- [ ] `.env.local` updated with new key
- [ ] Shell history cleared
- [ ] Git history checked/cleaned
- [ ] `.gitignore` verified
- [ ] Dev server running
- [ ] Database migrated

After running validation:
- [ ] All 5 reports generated
- [ ] Screenshots captured
- [ ] No secrets in logs
- [ ] `final-validation-summary.json` status = "PASS"
- [ ] Console clean (no 500/503)
- [ ] SLOs met (P95 ≤ 12s, tokens ≤ 200k)

---

**Status**: ✅ Ready for Execution  
**Command**: `npx tsx scripts/run-enhanced-validation.ts`
