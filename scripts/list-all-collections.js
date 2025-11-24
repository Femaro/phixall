/**
 * Script to list ALL collections in Firestore
 * This will help identify any collections we might have missed
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
  console.error('❌ Error loading service account:', error.message);
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

async function listAllCollections() {
  console.log('\n🔍 Listing ALL Firestore Collections\n');
  console.log('='.repeat(60));
  console.log(`Project: ${serviceAccount.project_id}`);
  console.log('='.repeat(60));

  try {
    // Note: Firestore Admin SDK doesn't have a direct way to list all collections
    // We need to check each collection we know about, plus try to discover others
    // by attempting to list documents in common collection patterns

    const knownCollections = [
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
      'notifications',
      'reviews',
      'messages',
      'resources',
      'bills',
    ];

    const discoveredCollections = new Set();
    let totalDocs = 0;

    console.log('\n📚 Checking Known Collections:');
    console.log('-'.repeat(60));

    for (const collectionName of knownCollections) {
      try {
        const snapshot = await db.collection(collectionName).limit(1).get();
        if (!snapshot.empty) {
          const fullSnapshot = await db.collection(collectionName).get();
          const count = fullSnapshot.size;
          totalDocs += count;
          console.log(`  ✓ ${collectionName}: ${count} document(s)`);
          
          // Show sample documents
          const samples = fullSnapshot.docs.slice(0, 3);
          samples.forEach((doc) => {
            const data = doc.data();
            console.log(`    - ${doc.id}: ${JSON.stringify(Object.keys(data).slice(0, 5).reduce((acc, key) => {
              acc[key] = data[key];
              return acc;
            }, {}))}`);
          });
          if (count > 3) {
            console.log(`    ... and ${count - 3} more`);
          }
        } else {
          console.log(`  ○ ${collectionName}: Empty`);
        }
      } catch (error) {
        console.log(`  ✗ ${collectionName}: Error - ${error.message}`);
      }
    }

    // Try to discover other collections by checking common patterns
    console.log('\n🔍 Attempting to discover other collections...');
    console.log('-'.repeat(60));
    console.log('  Note: Firestore Admin SDK cannot directly list all collections.');
    console.log('  Please check Firebase Console manually for any other collections.');
    console.log('  Common collection names to check:');
    console.log('    - Any collection starting with "test" or "demo"');
    console.log('    - Any collection with timestamps or IDs');
    console.log('    - Subcollections (nested under documents)');

    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary:');
    console.log('-'.repeat(60));
    console.log(`  Total documents found: ${totalDocs}`);
    console.log('='.repeat(60));

    if (totalDocs > 0) {
      console.log('\n⚠️  Data still exists in some collections.');
      console.log('   Run: npm run cleanup:all to delete remaining data.');
    } else {
      console.log('\n✅ All known collections are empty.');
    }

    console.log('');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

listAllCollections().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});

