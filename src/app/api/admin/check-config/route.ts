import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    // Check if environment variable exists
    const hasEnvVar = !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (!hasEnvVar) {
      return NextResponse.json({
        status: 'error',
        message: 'FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set',
        hasEnvVar: false,
      }, { status: 500 });
    }

    // Try to parse the JSON
    let parsed = false;
    try {
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
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
      return NextResponse.json({
        status: 'error',
        message: 'Firebase Admin SDK initialization failed',
        hasEnvVar: true,
        parsed: true,
        initialized: false,
        error: initError?.message || 'Unknown initialization error',
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

