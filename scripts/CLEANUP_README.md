# Firebase Data Cleanup Script

This script helps you remove test data from your Firebase Firestore database and Storage.

## ⚠️ WARNING

**This script will permanently delete data. Use with extreme caution!**

Always run with `--dry-run` first to see what will be deleted.

## Prerequisites

1. **Firebase Admin SDK Setup:**
   - See `SETUP_SERVICE_ACCOUNT.md` for detailed instructions
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file as `serviceAccountKey.json` in the project root
   - **OR** set the `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable with the JSON content

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Verify Setup:**
   ```bash
   npm run inspect
   ```
   This will show you what data exists in your Firebase project before cleanup.

## Usage

### 0. Inspect Your Data (Recommended First Step)
See what data exists in your Firebase project:
```bash
npm run inspect
```

### 1. Dry Run (Recommended Second Step)
See what would be deleted without actually deleting:
```bash
npm run cleanup:dry-run
```

### 2. Delete Only Test Data
Delete only data that appears to be test data (emails/names containing "test", "example", etc.):
```bash
npm run cleanup:test-only
```

### 3. Delete All Data
⚠️ **WARNING: This deletes EVERYTHING!**
```bash
npm run cleanup:all
```

## What Gets Deleted

### Firestore Collections:
- `profiles` - User profiles
- `jobs` - Job listings and assignments
- `transactions` - Payment transactions
- `wallets` - User wallet balances
- `jobCompletions` - Job completion records
- `phixer_onboarding` - Phixer onboarding applications
- `artisan_onboarding` - Legacy artisan onboarding (for cleanup)
- `support_articles` - Support knowledge base articles
- `support_sessions` - Support chat sessions
- `location_tracking` - Real-time location data
- `notifications` - User notifications
- `reviews` - Job reviews and ratings
- `messages` - User messages

### Storage Paths:
- `phixer-documents` - Phixer uploaded documents
- `artisan-documents` - Legacy artisan documents
- `job-attachments` - Job-related file attachments
- `profile-photos` - User profile photos

### Authentication:
- All Firebase Authentication users (if not filtering)

## Test Data Detection

When using `--filter-test-only`, the script identifies test data by:
- **Email patterns**: Contains "test", "example", "demo", "sample", "fake", "dummy", "@test", "@example"
- **Name patterns**: Contains "test", "example", "demo", "sample", "fake", "dummy"

## Examples

### Example 1: Preview what would be deleted
```bash
npm run cleanup:dry-run
```

### Example 2: Delete only test users
```bash
npm run cleanup:test-only
```

### Example 3: Complete cleanup (all data)
```bash
npm run cleanup:all
```

## Safety Features

1. **Confirmation Prompt**: The script asks for confirmation before deleting (unless in dry-run mode)
2. **Dry Run Mode**: Test the script without making changes
3. **Filter Mode**: Only delete data that matches test patterns
4. **Batch Processing**: Handles large datasets efficiently
5. **Error Handling**: Continues even if some deletions fail

## Manual Cleanup via Firebase Console

If you prefer to clean up manually:

1. **Firestore:**
   - Go to Firebase Console → Firestore Database
   - Select each collection
   - Delete documents individually or in bulk

2. **Storage:**
   - Go to Firebase Console → Storage
   - Navigate to each folder
   - Delete files individually or in bulk

3. **Authentication:**
   - Go to Firebase Console → Authentication → Users
   - Select and delete users

## Troubleshooting

### Error: "Cannot find module 'firebase-admin'"
```bash
npm install firebase-admin
```

### Error: "Service account key not found"
- Ensure `serviceAccountKey.json` exists in the project root
- OR set `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable

### Error: "Permission denied"
- Ensure your service account has the necessary permissions:
  - Cloud Datastore User
  - Firebase Admin
  - Storage Admin

## Notes

- The script processes deletions in batches to handle large datasets
- Firestore batch limit is 500 operations per batch
- Authentication user deletion limit is 1000 users per batch
- The script will continue even if some operations fail

