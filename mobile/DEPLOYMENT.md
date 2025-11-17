# Phixall Mobile App - Deployment Guide

## Current Status
✅ Mobile app is complete with all features
✅ Firebase configuration is set up
✅ Assets are in place (logo, icons, splash screens)
✅ All screens and functionality implemented

## Next Steps for Building & Deployment

### 1. **Install EAS CLI (Expo Application Services)**
EAS is the recommended way to build and deploy Expo apps.

```bash
npm install -g eas-cli
```

### 2. **Login to Expo**
```bash
eas login
```

If you don't have an Expo account, create one at https://expo.dev

### 3. **Configure EAS Build**
Initialize EAS in your project:

```bash
cd mobile
eas build:configure
```

This will create an `eas.json` file with build configurations.

### 4. **Update app.json for Production**

Before building, ensure your `app.json` has production-ready settings:

- ✅ Bundle identifier: `com.phixall.app` (iOS)
- ✅ Package name: `com.phixall.app` (Android)
- ✅ Version: `1.0.0` (increment for each release)
- ✅ Firebase config is in `extra` field

### 5. **Build for Development/Testing**

#### iOS Development Build:
```bash
eas build --platform ios --profile development
```

#### Android Development Build:
```bash
eas build --platform android --profile development
```

**Note:** For iOS, you'll need:
- Apple Developer Account ($99/year)
- Xcode installed (for local builds) or use EAS cloud builds

### 6. **Test the Build**

1. Download the build from the EAS dashboard or the link provided
2. Install on a physical device (iOS via TestFlight, Android via APK)
3. Test all features:
   - Authentication (login/register)
   - Client dashboard and service requests
   - Artisan dashboard and job acceptance
   - Job tracking and location sharing
   - Job completion forms
   - Notifications

### 7. **Build for Production**

#### iOS Production Build:
```bash
eas build --platform ios --profile production
```

#### Android Production Build:
```bash
eas build --platform android --profile production
```

### 8. **Submit to App Stores**

#### iOS (App Store):
```bash
eas submit --platform ios
```

**Requirements:**
- Apple Developer Account
- App Store Connect account
- App metadata (description, screenshots, etc.)

#### Android (Google Play Store):
```bash
eas submit --platform android
```

**Requirements:**
- Google Play Console account ($25 one-time fee)
- App metadata (description, screenshots, etc.)

### 9. **Set Up Continuous Updates (OTA Updates)**

For quick bug fixes and feature updates without app store approval:

```bash
eas update --branch production --message "Bug fixes and improvements"
```

### 10. **Environment Variables (Optional)**

For better security, move Firebase config to environment variables:

1. Create `.env` file:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

2. Install `expo-constants` and `dotenv` if needed
3. Update `config/firebase.ts` to use environment variables

## Pre-Deployment Checklist

### Code & Configuration
- [ ] All features tested and working
- [ ] No console errors or warnings
- [ ] Firebase security rules deployed
- [ ] App icons and splash screens are correct
- [ ] Logo displays correctly
- [ ] All permissions properly configured

### iOS Specific
- [ ] Bundle identifier is unique
- [ ] App Store Connect account set up
- [ ] Privacy policy URL (required for App Store)
- [ ] App Store screenshots prepared
- [ ] App description and metadata ready

### Android Specific
- [ ] Package name is unique
- [ ] Google Play Console account set up
- [ ] Privacy policy URL (required for Play Store)
- [ ] Play Store screenshots prepared
- [ ] App description and metadata ready

### Security
- [ ] Firebase rules are production-ready
- [ ] API keys are properly secured
- [ ] No hardcoded secrets in code
- [ ] User data is properly protected

## Build Profiles (eas.json example)

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

## Common Commands

```bash
# Start development server
npm start

# Build for iOS (development)
eas build --platform ios --profile development

# Build for Android (production)
eas build --platform android --profile production

# Submit to App Store
eas submit --platform ios

# Submit to Play Store
eas submit --platform android

# Check build status
eas build:list

# View build logs
eas build:view [BUILD_ID]
```

## Troubleshooting

### Build Fails
- Check EAS build logs: `eas build:view [BUILD_ID]`
- Verify all dependencies are compatible
- Ensure assets are in correct locations

### iOS Build Issues
- Verify Apple Developer account is active
- Check bundle identifier is unique
- Ensure certificates and provisioning profiles are valid

### Android Build Issues
- Verify package name is unique
- Check keystore is properly configured
- Ensure all permissions are declared

## Next Immediate Steps

1. **Install EAS CLI**: `npm install -g eas-cli`
2. **Login**: `eas login`
3. **Configure**: `eas build:configure`
4. **Test Build**: `eas build --platform android --profile preview` (Android is easier to test)
5. **Test on Device**: Install and test all features
6. **Fix Issues**: Address any bugs found
7. **Production Build**: Once tested, build for production
8. **Submit**: Submit to app stores

## Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [Google Play Console](https://play.google.com/console/)

## Estimated Timeline

- **Development Build**: 15-30 minutes per platform
- **Production Build**: 20-40 minutes per platform
- **App Store Review**: 1-3 days (iOS)
- **Play Store Review**: 1-7 days (Android)

---

**Ready to deploy?** Start with: `npm install -g eas-cli && eas login`

