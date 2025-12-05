import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

/**
 * Cleanup endpoint for unverified users
 * 
 * This endpoint deletes users who registered but didn't verify their email
 * within a specified period (default: 48 hours).
 * 
 * Should be called periodically via Vercel Cron or scheduled task.
 * 
 * Query parameters (GET) or Body (POST):
 * - hours: Number of hours to wait before deleting (default: 48)
 * - dryRun: If true, only reports what would be deleted (default: false)
 * - token: Authentication token (if CLEANUP_SECRET_TOKEN is set)
 */
async function handleCleanup(request: NextRequest, method: 'GET' | 'POST' = 'GET') {
  try {
    // Get parameters from query (GET) or body (POST)
    const searchParams = request.nextUrl.searchParams;
    let body: any = {};
    
    if (method === 'POST') {
      try {
        body = await request.json();
      } catch {
        // Body might be empty or invalid, use query params as fallback
      }
    }
    
    const hoursThreshold = parseInt(
      body.hours || searchParams.get('hours') || '48',
      10
    );
    const dryRun = 
      body.dryRun === true || 
      body.dryRun === 'true' || 
      searchParams.get('dryRun') === 'true';

    // Security: Check for authentication token
    // Can be provided via query param, body, or Authorization header
    const authToken = 
      body.token || 
      searchParams.get('token') || 
      request.headers.get('authorization')?.replace('Bearer ', '');
    const expectedToken = process.env.CLEANUP_SECRET_TOKEN;
    
    // In production, require token unless explicitly disabled
    if (process.env.NODE_ENV === 'production' && expectedToken) {
      if (!authToken || authToken !== expectedToken) {
        return NextResponse.json(
          { error: 'Unauthorized. Provide valid token via ?token=, body.token, or Authorization header.' },
          { status: 401 }
        );
      }
    }

    const { firestore, auth } = getFirebaseAdmin();

    // Calculate cutoff time
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hoursThreshold);

    console.log(`[Cleanup] Looking for unverified users created before ${cutoffTime.toISOString()}`);

    // Query Firestore for unverified profiles created before cutoff
    const profilesRef = firestore.collection('profiles');
    const unverifiedQuery = profilesRef
      .where('emailVerified', '==', false)
      .where('createdAt', '<', cutoffTime.toISOString());

    const snapshot = await unverifiedQuery.get();

    if (snapshot.empty) {
      return NextResponse.json({
        success: true,
        message: 'No unverified users found to clean up',
        deletedCount: 0,
        dryRun,
      });
    }

    const usersToDelete: Array<{ uid: string; email: string; createdAt: string }> = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      usersToDelete.push({
        uid: doc.id,
        email: data.email || 'unknown',
        createdAt: data.createdAt || 'unknown',
      });
    });

    console.log(`[Cleanup] Found ${usersToDelete.length} unverified users to delete`);

    if (dryRun) {
      return NextResponse.json({
        success: true,
        message: `[DRY RUN] Would delete ${usersToDelete.length} unverified users`,
        deletedCount: usersToDelete.length,
        users: usersToDelete.map(u => ({ uid: u.uid, email: u.email })),
        dryRun: true,
      });
    }

    // Delete users in batches (Firebase Admin allows up to 1000 per batch)
    let deletedCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // Process in batches of 1000
    for (let i = 0; i < usersToDelete.length; i += 1000) {
      const userBatch = usersToDelete.slice(i, i + 1000);
      const uids = userBatch.map(u => u.uid);

      try {
        // Delete from Firebase Auth
        await auth.deleteUsers(uids);
        
        // Delete from Firestore (process in smaller batches of 500 for Firestore)
        for (let j = 0; j < userBatch.length; j += 500) {
          const firestoreBatch = firestore.batch();
          const firestoreUserBatch = userBatch.slice(j, j + 500);
          
          firestoreUserBatch.forEach((user) => {
            const profileRef = firestore.collection('profiles').doc(user.uid);
            firestoreBatch.delete(profileRef);
          });
          
          await firestoreBatch.commit();
        }

        deletedCount += userBatch.length;
        console.log(`[Cleanup] Deleted batch: ${userBatch.length} users`);
      } catch (batchError: any) {
        console.error(`[Cleanup] Error deleting batch:`, batchError);
        failedCount += userBatch.length;
        errors.push(`Batch ${Math.floor(i / 1000) + 1}: ${batchError.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cleanup completed. Deleted ${deletedCount} unverified users.`,
      deletedCount,
      failedCount,
      errors: errors.length > 0 ? errors : undefined,
      thresholdHours: hoursThreshold,
    });
  } catch (error: any) {
    console.error('[Cleanup] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to cleanup unverified users',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleCleanup(request, 'GET');
}

export async function POST(request: NextRequest) {
  return handleCleanup(request, 'POST');
}

