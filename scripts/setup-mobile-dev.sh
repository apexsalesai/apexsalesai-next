#!/bin/bash

# Echo Breaker Mobile App - Development Setup Script

set -e

echo "================================================"
echo "Echo Breaker Mobile - Development Setup"
echo "================================================"
echo ""

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. You have: $(node -v)"
    exit 1
fi
echo "✅ Node.js $(node -v)"
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps
echo "✅ Dependencies installed"
echo ""

# Check for Expo account
echo "Checking Expo authentication..."
if eas whoami &>/dev/null; then
    echo "✅ Logged in as: $(eas whoami)"
else
    echo "⚠️  Not logged in to Expo"
    echo ""
    echo "To build and deploy, you'll need an Expo account."
    echo "Run: eas login"
    echo "Sign up at: https://expo.dev"
fi
echo ""

# Check for assets
echo "Checking app assets..."
if [ -f "mobile/assets/icon.png" ]; then
    echo "✅ icon.png found"
else
    echo "❌ icon.png missing (1024x1024 px)"
fi

if [ -f "mobile/assets/splash.png" ]; then
    echo "✅ splash.png found"
else
    echo "❌ splash.png missing (1284x2778 px)"
fi
echo ""

echo "================================================"
echo "Setup Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Create app assets (if not done):"
echo "   See: mobile/assets/README.md"
echo ""
echo "2. Start development server:"
echo "   npm run mobile:start"
echo ""
echo "3. Test on your phone:"
echo "   - Install 'Expo Go' app from your app store"
echo "   - Scan the QR code shown in terminal"
echo ""
echo "4. Build for production:"
echo "   bash scripts/build-mobile.sh"
echo ""
echo "Documentation:"
echo "   MOBILE_BUILD_GUIDE.md - Complete build guide"
echo "   mobile/README.md - Technical documentation"
echo ""
