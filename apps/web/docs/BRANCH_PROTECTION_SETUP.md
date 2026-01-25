# Branch Protection Rules Setup

## Overview
This document provides step-by-step instructions for setting up enterprise-grade branch protection rules for the ApexSalesAI repository.

## Prerequisites
- Repository admin access
- CodeQL workflow enabled (✅ completed)
- Dependabot enabled (✅ completed)

## Branch Protection Configuration

### Step 1: Access Branch Protection Settings
1. Go to your repository: `https://github.com/apexsalesai/apexsalesai-next`
2. Click **Settings** → **Branches**
3. Click **Add rule** or **Add branch protection rule**

### Step 2: Configure Main Branch Protection

#### Branch Name Pattern
```
main
```

#### Protection Rules to Enable

##### ✅ Require a pull request before merging
- **Required approvals:** 1
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require review from Code Owners (if CODEOWNERS file exists)
- ✅ Require approval of the most recent reviewable push

##### ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- **Required status checks:**
  - `CodeQL / Analyze (javascript)`
  - `CodeQL / Analyze (typescript)`
  - Any other CI/CD checks you add later

##### ✅ Require conversation resolution before merging
- Ensures all PR comments are resolved

##### ✅ Require signed commits (Optional but Recommended)
- Adds cryptographic verification

##### ✅ Require linear history (Recommended)
- Prevents merge commits, enforces rebase or squash

##### ✅ Include administrators
- Applies rules to repo admins too (best practice)

##### ✅ Restrict who can push to matching branches
- **Allowed to push:** None (all changes via PR)
- **Exceptions:** CI/CD service accounts if needed

##### ✅ Allow force pushes
- ❌ **Disabled** (prevents history rewriting)

##### ✅ Allow deletions
- ❌ **Disabled** (prevents accidental branch deletion)

### Step 3: Configure Feature Branch Protection (Optional)

#### Branch Name Pattern
```
feature/**
```

#### Lighter Protection Rules
- ✅ Require status checks to pass before merging
  - `CodeQL / Analyze (javascript)`
  - `CodeQL / Analyze (typescript)`
- ✅ Require conversation resolution before merging

### Step 4: Verify Protection is Active

After saving, test by:
1. Creating a new branch
2. Making a change
3. Opening a PR to `main`
4. Verify you **cannot** merge until:
   - CodeQL checks pass
   - Required reviews are approved
   - All conversations resolved

## Additional Security Measures

### Create CODEOWNERS File
Create `.github/CODEOWNERS` to auto-assign reviewers:

```
# Default owners for everything
* @your-github-username

# Specific ownership
/prisma/ @database-team
/lib/services/agent/ @ai-team
/.github/ @devops-team
```

### Enable Required Workflows (GitHub Enterprise)
If you have GitHub Enterprise:
1. Settings → Actions → General
2. Enable "Required workflows"
3. Add CodeQL as required

### Set Up Deployment Protection
1. Settings → Environments
2. Create `production` environment
3. Add protection rules:
   - Required reviewers
   - Wait timer (e.g., 5 minutes)
   - Deployment branches: `main` only

## Monitoring & Compliance

### Regular Security Checks
- **Weekly:** Review Dependabot alerts
- **Weekly:** Check CodeQL findings
- **Monthly:** Audit branch protection compliance
- **Quarterly:** Review and update protection rules

### Audit Log Access
Settings → Security → Audit log
- Track who bypassed protections
- Monitor force pushes
- Review permission changes

## Emergency Procedures

### Hotfix Process
1. Create `hotfix/description` branch from `main`
2. Make minimal fix
3. Open PR with `[HOTFIX]` prefix
4. Fast-track review (still requires approval)
5. Merge and deploy immediately

### Bypassing Protection (Admin Only)
Only in critical emergencies:
1. Document reason in incident log
2. Temporarily disable specific rule
3. Make change
4. Re-enable protection immediately
5. Create post-mortem

## Success Metrics

Your branch protection is working when:
- ✅ No direct commits to `main`
- ✅ All PRs have required reviews
- ✅ CodeQL blocks vulnerable code
- ✅ Dependabot PRs are reviewed promptly
- ✅ Zero unauthorized force pushes

## Resources

- [GitHub Branch Protection Docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [Dependabot Configuration](https://docs.github.com/en/code-security/dependabot)

---

**Last Updated:** 2025-10-25  
**Maintained By:** DevOps Team
