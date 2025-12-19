# Echo Breaker Mobile App - Build & Deployment Guide

This guide will walk you through building and deploying the Echo Breaker mobile app to both the Google Play Store (Android) and Apple App Store (iOS).

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Development](#development)
4. [Building for Production](#building-for-production)
5. [Submitting to App Stores](#submitting-to-app-stores)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Accounts

- **Expo Account**: Sign up at [expo.dev](https://expo.dev)
- **Google Play Console**: $25 one-time fee - [play.google.com/console](https://play.google.com/console)
- **Apple Developer Program**: $99/year - [developer.apple.com](https://developer.apple.com)

### Required Software

```bash
# Node.js (v18 or higher)
node --version

# npm or yarn
npm --version

# Expo CLI (will be installed with dependencies)
npm install -g eas-cli

# Login to Expo
eas login
```

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create App Assets

Create the following image assets in the `mobile/assets/` directory:

- **icon.png** (1024x1024 px) - App icon
- **adaptive-icon.png** (1024x1024 px) - Android adaptive icon
- **splash.png** (1284x2778 px) - Splash screen
- **favicon.png** (48x48 px) - Web favicon

See `mobile/assets/README.md` for detailed specifications.

### 3. Configure Expo Project

```bash
# Initialize EAS Build
eas build:configure

# This will prompt you to create an Expo project
# Follow the prompts and select your project settings
```

Update `app.json` with your project details:

```json
{
  "expo": {
    "name": "Echo Breaker",
    "slug": "echo-breaker",
    "ios": {
      "bundleIdentifier": "com.apexsalesai.echobreaker"
    },
    "android": {
      "package": "com.apexsalesai.echobreaker"
    }
  }
}
```

### 4. Update EAS Project ID

After running `eas build:configure`, update the `extra.eas.projectId` in `app.json` with your actual project ID from the Expo dashboard.

## Development

### Running the App Locally

```bash
# Start the development server
npm run mobile:start

# Or run directly on a device/simulator
npm run mobile:android  # For Android
npm run mobile:ios      # For iOS (macOS only)
```

### Testing on Physical Devices

1. Install **Expo Go** app on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code shown in the terminal with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

### Development Tips

- The app connects to `https://www.apexsalesai.com/api/reality-scan` for claim verification
- Hot reload is enabled - changes appear instantly
- Check the terminal for errors and warnings
- Use `console.log()` for debugging (visible in terminal)

## Building for Production

### Android Build (Google Play Store)

#### Step 1: Create a Keystore (First-time only)

EAS will automatically generate a keystore for you, or you can provide your own:

```bash
# Let EAS generate and manage the keystore (recommended)
eas build --platform android
```

#### Step 2: Build APK for Testing

```bash
# Build an APK for internal testing
eas build --platform android --profile preview
```

This creates an APK you can install directly on Android devices for testing.

#### Step 3: Build AAB for Production

```bash
# Build Android App Bundle for Play Store
npm run mobile:build:android

# Or manually:
eas build --platform android --profile production
```

#### Step 4: Download the Build

```bash
# Download the .aab file from the Expo dashboard
# Or use the CLI
eas build:list
```

### iOS Build (Apple App Store)

#### Prerequisites for iOS

- **macOS computer** (required for final submission)
- **Apple Developer Account** ($99/year)
- **App Store Connect** account set up

#### Step 1: Register App Identifier

1. Go to [developer.apple.com/account](https://developer.apple.com/account)
2. Navigate to "Certificates, Identifiers & Profiles"
3. Create a new App ID: `com.apexsalesai.echobreaker`

#### Step 2: Create App in App Store Connect

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - Platform: iOS
   - Name: Echo Breaker
   - Primary Language: English
   - Bundle ID: `com.apexsalesai.echobreaker`
   - SKU: `echobreaker001`

#### Step 3: Build for Production

```bash
# Build for iOS
npm run mobile:build:ios

# Or manually:
eas build --platform ios --profile production
```

#### Step 4: Configure Credentials

EAS will prompt you to:
- Generate or provide Apple Distribution Certificate
- Generate or provide Provisioning Profile

Choose "Let EAS handle credentials" for simplicity.

### Build Both Platforms Simultaneously

```bash
npm run mobile:build:all
```

## Submitting to App Stores

### Google Play Store Submission

#### Step 1: Set Up Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a service account with Play Store publishing permissions
3. Download the JSON key file
4. Save it as `android-service-account.json` in your project root
5. Add to `.gitignore` (security!)

#### Step 2: Update eas.json

Update the `serviceAccountKeyPath` in `eas.json`:

```json
{
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./android-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

#### Step 3: Submit to Play Store

```bash
# Submit to internal testing track
npm run mobile:submit:android

# Or manually:
eas submit --platform android --latest
```

#### Step 4: Create Play Store Listing

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app
3. Fill in the store listing:
   - **App name**: Echo Breaker
   - **Short description**: Verify claims before you share them
   - **Full description**:
     ```
     Echo Breaker helps you verify viral claims, headlines, and statistics before sharing them.

     Features:
     • Instant claim verification
     • Confidence ratings and sources
     • ProofCard generation
     • Misinformation analysis

     Break the echo chamber. Verify before you share.
     ```
   - **Screenshots**: Take 4-8 screenshots from the app
   - **Feature graphic**: 1024x500 px banner image
   - **App icon**: 512x512 px

4. Set up pricing (Free)
5. Select content rating
6. Submit for review

### Apple App Store Submission

#### Step 1: Configure App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app
3. Fill in the App Information:
   - **Name**: Echo Breaker
   - **Subtitle**: Verify before you share
   - **Privacy Policy URL**: Your privacy policy URL
   - **Category**: News or Utilities
   - **Age Rating**: 4+

#### Step 2: Update eas.json

Update your Apple credentials in `eas.json`:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "XXXXXXXXXX"
      }
    }
  }
}
```

#### Step 3: Submit Binary

```bash
# Submit to App Store Connect
npm run mobile:submit:ios

# Or manually:
eas submit --platform ios --latest
```

#### Step 4: Create App Store Listing

1. In App Store Connect, add version information:
   - **Version**: 1.0.0
   - **Copyright**: © 2024 ApexSalesAI
   - **Description**:
     ```
     Echo Breaker helps you verify viral claims, headlines, and statistics
     before sharing them on social media.

     FEATURES:
     • Instant claim verification powered by AI
     • Confidence ratings with sources
     • Detailed fact-checking reports
     • Understanding of why misinformation spreads
     • Shareable ProofCards

     Break free from echo chambers. Verify facts before you share.
     ```
   - **Keywords**: fact check, verify, claims, misinformation, truth
   - **Support URL**: https://www.apexsalesai.com/support
   - **Marketing URL**: https://www.apexsalesai.com/echo-breaker

2. Add screenshots:
   - 6.5" display (iPhone 14 Pro Max): Required
   - 5.5" display (iPhone 8 Plus): Optional
   - iPad Pro: Optional

3. Submit for review

## App Store Requirements

### Screenshots

You need to take screenshots on these devices:

**Android:**
- Phone: 1080x1920 minimum (at least 2 screenshots)
- Tablet: 1920x1080 minimum (optional)

**iOS:**
- iPhone 6.5": 1242x2688 or 1284x2778 (required)
- iPhone 5.5": 1242x2208 (optional)
- iPad Pro 12.9": 2048x2732 (optional)

### App Privacy

Both stores require privacy information:

**Data Collection:**
- No personal data collected
- Internet access for API calls
- No tracking or analytics (unless you add them)

**Permissions:**
- Internet: Required for claim verification
- No other permissions needed

## Troubleshooting

### Common Issues

#### Build Fails

```bash
# Clear cache and retry
eas build:configure
eas build --platform android --clear-cache
```

#### Credentials Issues

```bash
# Reset credentials
eas credentials
# Select platform → Select action → Delete credentials
# Then rebuild
```

#### App Crashes on Startup

- Check that `API_BASE_URL` in `EchoBreakerMobile.tsx` is correct
- Verify network connectivity
- Check Expo logs: `npx expo start --tunnel`

#### Can't Submit to App Store

- Ensure you have an active Apple Developer membership
- Verify your app identifier matches App Store Connect
- Check that all required screenshots are uploaded

### Getting Help

- **Expo Documentation**: [docs.expo.dev](https://docs.expo.dev)
- **Expo Discord**: [chat.expo.dev](https://chat.expo.dev)
- **Stack Overflow**: Tag with `expo` and `react-native`

## Maintenance & Updates

### Releasing Updates

1. Update version in `app.json`:
   ```json
   {
     "expo": {
       "version": "1.0.1",
       "ios": {
         "buildNumber": "1.0.1"
       },
       "android": {
         "versionCode": 2
       }
     }
   }
   ```

2. Build new version:
   ```bash
   npm run mobile:build:all
   ```

3. Submit to stores:
   ```bash
   npm run mobile:submit:android
   npm run mobile:submit:ios
   ```

### Over-the-Air Updates (OTA)

For minor changes that don't require app store review:

```bash
# Install expo-updates
npm install expo-updates

# Publish an update
eas update --branch production
```

Users will get the update automatically without needing to download from the store.

## Cost Summary

| Item | Cost | Frequency |
|------|------|-----------|
| Google Play Console | $25 | One-time |
| Apple Developer Program | $99 | Annual |
| Expo (Free tier) | $0 | - |
| EAS Build (Paid) | $29/month | Optional* |

\* You get limited free builds per month. Paid plan gives unlimited builds and priority.

## Next Steps

1. ✅ Create app assets (icons, splash screens)
2. ✅ Install dependencies: `npm install`
3. ✅ Test locally: `npm run mobile:start`
4. ✅ Build for testing: `eas build --platform android --profile preview`
5. ✅ Create store accounts (Google Play, Apple)
6. ✅ Build for production: `npm run mobile:build:all`
7. ✅ Submit to app stores
8. ✅ Monitor reviews and update as needed

---

**Questions?** Check the [Expo documentation](https://docs.expo.dev) or reach out to the development team.
