# Firebase Setup Guide

This guide will help you set up Firebase security rules for the Phixall application.

## Prerequisites

- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project created at https://console.firebase.google.com
- Firebase initialized in your project: `firebase init`

## Deploy Security Rules

### 1. Firestore Security Rules

Deploy the Firestore rules to secure your database:

```bash
firebase deploy --only firestore:rules
```

The `firestore.rules` file includes:
- Role-based access control (admin, client, artisan)
- User profile protection
- Job management permissions
- Wallet and transaction security
- Location tracking rules

### 2. Storage Security Rules

Deploy the Storage rules to secure file uploads:

```bash
firebase deploy --only storage
```

The `storage.rules` file includes:
- Job attachment uploads (10MB limit)
- Profile picture uploads (5MB limit)
- Admin-only uploads folder
- Public read access for profile pictures

### 3. Deploy All Rules at Once

```bash
firebase deploy --only firestore:rules,storage
```

## Security Rules Overview

### Firestore Rules

#### Profiles Collection (`/profiles/{userId}`)
- **Create**: Users can create their own profile
- **Read**: Users can read their own profile, admins can read all
- **Update**: Users can update their profile (except role), admins can update any
- **Delete**: Only admins can delete profiles

#### Jobs Collection (`/jobs/{jobId}`)
- **Create**: Clients and admins can create jobs
- **Read**: Job owner, assigned artisan, and admins can read; artisans can see available jobs
- **Update**: Job owner, assigned artisan, and admins can update
- **Delete**: Job owner and admins can delete

#### Wallets Collection (`/wallets/{userId}`)
- **Read**: Wallet owner and admins can read
- **Create/Update**: Wallet owner and admins can modify
- **Delete**: Only admins can delete

#### Transactions Collection (`/transactions/{transactionId}`)
- **Create**: Any authenticated user can create
- **Read**: Transaction owner and admins can read
- **Update/Delete**: Only admins can modify

### Storage Rules

#### Job Attachments (`/jobs/{jobId}/{filename}`)
- Max size: 10MB
- Authenticated users can upload
- Anyone authenticated can read
- Authenticated users and admins can delete

#### Profile Pictures (`/profiles/{userId}/{filename}`)
- Max size: 5MB
- Users can upload their own pictures
- Public read access
- Users can delete their own, admins can delete any

#### Admin Files (`/admin/{allPaths}`)
- Only admins can upload/delete
- Authenticated users can read

## Testing Security Rules

### Option 1: Firebase Console
1. Go to Firestore Database → Rules
2. Click "Rules Playground"
3. Test different scenarios with different user roles

### Option 2: Firebase Emulator
```bash
firebase emulators:start --only firestore,storage
```

Then run your tests against the emulator.

## Admin User Setup

To create an admin user:

1. **Via Firebase Console**:
   - Go to Firestore Database
   - Navigate to `profiles` collection
   - Find/create a user document
   - Set `role` field to `"admin"`
   - Ensure the document ID matches the Firebase Auth UID

2. **Via App**:
   - Register a new user
   - Go to Firestore Console
   - Find the user in `profiles` collection
   - Change `role` from `"client"` or `"artisan"` to `"admin"`

## Monitoring & Debugging

### Check Rule Violations
1. Go to Firebase Console
2. Navigate to Firestore Database → Usage
3. Check for security rule violations

### Debug Rules
Enable debug mode in your app:
```javascript
import { connectFirestoreEmulator } from 'firebase/firestore';
const db = getFirestore();
connectFirestoreEmulator(db, 'localhost', 8080);
```

## Production Checklist

- [ ] Deploy Firestore rules
- [ ] Deploy Storage rules
- [ ] Create at least one admin user
- [ ] Test admin dashboard access
- [ ] Test client dashboard access
- [ ] Test artisan dashboard access
- [ ] Verify unauthorized access is blocked
- [ ] Test file upload limits
- [ ] Monitor rule violations for first 24 hours

## Common Issues

### Issue: "Missing or insufficient permissions"
- **Solution**: Check that the user's role is correctly set in Firestore
- **Solution**: Ensure rules are deployed: `firebase deploy --only firestore:rules`

### Issue: "Admin can't access dashboard"
- **Solution**: Verify the profile document has `role: "admin"`
- **Solution**: Check that the document ID matches the user's Auth UID

### Issue: "File upload fails"
- **Solution**: Check file size limits (10MB for jobs, 5MB for profiles)
- **Solution**: Ensure storage rules are deployed: `firebase deploy --only storage`

## Support

For more information:
- Firebase Documentation: https://firebase.google.com/docs
- Firestore Security Rules: https://firebase.google.com/docs/firestore/security/get-started
- Storage Security Rules: https://firebase.google.com/docs/storage/security

