# Android Setup Guide

## Option 1: Use Expo Go on Physical Android Device (Recommended - No SDK Required)

This is the easiest way to test your app on Android:

1. **Install Expo Go** on your Android phone:
   - Go to Google Play Store
   - Search for "Expo Go"
   - Install the app (make sure it's SDK 54 compatible)

2. **Connect to the same network**:
   - Make sure your phone and computer are on the same Wi-Fi network

3. **Start Expo**:
   ```bash
   cd mobile
   npm start
   ```

4. **Scan QR code**:
   - Open Expo Go app on your phone
   - Tap "Scan QR code"
   - Scan the QR code from the terminal
   - The app will load!

**No Android SDK required for this method!**

---

## Option 2: Set Up Android SDK for Emulator

If you want to use an Android emulator, you need to set up the Android SDK:

### Step 1: Install Android Studio

1. Download Android Studio from: https://developer.android.com/studio
2. Install it with default settings
3. During installation, make sure to install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)

### Step 2: Set Environment Variables

**For Windows (PowerShell):**

1. Find your Android SDK location (usually):
   ```
   C:\Users\YourUsername\AppData\Local\Android\Sdk
   ```

2. Set environment variables:
   ```powershell
   # Set ANDROID_HOME
   [System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\prisc\AppData\Local\Android\Sdk', 'User')
   
   # Add to PATH
   $currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
   $newPath = "$currentPath;C:\Users\prisc\AppData\Local\Android\Sdk\platform-tools;C:\Users\prisc\AppData\Local\Android\Sdk\tools"
   [System.Environment]::SetEnvironmentVariable('Path', $newPath, 'User')
   ```

3. **Restart your terminal/PowerShell** after setting environment variables

### Step 3: Verify Installation

```bash
# Check if adb is available
adb version

# Check Android SDK path
echo $env:ANDROID_HOME
```

### Step 4: Create Android Virtual Device (AVD)

1. Open Android Studio
2. Go to Tools → Device Manager
3. Click "Create Device"
4. Select a device (e.g., Pixel 5)
5. Select a system image (API 33 or 34 recommended)
6. Click "Finish"

### Step 5: Start Emulator and Run App

```bash
cd mobile
npm start

# In another terminal, or press 'a' in Expo
npm run android
```

---

## Quick Fix: Use Physical Device (Easiest)

If you just want to test quickly, use **Option 1** - it requires no setup!

1. Install Expo Go on your Android phone
2. Run `npm start` in the mobile directory
3. Scan the QR code with Expo Go
4. Done! ✅

---

## Troubleshooting

### If ANDROID_HOME is still not found:

1. Check if Android SDK is installed:
   - Open Android Studio
   - Go to File → Settings → Appearance & Behavior → System Settings → Android SDK
   - Note the "Android SDK Location" path

2. Set ANDROID_HOME manually:
   ```powershell
   $env:ANDROID_HOME = "C:\Users\prisc\AppData\Local\Android\Sdk"
   $env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"
   ```

3. Restart your terminal and try again

### If you get "adb not found":

Make sure `platform-tools` is in your PATH:
```powershell
$env:PATH += ";C:\Users\prisc\AppData\Local\Android\Sdk\platform-tools"
```

