# Echo Breaker Mobile App

Cross-platform mobile application for iOS and Android built with React Native and Expo.

## Overview

Echo Breaker is a fact-checking mobile app that helps users verify viral claims, headlines, and statistics before sharing them on social media.

**Features:**
- ✅ Instant claim verification
- ✅ AI-powered fact-checking
- ✅ Confidence ratings and sources
- ✅ Detailed analysis of misinformation spread factors
- ✅ Shareable ProofCards
- ✅ Dark theme optimized UI
- ✅ Cross-platform (iOS & Android)

## Project Structure

```
mobile/
├── app/                    # Expo Router app directory
│   ├── _layout.tsx        # Root layout with navigation
│   └── index.tsx          # Home screen
├── components/            # React Native components
│   └── EchoBreakerMobile.tsx  # Main app component
├── assets/                # App assets (icons, splash screens)
│   └── README.md         # Asset specifications
└── README.md             # This file
```

## Technology Stack

- **Framework**: React Native 0.76
- **Build System**: Expo SDK 52
- **Navigation**: Expo Router 4.0
- **Language**: TypeScript
- **Styling**: React Native StyleSheet
- **API**: REST (connects to ApexSalesAI backend)

## Quick Start

### Development

```bash
# Start the development server
npm run mobile:start

# Run on Android device/emulator
npm run mobile:android

# Run on iOS simulator (macOS only)
npm run mobile:ios
```

### Building

```bash
# Build for Android
npm run mobile:build:android

# Build for iOS
npm run mobile:build:ios

# Build for both platforms
npm run mobile:build:all
```

### Deployment

```bash
# Submit to Google Play Store
npm run mobile:submit:android

# Submit to Apple App Store
npm run mobile:submit:ios
```

## Requirements

- Node.js 18+
- Expo CLI (installed via npm)
- EAS CLI (installed via npm)
- Expo account (free)
- For iOS builds: Apple Developer Account ($99/year)
- For Android: Google Play Console ($25 one-time)

## API Integration

The mobile app connects to the ApexSalesAI backend API:

**Endpoint**: `https://www.apexsalesai.com/api/reality-scan`

**Request**:
```json
{
  "claim": "The claim to verify",
  "link": "Optional source URL"
}
```

**Response**:
```json
{
  "verificationId": "unique-id",
  "verdict": "Accurate|Misleading|False",
  "confidence": 85,
  "summary": "Brief summary",
  "bottomLine": "Key takeaway",
  "whatDataShows": ["point 1", "point 2"],
  "spreadFactors": ["reason 1", "reason 2"],
  "sources": [
    {
      "title": "Source title",
      "url": "https://...",
      "domain": "example.com",
      "tier": 1
    }
  ]
}
```

## Configuration

### App Identifiers

- **iOS Bundle ID**: `com.apexsalesai.echobreaker`
- **Android Package**: `com.apexsalesai.echobreaker`

### App.json

The main configuration file is `app.json` in the project root. Key settings:

- App name and slug
- Version and build numbers
- Icons and splash screens
- Platform-specific settings
- Expo project ID

### EAS Build

Build configuration is in `eas.json`:

- **Development**: Internal builds with dev client
- **Preview**: APK/Ad-hoc builds for testing
- **Production**: App Bundle/IPA for store submission

## Development Workflow

1. **Make changes** to components in `mobile/`
2. **Test locally** with `npm run mobile:start`
3. **Preview build** with `eas build --profile preview`
4. **Test on device** by installing the preview build
5. **Production build** with `npm run mobile:build:all`
6. **Submit to stores** when ready

## UI Components

### Main Component: EchoBreakerMobile

Located at `mobile/components/EchoBreakerMobile.tsx`

**Sections:**
- Header with branding
- Claim input form
- Optional link input
- Preset examples
- Verification button
- Results display with verdict, sources, and analysis

**Key Features:**
- Keyboard-aware scrolling
- Loading states
- Error handling
- Link opening in browser
- Responsive layout

## Styling

Uses React Native StyleSheet with a dark theme:

**Colors:**
- Background: `#0f172a` (dark blue)
- Cards: `rgba(15, 23, 42, 0.7)`
- Borders: `#1e293b`, `#334155`
- Primary: `#6366f1` (indigo)
- Text: `#f1f5f9`, `#cbd5e1`
- Success: `#34d399` (emerald)
- Error: `#f87171` (red)

## Testing

### Manual Testing Checklist

- [ ] App launches successfully
- [ ] Claim verification works
- [ ] Results display correctly
- [ ] Links open in browser
- [ ] Keyboard doesn't obscure inputs
- [ ] Scrolling works smoothly
- [ ] Error messages appear
- [ ] Reset button works
- [ ] Preset examples work
- [ ] Dark theme displays correctly

### Testing on Devices

**iOS:**
1. Install Expo Go from App Store
2. Scan QR code from terminal
3. Test on iPhone and iPad

**Android:**
1. Install Expo Go from Play Store
2. Scan QR code from app
3. Test on different screen sizes

## Troubleshooting

### Common Issues

**Metro bundler won't start:**
```bash
npx expo start --clear
```

**Build fails:**
```bash
eas build --platform android --clear-cache
```

**Can't connect to API:**
- Check network connection
- Verify API endpoint is accessible
- Check for CORS issues (shouldn't affect mobile)

**App crashes on launch:**
- Check for TypeScript errors
- Review Expo logs
- Verify all dependencies are installed

## Documentation

- 📖 [Mobile Build Guide](../MOBILE_BUILD_GUIDE.md) - Complete build and deployment instructions
- 📖 [Asset Guide](./assets/README.md) - Icon and splash screen specifications
- 📖 [Expo Docs](https://docs.expo.dev) - Official Expo documentation
- 📖 [React Native Docs](https://reactnative.dev) - React Native documentation

## Support

For issues or questions:
1. Check the [Mobile Build Guide](../MOBILE_BUILD_GUIDE.md)
2. Review [Expo documentation](https://docs.expo.dev)
3. Join [Expo Discord](https://chat.expo.dev)
4. Contact the development team

## License

Part of the ApexSalesAI Next.js application.

---

**Version**: 1.0.0
**Last Updated**: 2024
**Maintainer**: ApexSalesAI Development Team
