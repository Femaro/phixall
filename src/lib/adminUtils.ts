import { getFirebase } from './firebaseClient';
import { collection, query, where, getDocs, updateDoc, doc, addDoc, serverTimestamp, Timestamp, setDoc, increment } from 'firebase/firestore';

/**
 * Check if a user has admin role
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const { db } = getFirebase();
    const profileQuery = query(collection(db, 'profiles'), where('__name__', '==', userId));
    const profileDocs = await getDocs(profileQuery);
    
    if (profileDocs.empty) return false;
    
    const profile = profileDocs.docs[0].data();
    return profile.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Get platform statistics
 */
export async function getPlatformStats() {
  try {
    const { db } = getFirebase();
    
    const [clientsSnap, artisansSnap, jobsSnap, transactionsSnap] = await Promise.all([
      getDocs(query(collection(db, 'profiles'), where('role', '==', 'client'))),
      getDocs(query(collection(db, 'profiles'), where('role', '==', 'Phixer'))),
      getDocs(collection(db, 'jobs')),
      getDocs(collection(db, 'transactions')),
    ]);
    
    const jobs = jobsSnap.docs.map(doc => doc.data());
    const transactions = transactionsSnap.docs.map(doc => doc.data());
    
    return {
      totalClients: clientsSnap.size,
      totalArtisans: artisansSnap.size,
      totalJobs: jobsSnap.size,
      activeJobs: jobs.filter(j => ['requested', 'accepted', 'in-progress'].includes(j.status)).length,
      completedJobs: jobs.filter(j => j.status === 'completed').length,
      totalRevenue: transactions
        .filter(t => t.type === 'payment' && t.status === 'completed')
        .reduce((sum, t) => sum + (t.amount || 0), 0),
      pendingRevenue: jobs
        .filter(j => j.status === 'completed' && !j.amount)
        .reduce((sum) => sum + 5000, 0), // Estimated
    };
  } catch (error) {
    console.error('Error getting platform stats:', error);
    return null;
  }
}

/**
 * Assign a job to an Phixer (admin action)
 */
export async function adminAssignJob(jobId: string, phixerId: string, phixerName: string) {
  try {
    const { db } = getFirebase();
    await updateDoc(doc(db, 'jobs', jobId), {
      phixerId,
      phixerName,
      status: 'accepted',
      assignedBy: 'admin',
      assignedAt: serverTimestamp(),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error assigning job:', error);
    return { success: false, error };
  }
}

/**
 * Set budget for a job (admin action)
 */
export async function adminSetJobBudget(jobId: string, amount: number) {
  try {
    const { db } = getFirebase();
    await updateDoc(doc(db, 'jobs', jobId), {
      budget: amount,
      amount: amount,
      budgetSetBy: 'admin',
      budgetSetAt: serverTimestamp(),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error setting budget:', error);
    return { success: false, error };
  }
}

/**
 * Update user status (admin action)
 */
export async function adminUpdateUserStatus(userId: string, status: 'active' | 'suspended') {
  try {
    const { db } = getFirebase();
    await updateDoc(doc(db, 'profiles', userId), {
      status,
      statusUpdatedBy: 'admin',
      statusUpdatedAt: serverTimestamp(),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user status:', error);
    return { success: false, error };
  }
}

/**
 * Create manual transaction (admin action)
 */
export async function adminCreateTransaction(
  userId: string,
  type: 'deposit' | 'payment' | 'earning' | 'cashout' | 'refund',
  amount: number,
  description: string
) {
  try {
    const { db } = getFirebase();
    
    await addDoc(collection(db, 'transactions'), {
      userId,
      type,
      amount,
      description,
      status: 'completed',
      createdBy: 'admin',
      createdAt: serverTimestamp(),
    });
    
    // Update wallet balance
    const walletDoc = doc(db, 'wallets', userId);
    const balanceDelta = type === 'deposit' || type === 'earning' || type === 'refund' ? amount : -amount;
    const walletUpdates: Record<string, unknown> = {
      balance: increment(balanceDelta),
    };

    if (type === 'deposit') {
      walletUpdates.totalDeposits = increment(Math.abs(amount));
    } else if (type === 'payment') {
      walletUpdates.totalSpent = increment(Math.abs(amount));
    }

    await setDoc(walletDoc, walletUpdates, { merge: true });
    
    return { success: true };
  } catch (error) {
    console.error('Error creating transaction:', error);
    return { success: false, error };
  }
}

/**
 * Get user details by ID
 */
export async function getUserDetails(userId: string) {
  try {
    const { db } = getFirebase();
    const profileQuery = query(collection(db, 'profiles'), where('__name__', '==', userId));
    const profileDocs = await getDocs(profileQuery);
    
    if (profileDocs.empty) return null;
    
    return {
      id: profileDocs.docs[0].id,
      ...profileDocs.docs[0].data(),
    };
  } catch (error) {
    console.error('Error getting user details:', error);
    return null;
  }
}

/**
 * Get all jobs for a specific user
 */
export async function getUserJobs(userId: string, role: 'client' | 'Phixer') {
  try {
    const { db } = getFirebase();
    const field = role === 'client' ? 'clientId' : 'phixerId';
    const jobsQuery = query(collection(db, 'jobs'), where(field, '==', userId));
    const jobsDocs = await getDocs(jobsQuery);
    
    return jobsDocs.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting user jobs:', error);
    return [];
  }
}

/**
 * Get user wallet details
 */
export async function getUserWallet(userId: string) {
  try {
    const { db } = getFirebase();
    const walletQuery = query(collection(db, 'wallets'), where('__name__', '==', userId));
    const walletDocs = await getDocs(walletQuery);
    
    if (walletDocs.empty) return null;
    
    return {
      id: walletDocs.docs[0].id,
      ...walletDocs.docs[0].data(),
    };
  } catch (error) {
    console.error('Error getting wallet:', error);
    return null;
  }
}

/**
 * Get user transactions
 */
export async function getUserTransactions(userId: string) {
  try {
    const { db } = getFirebase();
    const txQuery = query(collection(db, 'transactions'), where('userId', '==', userId));
    const txDocs = await getDocs(txQuery);
    
    return txDocs.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
}

/**
 * Generate platform report
 */
export async function generatePlatformReport(startDate: Date, endDate: Date) {
  try {
    const { db } = getFirebase();
    
    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);
    
    const [jobsSnap, transactionsSnap] = await Promise.all([
      getDocs(query(
        collection(db, 'jobs'),
        where('createdAt', '>=', startTimestamp),
        where('createdAt', '<=', endTimestamp)
      )),
      getDocs(query(
        collection(db, 'transactions'),
        where('createdAt', '>=', startTimestamp),
        where('createdAt', '<=', endTimestamp)
      )),
    ]);
    
    const jobs = jobsSnap.docs.map(doc => doc.data());
    const transactions = transactionsSnap.docs.map(doc => doc.data());
    
    return {
      period: {
        start: startDate,
        end: endDate,
      },
      jobs: {
        total: jobs.length,
        completed: jobs.filter(j => j.status === 'completed').length,
        inProgress: jobs.filter(j => j.status === 'in-progress').length,
        cancelled: jobs.filter(j => j.status === 'cancelled').length,
      },
      revenue: {
        total: transactions
          .filter(t => t.type === 'payment')
          .reduce((sum, t) => sum + (t.amount || 0), 0),
        deposits: transactions
          .filter(t => t.type === 'deposit')
          .reduce((sum, t) => sum + (t.amount || 0), 0),
        cashouts: transactions
          .filter(t => t.type === 'cashout')
          .reduce((sum, t) => sum + (t.amount || 0), 0),
      },
      transactions: {
        total: transactions.length,
        byType: {
          deposit: transactions.filter(t => t.type === 'deposit').length,
          payment: transactions.filter(t => t.type === 'payment').length,
          earning: transactions.filter(t => t.type === 'earning').length,
          cashout: transactions.filter(t => t.type === 'cashout').length,
        },
      },
    };
  } catch (error) {
    console.error('Error generating report:', error);
    return null;
  }
}



