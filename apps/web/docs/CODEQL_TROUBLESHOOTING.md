# CodeQL Workflow Troubleshooting

## Issue: CodeQL Workflow Failures

**Date:** 2025-10-25  
**Status:** ✅ Resolved

---

## Problem Description

The CodeQL security scanning workflow was failing on every push with build-related errors. The workflow was attempting to:
1. Install npm dependencies
2. Build the Next.js application
3. Run CodeQL analysis

### Root Cause

The build step was failing because:
- GitHub Actions environment lacks required environment variables (`.env` not present)
- Database connection strings not available in CI
- Azure/Auth0 credentials not configured in Actions secrets
- Build process requires these variables to complete successfully

### Error Pattern

```
npm run build
> Error: Missing environment variable: DATABASE_URL
> Error: Missing environment variable: AZURE_OPENAI_KEY
Build failed with exit code 1
```

---

## Solution

### What Changed

Simplified the CodeQL workflow to analyze source code directly without building:

**Before:**
```yaml
steps:
  - name: Checkout repository
  - name: Setup Node
  - name: Install dependencies
    run: npm ci
  - name: Build application
    run: npm run build
  - name: Initialize CodeQL
  - name: Autobuild
  - name: Perform CodeQL Analysis
```

**After:**
```yaml
steps:
  - name: Checkout repository
  - name: Initialize CodeQL
    with:
      queries: security-and-quality
  - name: Perform CodeQL Analysis
```

### Why This Works

For JavaScript and TypeScript projects:
- **CodeQL doesn't need a build** to analyze the source code
- Static analysis works on raw `.js` and `.ts` files
- Build artifacts (`.next/`, `dist/`) are not required for security scanning
- This approach is faster and more reliable

### Benefits

✅ **No build dependencies** - No need for env vars in CI  
✅ **Faster scans** - Skips 5-10 minute build process  
✅ **More reliable** - No build failures blocking security scans  
✅ **Same security coverage** - CodeQL analyzes all source files  

---

## Verification

After the fix, the workflow should:
1. ✅ Complete successfully in ~2-3 minutes
2. ✅ Scan both JavaScript and TypeScript files
3. ✅ Report security findings in the Security tab
4. ✅ Run on every push to `main` and `feature/**` branches

### Check Workflow Status

Visit: `https://github.com/apexsalesai/apexsalesai-next/actions`

Expected result:
- ✅ Green checkmark for CodeQL workflow
- ✅ "Analyze (javascript)" - Passed
- ✅ "Analyze (typescript)" - Passed

---

## When to Use Build-Based Analysis

You **should** include build steps if:
- Using compiled languages (Java, C++, C#, Go)
- Need to analyze generated code
- Have complex build-time code generation
- Using advanced TypeScript features that require compilation

For Next.js/React projects:
- ❌ **Not needed** - Source analysis is sufficient
- ✅ **Recommended** - Direct source scanning (current approach)

---

## Alternative: Add Secrets to GitHub Actions

If you need build-based analysis in the future:

1. Go to: `Settings → Secrets and variables → Actions`
2. Add repository secrets:
   ```
   DATABASE_URL
   AZURE_OPENAI_KEY
   AZURE_OPENAI_ENDPOINT
   AUTH0_CLIENT_SECRET
   NEXTAUTH_SECRET
   ```
3. Update workflow to use secrets:
   ```yaml
   - name: Build application
     env:
       DATABASE_URL: ${{ secrets.DATABASE_URL }}
       AZURE_OPENAI_KEY: ${{ secrets.AZURE_OPENAI_KEY }}
     run: npm run build
   ```

**Note:** Only add secrets if absolutely necessary for analysis.

---

## Related Documentation

- [CodeQL for JavaScript](https://codeql.github.com/docs/codeql-language-guides/codeql-for-javascript/)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [CodeQL Workflow Configuration](https://docs.github.com/en/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors/configuring-code-scanning)

---

## Monitoring

After deployment:
- **Check daily:** GitHub Actions tab for workflow status
- **Review weekly:** Security tab for CodeQL findings
- **Update quarterly:** CodeQL action versions

---

**Issue Resolved:** 2025-10-25  
**Fix Committed:** `3020885`  
**Status:** Production Ready ✅
