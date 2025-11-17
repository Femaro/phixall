# Build Troubleshooting Guide

## Build Failed - Next Steps

Your build failed with ID: `e9af190a-9e58-42c8-bff7-d24fb089e3e1`

### 1. Check Build Logs

View the detailed build logs at:
**https://expo.dev/accounts/medullaz/projects/phixall-mobile/builds/e9af190a-9e58-42c8-bff7-d24fb089e3e1**

The logs will show the exact error. Common issues:

### 2. Common Build Errors & Fixes

#### A. JavaScript/TypeScript Errors
```bash
# Test bundling locally
npx expo export --platform android
```

#### B. Missing Dependencies
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
```

#### C. Asset Issues
- Verify all assets exist in `mobile/assets/`:
  - ✅ icon.png
  - ✅ splash.png
  - ✅ adaptive-icon.png
  - ✅ logo.png
  - ✅ notification-icon.png

#### D. React Native Maps Configuration
- For Android, Google Maps API key is configured in `app.json` → `android.config.googleMaps.apiKey`
- For iOS, add to `app.json` → `ios.config.googleMapsApiKey`

#### E. TypeScript Errors
```bash
# Check for TypeScript errors
npx tsc --noEmit
```

### 3. Try Building Again

After fixing issues:

```bash
cd mobile
eas build --platform android --profile preview --clear-cache
```

### 4. Quick Fixes Applied

✅ Removed incorrect react-native-maps plugin config
✅ Added Google Maps API key to Android config
✅ Cleaned up permissions (removed RECORD_AUDIO if not needed)

### 5. Next Steps

1. **Check the build logs URL** to see the specific error
2. **Fix the error** based on logs
3. **Rebuild** with `--clear-cache` flag

### 6. Alternative: Local Build Test

Test locally first:
```bash
npx expo run:android --variant release
```

If local build works, the EAS build should work too.

---

**Please share the error message from the build logs so I can provide a specific fix!**

