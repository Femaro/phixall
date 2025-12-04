# Firebase Service Account Setup Guide

## Why You Need This

The cleanup and inspection scripts require a Firebase service account key to authenticate with Firebase Admin SDK. This allows the scripts to read and delete data from your Firebase project.

## How to Get Your Service Account Key

### Step 1: Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **phixall-4c0a2**

### Step 2: Navigate to Service Accounts
1. Click the gear icon ⚙️ next to "Project Overview"
2. Select **"Project settings"**
3. Go to the **"Service accounts"** tab

### Step 3: Generate New Private Key
1. Click **"Generate new private key"** button
2. A dialog will appear - click **"Generate key"**
3. A JSON file will be downloaded (e.g., `phixall-4c0a2-firebase-adminsdk-xxxxx.json`)

### Step 4: Save the Key File
1. Rename the downloaded file to: `serviceAccountKey.json`
2. Move it to your project root directory (same level as `package.json`)
3. **IMPORTANT**: This file contains sensitive credentials - never commit it to git!

The file should look like this:
```json
{
  "type": "service_account",
  "project_id": "phixall-4c0a2",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

## Alternative: Use Environment Variable

Instead of a file, you can set an environment variable:

**Windows (PowerShell):**
```powershell
$env:FIREBASE_SERVICE_ACCOUNT_KEY = Get-Content serviceAccountKey.json -Raw
```

**Windows (CMD):**
```cmd
set FIREBASE_SERVICE_ACCOUNT_KEY=<paste the entire JSON content>
```

**Linux/Mac:**
```bash
export FIREBASE_SERVICE_ACCOUNT_KEY="$(cat serviceAccountKey.json)"
```

## For Vercel Deployment

When adding the service account key to Vercel, you **must** preserve the `\n` characters in the `private_key` field. 

### ⚠️ Common Error: "Invalid PEM formatted message"

This error occurs when the `\n` (newline) characters in the private key are lost during copy-paste. The private key must contain literal `\n` strings, not actual line breaks.

### ✅ Solution: Use the Formatting Script

**Easiest method - Use the helper script:**

1. Make sure you have `serviceAccountKey.json` in your project root
2. Run:
   ```bash
   node scripts/format-service-account-for-vercel.js
   ```
3. Copy the output (single-line JSON)
4. Paste it into Vercel's `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable

### Manual Method (if script doesn't work)

1. Open your `serviceAccountKey.json` file
2. Use a JSON minifier that **preserves escape sequences**:
   - Online: https://jsonformatter.org/json-minify
   - Or use: `node -e "console.log(JSON.stringify(require('./serviceAccountKey.json')))"`
3. Copy the minified output (should be one line)
4. Verify the `private_key` field contains `\\n` (double backslash + n)
5. Paste into Vercel

### Verify in Vercel

After adding the variable, check the diagnostic endpoint:
```
https://your-domain.vercel.app/api/admin/check-config
```

It should show `"status": "success"` if configured correctly.

## Verify Setup

After setting up the service account key, verify it works:

```bash
npm run inspect
```

This should show your Firebase data without errors.

## Troubleshooting

### Error: "Invalid JWT: Token must be a short-lived token"
- **Cause**: Server time is not synced or the key is expired
- **Solution**: 
  1. Sync your system time
  2. Generate a new service account key
  3. Ensure the key file is valid JSON

### Error: "UNAUTHENTICATED"
- **Cause**: Invalid credentials or missing permissions
- **Solution**:
  1. Verify the service account key file exists and is valid
  2. Check that the key hasn't been revoked in Firebase Console
  3. Generate a new key if needed

### Error: "Cannot find module 'serviceAccountKey.json'"
- **Cause**: File not in the correct location
- **Solution**: Ensure `serviceAccountKey.json` is in the project root directory

## Security Notes

⚠️ **IMPORTANT SECURITY REMINDERS:**

1. **Never commit** `serviceAccountKey.json` to version control
2. The `.gitignore` file already excludes this file
3. If you accidentally commit it, immediately:
   - Revoke the key in Firebase Console
   - Generate a new key
   - Remove it from git history
4. Only share this key with trusted team members
5. Rotate keys periodically for security

## Next Steps

Once the service account is set up:
1. Run `npm run inspect` to see what data exists
2. Run `npm run cleanup:dry-run` to preview what would be deleted
3. Run `npm run cleanup:all` to perform the full cleanup


