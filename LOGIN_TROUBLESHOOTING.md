# Login Troubleshooting Guide

## Issue: "Invalid email or password" Error

### ✅ Diagnosis Complete

Your Firebase configuration is **working correctly**. The error occurs because you're trying to log in with credentials that don't exist in the Firebase Authentication system yet.

---

## 🚀 Quick Fix: Create a User Account

### Method 1: Register Through the App (Easiest)

1. **Stop the dev server if running** (Ctrl+C in terminal)

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Navigate to the registration page:**
   ```
   http://localhost:3000/register
   ```

4. **Fill in the form:**
   - **Name**: Your name
   - **Email**: your@email.com
   - **Password**: At least 6 characters
   - **Confirm Password**: Same as above
   - **I am a**: Select "Client" or "Artisan"

5. **Click "Create Account"**

6. **You'll be automatically logged in and redirected to your dashboard!**

---

### Method 2: Create via Firebase Console

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/
   - Select project: `phixall-4c0a2`

2. **Create Authentication User:**
   - Navigate to: **Authentication** → **Users**
   - Click **Add user**
   - Enter:
     - Email: `your@email.com`
     - Password: `your-password`
   - Click **Add user**
   - Copy the **UID** (you'll need it in step 3)

3. **Create Firestore Profile:**
   - Navigate to: **Firestore Database**
   - Click on **profiles** collection (create it if it doesn't exist)
   - Click **Add document**
   - Document ID: Paste the **UID** from step 2
   - Add fields:
     ```
     email: "your@email.com" (string)
     name: "Your Name" (string)
     role: "client" (string) 
     createdAt: [current timestamp] (timestamp)
     ```
     **Note**: For role, use one of: `"client"`, `"artisan"`, or `"admin"`
   - Click **Save**

4. **Now you can log in!**

---

## 🔐 Creating an Admin User

To create an admin user (for accessing `/admin/dashboard`):

### Via Registration Page:
The registration page only allows "client" or "artisan" roles. To create an admin:

1. First, register as a client at `http://localhost:3000/register`
2. Then go to Firebase Console → Firestore Database
3. Find your document in the `profiles` collection
4. Edit the document and change `role` from `"client"` to `"admin"`
5. Log out and log back in
6. You'll now be redirected to `/admin/dashboard`

### Via Firebase Console:
Follow **Method 2** above, but set `role: "admin"` in step 3.

---

## 📋 Test Credentials Template

Here's a template for creating test users:

### Test Client:
- Email: `client@phixall.com`
- Password: `client123`
- Role: `client`

### Test Artisan:
- Email: `artisan@phixall.com`
- Password: `artisan123`
- Role: `artisan`

### Test Admin:
- Email: `admin@phixall.com`
- Password: `admin123`
- Role: `admin`

---

## 🔍 Verify Firebase Configuration

Your current Firebase config (from `.env.local`):
```
✓ API Key: AIzaSyAEoie... (configured)
✓ Auth Domain: phixall-4c0a2.firebaseapp.com
✓ Project ID: phixall-4c0a2
✓ Storage Bucket: phixall-4c0a2.firebasestorage.app
✓ Messaging Sender ID: 116906563573
✓ App ID: 1:116906563573:web:4ac86209e77ed2c98432bc
```

---

## 🐛 Additional Debugging

If you're still having issues after creating an account:

### 1. Check Browser Console
- Open DevTools (F12)
- Go to Console tab
- Look for Firebase errors
- Share any error messages you see

### 2. Check Firebase Authentication is Enabled
- Go to Firebase Console
- Navigate to **Authentication**
- Click **Sign-in method** tab
- Ensure **Email/Password** provider is **Enabled**
- If not, click on it and enable it

### 3. Clear Browser Cache
- Sometimes cached Firebase state causes issues
- Clear browser cache and cookies
- Try logging in again

### 4. Check Network Tab
- Open DevTools → Network tab
- Try logging in
- Look for failed requests to Firebase
- Check if there are CORS errors

---

## ✅ Success Checklist

After creating an account, you should be able to:

- [ ] Log in successfully
- [ ] See your dashboard (client/artisan/admin based on role)
- [ ] Navigate without "Invalid email or password" errors
- [ ] See your name/email in the dashboard

---

## 🆘 Still Having Issues?

If you've followed all steps and still can't log in:

1. **Check the dev server is running:**
   ```bash
   npm run dev
   ```

2. **Verify you're on localhost:3000:**
   ```
   http://localhost:3000/login
   ```

3. **Check Firebase project status:**
   - Go to Firebase Console
   - Check if project is active (no billing issues, etc.)

4. **Share specific error details:**
   - Error message
   - Browser console logs
   - Steps you took
   - Which method you used to create the account

---

## 🎯 Next Steps After Login

Once logged in successfully:

### As Client:
- Request services
- Track jobs
- Manage wallet
- View transaction history

### As Artisan:
- View available jobs
- Accept service requests
- Track earnings
- Manage profile

### As Admin:
- Manage all users
- Create and assign jobs
- Handle billing
- View analytics

---

**Need the complete admin setup guide?** See `ADMIN_DASHBOARD_GUIDE.md`

