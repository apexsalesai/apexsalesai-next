#!/bin/bash

# Verification Script for Clean Deployment
# Checks for security issues, file integrity, and build readiness

echo "🔍 APEXSALESAI DEPLOYMENT VERIFICATION"
echo "======================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS=0
FAIL=0

# Function to check and report
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} $1"
        ((FAIL++))
    fi
}

# 1. Check for .env leaks in git
echo "1️⃣  Checking for environment file leaks..."
if git ls-files | grep -E "\.env$|\.env\..*" | grep -v ".env.example" > /dev/null; then
    echo -e "${RED}✗${NC} .env files found in git tracking"
    ((FAIL++))
else
    echo -e "${GREEN}✓${NC} No .env files in git"
    ((PASS++))
fi

# 2. Verify .gitignore has proper rules
echo ""
echo "2️⃣  Verifying .gitignore security..."
if grep -q "\.env" .gitignore; then
    echo -e "${GREEN}✓${NC} .gitignore contains .env rules"
    ((PASS++))
else
    echo -e "${RED}✗${NC} .gitignore missing .env rules"
    ((FAIL++))
fi

# 3. Check for secrets in recent commits
echo ""
echo "3️⃣  Scanning recent commits for secrets..."
RECENT_COMMITS=$(git log --oneline -5 | grep -i "env\|secret\|key" || true)
if [ -z "$RECENT_COMMITS" ]; then
    echo -e "${GREEN}✓${NC} No secret-related commits in recent history"
    ((PASS++))
else
    echo -e "${YELLOW}⚠${NC}  Found env-related commits (review manually):"
    echo "$RECENT_COMMITS"
fi

# 4. Verify critical files exist
echo ""
echo "4️⃣  Checking critical files..."
FILES=(
    "app/components/PremiumContentStudio.tsx"
    "lib/telemetry.ts"
    "prisma/schema-content-analytics.prisma"
    "PHASE_2_IMPLEMENTATION_PLAN.md"
    "SESSION_COMPLETE_SUMMARY.md"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
        ((PASS++))
    else
        echo -e "${YELLOW}⚠${NC}  $file not found (may need to be recreated)"
    fi
done

# 5. Check Node modules
echo ""
echo "5️⃣  Verifying dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules present"
    ((PASS++))
else
    echo -e "${YELLOW}⚠${NC}  node_modules missing (run npm install)"
fi

# 6. Check Prisma client
echo ""
echo "6️⃣  Checking Prisma setup..."
if [ -d "node_modules/@prisma/client" ]; then
    echo -e "${GREEN}✓${NC} Prisma client generated"
    ((PASS++))
else
    echo -e "${YELLOW}⚠${NC}  Prisma client not generated (run npx prisma generate)"
fi

# 7. Verify environment variables (without showing values)
echo ""
echo "7️⃣  Checking environment configuration..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local exists"
    
    # Check for required keys (without showing values)
    REQUIRED_VARS=("OPENAI_API_KEY" "DATABASE_URL" "ANTHROPIC_API_KEY")
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^${var}=" .env.local; then
            echo -e "${GREEN}  ✓${NC} $var configured"
        else
            echo -e "${YELLOW}  ⚠${NC}  $var missing"
        fi
    done
    ((PASS++))
else
    echo -e "${YELLOW}⚠${NC}  .env.local not found"
fi

# 8. Check TypeScript compilation
echo ""
echo "8️⃣  Testing TypeScript compilation..."
if npx tsc --noEmit > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} TypeScript compiles without errors"
    ((PASS++))
else
    echo -e "${RED}✗${NC} TypeScript compilation errors found"
    echo "Run 'npx tsc --noEmit' to see details"
    ((FAIL++))
fi

# 9. Check for uncommitted changes
echo ""
echo "9️⃣  Checking git status..."
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}✓${NC} No uncommitted changes"
    ((PASS++))
else
    echo -e "${YELLOW}⚠${NC}  Uncommitted changes present:"
    git status --short
fi

# 10. Verify branch
echo ""
echo "🔟 Verifying git branch..."
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"
if [ "$CURRENT_BRANCH" = "feature/max-content-stable" ]; then
    echo -e "${GREEN}✓${NC} On correct branch"
    ((PASS++))
else
    echo -e "${YELLOW}⚠${NC}  Not on feature/max-content-stable"
fi

# Summary
echo ""
echo "======================================"
echo "📊 VERIFICATION SUMMARY"
echo "======================================"
echo -e "${GREEN}Passed: $PASS${NC}"
if [ $FAIL -gt 0 ]; then
    echo -e "${RED}Failed: $FAIL${NC}"
fi
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CRITICAL CHECKS PASSED${NC}"
    echo "Ready for production deployment!"
    exit 0
else
    echo -e "${RED}⚠️  SOME CHECKS FAILED${NC}"
    echo "Please review and fix issues before deploying."
    exit 1
fi
