/**
 * Script to inspect and list all data in Firebase Firestore and Storage
 * 
 * Usage:
 *   node scripts/inspect-firebase-data.js
 * 
 * This script will list all collections, documents, storage files, and users
 * without making any changes.
 */

const admin = require('firebase-admin');

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

// Collections to check
const COLLECTIONS = [
  'profiles',
  'jobs',
  'transactions',
  'wallets',
  'jobCompletions',
  'phixer_onboarding',
  'artisan_onboarding',
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

// Storage paths to check
const STORAGE_PATHS = [
  'phixer-documents',
  'artisan-documents',
  'job-attachments',
  'profile-photos',
];

async function inspectCollection(collectionName) {
  try {
    const collectionRef = db.collection(collectionName);
    const snapshot = await collectionRef.get();
    
    if (snapshot.empty) {
      return { count: 0, samples: [] };
    }

    const docs = snapshot.docs;
    const samples = docs.slice(0, 3).map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        preview: {
          name: data.name || data.title || data.email || 'N/A',
          role: data.role || 'N/A',
          status: data.status || 'N/A',
        },
      };
    });

    return { count: docs.length, samples };
  } catch (error) {
    return { count: 0, error: error.message };
  }
}

async function inspectStoragePath(path) {
  try {
    const [files] = await bucket.getFiles({ prefix: path });
    return { count: files.length, files: files.slice(0, 5).map((f) => f.name) };
  } catch (error) {
    return { count: 0, error: error.message };
  }
}

async function inspectUsers() {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users;
    
    const samples = users.slice(0, 5).map((user) => ({
      uid: user.uid,
      email: user.email || 'N/A',
      displayName: user.displayName || 'N/A',
      createdAt: user.metadata.creationTime,
    }));

    return { count: users.length, samples };
  } catch (error) {
    return { count: 0, error: error.message };
  }
}

async function main() {
  console.log('\n🔍 Firebase Data Inspection Report\n');
  console.log('='.repeat(60));
  console.log(`Project: ${serviceAccount.project_id}`);
  console.log(`Storage Bucket: ${bucket.name}`);
  console.log('='.repeat(60));

  let totalDocs = 0;
  let totalFiles = 0;
  let totalUsers = 0;

  // Inspect Firestore Collections
  console.log('\n📚 Firestore Collections:');
  console.log('-'.repeat(60));
  for (const collection of COLLECTIONS) {
    const result = await inspectCollection(collection);
    if (result.error) {
      console.log(`  ✗ ${collection}: Error - ${result.error}`);
    } else if (result.count === 0) {
      console.log(`  ○ ${collection}: Empty (0 documents)`);
    } else {
      console.log(`  ✓ ${collection}: ${result.count} document(s)`);
      if (result.samples && result.samples.length > 0) {
        result.samples.forEach((sample) => {
          console.log(`    - ${sample.id}: ${JSON.stringify(sample.preview)}`);
        });
        if (result.count > 3) {
          console.log(`    ... and ${result.count - 3} more`);
        }
      }
      totalDocs += result.count;
    }
  }

  // Inspect Storage
  console.log('\n📁 Storage:');
  console.log('-'.repeat(60));
  for (const path of STORAGE_PATHS) {
    const result = await inspectStoragePath(path);
    if (result.error) {
      console.log(`  ✗ ${path}: Error - ${result.error}`);
    } else if (result.count === 0) {
      console.log(`  ○ ${path}: Empty (0 files)`);
    } else {
      console.log(`  ✓ ${path}: ${result.count} file(s)`);
      if (result.files && result.files.length > 0) {
        result.files.forEach((file) => {
          console.log(`    - ${file}`);
        });
        if (result.count > 5) {
          console.log(`    ... and ${result.count - 5} more`);
        }
      }
      totalFiles += result.count;
    }
  }

  // Inspect Authentication Users
  console.log('\n👤 Authentication Users:');
  console.log('-'.repeat(60));
  const userResult = await inspectUsers();
  if (userResult.error) {
    console.log(`  ✗ Error - ${userResult.error}`);
  } else if (userResult.count === 0) {
    console.log(`  ○ No users found`);
  } else {
    console.log(`  ✓ ${userResult.count} user(s)`);
    if (userResult.samples && userResult.samples.length > 0) {
      userResult.samples.forEach((user) => {
        console.log(`    - ${user.email} (${user.uid})`);
        console.log(`      Name: ${user.displayName}, Created: ${user.createdAt}`);
      });
      if (userResult.count > 5) {
        console.log(`    ... and ${userResult.count - 5} more`);
      }
    }
    totalUsers = userResult.count;
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log('-'.repeat(60));
  console.log(`  Total Firestore Documents: ${totalDocs}`);
  console.log(`  Total Storage Files: ${totalFiles}`);
  console.log(`  Total Authentication Users: ${totalUsers}`);
  console.log(`  Grand Total: ${totalDocs + totalFiles + totalUsers} items`);
  console.log('='.repeat(60));

  if (totalDocs === 0 && totalFiles === 0 && totalUsers === 0) {
    console.log('\n✅ Your Firebase project is empty. No cleanup needed.');
  } else {
    console.log('\n⚠️  Data found in Firebase project.');
    console.log('   To clean up, run: npm run cleanup:all');
  }

  console.log('');
  process.exit(0);
}

// Run the script
main().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});

