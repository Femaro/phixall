/**
 * Script to format Firebase Service Account JSON for Vercel
 * 
 * This script reads your serviceAccountKey.json file and outputs
 * a single-line JSON string that can be safely pasted into Vercel's
 * FIREBASE_SERVICE_ACCOUNT_KEY environment variable.
 * 
 * Usage:
 *   node scripts/format-service-account-for-vercel.js
 * 
 * The script will:
 * 1. Read serviceAccountKey.json from the project root
 * 2. Validate it's a valid service account key
 * 3. Output a single-line JSON string with preserved \n characters
 */

const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

try {
  // Check if file exists
  if (!fs.existsSync(serviceAccountPath)) {
    console.error('❌ Error: serviceAccountKey.json not found in project root');
    console.error('   Please download your service account key from Firebase Console');
    console.error('   and save it as serviceAccountKey.json in the project root');
    process.exit(1);
  }

  // Read and parse the JSON file
  const fileContent = fs.readFileSync(serviceAccountPath, 'utf8');
  const serviceAccount = JSON.parse(fileContent);

  // Validate it's a service account key
  if (!serviceAccount.type || serviceAccount.type !== 'service_account') {
    console.error('❌ Error: This does not appear to be a Firebase service account key');
    process.exit(1);
  }

  if (!serviceAccount.private_key) {
    console.error('❌ Error: private_key field is missing from service account key');
    process.exit(1);
  }

  // Check if private_key has proper format
  const privateKey = serviceAccount.private_key;
  if (!privateKey.includes('BEGIN PRIVATE KEY') || !privateKey.includes('END PRIVATE KEY')) {
    console.warn('⚠️  Warning: private_key may not be in correct PEM format');
  }

  // Convert to single-line JSON (JSON.stringify handles escaping automatically)
  const singleLineJson = JSON.stringify(serviceAccount);

  console.log('\n✅ Service Account Key formatted successfully!\n');
  console.log('📋 Copy the following and paste it into Vercel as FIREBASE_SERVICE_ACCOUNT_KEY:\n');
  console.log('─'.repeat(80));
  console.log(singleLineJson);
  console.log('─'.repeat(80));
  console.log('\n💡 Tips:');
  console.log('   1. Copy the entire line above (it should be one long line)');
  console.log('   2. Go to Vercel → Your Project → Settings → Environment Variables');
  console.log('   3. Add new variable: FIREBASE_SERVICE_ACCOUNT_KEY');
  console.log('   4. Paste the copied line as the value');
  console.log('   5. Select all environments (Production, Preview, Development)');
  console.log('   6. Save and redeploy\n');

} catch (error) {
  console.error('❌ Error processing service account key:', error.message);
  if (error instanceof SyntaxError) {
    console.error('   The JSON file appears to be invalid or corrupted');
  }
  process.exit(1);
}

