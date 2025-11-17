# Phixall Mobile App

React Native mobile application for the Phixall facility management platform, built with Expo.

## Features

### Client Features
- ✅ User authentication (Login/Register)
- ✅ Service request creation with photos and location
- ✅ Job tracking and management
- ✅ Wallet management and deposits
- ✅ Transaction history
- ✅ Profile management

### Artisan Features
- ✅ Artisan onboarding
- ✅ Job browsing and acceptance
- ✅ Earnings tracking
- ✅ Cash out functionality
- ✅ Availability toggle
- ✅ Job management

### Admin Features
- ✅ Admin dashboard (basic - full features on web)

## Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Studio (for Android)
- Firebase project (same as web app)

## Setup

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure Firebase

Create a `.env` file in the `mobile` directory:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Or update `app.json` with your Firebase config in the `extra` field.

### 3. Run the App

```bash
# Start Expo development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web (for testing)
npm run web
```

## Project Structure

```
mobile/
├── app/
│   ├── (auth)/          # Authentication screens
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── onboarding.tsx
│   ├── (tabs)/          # Main app screens
│   │   ├── client.tsx    # Client dashboard
│   │   ├── request.tsx   # Service request
│   │   ├── jobs.tsx      # Job listings
│   │   ├── wallet.tsx    # Wallet management
│   │   ├── profile.tsx   # User profile
│   │   ├── artisan.tsx   # Artisan dashboard
│   │   ├── earnings.tsx  # Earnings tracking
│   │   └── admin.tsx     # Admin dashboard
│   └── _layout.tsx       # Root layout
├── config/
│   └── firebase.ts       # Firebase configuration
├── hooks/
│   └── useAuthState.ts   # Auth state hook
├── app.json              # Expo configuration
├── package.json
└── tsconfig.json
```

## Key Features

### Authentication
- Email/password authentication
- Role-based routing (Client/Artisan/Admin)
- Persistent sessions with AsyncStorage

### Service Requests
- Category selection
- Photo attachments
- Location services (current location or manual)
- Real-time job status updates

### Wallet System
- Balance display
- Deposit functionality (requires payment gateway integration)
- Transaction history
- Cash out for artisans

### Real-time Updates
- Firestore real-time listeners
- Automatic UI updates
- Pull-to-refresh

## Mobile-Specific Features

### Location Services
- Current location detection
- Reverse geocoding for addresses
- Location permissions handling

### Image Picker
- Photo selection from gallery
- Multiple image support
- Image upload to Firebase Storage

### Push Notifications
- Configured for Expo notifications
- Ready for job alerts and updates

## Building for Production

### iOS

```bash
# Build for iOS
eas build --platform ios

# Or use Expo build
expo build:ios
```

### Android

```bash
# Build for Android
eas build --platform android

# Or use Expo build
expo build:android
```

## Environment Variables

The app uses Expo's environment variable system. Set variables in `.env` or configure in `app.json`:

```json
{
  "expo": {
    "extra": {
      "firebaseApiKey": "...",
      "firebaseAuthDomain": "...",
      // ... other config
    }
  }
}
```

## Firebase Integration

The mobile app uses the same Firebase project as the web app:
- Same Firestore database
- Same authentication system
- Same storage bucket
- Same security rules

## Permissions

The app requires the following permissions:
- **Location**: For service request location
- **Camera/Gallery**: For photo attachments
- **Notifications**: For job alerts (optional)

## Known Limitations

1. **Payment Integration**: Deposit and cash out require payment gateway integration (Stripe/Paystack)
2. **Admin Features**: Full admin features are available on web only
3. **Real-time Tracking**: Artisan location tracking requires additional setup
4. **Push Notifications**: Requires Expo push notification service setup

## Troubleshooting

### Firebase Connection Issues
- Verify environment variables are set correctly
- Check Firebase project configuration
- Ensure security rules allow mobile app access

### Location Not Working
- Check device permissions
- Verify location services are enabled
- Test on physical device (simulator may have issues)

### Image Upload Fails
- Check Firebase Storage rules
- Verify storage bucket configuration
- Check file size limits

## Development Tips

1. Use Expo Go app for quick testing on physical devices
2. Enable remote debugging for better error tracking
3. Use React Native Debugger for advanced debugging
4. Test on both iOS and Android for compatibility

## Next Steps

- [ ] Integrate payment gateway (Stripe/Paystack)
- [ ] Add push notifications
- [ ] Implement real-time artisan tracking
- [ ] Add in-app messaging
- [ ] Enhance admin features
- [ ] Add offline support
- [ ] Implement deep linking

## Support

For issues or questions, refer to the main project README or contact support.

