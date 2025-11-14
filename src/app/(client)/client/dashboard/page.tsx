'use client';
export const dynamic = 'force-dynamic';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { getFirebase } from '@/lib/firebaseClient';
import { addDoc, collection, serverTimestamp, query, where, onSnapshot, updateDoc, doc, orderBy, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter, useSearchParams } from 'next/navigation';
import type { User as FirebaseUser } from 'firebase/auth';

interface ClientProfile {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  pushNotifications?: boolean;
  language?: string;
  timezone?: string;
  [key: string]: unknown;
}

type ClientTab = 'overview' | 'request' | 'jobs' | 'wallet' | 'profile' | 'settings';
type TimestampLike = Date | { seconds: number; nanoseconds: number } | { toDate: () => Date } | null | undefined;

const formatTimestamp = (value: TimestampLike) => {
  if (!value) return '—';
  if (value instanceof Date) return value.toLocaleString();
  if ('toDate' in value && typeof value.toDate === 'function') {
    return value.toDate().toLocaleString();
  }
  if ('seconds' in value && typeof value.seconds === 'number') {
    return new Date(value.seconds * 1000).toLocaleString();
  }
  return '—';
};

interface Job {
  id: string;
  title: string;
  description: string;
  serviceCategory?: string;
  status: 'requested' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  scheduledAt: TimestampLike;
  createdAt?: TimestampLike;
  artisanId?: string;
  artisanName?: string;
  clientId: string;
  attachments?: string[];
  amount?: number;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'payment' | 'refund';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt?: TimestampLike;
  jobId?: string;
}

interface Wallet {
  balance: number;
  totalDeposits: number;
  totalSpent: number;
}

export default function ClientDashboardPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm text-neutral-600">Loading dashboard…</div>}>
      <ClientDashboardContent />
    </Suspense>
  );
}

function ClientDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionIdFromQuery = searchParams.get('session_id');
  const cancelledPayment = searchParams.get('cancelled');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallet, setWallet] = useState<Wallet>({ balance: 0, totalDeposits: 0, totalSpent: 0 });
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<ClientProfile | null>(null);
  const [activeTab, setActiveTab] = useState<ClientTab>('overview');
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [verifyingSessionId, setVerifyingSessionId] = useState<string | null>(null);
  const [processedSessionId, setProcessedSessionId] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  
  // Profile states
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  
  // Settings states
  const [settingsForm, setSettingsForm] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    language: 'en',
    timezone: 'Africa/Lagos'
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    const { auth } = getFirebase();
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      onAuthStateChanged(auth, (currentUser) => {
        if (!currentUser) {
          window.location.href = '/login';
        } else {
          setUser(currentUser);
          setLoading(false);
        }
      });
    });
  }, []);

  // Load user profile
  useEffect(() => {
    if (!user) return;

    const { db } = getFirebase();
    const profileRef = doc(db, 'profiles', user.uid);
    
    const unsubscribe = onSnapshot(profileRef, (doc) => {
      if (doc.exists()) {
        const profile = doc.data() as ClientProfile;
        setUserProfile(profile);
        setProfileForm({
          name: profile.name || '',
          email: profile.email || user?.email || '',
          phone: profile.phone || '',
          address: profile.address || '',
          company: profile.company || ''
        });
        setSettingsForm({
          emailNotifications: profile.emailNotifications ?? true,
          smsNotifications: profile.smsNotifications ?? false,
          pushNotifications: profile.pushNotifications ?? true,
          language: profile.language || 'en',
          timezone: profile.timezone || 'Africa/Lagos'
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Load wallet data
  useEffect(() => {
    if (!user) return;

    const { db } = getFirebase();
    const walletRef = doc(db, 'wallets', user.uid);
    
    const unsubscribe = onSnapshot(walletRef, (doc) => {
      if (doc.exists()) {
        setWallet(doc.data() as Wallet);
      } else {
        // Initialize wallet
        setDoc(walletRef, {
          balance: 0,
          totalDeposits: 0,
          totalSpent: 0,
          createdAt: serverTimestamp(),
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Load jobs
  useEffect(() => {
    if (!user) return;

    const { db } = getFirebase();
    const jobsQuery = query(
      collection(db, 'jobs'),
      where('clientId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(jobsQuery, (snapshot) => {
      const jobsData: Job[] = [];
      snapshot.forEach((doc) => {
        jobsData.push({ id: doc.id, ...doc.data() } as Job);
      });
      setJobs(jobsData);
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

  useEffect(() => {
    if (!cancelledPayment) return;
    setMessage({ text: 'Deposit cancelled.', type: 'error' });
    router.replace('/client/dashboard');
  }, [cancelledPayment, router]);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const { auth, db, storage } = getFirebase();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        window.location.href = '/login';
        return;
      }

      const attachmentUrls: string[] = [];

      if (files && files.length > 0) {
        for (const file of Array.from(files)) {
          const fileRef = ref(storage, `job-attachments/${Date.now()}-${file.name}`);
          await uploadBytes(fileRef, file);
          const url = await getDownloadURL(fileRef);
          attachmentUrls.push(url);
        }
      }

      await addDoc(collection(db, 'jobs'), {
        clientId: currentUser.uid,
        clientName: userProfile?.name || currentUser.displayName || currentUser.email,
        clientEmail: userProfile?.email || currentUser.email,
        clientPhone: userProfile?.phone || '',
        clientCompany: userProfile?.company || '',
        title,
        description,
        serviceCategory,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: 'requested',
        createdByRole: 'client',
        attachments: attachmentUrls,
        artifact: 'service-request',
        createdAt: serverTimestamp(),
      });

      setMessage({ text: 'Service request submitted successfully!', type: 'success' });
      setTitle('');
      setDescription('');
      setServiceCategory('');
      setScheduledAt('');
      setFiles(null);
      setActiveTab('jobs');
    } catch (error) {
      console.error('Error submitting job:', error);
      setMessage({ text: 'Failed to submit request. Please try again.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeposit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setProcessingPayment(true);
    setMessage(null);

    try {
      if (!user) {
        setMessage({ text: 'You must be signed in to deposit funds.', type: 'error' });
        setProcessingPayment(false);
        return;
      }
      const amount = Number(depositAmount);
      if (!Number.isFinite(amount) || amount < 100) {
        setMessage({ text: 'Minimum deposit is ₦100', type: 'error' });
        setProcessingPayment(false);
        return;
      }

      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, userId: user.uid }),
      });
      const data = await response.json();
      if (!response.ok || !data?.url) {
        setMessage({ text: data?.error || 'Failed to start checkout session.', type: 'error' });
        setProcessingPayment(false);
        return;
      }

      window.location.href = data.url as string;
    } catch (error) {
      console.error('Error processing deposit:', error);
      setMessage({ text: 'Failed to start deposit. Please try again.', type: 'error' });
      setProcessingPayment(false);
    }
  }

  const confirmStripeSession = useCallback(async (sessionId: string) => {
    setVerifyingSessionId(sessionId);
    try {
      const response = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      const data = await response.json();
      if (!response.ok || data?.status !== 'success') {
        setMessage({ text: data?.error || 'Unable to verify payment. Contact support with your receipt.', type: 'error' });
        return;
      }
      setMessage({ text: 'Deposit confirmed! Your wallet will update shortly.', type: 'success' });
      setProcessedSessionId(sessionId);
      setDepositAmount('');
      router.replace('/client/dashboard');
    } catch (error) {
      console.error('Error confirming deposit:', error);
      setMessage({ text: 'Failed to verify payment. Please contact support.', type: 'error' });
    } finally {
      setVerifyingSessionId(null);
    }
  }, [router]);

  useEffect(() => {
    if (!sessionIdFromQuery || verifyingSessionId || processedSessionId === sessionIdFromQuery) {
      return;
    }
    confirmStripeSession(sessionIdFromQuery);
  }, [sessionIdFromQuery, verifyingSessionId, processedSessionId, confirmStripeSession]);

  async function handleSaveProfile() {
    if (!user) {
      setMessage({ text: 'You must be signed in to update your profile.', type: 'error' });
      return;
    }

    setSavingProfile(true);
    try {
      const { db } = getFirebase();
      const profileRef = doc(db, 'profiles', user.uid);
      
      await updateDoc(profileRef, {
        name: profileForm.name,
        phone: profileForm.phone,
        address: profileForm.address,
        company: profileForm.company,
        updatedAt: serverTimestamp(),
      });

      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ text: 'Failed to update profile. Please try again.', type: 'error' });
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleSaveSettings() {
    if (!user) {
      setMessage({ text: 'You must be signed in to update settings.', type: 'error' });
      return;
    }

    setSavingSettings(true);
    try {
      const { db } = getFirebase();
      const profileRef = doc(db, 'profiles', user.uid);
      
      await updateDoc(profileRef, {
        emailNotifications: settingsForm.emailNotifications,
        smsNotifications: settingsForm.smsNotifications,
        pushNotifications: settingsForm.pushNotifications,
        language: settingsForm.language,
        timezone: settingsForm.timezone,
        updatedAt: serverTimestamp(),
      });

      setMessage({ text: 'Settings saved successfully!', type: 'success' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ text: 'Failed to save settings. Please try again.', type: 'error' });
    } finally {
      setSavingSettings(false);
    }
  }

  async function handlePayForJob(jobId: string, amount: number) {
    if (!user) {
      setMessage({ text: 'You must be signed in to pay for a job.', type: 'error' });
      return;
    }

    if (wallet.balance < amount) {
      setMessage({ text: 'Insufficient balance. Please deposit funds.', type: 'error' });
      return;
    }

    try {
      const { db } = getFirebase();

      // Create payment transaction
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        type: 'payment',
        amount: -amount,
        description: `Payment for job`,
        status: 'completed',
        jobId: jobId,
        createdAt: serverTimestamp(),
      });

      // Update wallet
      const walletRef = doc(db, 'wallets', user.uid);
      await updateDoc(walletRef, {
        balance: wallet.balance - amount,
        totalSpent: wallet.totalSpent + amount,
      });

      // Update job status
      await updateDoc(doc(db, 'jobs', jobId), {
        status: 'completed',
        paidAt: serverTimestamp(),
        amount: amount,
      });

      setMessage({ text: 'Payment successful!', type: 'success' });
    } catch (error) {
      console.error('Error processing payment:', error);
      setMessage({ text: 'Payment failed. Please try again.', type: 'error' });
    }
  }

  async function handleCancelJob(jobId: string) {
    if (!confirm('Are you sure you want to cancel this job?')) return;

    try {
      const { db } = getFirebase();
      await updateDoc(doc(db, 'jobs', jobId), {
        status: 'cancelled',
      });
      setMessage({ text: 'Job cancelled successfully', type: 'success' });
    } catch (error) {
      console.error('Error cancelling job:', error);
      setMessage({ text: 'Failed to cancel job', type: 'error' });
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
    total: jobs.length,
    active: jobs.filter(j => ['requested', 'accepted', 'in-progress'].includes(j.status)).length,
    completed: jobs.filter(j => j.status === 'completed').length,
  };

  const tabConfig: Array<{ id: ClientTab; label: string; icon: string; badge?: number }> = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'request', label: 'Request Service', icon: '➕' },
    { id: 'jobs', label: 'My Jobs', icon: '📋', badge: jobs.length },
    { id: 'wallet', label: 'Wallet', icon: '💰' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const renderTabs = (onNavigate?: () => void) =>
    tabConfig.map((tab) => (
      <button
        key={tab.id}
        onClick={() => {
          setActiveTab(tab.id);
          onNavigate?.();
        }}
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
    ));

  const trackableJob = jobs.find((job) => job.artisanId && ['accepted', 'in-progress'].includes(job.status));
  const trackableJobLink = trackableJob ? `/client/tracking?jobId=${trackableJob.id}&artisanId=${trackableJob.artisanId}` : null;

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
      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${mobileNavOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!mobileNavOpen}
      >
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            mobileNavOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileNavOpen(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 w-72 max-w-full transform bg-white shadow-2xl transition-transform duration-300 ${
            mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500">Client Menu</p>
              <p className="text-base font-semibold text-neutral-900">
                {userProfile?.name || user?.displayName || user?.email?.split('@')[0]}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100"
              aria-label="Close navigation menu"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">{renderTabs(() => setMobileNavOpen(false))}</div>
          </div>
          <div className="border-t border-neutral-200 p-4">
            <button
              onClick={async () => {
                const { auth } = getFirebase();
                const { signOut } = await import('firebase/auth');
                await signOut(auth);
                window.location.href = '/login';
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Custom Dashboard Header */}
      <div className="border-b border-neutral-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
              <div className="flex w-full items-center justify-between gap-3 md:w-auto md:justify-start">
                <div className="flex items-center gap-3">
                  <Link href="/">
                    <img src="/logo.png" alt="Phixall" className="h-12" />
                  </Link>
                  <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Client Dashboard</h1>
                    <p className="text-sm text-neutral-600">
                      Welcome back, <span className="font-semibold text-brand-600">{userProfile?.name || user?.displayName || user?.email?.split('@')[0]}</span>! 👋
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 md:hidden"
                  aria-label="Open navigation menu"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h12M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex w-full flex-wrap items-center gap-3 md:w-auto md:justify-end">
              {/* Wallet Balance Display */}
              <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-gradient-to-r from-brand-50 to-brand-100 px-4 py-2">
                <svg className="h-5 w-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <div>
                  <p className="text-xs text-neutral-600">Wallet Balance</p>
                  <p className="font-bold text-brand-700">₦{wallet.balance.toLocaleString()}</p>
                </div>
              </div>
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

      <div className="mx-auto w-full max-w-7xl px-4 pt-2 md:hidden">
        <button
          type="button"
          onClick={() => setActiveTab('request')}
          className="w-full rounded-lg bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          + Create Request
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="hidden border-b border-neutral-200 bg-white md:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap gap-3">{renderTabs()}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {message && (
          <div className={`mb-6 rounded-lg border p-4 ${message.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                {message.type === 'success' ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                )}
              </svg>
              <p className="font-medium">{message.text}</p>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Dashboard Overview</h2>
            <p className="mt-1 text-neutral-600">Track your service requests and activity</p>

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
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-2xl">
                    📋
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-600">Total Jobs</p>
                    <p className="mt-1 text-2xl font-bold text-neutral-900">{stats.total}</p>
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

            {/* Recent Jobs */}
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900">Recent Service Requests</h3>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className="text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  View All →
                </button>
              </div>

              {jobs.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-neutral-300 bg-white p-12 text-center">
                  <div className="text-5xl mb-4">📝</div>
                  <h3 className="text-lg font-semibold text-neutral-900">No service requests yet</h3>
                  <p className="mt-2 text-neutral-600">Get started by requesting your first service</p>
                  <button
                    onClick={() => setActiveTab('request')}
                    className="mt-4 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                  >
                    Request Service
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.slice(0, 5).map((job) => (
                    <div key={job.id} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft transition-all hover:shadow-glow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-neutral-900">{job.title}</h3>
                            <span className={`rounded-full border px-3 py-0.5 text-xs font-medium ${getStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-neutral-600">{job.description}</p>
                          {job.artisanName && (
                            <p className="mt-2 text-sm text-neutral-600">
                              <span className="font-medium">Artisan:</span> {job.artisanName}
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
                <div className="text-3xl mb-3">🔧</div>
                <h3 className="text-lg font-semibold text-neutral-900">Request New Service</h3>
                <p className="mt-2 text-sm text-neutral-600">Get matched with verified artisans for your maintenance needs</p>
                <button
                  onClick={() => setActiveTab('request')}
                  className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                >
                  Request Service
                </button>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-soft">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="text-lg font-semibold text-neutral-900">Add Funds</h3>
                <p className="mt-2 text-sm text-neutral-600">Deposit money to your wallet for quick and easy payments</p>
                <button
                  onClick={() => setActiveTab('wallet')}
                  className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                >
                  Go to Wallet
                </button>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-soft">
                <div className="text-3xl mb-3">📍</div>
                <h3 className="text-lg font-semibold text-neutral-900">Track Active Jobs</h3>
                <p className="mt-2 text-sm text-neutral-600">
                  {trackableJobLink
                    ? 'Monitor artisan location and job progress in real-time'
                    : 'Tracking becomes available once an artisan is assigned'}
                </p>
                {trackableJobLink ? (
                  <Link
                    href={trackableJobLink}
                    className="mt-4 inline-block rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
                  >
                    Open Tracking
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="mt-4 inline-block w-full rounded-lg border border-purple-200 px-4 py-2 text-sm font-semibold text-purple-300 cursor-not-allowed"
                  >
                    Waiting for assignment
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Wallet Tab */}
        {activeTab === 'wallet' && (
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Wallet Management</h2>
            <p className="mt-1 text-neutral-600">Manage your funds and view transaction history</p>

            {/* Wallet Stats */}
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              <div className="rounded-xl border border-neutral-200 bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-soft">
                <div className="text-3xl mb-3">💰</div>
                <p className="text-sm font-medium text-neutral-600">Available Balance</p>
                <p className="mt-2 text-3xl font-bold text-neutral-900">₦{wallet.balance.toLocaleString()}</p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <div className="text-3xl mb-3">📥</div>
                <p className="text-sm font-medium text-neutral-600">Total Deposits</p>
                <p className="mt-2 text-2xl font-bold text-neutral-900">₦{wallet.totalDeposits.toLocaleString()}</p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <div className="text-3xl mb-3">📤</div>
                <p className="text-sm font-medium text-neutral-600">Total Spent</p>
                <p className="mt-2 text-2xl font-bold text-neutral-900">₦{wallet.totalSpent.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {/* Deposit Form */}
              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-neutral-900">Add Funds to Wallet</h3>
                <p className="mt-1 text-sm text-neutral-600">Deposit money to pay for services</p>

                <form onSubmit={handleDeposit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700">Amount (₦)</label>
                    <input
                      type="number"
                      min="100"
                      step="0.01"
                      className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-3 text-lg font-semibold focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      placeholder="Enter amount"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      required
                    />
                    <p className="mt-1 text-xs text-neutral-500">Minimum deposit: ₦100</p>
                  </div>

                  <div className="rounded-lg bg-neutral-50 p-4">
                    <p className="text-sm font-medium text-neutral-700">Quick Select:</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {[1000, 5000, 10000, 20000].map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setDepositAmount(amount.toString())}
                          className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-brand-50 hover:border-brand-300"
                        >
                          ₦{(amount / 1000).toFixed(0)}k
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={processingPayment || !!verifyingSessionId}
                    className="w-full rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingPayment
                      ? 'Starting checkout...'
                      : verifyingSessionId
                        ? 'Verifying payment...'
                        : 'Deposit Funds'}
                  </button>

                  <p className="text-xs text-center text-neutral-500">
                    Secure payment processing with bank-level encryption
                  </p>
                </form>
              </div>

              {/* Transaction History */}
              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-neutral-900">Transaction History</h3>
                <p className="mt-1 text-sm text-neutral-600">View all your wallet transactions</p>

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
                            transaction.type === 'deposit' ? 'bg-green-100 text-green-600' :
                            transaction.type === 'payment' ? 'bg-red-100 text-red-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {transaction.type === 'deposit' ? '📥' : transaction.type === 'payment' ? '📤' : '↩️'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-900">{transaction.description}</p>
                            <p className="text-xs text-neutral-500">
                              {formatTimestamp(transaction.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className={`text-right font-semibold ${
                          transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'deposit' ? '+' : '-'}₦{Math.abs(transaction.amount).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Request Service Tab - Keep existing code */}
        {activeTab === 'request' && (
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-neutral-900">Request a Service</h2>
            <p className="mt-1 text-neutral-600">Fill in the details and get matched with verified artisans</p>

            <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Service Category *</label>
                  <select
                    className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="plumbing">🔧 Plumbing & Leak Repair</option>
                    <option value="electrical">⚡ Electrical & Lighting</option>
                    <option value="hvac">❄️ HVAC & Ventilation</option>
                    <option value="appliance">🔨 Appliance Installation</option>
                    <option value="painting">🎨 Painting & Drywall</option>
                    <option value="carpentry">🚪 Carpentry & Doors</option>
                    <option value="cleaning">🧹 Cleaning Services</option>
                    <option value="other">📦 Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">Job Title *</label>
                  <input
                    type="text"
                    className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    placeholder="e.g., Fix leaking kitchen faucet"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">Description *</label>
                  <textarea
                    className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    rows={5}
                    placeholder="Describe the issue in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">Preferred Schedule</label>
                  <input
                    type="datetime-local"
                    className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-neutral-500">Leave empty for ASAP service</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">Attachments (Photos/Videos)</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="mt-2 block w-full text-sm text-neutral-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
                    onChange={(e) => setFiles(e.target.files)}
                  />
                  <p className="mt-1 text-xs text-neutral-500">Upload photos or videos to help artisans understand the job</p>
                </div>

                <div className="flex gap-4 border-t border-neutral-200 pt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className="rounded-lg border border-neutral-300 px-6 py-3 font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* My Jobs Tab - Keep existing code with payment integration */}
        {activeTab === 'jobs' && (
          <div>
            <h2 className="text-xl font-bold text-neutral-900">My Service Requests</h2>
            <p className="mt-1 text-neutral-600">View and manage all your service requests</p>

            <div className="mt-6 space-y-4">
              {jobs.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-neutral-300 bg-white p-12 text-center">
                  <div className="text-5xl mb-4">📋</div>
                  <h3 className="text-lg font-semibold text-neutral-900">No jobs found</h3>
                  <p className="mt-2 text-neutral-600">Request your first service to get started</p>
                </div>
              ) : (
                jobs.map((job) => (
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
                        
                        {job.artisanName && (
                          <div className="mt-3 flex items-center gap-2 rounded-lg bg-neutral-50 p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                              {job.artisanName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-neutral-900">{job.artisanName}</p>
                              <p className="text-xs text-neutral-500">Assigned Artisan</p>
                            </div>
                          </div>
                        )}

                        <div className="mt-3 flex items-center gap-4 text-xs text-neutral-500">
                          <span>Created: {formatTimestamp(job.createdAt)}</span>
                          {job.scheduledAt && (
                            <span>Scheduled: {formatTimestamp(job.scheduledAt)}</span>
                          )}
                        </div>
                      </div>

                      <div className="ml-4 flex flex-col gap-2">
                        {job.status === 'requested' && (
                          <button
                            onClick={() => handleCancelJob(job.id)}
                            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                          >
                            Cancel
                          </button>
                        )}
                        {job.artisanId && ['accepted', 'in-progress'].includes(job.status) && (
                          <Link
                            href={`/client/tracking?jobId=${job.id}&artisanId=${job.artisanId}`}
                            className="rounded-lg bg-brand-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-brand-700"
                          >
                            {job.status === 'in-progress' ? 'Track Live' : 'View Tracking'}
                          </Link>
                        )}
                        {job.status === 'completed' && !job.amount && (
                          <button
                            onClick={() => handlePayForJob(job.id, 5000)}
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                          >
                            Pay ₦5,000
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <h2 className="text-xl font-bold text-neutral-900 mb-6">Profile Information</h2>
            <div className="max-w-2xl">
              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      disabled
                      className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 text-neutral-500 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-neutral-500">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      placeholder="+234 800 000 0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      rows={3}
                      className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      placeholder="Enter your address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Company/Organization (Optional)
                    </label>
                    <input
                      type="text"
                      value={profileForm.company}
                      onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                      className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {savingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-bold text-neutral-900 mb-6">Dashboard Settings</h2>
            <div className="max-w-2xl space-y-6">
              {/* Notifications */}
              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">Email Notifications</p>
                      <p className="text-sm text-neutral-600">Receive updates via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsForm.emailNotifications}
                        onChange={(e) => setSettingsForm({ ...settingsForm, emailNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">SMS Notifications</p>
                      <p className="text-sm text-neutral-600">Receive updates via SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsForm.smsNotifications}
                        onChange={(e) => setSettingsForm({ ...settingsForm, smsNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">Push Notifications</p>
                      <p className="text-sm text-neutral-600">Receive push notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsForm.pushNotifications}
                        onChange={(e) => setSettingsForm({ ...settingsForm, pushNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Language
                    </label>
                    <select
                      value={settingsForm.language}
                      onChange={(e) => setSettingsForm({ ...settingsForm, language: e.target.value })}
                      className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    >
                      <option value="en">English</option>
                      <option value="yo">Yoruba</option>
                      <option value="ig">Igbo</option>
                      <option value="ha">Hausa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={settingsForm.timezone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, timezone: e.target.value })}
                      className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    >
                      <option value="Africa/Lagos">Lagos (WAT)</option>
                      <option value="Africa/Abuja">Abuja (WAT)</option>
                      <option value="Africa/Port_Harcourt">Port Harcourt (WAT)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  disabled={savingSettings}
                  className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingSettings ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
