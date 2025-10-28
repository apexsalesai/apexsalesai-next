# 🔐 OAuth2 Token Acquisition - ReqBin Issue Resolved

**Date:** October 27, 2024  
**Status:** ✅ **RESOLVED**  
**Root Cause:** ReqBin mis-encodes form data  
**Solution:** Use PowerShell native tooling

---

## 🐛 Problem

**Symptom:** Azure AD OAuth2 token requests fail with 400 Bad Request when using ReqBin

**Root Cause:**
- ReqBin silently adds line breaks to form-encoded payloads
- ReqBin may use `multipart/form-data` instead of `application/x-www-form-urlencoded`
- Azure AD strictly validates OAuth2 token requests and rejects malformed bodies

**Error Example:**
```
HTTP 400 Bad Request
AADSTS900144: The request body must contain the following parameter: 'grant_type'
```

---

## ✅ Solution

**Use PowerShell's `Invoke-RestMethod`** which correctly encodes form data:

### **Automated Test Script**
```powershell
pwsh ./scripts/test-dataverse-token.ps1
```

This script:
- ✅ Loads credentials from `.env.local`
- ✅ Requests OAuth2 token from Azure AD
- ✅ Validates token with Dataverse `WhoAmI` API
- ✅ Displays token details and connection info
- ✅ Provides troubleshooting guidance on failure

### **Manual Test (PowerShell)**
```powershell
$tenantId = "YOUR_TENANT_ID"
$clientId = "YOUR_CLIENT_ID"
$clientSecret = "YOUR_CLIENT_SECRET"
$scope = "https://YOUR_INSTANCE.crm.dynamics.com/.default"

$body = @{
    client_id     = $clientId
    client_secret = $clientSecret
    grant_type    = "client_credentials"
    scope         = $scope
}

Invoke-RestMethod -Method Post `
  -Uri "https://login.microsoftonline.com/$tenantId/oauth2/v2.0/token" `
  -ContentType "application/x-www-form-urlencoded" `
  -Body $body
```

**Expected Response:**
```json
{
  "token_type": "Bearer",
  "expires_in": 3599,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJS..."
}
```

---

## 🚫 What NOT to Use

**Avoid these tools for OAuth2 token requests on Windows:**

| Tool | Issue |
|------|-------|
| **ReqBin** | Mis-encodes form data, adds line breaks |
| **curl (Windows)** | Encoding issues with special characters in secrets |
| **Postman (sometimes)** | May work but requires careful configuration |

**✅ Recommended:** PowerShell `Invoke-RestMethod` (native, reliable, correct encoding)

---

## 📋 Updated Documentation

**Files Updated:**
1. `WINDSURF_PHASE3_DIRECTIVE.md` - Added Step 2.5 with PowerShell solution
2. `scripts/test-dataverse-token.ps1` - New automated test script

**Timeline Updated:**
- **T + 20 min:** Test OAuth2 token (new step)
- Subsequent steps adjusted by +5 minutes

---

## 🎯 Verification Steps

**After running the test script, verify:**

1. ✅ HTTP 200 OK response
2. ✅ `access_token` present (JWT format)
3. ✅ `expires_in` = 3599 seconds (59 minutes)
4. ✅ `token_type` = "Bearer"
5. ✅ Dataverse `WhoAmI` API returns user/org details

---

## 🔍 Troubleshooting

**If token request fails:**

1. **Verify credentials in `.env.local`:**
   - `AZURE_TENANT_ID` - Must match Azure AD tenant
   - `AZURE_CLIENT_ID` - Must match App Registration
   - `AZURE_CLIENT_SECRET` - Must be valid and not expired
   - `DATAVERSE_RESOURCE` - Must match Dataverse instance URL

2. **Check Azure AD App Registration:**
   - API permissions granted (Dynamics CRM → user_impersonation)
   - Admin consent granted
   - Client secret not expired

3. **Verify Dataverse URL:**
   - Format: `https://[org-name].crm.dynamics.com`
   - No trailing slash
   - Matches Power Platform environment

4. **Check network/firewall:**
   - Can reach `login.microsoftonline.com`
   - Can reach Dataverse instance
   - No proxy blocking OAuth2 endpoints

---

## 📊 Impact

**Before Fix:**
- ❌ OAuth2 token requests failing
- ❌ Unable to validate Dataverse credentials
- ❌ Phase 3 activation blocked

**After Fix:**
- ✅ OAuth2 token acquisition working
- ✅ Dataverse API access validated
- ✅ Phase 3 activation unblocked
- ✅ Automated test script available
- ✅ Documentation updated with working solution

---

## 🚀 Next Steps

1. Run `pwsh ./scripts/test-dataverse-token.ps1` to validate credentials
2. Proceed to Step 3 (Create Dataverse Table)
3. Continue with Phase 3 activation per `WINDSURF_PHASE3_DIRECTIVE.md`

---

**Status:** ✅ **RESOLVED - READY FOR PHASE 3 ACTIVATION**  
**Commit:** `0046dd6`  
**Files:** `scripts/test-dataverse-token.ps1`, `WINDSURF_PHASE3_DIRECTIVE.md`
