#!/bin/bash
# Create a new Dataverse app registration to replace the orphaned one
# This script creates everything needed and outputs ready-to-paste .env values

echo "=== CREATING NEW DATAVERSE APP REGISTRATION ==="
echo ""
echo "This will create a new app to replace the orphaned registration"
echo "The old app (8b232120-1a73-4db4-9b0d-9bd4d4b82c10) will remain in the portal but won't be used"
echo ""

# Step 1: Create new app registration
echo "Step 1: Creating new app registration..."
APP_JSON=$(az ad app create \
  --display-name "ApexSalesAI-Dataverse-v2" \
  --sign-in-audience AzureADMyOrg)

NEW_APP_ID=$(echo $APP_JSON | jq -r '.appId')
echo "✅ App created with ID: $NEW_APP_ID"
echo ""

# Step 2: Create service principal
echo "Step 2: Creating service principal..."
SP_JSON=$(az ad sp create --id $NEW_APP_ID)
SP_OBJECT_ID=$(echo $SP_JSON | jq -r '.id')
echo "✅ Service Principal created with Object ID: $SP_OBJECT_ID"
echo ""

# Step 3: Generate client secret
echo "Step 3: Generating client secret..."
CRED_JSON=$(az ad app credential reset --id $NEW_APP_ID --append)
NEW_SECRET=$(echo $CRED_JSON | jq -r '.password')
echo "✅ Client secret generated"
echo ""

# Output summary
echo "=========================================="
echo "✅ SUCCESS! NEW APP REGISTRATION CREATED"
echo "=========================================="
echo ""
echo "📋 UPDATE YOUR .env.local WITH THESE VALUES:"
echo ""
echo "DATAVERSE_CLIENT_ID=\"$NEW_APP_ID\""
echo "DATAVERSE_CLIENT_SECRET=\"$NEW_SECRET\""
echo ""
echo "⚠️  KEEP THESE VALUES SECURE!"
echo ""
echo "=========================================="
echo "NEXT STEPS:"
echo "=========================================="
echo ""
echo "1. Update .env.local with the values above"
echo ""
echo "2. Grant API permissions in Azure Portal:"
echo "   - Go to: App registrations → ApexSalesAI-Dataverse-v2"
echo "   - Click: API permissions → Add permission"
echo "   - Select: APIs my organization uses → Dynamics CRM"
echo "   - Check: user_impersonation (Delegated)"
echo "   - Click: Add permissions"
echo "   - Click: Grant admin consent for Lyfye"
echo ""
echo "3. Update Application User in Power Platform:"
echo "   - Go to: Power Platform Admin Center"
echo "   - Navigate to: apexai-dev environment"
echo "   - Go to: Settings → Users + permissions → Application users"
echo "   - Open: ApexSalesAI-Dataverse user"
echo "   - Replace Azure Application ID with: $NEW_APP_ID"
echo "   - Save"
echo ""
echo "4. Test the integration:"
echo "   npx tsx scripts/test-dataverse-integration.ts"
echo ""
echo "=========================================="
