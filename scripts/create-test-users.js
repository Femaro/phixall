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
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();

const TEST_USERS = [
  {
    email: 'admin@phixall.com',
    password: 'Admin@12345',
    displayName: 'Admin User',
    role: 'admin',
  },
  {
    email: 'client@test.com',
    password: 'Client@12345',
    displayName: 'Test Client',
    role: 'client',
  },
  {
    email: 'phixer@test.com',
    password: 'Phixer@12345',
    displayName: 'Test Phixer',
    role: 'Phixer',
  },
];

async function createTestUsers() {
  console.log('\n🔧 Creating Test Users & Profiles\n');
  console.log('==================================================\n');

  for (const userData of TEST_USERS) {
    try {
      // Create user in Firebase Auth
      console.log(`Creating ${userData.role}: ${userData.email}...`);
      
      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(userData.email);
        console.log(`  ℹ️  User already exists, updating...`);
        userRecord = await auth.updateUser(userRecord.uid, {
          displayName: userData.displayName,
          emailVerified: true,
        });
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          userRecord = await auth.createUser({
            email: userData.email,
            password: userData.password,
            displayName: userData.displayName,
            emailVerified: true,
          });
          console.log(`  ✓ Created auth user: ${userRecord.uid}`);
        } else {
          throw error;
        }
      }

      // Create profile in Firestore
      await db.collection('profiles').doc(userRecord.uid).set({
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        emailVerified: true,
      });
      console.log(`  ✓ Created profile document`);

      // Create wallet for the user
      await db.collection('wallets').doc(userRecord.uid).set({
        balance: userData.role === 'client' ? 10000 : 0, // Give client ₦10,000 for testing
        heldBalance: 0,
        currency: 'NGN',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`  ✓ Created wallet (Balance: ₦${userData.role === 'client' ? '10,000' : '0'})`);

      // If Phixer, create approved onboarding record
      if (userData.role === 'Phixer') {
        await db.collection('phixer_onboarding').doc(userRecord.uid).set({
          userId: userRecord.uid,
          status: 'approved',
          skills: ['Plumbing', 'Electrical'],
          experience: '5+ years',
          completedAt: admin.firestore.FieldValue.serverTimestamp(),
          approvedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`  ✓ Created approved onboarding record`);
      }

      console.log(`  ✅ ${userData.role} ready: ${userData.email} / ${userData.password}\n`);

    } catch (error) {
      console.error(`  ❌ Error creating ${userData.role}:`, error.message, '\n');
    }
  }

  console.log('==================================================');
  console.log('\n✅ Test users created successfully!\n');
  console.log('📝 Login Credentials:\n');
  TEST_USERS.forEach(user => {
    console.log(`${user.role.toUpperCase()}:`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Password: ${user.password}\n`);
  });

  process.exit(0);
}

createTestUsers().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});


