# Vercel Deployment Fixes

## Issues Fixed

### 1. **crypto-js SSR Issue**
- **Problem**: `crypto-js` was being imported in a client-side file, causing SSR (Server-Side Rendering) errors
- **Solution**: 
  - Made `crypto-js` import conditional (client-side only)
  - Updated API route to use Node.js built-in `crypto` module instead
  - Mobile component now has its own self-contained QR code generation

### 2. **Mobile Directory in Build**
- **Problem**: Mobile directory might be included in Next.js build, causing issues
- **Solution**: 
  - Updated `next.config.ts` to exclude mobile from webpack build
  - Mobile is already excluded in `tsconfig.json`

### 3. **API Route Dependencies**
- **Problem**: API route was importing client-side verification functions
- **Solution**: 
  - API route now uses Node.js `crypto` for server-side token verification
  - Removed dependency on client-side `verifyQRCodeForJob` function

## Files Modified

1. **`src/lib/qrCodeVerification.ts`**
   - Made `crypto-js` import conditional (client-side only)
   - Added error handling for missing CryptoJS

2. **`src/app/api/jobs/verify-qr/route.ts`**
   - Uses Node.js `crypto` module for server-side verification
   - Removed dependency on client-side verification functions

3. **`mobile/components/QRCodeDisplay.tsx`**
   - Self-contained QR code generation (doesn't import from shared lib)
   - Uses `crypto-js` directly (mobile app, not Next.js)

4. **`next.config.ts`**
   - Added webpack config to exclude mobile directory
   - Added fallbacks for Node.js modules in client bundle

## Verification

To verify the build works:

```bash
npm run build
```

If the build succeeds locally, it should work on Vercel.

## Environment Variables

Make sure these are set in Vercel:

- `NEXT_PUBLIC_QR_SECRET_KEY` (optional, has default)
- All Firebase environment variables
- All other required environment variables

## Next Steps

1. Push changes to trigger Vercel deployment
2. Check Vercel build logs for any remaining errors
3. Verify the deployment succeeds

## Important Note

If Vercel is still showing errors from an older commit:
- The latest fix is in commit `b6bf0df` (or later)
- Make sure Vercel is building the latest commit
- You may need to manually trigger a redeployment in Vercel dashboard
- Or wait for Vercel to automatically detect the new commit

