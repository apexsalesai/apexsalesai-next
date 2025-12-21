# Remove NextAuth directories that are causing conflicts
Write-Host "Removing NextAuth routes..."

$paths = @(
    "app\api\auth\[...nextauth]",
    "app\api\echo-auth"
)

foreach ($path in $paths) {
    if (Test-Path $path) {
        Remove-Item -Path $path -Recurse -Force
        Write-Host "✓ Removed: $path"
    } else {
        Write-Host "○ Not found: $path"
    }
}

Write-Host ""
Write-Host "Done! NextAuth routes removed."
Write-Host "Auth0 remains at: app\api\auth\[...auth0]"
Write-Host "Entra ID is at: app\api\entra\"
