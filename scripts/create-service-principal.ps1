# Create Service Principal for ApexSalesAI-Dataverse
# This creates the Enterprise Application object that Azure AD needs for authentication

Write-Host "=== CREATE SERVICE PRINCIPAL ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will create the Enterprise Application (Service Principal) for your app" -ForegroundColor Yellow
Write-Host ""

$appId = "8b232120-1a73-4db4-9b0d-9bd4d4b82c10"

Write-Host "App ID: $appId" -ForegroundColor White
Write-Host ""
Write-Host "Checking if Azure CLI is installed..." -ForegroundColor Yellow

try {
    $azVersion = az version 2>&1
    Write-Host "Azure CLI found!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Azure CLI not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Azure CLI from: https://aka.ms/installazurecliwindows" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Logging in to Azure..." -ForegroundColor Yellow
Write-Host "A browser window will open for authentication" -ForegroundColor Gray
Write-Host ""

az login

Write-Host ""
Write-Host "Creating Service Principal..." -ForegroundColor Yellow

try {
    $result = az ad sp create --id $appId 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "SUCCESS! Service Principal created" -ForegroundColor Green
        Write-Host ""
        Write-Host "Result:" -ForegroundColor White
        Write-Host $result
        Write-Host ""
        Write-Host "NEXT STEPS:" -ForegroundColor Cyan
        Write-Host "1. Go to Enterprise Applications in Azure Portal"
        Write-Host "2. Search for: $appId"
        Write-Host "3. Verify it now appears"
        Write-Host "4. Run the Dataverse integration test again"
    } else {
        Write-Host ""
        Write-Host "ERROR: Failed to create Service Principal" -ForegroundColor Red
        Write-Host $result
        
        if ($result -like "*already exists*") {
            Write-Host ""
            Write-Host "The Service Principal already exists but might not be visible" -ForegroundColor Yellow
            Write-Host "Try refreshing the Enterprise Applications page in Azure Portal" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host ""
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
