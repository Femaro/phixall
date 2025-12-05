import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * Cleanup unverified user accounts
 * 
 * This endpoint deletes user accounts that:
 * - Have emailVerified: false
 * - Were created more than the specified period ago (default: 7 days)
 * 
 * Can be called:
 * - Manually via API
 * - Via Vercel Cron (configured in vercel.json)
 * - Via external cron service
 * 
 * Security: Should be protected with a secret token or admin authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication/authorization check
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { firestore, auth } = getFirebaseAdmin();
    
    // Get cleanup period from query params or env (default: 7 days)
    const url = new URL(request.url);
    const daysParam = url.searchParams.get('days') || process.env.UNVERIFIED_USER_CLEANUP_DAYS || '7';
    const days = parseInt(daysParam, 10);
    
    if (isNaN(days) || days < 1) {
      return NextResponse.json(
        { error: 'Invalid days parameter. Must be a positive number.' },
        { status: 400 }
      );
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffTimestamp = Timestamp.fromDate(cutoffDate);
    const cutoffISOString = cutoffDate.toISOString();

    console.log(`Starting cleanup of unverified users older than ${days} days (before ${cutoffISOString})`);

    // Query for unverified users created before cutoff date
    // Note: createdAt can be either Timestamp or ISO string (for backward compatibility)
    const profilesRef = firestore.collection('profiles');
    const unverifiedUsersQuery = await profilesRef
      .where('emailVerified', '==', false)
      .get();
    
    // Filter in memory to handle both Timestamp and ISO string formats
    const unverifiedUsers = unverifiedUsersQuery.docs.filter((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt;
      
      if (!createdAt) return false;
      
      // Handle Firestore Timestamp
      if (createdAt.toDate) {
        return createdAt.toDate() < cutoffDate;
      }
      
      // Handle ISO string
      if (typeof createdAt === 'string') {
        return new Date(createdAt) < cutoffDate;
      }
      
      return false;
    });

    if (unverifiedUsers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No unverified users found to clean up',
        deletedCount: 0,
        cutoffDate: cutoffISOString,
        days,
      });
    }

    console.log(`Found ${unverifiedUsers.length} unverified users to delete`);

    const deletedUsers: string[] = [];
    const errors: Array<{ userId: string; error: string }> = [];

    // Delete each unverified user
    for (const docSnapshot of unverifiedUsers) {
      const userId = docSnapshot.id;
      const userData = docSnapshot.data();

      try {
        // Delete from Firebase Auth
        try {
          await auth.deleteUser(userId);
          console.log(`Deleted user from Auth: ${userId}`);
        } catch (authError: any) {
          // User might not exist in Auth (edge case)
          if (authError.code !== 'auth/user-not-found') {
            throw authError;
          }
          console.log(`User not found in Auth (may have been deleted): ${userId}`);
        }

        // Delete profile from Firestore
        await docSnapshot.ref.delete();
        console.log(`Deleted profile: ${userId}`);

        // Delete related data (wallets, etc.)
        try {
          const walletRef = firestore.collection('wallets').doc(userId);
          const walletSnap = await walletRef.get();
          if (walletSnap.exists()) {
            await walletRef.delete();
            console.log(`Deleted wallet: ${userId}`);
          }
        } catch (walletError) {
          // Wallet might not exist, continue
          console.log(`No wallet found for user: ${userId}`);
        }

        // Delete onboarding data if exists
        try {
          const onboardingRef = firestore.collection('phixer_onboarding').doc(userId);
          const onboardingSnap = await onboardingRef.get();
          if (onboardingSnap.exists()) {
            await onboardingRef.delete();
            console.log(`Deleted onboarding data: ${userId}`);
          }
        } catch (onboardingError) {
          // Onboarding might not exist, continue
          console.log(`No onboarding data found for user: ${userId}`);
        }

        deletedUsers.push(userId);
      } catch (error: any) {
        console.error(`Error deleting user ${userId}:`, error);
        errors.push({
          userId,
          error: error.message || 'Unknown error',
        });
      }
    }

    const result = {
      success: true,
      message: `Cleanup completed. Deleted ${deletedUsers.length} unverified user(s)`,
      deletedCount: deletedUsers.length,
      totalFound: unverifiedUsers.length,
      cutoffDate: cutoffISOString,
      days,
      deletedUsers: deletedUsers.slice(0, 10), // Limit to first 10 for response size
      errors: errors.length > 0 ? errors : undefined,
    };

    console.log(`Cleanup completed: ${deletedUsers.length}/${unverifiedUsers.size} users deleted`);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in cleanup unverified users:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to cleanup unverified users',
      },
      { status: 500 }
    );
  }
}

// Also support GET for easier testing
export async function GET(request: NextRequest) {
  return POST(request);
}

