# Echo Breaker Mobile - Quick Start Guide

Get your mobile app running in 5 minutes!

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Create App Icons

You need 4 image files in `mobile/assets/`:

| File | Size | Purpose |
|------|------|---------|
| `icon.png` | 1024x1024 | App icon |
| `adaptive-icon.png` | 1024x1024 | Android icon |
| `splash.png` | 1284x2778 | Splash screen |
| `favicon.png` | 48x48 | Web favicon |

**Design Tips:**
- Use ApexSalesAI / Echo Breaker branding
- Dark background (#0f172a) with indigo accent (#6366f1)
- Keep designs clean and professional

**Quick Placeholders:** For testing, you can use simple colored squares temporarily.

### 3. Set Up Expo Account (Free)

```bash
# Install EAS CLI (already done)
npm install -g eas-cli

# Create account and login
eas login
```

Sign up at [expo.dev](https://expo.dev) - it's free!

### 4. Test Locally

```bash
# Start development server
npm run mobile:start

# Or use the helper script
bash scripts/setup-mobile-dev.sh
```

Then:
1. Install **Expo Go** on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app
3. App loads on your phone instantly!

### 5. Build for Testing (Optional)

```bash
# Build APK for Android testing
eas build --platform android --profile preview

# This takes 10-20 minutes
# Downloads directly to your phone when done
```

### 6. Build for Production

```bash
# Use the helper script
bash scripts/build-mobile.sh

# Or manually:
npm run mobile:build:all
```

## 📱 What You Get

**Echo Breaker Mobile App** - A fully functional fact-checking app that:
- ✅ Verifies claims in real-time
- ✅ Shows confidence ratings and sources
- ✅ Analyzes why misinformation spreads
- ✅ Works on iOS and Android
- ✅ Dark theme optimized
- ✅ Production-ready

## 🔧 Common Commands

```bash
# Development
npm run mobile:start          # Start dev server
npm run mobile:android        # Run on Android emulator
npm run mobile:ios            # Run on iOS simulator (macOS)

# Building
npm run mobile:build:android  # Build Android (AAB)
npm run mobile:build:ios      # Build iOS (IPA)
npm run mobile:build:all      # Build both

# Submission
npm run mobile:submit:android # Submit to Play Store
npm run mobile:submit:ios     # Submit to App Store
```

## 📚 Documentation

- **[MOBILE_BUILD_GUIDE.md](MOBILE_BUILD_GUIDE.md)** - Complete deployment guide
- **[mobile/README.md](mobile/README.md)** - Technical documentation
- **[mobile/assets/README.md](mobile/assets/README.md)** - Asset specifications

## 🆘 Troubleshooting

### "Cannot find module 'expo'"
```bash
npm install --legacy-peer-deps
```

### "Not logged in"
```bash
eas login
```

### "Build failed"
```bash
# Clear cache and retry
eas build --platform android --clear-cache
```

### "Metro bundler error"
```bash
npx expo start --clear
```

## 💰 Cost Breakdown

| Item | Cost | When |
|------|------|------|
| Development & Testing | **FREE** | Now |
| Expo Account | **FREE** | Now |
| EAS Builds (limited) | **FREE** | First few builds |
| EAS Builds (unlimited) | $29/month | Optional |
| Google Play Console | **$25** | Before publishing |
| Apple Developer | **$99/year** | Before publishing |

**Total to get started: $0**
**Total to publish: $124-$223**

## 🎯 Next Steps

1. ✅ Run `npm install --legacy-peer-deps`
2. ✅ Create app icons in `mobile/assets/`
3. ✅ Run `npm run mobile:start`
4. ✅ Test on your phone with Expo Go
5. ✅ Sign up for Expo account
6. ✅ Build preview APK for testing
7. ✅ Register for Play Store / App Store
8. ✅ Build production apps
9. ✅ Submit to stores

## 🔗 Useful Links

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Expo Discord](https://chat.expo.dev)
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com)

---

**Questions?** Check the [complete build guide](MOBILE_BUILD_GUIDE.md) or reach out to the dev team!
