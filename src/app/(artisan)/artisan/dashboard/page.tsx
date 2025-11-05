'use client';
export const dynamic = 'force-dynamic';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getFirebase } from '@/lib/firebaseClient';
import { doc, updateDoc, query, collection, where, onSnapshot, getDocs, orderBy, limit, addDoc, serverTimestamp, getDoc, setDoc } from 'firebase/firestore';

interface Job {
  id: string;
  title: string;
  description: string;
  serviceCategory?: string;
  status: 'requested' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  clientId: string;
  clientName?: string;
  artisanId?: string;
  scheduledAt?: any;
  createdAt: any;
  distance_km?: number;
  amount?: number;
}

interface Transaction {
  id: string;
  type: 'earning' | 'cashout' | 'fee';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: any;
  jobId?: string;
}

interface Wallet {
  balance: number;
  totalEarnings: number;
  totalCashout: number;
  pendingBalance: number;
}

export default function ArtisanDashboardPage() {
  const [available, setAvailable] = useState(false);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallet, setWallet] = useState<Wallet>({ balance: 0, totalEarnings: 0, totalCashout: 0, pendingBalance: 0 });
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'available' | 'my-jobs' | 'wallet'>('overview');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [cashoutAmount, setCashoutAmount] = useState('');
  const [processingCashout, setProcessingCashout] = useState(false);
  const [bankAccount, setBankAccount] = useState({ accountNumber: '', bankName: '', accountName: '' });

  const CASHOUT_FEE_PERCENT = 2.5; // 2.5% fee
  const MIN_CASHOUT = 1000; // Minimum ₦1,000

  useEffect(() => {
    const { auth, db } = getFirebase();
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (!currentUser) {
          window.location.href = '/login';
        } else {
          setUser(currentUser);
          
          const profileDoc = await getDocs(query(collection(db, 'profiles'), where('__name__', '==', currentUser.uid), limit(1)));
          if (!profileDoc.empty) {
            const profileData = profileDoc.docs[0].data();
            setProfile(profileData);
            setAvailable(profileData.available || false);
            if (profileData.bankAccount) {
              setBankAccount(profileData.bankAccount);
            }
          }
          
          setLoading(false);
        }
      });
    });
  }, []);

  // Load wallet data
  useEffect(() => {
    if (!user) return;

    const { db } = getFirebase();
    const walletRef = doc(db, 'wallets', user.uid);
    
    const unsubscribe = onSnapshot(walletRef, (doc) => {
      if (doc.exists()) {
        setWallet(doc.data() as Wallet);
      } else {
        setDoc(walletRef, {
          balance: 0,
          totalEarnings: 0,
          totalCashout: 0,
          pendingBalance: 0,
          createdAt: serverTimestamp(),
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Load available jobs
  useEffect(() => {
    if (!user) return;

    const { db } = getFirebase();
    const availableJobsQuery = query(
      collection(db, 'jobs'),
      where('status', '==', 'requested'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(availableJobsQuery, (snapshot) => {
      const jobs: Job[] = [];
      snapshot.forEach((doc) => {
        jobs.push({ id: doc.id, ...doc.data() } as Job);
      });
      setAvailableJobs(jobs);
    });

    return () => unsubscribe();
  }, [user]);

  // Load artisan's jobs
  useEffect(() => {
    if (!user) return;

    const { db } = getFirebase();
    const myJobsQuery = query(
      collection(db, 'jobs'),
      where('artisanId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(myJobsQuery, (snapshot) => {
      const jobs: Job[] = [];
      snapshot.forEach((doc) => {
        jobs.push({ id: doc.id, ...doc.data() } as Job);
      });
      setMyJobs(jobs);
    });

    return () => unsubscribe();
  }, [user]);

  // Load transactions
  useEffect(() => {
    if (!user) return;

    const { db } = getFirebase();
    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(transactionsQuery, (snapshot) => {
      const transactionsData: Transaction[] = [];
      snapshot.forEach((doc) => {
        transactionsData.push({ id: doc.id, ...doc.data() } as Transaction);
      });
      setTransactions(transactionsData);
    });

    return () => unsubscribe();
  }, [user]);

  async function toggleAvailability(): Promise<void> {
    const next = !available;
    setAvailable(next);
    try {
      const { auth, db } = getFirebase();
      const uid = auth.currentUser?.uid;
      if (uid) {
        await updateDoc(doc(db, 'profiles', uid), { 
          available: next,
          lastAvailableToggle: new Date()
        });
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
      setAvailable(!next);
    }
  }

  async function acceptJob(jobId: string) {
    if (!user) return;

    try {
      const { db } = getFirebase();
      await updateDoc(doc(db, 'jobs', jobId), {
        artisanId: user.uid,
        artisanName: user.displayName || user.email,
        status: 'accepted',
        acceptedAt: new Date(),
      });

      setActiveTab('my-jobs');
    } catch (error) {
      console.error('Error accepting job:', error);
      alert('Failed to accept job. Please try again.');
    }
  }

  async function updateJobStatus(jobId: string, newStatus: 'in-progress' | 'completed') {
    try {
      const { db } = getFirebase();
      
      const jobRef = doc(db, 'jobs', jobId);
      const jobDoc = await getDoc(jobRef);
      const jobData = jobDoc.data();

      await updateDoc(jobRef, {
        status: newStatus,
        [`${newStatus}At`]: new Date(),
      });

      // If job is completed, add earning to wallet
      if (newStatus === 'completed' && jobData?.amount) {
        const walletRef = doc(db, 'wallets', user.uid);
        const walletDoc = await getDoc(walletRef);
        const currentWallet = walletDoc.data() as Wallet;

        await updateDoc(walletRef, {
          balance: (currentWallet?.balance || 0) + jobData.amount,
          totalEarnings: (currentWallet?.totalEarnings || 0) + jobData.amount,
        });

        // Create earning transaction
        await addDoc(collection(db, 'transactions'), {
          userId: user.uid,
          type: 'earning',
          amount: jobData.amount,
          description: `Earned from: ${jobData.title}`,
          status: 'completed',
          jobId: jobId,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      alert('Failed to update job status. Please try again.');
    }
  }

  async function handleCashout(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setProcessingCashout(true);

    try {
      const amount = parseFloat(cashoutAmount);
      
      if (amount < MIN_CASHOUT) {
        alert(`Minimum cashout is ₦${MIN_CASHOUT.toLocaleString()}`);
        setProcessingCashout(false);
        return;
      }

      if (amount > wallet.balance) {
        alert('Insufficient balance');
        setProcessingCashout(false);
        return;
      }

      if (!bankAccount.accountNumber || !bankAccount.bankName) {
        alert('Please add your bank account details first');
        setProcessingCashout(false);
        return;
      }

      const fee = (amount * CASHOUT_FEE_PERCENT) / 100;
      const netAmount = amount - fee;

      const { db } = getFirebase();

      // Create cashout transaction
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        type: 'cashout',
        amount: -amount,
        netAmount: netAmount,
        fee: fee,
        description: `Cashout to ${bankAccount.accountName} (${bankAccount.accountNumber})`,
        status: 'pending', // Would be 'completed' after bank transfer
        bankAccount: bankAccount,
        createdAt: serverTimestamp(),
      });

      // Create fee transaction
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        type: 'fee',
        amount: -fee,
        description: `Transaction fee (${CASHOUT_FEE_PERCENT}%)`,
        status: 'completed',
        createdAt: serverTimestamp(),
      });

      // Update wallet
      const walletRef = doc(db, 'wallets', user.uid);
      await updateDoc(walletRef, {
        balance: wallet.balance - amount,
        totalCashout: wallet.totalCashout + amount,
      });

      alert(`Cashout request submitted! You will receive ₦${netAmount.toLocaleString()} (₦${fee.toFixed(2)} fee deducted)`);
      setCashoutAmount('');
    } catch (error) {
      console.error('Error processing cashout:', error);
      alert('Failed to process cashout. Please try again.');
    } finally {
      setProcessingCashout(false);
    }
  }

  async function saveBankAccount() {
    try {
      const { db } = getFirebase();
      await updateDoc(doc(db, 'profiles', user.uid), {
        bankAccount: bankAccount,
      });
      alert('Bank account saved successfully!');
    } catch (error) {
      console.error('Error saving bank account:', error);
      alert('Failed to save bank account');
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'accepted':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in-progress':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const stats = {
    available: availableJobs.length,
    active: myJobs.filter(j => ['accepted', 'in-progress'].includes(j.status)).length,
    completed: myJobs.filter(j => j.status === 'completed').length,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Custom Dashboard Header */}
      <div className="border-b border-neutral-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <img src="/logo.png" alt="Phixall" className="h-12" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">Artisan Dashboard</h1>
                <p className="text-sm text-neutral-600">Welcome, {user?.displayName || user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Wallet Balance Display */}
              <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-gradient-to-r from-green-50 to-green-100 px-4 py-2">
                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <div>
                  <p className="text-xs text-neutral-600">Wallet Balance</p>
                  <p className="font-bold text-green-700">₦{wallet.balance.toLocaleString()}</p>
                </div>
              </div>

              {/* Availability Toggle */}
              <button
                onClick={toggleAvailability}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition-all ${
                  available
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-neutral-600 hover:bg-neutral-700'
                }`}
              >
                <div className={`h-2 w-2 rounded-full ${available ? 'bg-white animate-pulse' : 'bg-neutral-400'}`}></div>
                {available ? 'Available' : 'Unavailable'}
              </button>

              <button
                onClick={async () => {
                  const { auth } = getFirebase();
                  const { signOut } = await import('firebase/auth');
                  await signOut(auth);
                  window.location.href = '/login';
                }}
                className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'available', label: 'Available Jobs', icon: '🔔', badge: availableJobs.length },
              { id: 'my-jobs', label: 'My Jobs', icon: '💼', badge: myJobs.length },
              { id: 'wallet', label: 'Wallet', icon: '💰' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Dashboard Overview</h2>
            <p className="mt-1 text-neutral-600">Track your jobs and earnings</p>

            {/* Stats Cards */}
            <div className="mt-6 grid gap-6 sm:grid-cols-4">
              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-2xl">
                    💰
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-600">Wallet Balance</p>
                    <p className="mt-1 text-2xl font-bold text-neutral-900">₦{wallet.balance.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-50 text-2xl">
                    🔔
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-600">Available Jobs</p>
                    <p className="mt-1 text-2xl font-bold text-neutral-900">{stats.available}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-2xl">
                    🔄
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-600">Active Jobs</p>
                    <p className="mt-1 text-2xl font-bold text-neutral-900">{stats.active}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-2xl">
                    ✓
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-600">Completed</p>
                    <p className="mt-1 text-2xl font-bold text-neutral-900">{stats.completed}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Status */}
            <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Availability Status</h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    {available 
                      ? "You're currently available to receive job notifications" 
                      : "Turn on availability to start receiving job offers"}
                  </p>
                </div>
                <button
                  onClick={toggleAvailability}
                  className={`rounded-lg px-6 py-3 font-semibold text-white transition-all ${
                    available
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-neutral-600 hover:bg-neutral-700'
                  }`}
                >
                  {available ? 'Go Unavailable' : 'Go Available'}
                </button>
              </div>
            </div>

            {/* Recent Jobs */}
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900">Recent Jobs</h3>
                <button
                  onClick={() => setActiveTab('my-jobs')}
                  className="text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  View All →
                </button>
              </div>

              {myJobs.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-neutral-300 bg-white p-12 text-center">
                  <div className="text-5xl mb-4">💼</div>
                  <h3 className="text-lg font-semibold text-neutral-900">No jobs yet</h3>
                  <p className="mt-2 text-neutral-600">Accept jobs from available listings to get started</p>
                  <button
                    onClick={() => setActiveTab('available')}
                    className="mt-4 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                  >
                    Browse Jobs
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myJobs.slice(0, 5).map((job) => (
                    <div key={job.id} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-neutral-900">{job.title}</h3>
                            <span className={`rounded-full border px-3 py-0.5 text-xs font-medium ${getStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-neutral-600">{job.description}</p>
                          {job.clientName && (
                            <p className="mt-2 text-sm text-neutral-600">
                              <span className="font-medium">Client:</span> {job.clientName}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <div className="rounded-xl border border-neutral-200 bg-gradient-to-br from-brand-50 to-brand-100 p-6 shadow-soft">
                <div className="text-3xl mb-3">🔔</div>
                <h3 className="text-lg font-semibold text-neutral-900">Available Jobs</h3>
                <p className="mt-2 text-sm text-neutral-600">Browse and accept new job opportunities near you</p>
                <button
                  onClick={() => setActiveTab('available')}
                  className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                >
                  View Jobs ({availableJobs.length})
                </button>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-soft">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="text-lg font-semibold text-neutral-900">Cash Out</h3>
                <p className="mt-2 text-sm text-neutral-600">Withdraw your earnings to your bank account</p>
                <button
                  onClick={() => setActiveTab('wallet')}
                  className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                >
                  Go to Wallet
                </button>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-soft">
                <div className="text-3xl mb-3">📍</div>
                <h3 className="text-lg font-semibold text-neutral-900">Location Broadcast</h3>
                <p className="mt-2 text-sm text-neutral-600">Share your location for active jobs to enable client tracking</p>
                <Link
                  href="/artisan/location-broadcast"
                  className="mt-4 inline-block rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
                >
                  Open Broadcast
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Wallet Tab */}
        {activeTab === 'wallet' && (
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Wallet Management</h2>
            <p className="mt-1 text-neutral-600">Manage your earnings and cash out</p>

            {/* Wallet Stats */}
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              <div className="rounded-xl border border-neutral-200 bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-soft">
                <div className="text-3xl mb-3">💰</div>
                <p className="text-sm font-medium text-neutral-600">Available Balance</p>
                <p className="mt-2 text-3xl font-bold text-neutral-900">₦{wallet.balance.toLocaleString()}</p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <div className="text-3xl mb-3">📈</div>
                <p className="text-sm font-medium text-neutral-600">Total Earnings</p>
                <p className="mt-2 text-2xl font-bold text-neutral-900">₦{wallet.totalEarnings.toLocaleString()}</p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <div className="text-3xl mb-3">📤</div>
                <p className="text-sm font-medium text-neutral-600">Total Cashout</p>
                <p className="mt-2 text-2xl font-bold text-neutral-900">₦{wallet.totalCashout.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {/* Cashout Form */}
              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-neutral-900">Cash Out to Bank</h3>
                <p className="mt-1 text-sm text-neutral-600">Withdraw your earnings ({CASHOUT_FEE_PERCENT}% transaction fee applies)</p>

                {/* Bank Account Form */}
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700">Bank Name</label>
                    <input
                      type="text"
                      className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      placeholder="Enter bank name"
                      value={bankAccount.bankName}
                      onChange={(e) => setBankAccount({ ...bankAccount, bankName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700">Account Number</label>
                    <input
                      type="text"
                      className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      placeholder="0000000000"
                      value={bankAccount.accountNumber}
                      onChange={(e) => setBankAccount({ ...bankAccount, accountNumber: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700">Account Name</label>
                    <input
                      type="text"
                      className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      placeholder="Account holder name"
                      value={bankAccount.accountName}
                      onChange={(e) => setBankAccount({ ...bankAccount, accountName: e.target.value })}
                    />
                  </div>

                  <button
                    onClick={saveBankAccount}
                    className="w-full rounded-lg border border-brand-300 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100"
                  >
                    Save Bank Account
                  </button>
                </div>

                {/* Cashout Form */}
                <form onSubmit={handleCashout} className="mt-6 space-y-4 border-t border-neutral-200 pt-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700">Amount to Cashout (₦)</label>
                    <input
                      type="number"
                      min={MIN_CASHOUT}
                      max={wallet.balance}
                      step="0.01"
                      className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-3 text-lg font-semibold focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      placeholder="Enter amount"
                      value={cashoutAmount}
                      onChange={(e) => setCashoutAmount(e.target.value)}
                      required
                    />
                    <p className="mt-1 text-xs text-neutral-500">
                      Minimum: ₦{MIN_CASHOUT.toLocaleString()} | Available: ₦{wallet.balance.toLocaleString()}
                    </p>
                  </div>

                  {cashoutAmount && parseFloat(cashoutAmount) >= MIN_CASHOUT && (
                    <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                      <p className="text-sm font-medium text-amber-900">Fee Breakdown:</p>
                      <div className="mt-2 space-y-1 text-sm text-amber-700">
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span className="font-semibold">₦{parseFloat(cashoutAmount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fee ({CASHOUT_FEE_PERCENT}%):</span>
                          <span className="font-semibold">-₦{((parseFloat(cashoutAmount) * CASHOUT_FEE_PERCENT) / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t border-amber-300 pt-1 font-bold">
                          <span>You Receive:</span>
                          <span>₦{(parseFloat(cashoutAmount) - (parseFloat(cashoutAmount) * CASHOUT_FEE_PERCENT) / 100).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={processingCashout || !bankAccount.accountNumber}
                    className="w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingCashout ? 'Processing...' : 'Cash Out'}
                  </button>

                  <p className="text-xs text-center text-neutral-500">
                    Funds will be transferred within 24 hours
                  </p>
                </form>
              </div>

              {/* Transaction History */}
              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-neutral-900">Transaction History</h3>
                <p className="mt-1 text-sm text-neutral-600">View all your earnings and withdrawals</p>

                <div className="mt-6 space-y-3 max-h-96 overflow-y-auto">
                  {transactions.length === 0 ? (
                    <div className="py-8 text-center">
                      <div className="text-4xl mb-2">📜</div>
                      <p className="text-sm text-neutral-600">No transactions yet</p>
                    </div>
                  ) : (
                    transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 hover:bg-neutral-50">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                            transaction.type === 'earning' ? 'bg-green-100 text-green-600' :
                            transaction.type === 'cashout' ? 'bg-blue-100 text-blue-600' :
                            'bg-red-100 text-red-600'
                          }`}>
                            {transaction.type === 'earning' ? '💵' : transaction.type === 'cashout' ? '📤' : '💸'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-900">{transaction.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                                transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {transaction.status}
                              </span>
                              <p className="text-xs text-neutral-500">
                                {transaction.createdAt?.toDate().toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className={`text-right font-semibold ${
                          transaction.type === 'earning' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'earning' ? '+' : '-'}₦{Math.abs(transaction.amount).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Available Jobs Tab */}
        {activeTab === 'available' && (
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Available Jobs</h2>
            <p className="mt-1 text-neutral-600">Browse and accept job opportunities</p>

            <div className="mt-6 space-y-4">
              {availableJobs.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-neutral-300 bg-white p-12 text-center">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold text-neutral-900">No available jobs</h3>
                  <p className="mt-2 text-neutral-600">Check back later for new opportunities</p>
                </div>
              ) : (
                availableJobs.map((job) => (
                  <div key={job.id} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft transition-all hover:shadow-glow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {job.serviceCategory === 'plumbing' && '🔧'}
                            {job.serviceCategory === 'electrical' && '⚡'}
                            {job.serviceCategory === 'hvac' && '❄️'}
                            {job.serviceCategory === 'appliance' && '🔨'}
                            {job.serviceCategory === 'painting' && '🎨'}
                            {job.serviceCategory === 'carpentry' && '🚪'}
                            {job.serviceCategory === 'cleaning' && '🧹'}
                            {!job.serviceCategory && '📦'}
                          </span>
                          <div>
                            <h3 className="font-semibold text-neutral-900">{job.title}</h3>
                            <span className="mt-1 inline-block rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
                              New Request
                            </span>
                          </div>
                        </div>

                        <p className="mt-3 text-sm text-neutral-600">{job.description}</p>

                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                          {job.clientName && <span>Client: {job.clientName}</span>}
                          {job.scheduledAt && (
                            <span>Scheduled: {new Date(job.scheduledAt.toDate()).toLocaleString()}</span>
                          )}
                          {job.distance_km && <span>{job.distance_km} km away</span>}
                          <span>Posted: {job.createdAt?.toDate().toLocaleDateString()}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => acceptJob(job.id)}
                        className="ml-4 rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
                      >
                        Accept Job
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* My Jobs Tab */}
        {activeTab === 'my-jobs' && (
          <div>
            <h2 className="text-xl font-bold text-neutral-900">My Jobs</h2>
            <p className="mt-1 text-neutral-600">Manage your accepted jobs</p>

            <div className="mt-6 space-y-4">
              {myJobs.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-neutral-300 bg-white p-12 text-center">
                  <div className="text-5xl mb-4">💼</div>
                  <h3 className="text-lg font-semibold text-neutral-900">No jobs yet</h3>
                  <p className="mt-2 text-neutral-600">Accept jobs to see them here</p>
                  <button
                    onClick={() => setActiveTab('available')}
                    className="mt-4 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                  >
                    Browse Jobs
                  </button>
                </div>
              ) : (
                myJobs.map((job) => (
                  <div key={job.id} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {job.serviceCategory === 'plumbing' && '🔧'}
                            {job.serviceCategory === 'electrical' && '⚡'}
                            {job.serviceCategory === 'hvac' && '❄️'}
                            {job.serviceCategory === 'appliance' && '🔨'}
                            {job.serviceCategory === 'painting' && '🎨'}
                            {job.serviceCategory === 'carpentry' && '🚪'}
                            {job.serviceCategory === 'cleaning' && '🧹'}
                            {!job.serviceCategory && '📦'}
                          </span>
                          <div>
                            <h3 className="font-semibold text-neutral-900">{job.title}</h3>
                            <span className={`mt-1 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                          </div>
                        </div>

                        <p className="mt-3 text-sm text-neutral-600">{job.description}</p>

                        {job.clientName && (
                          <div className="mt-3 flex items-center gap-2 rounded-lg bg-neutral-50 p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                              {job.clientName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-neutral-900">{job.clientName}</p>
                              <p className="text-xs text-neutral-500">Client</p>
                            </div>
                          </div>
                        )}

                        <div className="mt-3 flex items-center gap-4 text-xs text-neutral-500">
                          {job.scheduledAt && (
                            <span>Scheduled: {new Date(job.scheduledAt.toDate()).toLocaleString()}</span>
                          )}
                          <span>Accepted: {job.createdAt?.toDate().toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="ml-4 flex flex-col gap-2">
                        {job.status === 'accepted' && (
                          <button
                            onClick={() => updateJobStatus(job.id, 'in-progress')}
                            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                          >
                            Start Job
                          </button>
                        )}
                        {job.status === 'in-progress' && (
                          <>
                            <Link
                              href="/artisan/location-broadcast"
                              className="rounded-lg border border-purple-300 px-4 py-2 text-center text-sm font-medium text-purple-600 hover:bg-purple-50"
                            >
                              Broadcast Location
                            </Link>
                            <button
                              onClick={() => updateJobStatus(job.id, 'completed')}
                              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                            >
                              Mark Complete
                            </button>
                          </>
                        )}
                        {job.status === 'completed' && (
                          <div className="flex items-center gap-2 text-green-600">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium">Completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
