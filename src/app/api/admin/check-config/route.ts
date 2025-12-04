import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    // Check if environment variable exists
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (!serviceAccountKey) {
      return NextResponse.json({
        status: 'error',
        message: 'FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set',
        hasEnvVar: false,
      }, { status: 500 });
    }

    // Try to parse the JSON
    let parsed = false;
    let parsedData: any;
    try {
      parsedData = JSON.parse(serviceAccountKey);
      parsed = true;
    } catch (parseError) {
      return NextResponse.json({
        status: 'error',
        message: 'FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON',
        hasEnvVar: true,
        parsed: false,
        error: parseError instanceof Error ? parseError.message : 'Unknown parse error',
      }, { status: 500 });
    }

    // Check if private_key contains newline characters
    const privateKey = parsedData?.private_key || '';
    const hasNewlines = privateKey.includes('\\n') || privateKey.includes('\n');
    const hasBeginEnd = privateKey.includes('BEGIN PRIVATE KEY') && privateKey.includes('END PRIVATE KEY');

    // Try to initialize Firebase Admin
    try {
      const admin = getFirebaseAdmin();
      const firestore = admin.firestore;
      const storage = admin.storage;
      
      // Test Firestore connection
      await firestore.collection('_test').limit(1).get();
      
      return NextResponse.json({
        status: 'success',
        message: 'Firebase Admin SDK is configured correctly',
        hasEnvVar: true,
        parsed: true,
        initialized: true,
      });
    } catch (initError: any) {
      const errorMessage = initError?.message || 'Unknown initialization error';
      const isPemError = errorMessage.includes('PEM') || errorMessage.includes('private key');
      
      return NextResponse.json({
        status: 'error',
        message: 'Firebase Admin SDK initialization failed',
        hasEnvVar: true,
        parsed: true,
        initialized: false,
        error: errorMessage,
        diagnostic: isPemError ? {
          issue: 'Invalid private key format',
          cause: 'The private key in your service account JSON may have lost its newline characters (\\n) when pasted into Vercel',
          solution: 'Ensure the private_key field contains \\n characters. When copying JSON to Vercel, use a JSON minifier that preserves escape sequences, or use the raw JSON file content directly.',
          hasNewlines: hasNewlines,
          hasBeginEnd: hasBeginEnd,
        } : undefined,
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error checking configuration',
      error: error?.message || 'Unknown error',
    }, { status: 500 });
  }
}

