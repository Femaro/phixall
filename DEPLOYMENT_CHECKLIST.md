# Phixall Deployment Checklist

Use this checklist to ensure a smooth deployment of the Phixall platform.

## 📋 Pre-Deployment Checklist

### 1. Firebase Setup
- [ ] Firebase project created
- [ ] Firebase Authentication enabled (Email/Password)
- [ ] Firestore Database created
- [ ] Firebase Storage bucket created
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Firebase initialized in project (`firebase init`)

### 2. Environment Configuration
- [ ] `.env.local` file created
- [ ] All Firebase config variables added:
  - [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
  - [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
  - [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
  - [ ] `NEXT_PUBLIC_BASE_URL`

### 3. Dependencies
- [ ] Node.js 18+ installed
- [ ] All npm packages installed (`npm install`)
- [ ] No dependency vulnerabilities (`npm audit`)

### 4. Security Rules
- [ ] `firestore.rules` file reviewed
- [ ] `storage.rules` file reviewed
- [ ] Security rules deployed to Firebase:
  ```bash
  firebase deploy --only firestore:rules
  firebase deploy --only storage
  ```

### 5. Local Testing
- [ ] App runs locally (`npm run dev`)
- [ ] Client registration works
- [ ] Artisan registration works
- [ ] Client dashboard accessible
- [ ] Artisan dashboard accessible
- [ ] Job creation works
- [ ] Wallet deposits work
- [ ] File uploads work

---

## 🚀 Deployment Steps

### Step 1: Prepare Code
```bash
# Ensure you're on the main branch
git checkout main

# Pull latest changes
git pull origin main

# Run build test
npm run build

# Fix any build errors
```

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard
1. [ ] Go to https://vercel.com
2. [ ] Click "New Project"
3. [ ] Import your GitHub repository
4. [ ] Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. [ ] Add environment variables (copy from `.env.local`)
6. [ ] Click "Deploy"

#### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Step 3: Post-Deployment Configuration

#### Update Firebase Settings
1. [ ] Go to Firebase Console → Authentication → Settings
2. [ ] Add authorized domain: `your-app.vercel.app`
3. [ ] Add production domain if using custom domain

#### Verify Deployment
- [ ] Visit production URL
- [ ] Test homepage loads
- [ ] Test user registration
- [ ] Test login
- [ ] Test all dashboards

---

## 👑 Admin Setup

### Create First Admin User

#### Method 1: Via Firebase Console
1. [ ] Register a user through the app
2. [ ] Go to Firebase Console → Firestore Database
3. [ ] Navigate to `profiles` collection
4. [ ] Find user's document (document ID = user's UID)
5. [ ] Edit document
6. [ ] Change `role` field to `"admin"`
7. [ ] Save changes
8. [ ] Logout and login again
9. [ ] Navigate to `/admin/dashboard`
10. [ ] Verify admin access

#### Method 2: Via Firestore Import
1. [ ] Create JSON file with admin profile:
```json
{
  "profiles": {
    "USER_UID_HERE": {
      "email": "admin@phixall.com",
      "name": "Admin User",
      "role": "admin",
      "status": "active",
      "createdAt": {"_seconds": 1234567890, "_nanoseconds": 0}
    }
  }
}
```
2. [ ] Import via Firebase Console

---

## 🧪 Post-Deployment Testing

### User Registration & Authentication
- [ ] Client can register
- [ ] Artisan can register
- [ ] Login works for all roles
- [ ] Logout works
- [ ] Password reset works (if implemented)

### Client Dashboard
- [ ] Dashboard loads correctly
- [ ] Can create service request
- [ ] Can upload attachments
- [ ] Can view jobs
- [ ] Wallet shows correct balance
- [ ] Can deposit funds
- [ ] Can pay for jobs
- [ ] Transaction history displays

### Artisan Dashboard
- [ ] Dashboard loads correctly
- [ ] Can toggle availability
- [ ] Can view available jobs
- [ ] Can accept jobs
- [ ] Can update job status
- [ ] Wallet shows earnings
- [ ] Can add bank details
- [ ] Can cash out (with 2.5% fee)

### Admin Dashboard
- [ ] Dashboard loads correctly
- [ ] Can view all users
- [ ] Can suspend users
- [ ] Can activate users
- [ ] Can view all jobs
- [ ] Can assign artisans to jobs
- [ ] Can set job budgets
- [ ] Can view all transactions
- [ ] Analytics display correctly

### Real-Time Features
- [ ] Job status updates in real-time
- [ ] Wallet balance updates instantly
- [ ] New jobs appear immediately
- [ ] Availability changes reflect instantly

### Security
- [ ] Non-authenticated users can't access dashboards
- [ ] Clients can't access artisan dashboard
- [ ] Artisans can't access client dashboard
- [ ] Non-admins can't access admin dashboard
- [ ] Users can't modify their own role
- [ ] Security rules are enforced

---

## 🔧 Troubleshooting

### Build Fails
```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Try build again
npm run build
```

### Environment Variables Not Working
- [ ] Check variable names (must start with `NEXT_PUBLIC_`)
- [ ] Verify values don't have quotes
- [ ] Restart dev server after changes
- [ ] In Vercel, redeploy after adding variables

### Firebase Connection Issues
- [ ] Verify Firebase config values
- [ ] Check Firebase project is active
- [ ] Ensure billing is enabled (for production)
- [ ] Check browser console for specific errors

### Security Rules Blocking Access
```bash
# Redeploy rules
firebase deploy --only firestore:rules
firebase deploy --only storage

# Check rules in Firebase Console
# Test rules in Rules Playground
```

### 404 Errors on Routes
- [ ] Ensure route folders exist
- [ ] Check for typos in folder names
- [ ] Verify `page.tsx` exists in route folders
- [ ] Clear `.next` folder and rebuild

---

## 📊 Monitoring Setup

### Firebase Console Monitoring
1. [ ] Set up alerts for:
   - Authentication failures
   - Security rule violations
   - Database read/write errors
   - Storage upload failures

2. [ ] Enable Analytics:
   - Go to Firebase Console → Analytics
   - Enable Google Analytics integration

### Vercel Monitoring
1. [ ] Enable Vercel Analytics:
   - Go to Project Settings → Analytics
   - Enable Web Analytics

2. [ ] Set up deployment notifications:
   - Configure GitHub/Slack notifications
   - Set up email alerts

---

## 🔐 Security Hardening

### Production Security Checklist
- [ ] Firestore security rules deployed
- [ ] Storage security rules deployed
- [ ] Environment variables secured (not in code)
- [ ] API keys restricted (Firebase Console)
- [ ] CORS configured correctly
- [ ] HTTPS enforced (automatic with Vercel)
- [ ] Admin role protected
- [ ] User passwords hashed (automatic with Firebase)

### Recommended Security Rules Updates
```javascript
// Consider adding rate limiting
// Consider adding IP restrictions for admin
// Consider adding 2FA for admin accounts
```

---

## 📝 Documentation Review

Before going live, ensure:
- [ ] README.md is updated
- [ ] CREATE_ADMIN.md is accessible
- [ ] FIREBASE_SETUP.md is complete
- [ ] ADMIN_DASHBOARD_GUIDE.md is accurate
- [ ] FEATURES_OVERVIEW.md is current
- [ ] API documentation exists (if applicable)

---

## 🎉 Go-Live Checklist

### Final Checks
- [ ] All tests passed
- [ ] No console errors in browser
- [ ] No build warnings
- [ ] Performance is acceptable
- [ ] Mobile responsive works
- [ ] Cross-browser tested

### Communication
- [ ] Notify stakeholders of go-live
- [ ] Share admin credentials securely
- [ ] Provide user documentation
- [ ] Set up support channel

### Backup Plan
- [ ] Previous version tagged in Git
- [ ] Rollback plan documented
- [ ] Support team on standby
- [ ] Monitoring alerts active

---

## 📞 Support Contacts

After deployment, ensure these are documented:

- **Technical Lead**: [Name/Email]
- **Firebase Admin**: [Name/Email]
- **Vercel Admin**: [Name/Email]
- **Emergency Contact**: [Phone/Email]

---

## 📈 Post-Launch Tasks

### Week 1
- [ ] Monitor error rates daily
- [ ] Check user registration rates
- [ ] Review transaction success rates
- [ ] Gather user feedback
- [ ] Fix critical issues

### Month 1
- [ ] Analyze usage patterns
- [ ] Review performance metrics
- [ ] Plan feature enhancements
- [ ] Optimize based on data
- [ ] Update documentation

---

## ✅ Sign-Off

- [ ] Technical lead approval
- [ ] Security review complete
- [ ] Performance benchmarks met
- [ ] Documentation complete
- [ ] Stakeholder approval

**Deployed By**: _______________  
**Date**: _______________  
**Version**: _______________  

---

**Congratulations on deploying Phixall! 🎉**

For ongoing support, refer to:
- [README.md](./README.md)
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- [ADMIN_DASHBOARD_GUIDE.md](./ADMIN_DASHBOARD_GUIDE.md)

