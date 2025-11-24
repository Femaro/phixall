/**
 * Script to remove all test data from Firebase Firestore and Storage
 * 
 * Prerequisites:
 *   1. Install firebase-admin: npm install firebase-admin
 *   2. Get service account key from Firebase Console
 *   3. Save as serviceAccountKey.json in project root
 *      OR set FIREBASE_SERVICE_ACCOUNT_KEY environment variable
 * 
 * Usage:
 *   node scripts/cleanup-test-data.js [--dry-run] [--filter-test-only]
 * 
 * Options:
 *   --dry-run: Show what would be deleted without actually deleting
 *   --filter-test-only: Only delete data that appears to be test data
 *                       (emails containing 'test', 'example', '@test', etc.)
 * 
 * WARNING: This script will permanently delete data. Use with caution!
 */

const admin = require('firebase-admin');
const readline = require('readline');

// Initialize Firebase Admin
let serviceAccount;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  } else {
    serviceAccount = require('../serviceAccountKey.json');
  }
} catch (error) {
  console.error('❌ Error loading service account:');
  console.error('   Please ensure serviceAccountKey.json exists in the project root');
  console.error('   OR set FIREBASE_SERVICE_ACCOUNT_KEY environment variable');
  console.error('\n   To get your service account key:');
  console.error('   1. Go to Firebase Console → Project Settings → Service Accounts');
  console.error('   2. Click "Generate New Private Key"');
  console.error('   3. Save the JSON file as serviceAccountKey.json in the project root\n');
  process.exit(1);
}

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || serviceAccount.project_id + '.appspot.com',
    });
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error.message);
    process.exit(1);
  }
}

const db = admin.firestore();
const storage = admin.storage();
const bucket = storage.bucket();

// Collections to clean up
const COLLECTIONS = [
  'profiles',
  'jobs',
  'transactions',
  'wallets',
  'jobCompletions',
  'phixer_onboarding',
  'artisan_onboarding', // Legacy collection
  'support_articles',
  'support_sessions',
  'support_macros',
  'support_agents',
  'support_notifications',
  'location_tracking',
  'jobLocations',
  'notifications',
  'reviews',
  'messages',
  'resources',
  'bills',
];

// Storage paths to clean up
const STORAGE_PATHS = [
  'phixer-documents',
  'artisan-documents', // Legacy path
  'job-attachments',
  'profile-photos',
];

// Test data patterns
const TEST_PATTERNS = {
  email: /test|example|demo|sample|fake|dummy|@test|@example/i,
  name: /test|example|demo|sample|fake|dummy/i,
};

function isTestData(data) {
  if (!data) return false;
  
  // Check email
  if (data.email && TEST_PATTERNS.email.test(data.email)) {
    return true;
  }
  
  // Check name
  if (data.name && TEST_PATTERNS.name.test(data.name)) {
    return true;
  }
  
  return false;
}

async function deleteCollection(collectionName, filterTestOnly = false, dryRun = false) {
  const collectionRef = db.collection(collectionName);
  let deletedCount = 0;
  let batchCount = 0;

  try {
    const snapshot = await collectionRef.get();
    
    if (snapshot.empty) {
      console.log(`  ✓ ${collectionName}: No documents found`);
      return 0;
    }

    const docs = snapshot.docs;
    let docsToDelete = docs;

    // Filter test data if requested
    if (filterTestOnly) {
      docsToDelete = docs.filter((doc) => isTestData(doc.data()));
      console.log(`  ℹ ${collectionName}: ${docsToDelete.length} of ${docs.length} documents are test data`);
    }

    if (docsToDelete.length === 0) {
      console.log(`  ✓ ${collectionName}: No documents to delete`);
      return 0;
    }

    if (dryRun) {
      console.log(`  [DRY RUN] Would delete ${docsToDelete.length} documents from ${collectionName}`);
      return docsToDelete.length;
    }

    // Delete in batches of 500 (Firestore limit)
    const batches = [];
    let currentBatch = db.batch();
    let operationCount = 0;

    for (const doc of docsToDelete) {
      currentBatch.delete(doc.ref);
      operationCount++;
      deletedCount++;

      if (operationCount === 500) {
        batches.push(currentBatch);
        currentBatch = db.batch();
        operationCount = 0;
        batchCount++;
      }
    }

    if (operationCount > 0) {
      batches.push(currentBatch);
      batchCount++;
    }

    // Execute all batches
    for (const batch of batches) {
      await batch.commit();
    }

    console.log(`  ✓ ${collectionName}: Deleted ${deletedCount} documents (${batchCount} batches)`);
    return deletedCount;
  } catch (error) {
    console.error(`  ✗ ${collectionName}: Error - ${error.message}`);
    return 0;
  }
}

async function deleteStoragePath(path, filterTestOnly = false, dryRun = false) {
  try {
    const [files] = await bucket.getFiles({ prefix: path });
    
    if (files.length === 0) {
      console.log(`  ✓ ${path}: No files found`);
      return 0;
    }

    let filesToDelete = files;

    // Filter test files if requested (by checking if path contains test patterns)
    if (filterTestOnly) {
      filesToDelete = files.filter((file) => {
        const fileName = file.name.toLowerCase();
        return TEST_PATTERNS.name.test(fileName);
      });
      console.log(`  ℹ ${path}: ${filesToDelete.length} of ${files.length} files appear to be test data`);
    }

    if (filesToDelete.length === 0) {
      console.log(`  ✓ ${path}: No files to delete`);
      return 0;
    }

    if (dryRun) {
      console.log(`  [DRY RUN] Would delete ${filesToDelete.length} files from ${path}`);
      return filesToDelete.length;
    }

    // Delete files
    await Promise.all(filesToDelete.map((file) => file.delete()));
    console.log(`  ✓ ${path}: Deleted ${filesToDelete.length} files`);
    return filesToDelete.length;
  } catch (error) {
    console.error(`  ✗ ${path}: Error - ${error.message}`);
    return 0;
  }
}

async function deleteAllUsers(filterTestOnly = false, dryRun = false) {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users;

    if (users.length === 0) {
      console.log(`  ✓ Authentication users: No users found`);
      return 0;
    }

    let usersToDelete = users;

    // Filter test users if requested
    if (filterTestOnly) {
      usersToDelete = users.filter((user) => {
        if (user.email && TEST_PATTERNS.email.test(user.email)) {
          return true;
        }
        if (user.displayName && TEST_PATTERNS.name.test(user.displayName)) {
          return true;
        }
        return false;
      });
      console.log(`  ℹ Authentication users: ${usersToDelete.length} of ${users.length} users appear to be test data`);
    }

    if (usersToDelete.length === 0) {
      console.log(`  ✓ Authentication users: No users to delete`);
      return 0;
    }

    if (dryRun) {
      console.log(`  [DRY RUN] Would delete ${usersToDelete.length} authentication users`);
      return usersToDelete.length;
    }

    // Delete users in batches of 1000
    const uids = usersToDelete.map((user) => user.uid);
    let deletedCount = 0;

    for (let i = 0; i < uids.length; i += 1000) {
      const batch = uids.slice(i, i + 1000);
      await admin.auth().deleteUsers(batch);
      deletedCount += batch.length;
    }

    console.log(`  ✓ Authentication users: Deleted ${deletedCount} users`);
    return deletedCount;
  } catch (error) {
    console.error(`  ✗ Authentication users: Error - ${error.message}`);
    return 0;
  }
}

function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const filterTestOnly = args.includes('--filter-test-only');

  console.log('\n🧹 Firebase Test Data Cleanup Script\n');
  console.log('='.repeat(50));
  
  if (dryRun) {
    console.log('⚠️  DRY RUN MODE - No data will be deleted\n');
  }
  
  if (filterTestOnly) {
    console.log('🔍 FILTER MODE - Only test data will be deleted\n');
    console.log('Test data patterns:');
    console.log('  - Emails containing: test, example, demo, sample, fake, dummy');
    console.log('  - Names containing: test, example, demo, sample, fake, dummy\n');
  } else {
    console.log('⚠️  WARNING: This will delete ALL data from the following:\n');
  }

  console.log('Collections to clean:');
  COLLECTIONS.forEach((col) => console.log(`  - ${col}`));
  console.log('\nStorage paths to clean:');
  STORAGE_PATHS.forEach((path) => console.log(`  - ${path}`));
  console.log('\nAuthentication users will also be deleted\n');

  if (!dryRun) {
    const confirmed = await askConfirmation(
      filterTestOnly
        ? 'Are you sure you want to delete test data? (yes/no): '
        : '⚠️  WARNING: This will delete ALL data. Type "yes" to continue: '
    );

    if (!confirmed) {
      console.log('\n❌ Cleanup cancelled.');
      process.exit(0);
    }
  }

  console.log('\n🚀 Starting cleanup...\n');
  console.log('='.repeat(50));

  let totalDeleted = 0;

  // Delete Firestore collections
  console.log('\n📚 Cleaning Firestore Collections:');
  for (const collection of COLLECTIONS) {
    const count = await deleteCollection(collection, filterTestOnly, dryRun);
    totalDeleted += count;
  }

  // Delete Storage files
  console.log('\n📁 Cleaning Storage:');
  for (const path of STORAGE_PATHS) {
    const count = await deleteStoragePath(path, filterTestOnly, dryRun);
    totalDeleted += count;
  }

  // Delete Authentication users
  console.log('\n👤 Cleaning Authentication Users:');
  const userCount = await deleteAllUsers(filterTestOnly, dryRun);
  totalDeleted += userCount;

  console.log('\n' + '='.repeat(50));
  console.log(`\n✅ Cleanup complete!`);
  console.log(`   Total items deleted: ${totalDeleted}`);
  
  if (dryRun) {
    console.log(`\n⚠️  This was a dry run. No data was actually deleted.`);
    console.log(`   Run without --dry-run to perform the actual deletion.`);
  }
  
  console.log('');
  process.exit(0);
}

// Run the script
main().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
