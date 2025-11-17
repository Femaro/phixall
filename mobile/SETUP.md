# Phixall Mobile App Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   cd mobile
   npm install
   ```

2. **Configure Environment Variables**

   Create a `.env` file in the `mobile` directory with your Firebase credentials:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

   Or update `app.json`:
   ```json
   {
     "expo": {
       "extra": {
         "firebaseApiKey": "...",
         "firebaseAuthDomain": "...",
         "firebaseProjectId": "...",
         "firebaseStorageBucket": "...",
         "firebaseMessagingSenderId": "...",
         "firebaseAppId": "..."
       }
     }
   }
   ```

3. **Run the App**
   ```bash
   npm start
   ```

   Then:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## Features Implemented

✅ Authentication (Login/Register)
✅ Client Dashboard
✅ Service Request Creation
✅ Job Management
✅ Wallet System
✅ Artisan Dashboard
✅ Earnings Tracking
✅ Profile Management
✅ Location Services
✅ Image Picker

## Next Steps

1. Test on physical device using Expo Go
2. Integrate payment gateway for deposits/cash out
3. Set up push notifications
4. Build production apps with EAS Build

