# Fix Firebase Permissions - URGENT

Your admin dashboard can't load data because of **missing Firestore security rules**.

## 🚨 Quick Fix (5 minutes)

### Step 1: Go to Firebase Console
1. Open: https://console.firebase.google.com
2. Select project: **phixall-dcb15**

### Step 2: Update Firestore Rules
1. Click **Firestore Database** in left sidebar
2. Click the **Rules** tab at the top
3. You'll see a code editor with current rules
4. **Delete everything** in the editor
5. **Copy and paste** the ENTIRE contents from your `firestore.rules` file
   - File location: `C:\Users\prisc\Downloads\Phixall\firestore.rules`
6. Click **Publish** button

### Step 3: Test
1. Refresh your admin dashboard at `http://localhost:3000/admin/dashboard`
2. The permission errors should be gone
3. You should see clients and data loading

---

## What the Rules Do

The updated rules allow:
- ✅ **Admins** to read ALL collections (profiles, jobs, wallets, transactions, resources, bills)
- ✅ **Clients** to read their own data and create jobs
- ✅ **Artisans** to see available jobs and manage assigned jobs
- ✅ **Role-based security** - users can't see other users' data
- ✅ **Resources & Bills** - admin-only management

---

## Alternative: Temporary Open Rules (NOT RECOMMENDED for production)

If you just want to test quickly, use these **temporary** rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **WARNING**: These rules allow ANY authenticated user to read/write EVERYTHING. Use only for testing!

---

## After Fixing

Once rules are published:
1. Your admin dashboard will load all data
2. Clients will appear in the user list
3. No more permission errors in console
4. Everything will work properly

---

## Need Help?

If you still see errors after updating rules:
1. Check browser console for new error messages
2. Verify the user you're logged in as has `role: "admin"` in Firestore
3. Make sure you clicked "Publish" after pasting the rules
4. Try logging out and back in

