# PowerShell script to safely remove NextAuth routes
Write-Host "Cleaning up NextAuth routes..."

# Remove the route files first
if (Test-Path "app\api\auth\[...nextauth]\route.ts") {
    Remove-Item "app\api\auth\[...nextauth]\route.ts" -Force
    Write-Host "✓ Removed app\api\auth\[...nextauth]\route.ts"
}

if (Test-Path "app\api\echo-auth\[...nextauth]\route.ts") {
    Remove-Item "app\api\echo-auth\[...nextauth]\route.ts" -Force
    Write-Host "✓ Removed app\api\echo-auth\[...nextauth]\route.ts"
}

# Remove the directories
if (Test-Path "app\api\auth\[...nextauth]") {
    Remove-Item "app\api\auth\[...nextauth]" -Recurse -Force
    Write-Host "✓ Removed app\api\auth\[...nextauth] directory"
}

if (Test-Path "app\api\echo-auth\[...nextauth]") {
    Remove-Item "app\api\echo-auth\[...nextauth]" -Recurse -Force
    Write-Host "✓ Removed app\api\echo-auth\[...nextauth] directory"
}

Write-Host "`n✅ Cleanup complete! NextAuth routes removed."
Write-Host "You can now restart the dev server."
