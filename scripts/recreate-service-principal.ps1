# Recreate Service Principal using Azure REST API
# This bypasses the need for Microsoft Graph PowerShell module

$appId = "8b232120-1a73-4db4-9b0d-9bd4d4b82c10"
$tenantId = "2b9299fd-322f-4c29-83c0-7a10086e8d29"

Write-Host "=== RECREATE SERVICE PRINCIPAL ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will attempt to recreate the Service Principal using Azure REST API" -ForegroundColor Yellow
Write-Host ""

# Step 1: Get an access token for Azure AD Graph (using your admin credentials)
Write-Host "Step 1: You need to manually create the Service Principal" -ForegroundColor Yellow
Write-Host ""
Write-Host "INSTRUCTIONS:" -ForegroundColor Cyan
Write-Host "1. Go to Azure Portal: https://portal.azure.com" -ForegroundColor White
Write-Host "2. Open Cloud Shell (icon at top right)" -ForegroundColor White
Write-Host "3. Run this command:" -ForegroundColor White
Write-Host ""
Write-Host "   az ad sp create --id $appId" -ForegroundColor Green
Write-Host ""
Write-Host "4. Wait for it to complete" -ForegroundColor White
Write-Host "5. Come back here and press Enter to continue" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter after you've run the command in Cloud Shell"

Write-Host ""
Write-Host "Testing if Service Principal now works..." -ForegroundColor Yellow

$tokenUrl = "https://login.microsoftonline.com/$tenantId/oauth2/token"
$body = @{
    client_id     = $appId
    client_secret = 'f859b8f2-67d6-4be5-a3d5-edb401967468'
    grant_type    = 'client_credentials'
    resource      = 'https://graph.microsoft.com'
}

try {
    $response = Invoke-RestMethod -Method POST -Uri $tokenUrl -Body $body -ContentType "application/x-www-form-urlencoded"
    Write-Host ""
    Write-Host "SUCCESS! Service Principal is now working!" -ForegroundColor Green
    Write-Host "You can now run: npx tsx scripts/test-dataverse-integration.ts" -ForegroundColor Cyan
} catch {
    Write-Host ""
    Write-Host "Still not working. Error:" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $responseBody = $reader.ReadToEnd()
        Write-Host $responseBody -ForegroundColor Red
    }
}
