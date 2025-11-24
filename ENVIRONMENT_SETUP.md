# Complete Environment Configuration Guide

Follow these steps to set up your environment variables for the Phixall platform.

## Step 1: Create `.env.local` File

In the root directory of your project, create a file named `.env.local` and add the following:

```bash
# ==========================================
# FIREBASE CONFIGURATION
# ==========================================
# Get these from: Firebase Console → Project Settings → General
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=phixall-4c0a2.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=phixall-4c0a2
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=phixall-4c0a2.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# ==========================================
# FIREBASE ADMIN SDK (Server-side)
# ==========================================
# Get this from: Firebase Console → Project Settings → Service Accounts → Generate New Private Key
# Paste the entire JSON content as a single line
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"phixall-4c0a2","private_key_id":"...","private_key":"...","client_email":"..."}

# ==========================================
# GOOGLE MAPS API
# ==========================================
# Get this from: Google Cloud Console → APIs & Services → Credentials
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# ==========================================
# SITE CONFIGURATION
# ==========================================
# Development
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Production (when deploying)
# NEXT_PUBLIC_SITE_URL=https://phixall.vercel.app

# ==========================================
# GEMINI AI (Support Bot)
# ==========================================
# Get this from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key

# ==========================================
# PAYSTACK PAYMENT GATEWAY (TEST MODE)
# ==========================================
# Your Paystack Test Keys
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_d6c5fb257b5883912ca03d6ed4a7e1540643c8f7
PAYSTACK_SECRET_KEY=sk_test_8e06da6381f45d2d662d58b759635746a7c8f799

# For Production (after business verification):
# NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key
# PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key

# ==========================================
# STRIPE (Legacy - Optional)
# ==========================================
# If you're still using Stripe, add these:
# STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_public_key
# STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Step 2: Get Missing Keys

### Firebase Keys

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project **phixall-4c0a2**
3. Click the gear icon → **Project Settings**
4. Under "Your apps" section, copy the config values
5. For Firebase Admin SDK:
   - Go to **Service Accounts** tab
   - Click "Generate New Private Key"
   - Copy the entire JSON content (remove line breaks, make it one line)

### Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Create or copy your API key
4. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API

### Gemini AI API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key"
4. Copy the generated key

## Step 3: Verify Configuration

After setting up your `.env.local` file:

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Test each integration:**
   - ✅ Authentication (Firebase Auth)
   - ✅ Database operations (Firestore)
   - ✅ Location services (Google Maps)
   - ✅ AI Support (Gemini)
   - ✅ Payments (Paystack)

## Step 4: Configure Paystack Webhook

For receiving payment notifications:

1. Go to [Paystack Dashboard](https://dashboard.paystack.com/)
2. Navigate to **Settings** → **API Keys & Webhooks**
3. Click on **Webhooks** tab
4. Add webhook URL:
   - **Local Development (using ngrok):**
     ```bash
     # Install ngrok
     npm install -g ngrok
     
     # Start ngrok
     ngrok http 3000
     
     # Use the HTTPS URL
     https://your-ngrok-url.ngrok.io/api/payments/webhook
     ```
   - **Production:**
     ```
     https://yourdomain.com/api/payments/webhook
     ```

## Step 5: Test Payment Integration

### Using Test Cards

| Purpose | Card Number | CVV | PIN | Expiry | OTP |
|---------|-------------|-----|-----|--------|-----|
| Success | 4084084084084081 | 408 | 0000 | 12/25 | 123456 |
| Success | 5060666666666666666 | 123 | 1234 | 12/25 | 123456 |
| Decline | 5060000000000000009 | 123 | 1234 | 12/25 | 123456 |

### Test the Wallet

1. Start your dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/client/wallet`
3. Click "Fund Wallet"
4. Enter an amount (minimum ₦100)
5. Click "Pay" button
6. Use test card details above
7. Complete payment
8. Verify balance updated

## Step 6: Security Checklist

- ✅ `.env.local` is in `.gitignore` (never commit it!)
- ✅ Never expose secret keys in client-side code
- ✅ Use HTTPS in production
- ✅ Verify webhook signatures
- ✅ Keep dependencies updated

## Troubleshooting

### Issue: "Firebase configuration not found"
**Solution:** Make sure all `NEXT_PUBLIC_FIREBASE_*` variables are set correctly

### Issue: "Maps API error"
**Solution:** 
1. Check if Google Maps API key is valid
2. Enable required APIs in Google Cloud Console
3. Check billing is enabled

### Issue: "Paystack: Invalid API Key"
**Solution:** Verify you're using the correct key (test vs live)

### Issue: "Webhook not receiving events"
**Solution:**
1. For local dev, make sure ngrok is running
2. Check webhook URL in Paystack dashboard
3. Verify webhook signature validation

## Environment Variables Reference

| Variable | Required | Where to Get | Purpose |
|----------|----------|--------------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ Yes | Firebase Console | Client auth |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ Yes | Firebase Console | Client auth |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ Yes | Firebase Console | Firebase project |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | ✅ Yes | Firebase Console | Server operations |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | ✅ Yes | Google Cloud | Maps & location |
| `GEMINI_API_KEY` | ⚠️ Optional | Google AI Studio | AI support bot |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | ✅ Yes | Paystack Dashboard | Payment UI |
| `PAYSTACK_SECRET_KEY` | ✅ Yes | Paystack Dashboard | Payment API |
| `NEXT_PUBLIC_SITE_URL` | ✅ Yes | Your domain | Callbacks & links |

## Quick Start Command

Once you've set up `.env.local`:

```bash
# Install dependencies (if not done)
npm install

# Run development server
npm run dev

# Open browser
# http://localhost:3000
```

## Production Deployment

When deploying to Vercel:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add all variables from `.env.local`
4. Update `NEXT_PUBLIC_SITE_URL` to your production domain
5. For Paystack, switch to live keys after business verification

---

**Need Help?** Check the following documentation:
- [Firebase Setup](./FIREBASE_SETUP.md)
- [Paystack Integration](./PAYSTACK_SETUP.md)
- [Deployment Guide](./DEPLOYMENT_CHECKLIST.md)

