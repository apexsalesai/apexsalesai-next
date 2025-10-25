# 🚀 Quick Start — Phase 2-3 Validation

**Copy and paste these commands in order**

---

## ✅ Step 1: Restart Dev Server

```powershell
# Stop current server (Ctrl+C), then:
npm run dev
```

---

## ✅ Step 2: Verify OpenAI Key

```powershell
Invoke-WebRequest http://localhost:3000/api/test-openai -UseBasicParsing | Select-Object -ExpandProperty Content
```

**Expected**: `"success": true, "keyPresent": true`

---

## ✅ Step 3: Test Agents

```powershell
npx tsx scripts/test-phase2-agents.ts
```

**Expected**: All 5 agents complete, 13-15 assets created

---

## ✅ Step 4: Run Full Validation

```powershell
npx tsx scripts/run-enhanced-validation.ts
```

**Expected**: `VALIDATION PASSED` after 5-10 minutes

---

## ✅ Step 5: Check Reports

```powershell
Get-Content reports/final-validation-summary.json | ConvertFrom-Json
```

**Expected**: `"status": "PASS"`

---

## ✅ Step 6: Commit

```powershell
git add .
git commit -m "Phase 2-3: Complete validation suite with dotenv config"
git push origin feature/max-content-stable
```

---

## 🎯 Success Criteria

- ✅ Dev server running
- ✅ OpenAI API test passes
- ✅ All 5 agents execute
- ✅ Validation suite passes
- ✅ Reports generated in `reports/`
- ✅ `final-validation-summary.json` shows `"status": "PASS"`

---

**Ready?** Start with Step 1! 🚀
