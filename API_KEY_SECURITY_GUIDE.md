# API Key Security Guide

## ⚠️ Security Alert: Public API Key

You received a warning because your Google API key is publicly accessible. While Firebase API keys are **meant to be public** (they're used in client-side code), they **MUST be restricted** to prevent abuse and unauthorized usage.

## 🔒 Why This Matters

Without restrictions, anyone can:
- Use your API key for their own projects
- Exceed your quota limits (costing you money)
- Make unauthorized requests to your Firebase project

## ✅ Solution: Restrict Your API Keys

### Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/apis/credentials?project=phixall-4c0a2
2. Find your API key: `AIzaSyAEoieAgpx2ExNauC1IoauAZV-UsXh1MTg`
3. Click on the key to edit it

### Step 2: Restrict the API Key

#### For Firebase API Key (Web Application):

1. **Application restrictions:**
   - Select "HTTP referrers (web sites)"
   - Click "Add an item"
   - Add your domains:
     ```
     https://phixall.com/*
     https://*.phixall.com/*
     https://phixall-*.vercel.app/*
     http://localhost:3000/*
     http://127.0.0.1:3000/*
     ```

2. **API restrictions:**
   - Select "Restrict key"
   - Choose these APIs:
     - ✅ Firebase Authentication API
     - ✅ Cloud Firestore API
     - ✅ Firebase Storage API
     - ✅ Firebase Realtime Database API (if used)
   - Click "Save"

#### For Google Maps API Key (if separate):

1. **Application restrictions:**
   - Select "HTTP referrers (web sites)"
   - Add the same domains as above

2. **API restrictions:**
   - Select "Restrict key"
   - Choose:
     - ✅ Maps JavaScript API
     - ✅ Places API (if used)
     - ✅ Geocoding API (if used)
   - Click "Save"

### Step 3: Create Separate Keys (Recommended)

**Best Practice:** Create separate API keys for different purposes:

1. **Firebase Web Key** - For web application
2. **Firebase Mobile Key** - For mobile apps (with Android/iOS restrictions)
3. **Google Maps Key** - For maps functionality

#### Creating a Mobile-Specific Key:

1. Click "Create Credentials" → "API Key"
2. Name it: "Firebase Mobile App Key"
3. **Application restrictions:**
   - Select "Android apps" or "iOS apps"
   - For Android: Add package name `com.phixall.app` and SHA-1 certificate fingerprint
   - For iOS: Add bundle ID `com.phixall.app`
4. **API restrictions:** Same as Firebase APIs above

### Step 4: Update Your Code

After creating restricted keys, update your environment variables:

#### For Web (.env.local):
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_restricted_web_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_restricted_maps_key
```

#### For Mobile (app.json):
```json
{
  "extra": {
    "firebaseApiKey": "your_restricted_mobile_key"
  },
  "android": {
    "config": {
      "googleMaps": {
        "apiKey": "your_restricted_maps_key"
      }
    }
  }
}
```

### Step 5: Set Quota Limits (Additional Protection)

1. Go to: https://console.cloud.google.com/apis/api/identitytoolkit.googleapis.com/quotas
2. Set daily quotas for:
   - Authentication requests
   - Firestore reads/writes
   - Storage uploads

## 🛡️ Additional Security Measures

### 1. Enable Firebase App Check (Recommended)

Firebase App Check helps protect your backend resources from abuse:

```bash
# Install App Check
npm install firebase-admin
```

Then enable it in Firebase Console:
- Go to Firebase Console → App Check
- Register your apps
- Enable enforcement for Firestore and Storage

### 2. Monitor API Usage

1. Go to: https://console.cloud.google.com/apis/dashboard?project=phixall-4c0a2
2. Monitor:
   - API requests per day
   - Quota usage
   - Error rates

### 3. Set Up Alerts

1. Go to: https://console.cloud.google.com/monitoring/alerting?project=phixall-4c0a2
2. Create alerts for:
   - Unusual API usage spikes
   - Quota threshold warnings
   - Authentication failures

## 📋 Quick Checklist

- [ ] Restrict Firebase API key to your domains
- [ ] Restrict Google Maps API key to your domains
- [ ] Create separate keys for web and mobile
- [ ] Set API restrictions (only allow needed APIs)
- [ ] Set quota limits
- [ ] Enable Firebase App Check
- [ ] Monitor API usage regularly
- [ ] Set up usage alerts

## 🔗 Useful Links

- [Google Cloud Console - API Credentials](https://console.cloud.google.com/apis/credentials?project=phixall-4c0a2)
- [Firebase App Check Documentation](https://firebase.google.com/docs/app-check)
- [API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)

## ⚠️ Important Notes

1. **Never commit API keys to public repositories** - Use environment variables
2. **Rotate keys regularly** - If a key is compromised, create a new one
3. **Use different keys for dev/staging/production**
4. **Monitor usage** - Unusual spikes may indicate abuse

---

**After completing these steps, your API keys will be secure and the Google warning should disappear.**



