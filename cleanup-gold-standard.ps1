# Gold Standard NextAuth Cleanup
# Architectural decision: Full migration to Microsoft Entra ID

Write-Host "=== Gold Standard NextAuth Cleanup ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Remove NextAuth directories
$dirsToRemove = @(
    "app\api\auth\[...nextauth]",
    "app\api\echo-auth"
)

Write-Host "Step 1: Removing NextAuth directories..." -ForegroundColor Yellow
foreach ($dir in $dirsToRemove) {
    if (Test-Path $dir) {
        Remove-Item -Path $dir -Recurse -Force
        Write-Host "  [DELETED] $dir" -ForegroundColor Green
    } else {
        Write-Host "  [NOT FOUND] $dir" -ForegroundColor Gray
    }
}

# Step 2: Remove NextAuth config files
$filesToRemove = @(
    "lib\auth.ts",
    "app\echo-breaker\providers.tsx",
    "types\next-auth.d.ts"
)

Write-Host ""
Write-Host "Step 2: Removing NextAuth config files..." -ForegroundColor Yellow
foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Remove-Item -Path $file -Force
        Write-Host "  [DELETED] $file" -ForegroundColor Green
    } else {
        Write-Host "  [NOT FOUND] $file" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "=== Cleanup Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Final Architecture:" -ForegroundColor White
Write-Host "  Auth0:     /api/auth/[...auth0]  (reserved for future)" -ForegroundColor Gray
Write-Host "  Entra ID:  /api/entra/*          (active - Echo Breaker)" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Run: npm uninstall next-auth" -ForegroundColor Yellow
Write-Host "  2. Clean NEXTAUTH_* from .env.local" -ForegroundColor Yellow
Write-Host "  3. Verify no next-auth references" -ForegroundColor Yellow
Write-Host "  4. Commit with architectural intent" -ForegroundColor Yellow
