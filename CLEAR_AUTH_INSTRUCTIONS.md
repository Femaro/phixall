# Clear Authentication & Login with Test Accounts

## Problem
After cleaning Firebase data, old authentication sessions don't have profiles, causing permission errors.

## Solution: Clear Browser Storage

### Method 1: Use Browser DevTools (Recommended)

1. **Open your app in browser** (http://localhost:3000)

2. **Open DevTools:**
   - Windows: `F12` or `Ctrl + Shift + I`
   - Mac: `Cmd + Option + I`

3. **Go to Application tab** (Chrome/Edge) or **Storage tab** (Firefox)

4. **Clear Storage:**
   - Click "Storage" in the left sidebar
   - Under "Storage", click "Clear site data"
   - Click "Clear site data" button
   
   **OR manually delete:**
   - Expand "Local Storage" → Click your localhost URL → Right-click → Clear
   - Expand "Session Storage" → Click your localhost URL → Right-click → Clear
   - Expand "IndexedDB" → Delete all Firebase entries

5. **Refresh the page** (`F5` or `Ctrl + R`)

6. **You should now see the login page**

### Method 2: Logout via Console

If you're on the app and can access the browser console:

1. Open browser DevTools Console (`F12`)
2. Run this command:
```javascript
localStorage.clear();
sessionStorage.clear();
indexedDB.deleteDatabase('firebaseLocalStorageDb');
location.reload();
```

### Method 3: Incognito/Private Window

1. **Open incognito window:**
   - Chrome/Edge: `Ctrl + Shift + N`
   - Firefox: `Ctrl + Shift + P`
   
2. **Navigate to** http://localhost:3000

3. **No cached auth** - fresh login!

## Test Accounts (Already Created)

### CLIENT (for testing payments)
```
Email: client@test.com
Password: Client@12345
Wallet: ₦10,000 (ready for testing)
```

### PHIXER (for accepting jobs)
```
Email: phixer@test.com
Password: Phixer@12345
Status: Pre-approved, ready to work
```

### ADMIN (for managing platform)
```
Email: admin@phixall.com
Password: Admin@12345
Access: Full administrative control
```

## Verify It's Working

After logging in, you should:
- ✅ See your dashboard (no permission errors)
- ✅ See your role displayed correctly
- ✅ Console shows no Firebase errors
- ✅ Can access your data (jobs, wallet, etc.)

## If Still Getting Errors

1. **Check you're using the correct test account emails** (not your old accounts)
2. **Verify test users were created** - Run: `npm run inspect`
3. **Check browser console** for specific error messages
4. **Try different browser** to rule out extension conflicts

## Create More Test Users

If you need additional test accounts, re-run:
```bash
npm run setup:test-users
```

Or modify `scripts/create-test-users.js` to add custom users.


