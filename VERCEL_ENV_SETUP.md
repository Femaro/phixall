# Vercel Environment Variables Setup

## Issue: Login/Registration Works Locally but Not on Vercel

### 🎯 Root Cause:
Your Vercel deployment is **missing Firebase environment variables**. The build logs showed:
```
Missing Firebase env vars. Set NEXT_PUBLIC_FIREBASE_*
```

This means Firebase can't connect in production!

---

## 🚀 Fix: Add Environment Variables to Vercel

### **Method 1: Via Vercel Dashboard (Easiest)**

#### **Step 1: Go to Vercel Project Settings**
1. Visit: https://vercel.com/femaros-projects/phixall-web/settings/environment-variables
2. Or navigate manually:
   - Go to https://vercel.com
   - Click on your `phixall-web` project
   - Click **Settings** (top menu)
   - Click **Environment Variables** (left sidebar)

#### **Step 2: Add All Firebase Variables**

Add each of these variables one by one:

| Variable Name | Value (from your .env.local) | Environment |
|---------------|------------------------------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyAEoieAgpx2ExNauC1IoauAZV-UsXh1MTg` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `phixall-4c0a2.firebaseapp.com` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `phixall-4c0a2` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `phixall-4c0a2.firebasestorage.app` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `116906563573` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:116906563573:web:4ac86209e77ed2c98432bc` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-2BXK7BFXF3` | Production, Preview, Development |

**For each variable:**
1. Click **Add New**
2. Enter the **Name** (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`)
3. Enter the **Value** (e.g., `AIzaSyAEoieAgpx2ExNauC1IoauAZV-UsXh1MTg`)
4. Select all three environments: ✅ Production ✅ Preview ✅ Development
5. Click **Save**
6. Repeat for all 7 variables

#### **Step 3: Redeploy**
After adding all variables, you need to redeploy:
- Click **Deployments** (top menu)
- Find the latest deployment
- Click the three dots (•••) on the right
- Click **Redeploy**
- Wait for the build to complete

---

### **Method 2: Via Vercel CLI (Faster)**

Run these commands in your terminal:

```bash
cd C:\Users\prisc\Downloads\Phixall

# Set environment variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
# When prompted, paste: AIzaSyAEoieAgpx2ExNauC1IoauAZV-UsXh1MTg

vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
# When prompted, paste: phixall-4c0a2.firebaseapp.com

vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
# When prompted, paste: phixall-4c0a2

vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
# When prompted, paste: phixall-4c0a2.firebasestorage.app

vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production
# When prompted, paste: 116906563573

vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production
# When prompted, paste: 1:116906563573:web:4ac86209e77ed2c98432bc

vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID production
# When prompted, paste: G-2BXK7BFXF3

# After adding all variables, redeploy
vercel --prod
```

---

### **Method 3: Automated Script (Quickest)**

I can create a script to set all variables at once. But first, let's use Method 1 or 2 above.

---

## ⚠️ Important: Firebase Domain Whitelisting

After adding environment variables, you also need to whitelist your Vercel domain in Firebase:

### **Step 1: Get Your Vercel Domain**
Your production URL is:
```
https://phixall-35p43jlhs-femaros-projects.vercel.app
```

Or you might have a custom domain like:
```
https://phixall-web.vercel.app
```

### **Step 2: Add Domain to Firebase**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `phixall-4c0a2`
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain**
5. Add your Vercel domain (without https://):
   - `phixall-35p43jlhs-femaros-projects.vercel.app`
   - And if you have a custom domain, add that too
6. Click **Add**

**Note:** Firebase might already have `*.vercel.app` whitelisted, but it's good to add your specific domain.

---

## ✅ Verification Steps

After setting up environment variables and redeploying:

### **1. Check Build Logs**
1. Go to Vercel Dashboard → Deployments
2. Click on the latest deployment
3. Look at the build logs
4. You should **NOT** see: "Missing Firebase env vars"

### **2. Test on Production**
1. Visit your Vercel URL: `https://phixall-35p43jlhs-femaros-projects.vercel.app/register`
2. Try creating an account
3. It should work now! ✅

### **3. Check Browser Console**
If it still doesn't work:
1. Open DevTools (F12) on your Vercel URL
2. Go to Console tab
3. Look for Firebase errors
4. Share any error messages you see

---

## 🎯 Quick Checklist

- [ ] Add all 7 Firebase environment variables to Vercel
- [ ] Make sure to select all three environments (Production, Preview, Development)
- [ ] Redeploy the application
- [ ] Add Vercel domain to Firebase Authorized domains
- [ ] Test registration on production URL
- [ ] Test login on production URL
- [ ] Verify no "Missing Firebase env vars" in build logs

---

## 🐛 Troubleshooting

### Issue: Still seeing "Missing Firebase env vars" after adding them
**Solution:** You need to **redeploy** after adding environment variables. They're not automatically applied to existing deployments.

### Issue: "auth/unauthorized-domain" error
**Solution:** Add your Vercel domain to Firebase Authorized domains (see Step 2 above).

### Issue: Variables not working after redeploy
**Solution:** 
1. Make sure variable names are EXACTLY correct (case-sensitive)
2. Make sure you selected all environments when adding them
3. Try pulling the variables locally to verify:
   ```bash
   vercel env pull .env.vercel
   cat .env.vercel
   ```

### Issue: Different error on Vercel vs localhost
**Solution:** Check browser console on the Vercel URL. Network issues, CORS, or domain restrictions might be the cause.

---

## 📊 Environment Variables Summary

You need to add these 7 variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAEoieAgpx2ExNauC1IoauAZV-UsXh1MTg
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=phixall-4c0a2.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=phixall-4c0a2
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=phixall-4c0a2.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=116906563573
NEXT_PUBLIC_FIREBASE_APP_ID=1:116906563573:web:4ac86209e77ed2c98432bc
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-2BXK7BFXF3
```

**Important:** These are PUBLIC variables (hence `NEXT_PUBLIC_` prefix). They're safe to expose in the browser because Firebase uses security rules to protect your data.

---

## 🚀 After Fix

Once this is set up, your Vercel deployment will:
- ✅ Connect to Firebase properly
- ✅ Allow user registration
- ✅ Allow user login
- ✅ Access Firestore data
- ✅ Work exactly like localhost

---

## 🆘 Need Help?

If you're still having issues after following these steps:

1. Share the **exact error message** from the Vercel app
2. Share the **browser console logs** (F12 → Console)
3. Share a **screenshot** of your Vercel environment variables page
4. Confirm you've **redeployed** after adding the variables

---

**Next step:** Go to Method 1 above and add those environment variables! 🎯

---

## US visitors: phixall.com → phixall.us (edge redirect)

Production **Vercel** deployments can redirect **US** visitors from `phixall.com` to `https://phixall.us` (path and query preserved, **307**). Logic lives in [`src/middleware.ts`](src/middleware.ts).

| Variable | Purpose |
|----------|---------|
| `US_REDIRECT_ALLOWLIST_IPS` | Comma-separated client IPs (first `X-Forwarded-For` hop) that **never** receive the redirect. |
| `US_REDIRECT_BYPASS_SECRET` | If set, visiting `https://phixall.com/...?bypass_geo=<secret>` sets an HttpOnly cookie so the redirect is skipped (90 days). Rotate the secret if it leaks. |
| `ENABLE_US_DOTCOM_REDIRECT` | When `VERCEL_ENV` is **`preview`**, redirects are **disabled** unless this is **`true`**. **Production** does not need this variable: US visitors on `phixall.com` receive the redirect. |
| `PHIXALL_US_SITE_URL` | Optional. Canonical origin for enterprise metadata and sitemap URLs (default `https://phixall.us`). No trailing slash. |

**Behavior notes**

- **Local `next dev`**: redirect is **disabled** (`NODE_ENV=development`). `request.geo` is usually absent locally anyway.
- **Preview**: redirect is **off** unless `ENABLE_US_DOTCOM_REDIRECT=true`.
- **Troubleshooting**: use an allowlisted IP, the bypass query + cookie, or preview with `ENABLE_US_DOTCOM_REDIRECT=true`.

---

## Enterprise US SEO (phixall.us) and Search Console

- **Sitemap**: [`src/app/sitemap.ts`](src/app/sitemap.ts) lists main marketing URLs and full `https://phixall.us/us/...` enterprise routes. Submit **`https://phixall.us/sitemap.xml`** in the **phixall.us** Google Search Console property (and the marketing URL in the **phixall.com** property if needed).
- **Verification**: Add both **Domain** or **URL-prefix** properties for `phixall.com` and `phixall.us` in [Google Search Console](https://search.google.com/search-console), then submit sitemaps per property.
- **Hreflang / alternates**: Root metadata and [`src/app/us/layout.tsx`](src/app/us/layout.tsx) expose `en-US` vs `x-default` language alternates; **JSON-LD** (`Organization` + `WebSite`) is rendered in the US layout via [`src/components/us/PhixallUsJsonLd.tsx`](src/components/us/PhixallUsJsonLd.tsx).
- **Env**: Set `NEXT_PUBLIC_SITE_URL` to the primary marketing origin (e.g. `https://phixall.com`) and `PHIXALL_US_SITE_URL` to `https://phixall.us` in production so metadata and sitemap URLs match live hosts.

