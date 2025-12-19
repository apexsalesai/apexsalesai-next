#!/bin/bash

# Echo Breaker Mobile App - Build Script
# This script guides you through building the mobile app

set -e

echo "================================================"
echo "Echo Breaker Mobile App - Build Script"
echo "================================================"
echo ""

# Check if logged in to Expo
echo "Checking Expo authentication..."
if ! eas whoami &>/dev/null; then
    echo "❌ Not logged in to Expo"
    echo ""
    echo "Please run: eas login"
    echo "If you don't have an account, sign up at: https://expo.dev"
    echo ""
    exit 1
fi

echo "✅ Logged in as: $(eas whoami)"
echo ""

# Check if assets exist
echo "Checking for app assets..."
MISSING_ASSETS=false

if [ ! -f "mobile/assets/icon.png" ]; then
    echo "❌ Missing: mobile/assets/icon.png (1024x1024 px)"
    MISSING_ASSETS=true
fi

if [ ! -f "mobile/assets/adaptive-icon.png" ]; then
    echo "❌ Missing: mobile/assets/adaptive-icon.png (1024x1024 px)"
    MISSING_ASSETS=true
fi

if [ ! -f "mobile/assets/splash.png" ]; then
    echo "❌ Missing: mobile/assets/splash.png (1284x2778 px)"
    MISSING_ASSETS=true
fi

if [ ! -f "mobile/assets/favicon.png" ]; then
    echo "❌ Missing: mobile/assets/favicon.png (48x48 px)"
    MISSING_ASSETS=true
fi

if [ "$MISSING_ASSETS" = true ]; then
    echo ""
    echo "Please create the missing assets. See mobile/assets/README.md"
    echo "You can use temporary placeholders for testing."
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ All assets found"
fi

echo ""
echo "Select build type:"
echo "1. Preview (APK for testing - no store account needed)"
echo "2. Production Android (AAB for Play Store)"
echo "3. Production iOS (IPA for App Store)"
echo "4. Production Both (Android + iOS)"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "Building preview APK for Android..."
        echo "This will create an APK you can install directly on Android devices"
        echo ""
        eas build --platform android --profile preview
        ;;
    2)
        echo ""
        echo "Building production Android App Bundle..."
        echo "This creates an .aab file for Google Play Store"
        echo ""
        eas build --platform android --profile production
        ;;
    3)
        echo ""
        echo "Building production iOS IPA..."
        echo "This creates an IPA file for Apple App Store"
        echo "Note: Requires Apple Developer account ($99/year)"
        echo ""
        eas build --platform ios --profile production
        ;;
    4)
        echo ""
        echo "Building for both Android and iOS..."
        echo ""
        eas build --platform all --profile production
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "================================================"
echo "Build started!"
echo "================================================"
echo ""
echo "Build progress: https://expo.dev/accounts/$(eas whoami | tr -d '[:space:]')/projects/echo-breaker/builds"
echo ""
echo "The build will take 10-30 minutes."
echo "You'll receive an email when it completes."
echo ""
echo "Check build status with: eas build:list"
