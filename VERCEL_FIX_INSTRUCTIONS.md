# CRITICAL: Fix Vercel Environment Variable

## ⚠️ THE PROBLEM

Your Vercel deployment has an invalid `ANTHROPIC_MODEL` environment variable.

**Current (WRONG):** `claude-sonnet-4-5`
**Required (CORRECT):** `claude-3-5-sonnet-20241022`

This is causing all verification requests to fail with "Reality scan crashed" error.

---

## ✅ STEP-BY-STEP FIX

### Step 1: Open Vercel Dashboard

1. Go to: **https://vercel.com/apexsalesai/apexsalesai-next**
2. Log in if needed

### Step 2: Navigate to Environment Variables

1. Click **"Settings"** in the top navigation
2. Click **"Environment Variables"** in the left sidebar
3. Or go directly to: **https://vercel.com/apexsalesai/apexsalesai-next/settings/environment-variables**

### Step 3: Find ANTHROPIC_MODEL

1. Scroll through the list of environment variables
2. Find the one named: **`ANTHROPIC_MODEL`**
3. Click the **"Edit"** button (pencil icon) next to it

### Step 4: Update the Value

1. **Current value:** `claude-sonnet-4-5`
2. **Delete** the current value
3. **Enter new value:** `claude-3-5-sonnet-20241022`
4. Make sure it's applied to all environments:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

### Step 5: Save Changes

1. Click **"Save"** button
2. Vercel will ask if you want to redeploy
3. Click **"Redeploy"** or **"Yes"**

### Step 6: Wait for Deployment

1. Go to **"Deployments"** tab
2. Wait for the new deployment to complete (usually 1-2 minutes)
3. You'll see "Deployment completed" when done

---

## 🧪 VERIFICATION

### After deployment completes:

**1. Check Health Endpoint:**

Open in browser: https://apexsalesai.com/api/health

**Expected response:**
```json
{
  "status": "healthy",
  "checks": {
    "anthropic": {
      "status": "healthy",
      "message": "API key configured, model: claude-3-5-sonnet-20241022"
    }
  }
}
```

**If you see `"status": "unhealthy"` with invalid model error, the env var wasn't updated correctly.**

---

**2. Test Echo Breaker:**

1. Go to: https://apexsalesai.com/echo-breaker
2. Enter claim: "The Earth orbits the Sun"
3. Click "✓ Verify Reality"
4. Should show results within 10 seconds (no "Reality scan crashed" error)

---

## 📋 REFERENCE: Valid Model Names

**Use one of these:**
- `claude-3-5-sonnet-20241022` ← **RECOMMENDED (fastest, best quality)**
- `claude-3-opus-20240229` (slower, highest quality)
- `claude-3-sonnet-20240229` (faster, good quality)

**NEVER use:**
- ❌ `claude-sonnet-4-5` (doesn't exist)
- ❌ `claude-sonnet-4-20250514` (doesn't exist)
- ❌ `claude-3-5-sonnet` (missing date - won't work)

---

## ❓ TROUBLESHOOTING

### If health check still shows "unhealthy" after update:

1. **Double-check the value:**
   - Go back to Vercel environment variables
   - Verify it says exactly: `claude-3-5-sonnet-20241022`
   - No extra spaces, no typos

2. **Force a new deployment:**
   - Go to Deployments tab
   - Click the three dots (...) on latest deployment
   - Click "Redeploy"

3. **Check all environments:**
   - Make sure the variable is set for Production, Preview, AND Development
   - Sometimes only one environment is updated

### If you can't find ANTHROPIC_MODEL variable:

1. It might not exist yet - **create it:**
   - Click "Add New" button
   - Name: `ANTHROPIC_MODEL`
   - Value: `claude-3-5-sonnet-20241022`
   - Select all environments
   - Click Save

---

## 🎯 WHY THIS FIXES THE ISSUE

The Anthropic API requires exact model names with date suffixes. The model name `claude-sonnet-4-5` doesn't exist in their API, so every request fails.

When the API tries to call Anthropic with an invalid model:
1. Anthropic returns an error
2. Our code catches it and returns "verifier_runtime_error"
3. UI shows "Reality scan crashed"

By using the correct model name `claude-3-5-sonnet-20241022`:
1. Anthropic accepts the request
2. Returns verification results
3. UI shows the results properly

---

## ✅ CONFIRMATION

Once you've updated the environment variable and redeployed:

**Reply with:** "Updated and redeployed"

Then I'll verify the fix is working by checking the health endpoint and testing the verification flow.

---

**This is the ONLY change needed to fix the production issue.**
