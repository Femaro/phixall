'use client';
export const dynamic = 'force-dynamic';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getFirebase } from '@/lib/firebaseClient';
import { doc, updateDoc, query, collection, where, onSnapshot, getDocs, orderBy, limit, addDoc, serverTimestamp, getDoc, setDoc } from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';
import { SupportChat } from '@/components/support/SupportChat';

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

const EARTH_RADIUS_KM = 6371;

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function calculateDistanceKm(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): number {
  const dLat = toRadians(destination.lat - origin.lat);
  const dLon = toRadians(destination.lng - origin.lng);
  const lat1 = toRadians(origin.lat);
  const lat2 = toRadians(destination.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

interface ArtisanProfile {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  state?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  skills?: string;
  experience?: string;
  available?: boolean;
  bankAccount?: {
    accountNumber?: string;
    bankName?: string;
    accountName?: string;
  };
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  pushNotifications?: boolean;
  language?: string;
  timezone?: string;
  [key: string]: unknown;
}

type ArtisanTab = 'overview' | 'available' | 'my-jobs' | 'wallet' | 'profile' | 'settings';

interface Job {
  id: string;
  title: string;
  description: string;
  serviceCategory?: string;
  status: 'requested' | 'accepted' | 'in-progress' | 'pending-completion' | 'completed' | 'cancelled';
  clientId: string;
  clientName?: string;
  artisanId?: string;
  phixerId?: string;
  scheduledAt?: TimestampLike;
  createdAt?: TimestampLike;
  amount?: number;
  clientVerified?: boolean;
  clientReview?: {
    rating?: number;
    feedback?: string;
    verifiedAt?: TimestampLike;
    clientName?: string;
  };
  artisanReview?: {
    rating?: number;
    feedback?: string;
    ratedAt?: TimestampLike;
    artisanName?: string;
  };
  serviceAddress?: {
    description?: string;
    placeId?: string;
    lat?: number;
    lng?: number;
  };
  serviceCoordinates?: {
    lat: number;
    lng: number;
  } | null;
  serviceState?: string;
}

interface Transaction {
  id: string;
  type: 'earning' | 'cashout' | 'fee';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt?: TimestampLike;
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
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [activeTab, setActiveTab] = useState<ArtisanTab>('overview');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ArtisanProfile | null>(null);
  const [cashoutAmount, setCashoutAmount] = useState('');
  const [processingCashout, setProcessingCashout] = useState(false);
  const [bankAccount, setBankAccount] = useState({ accountNumber: '', bankName: '', accountName: '' });
  
  // Profile states
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  state: '',
    skills: '',
    experience: ''
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [clientRatingForms, setClientRatingForms] = useState<Record<string, { rating: number; feedback: string }>>({});
  const [submittingClientReview, setSubmittingClientReview] = useState<string | null>(null);
  const [artisanCoords, setArtisanCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [capturingLocation, setCapturingLocation] = useState(false);

  const CASHOUT_FEE_PERCENT = 2.5; // 2.5% fee
  const MIN_CASHOUT = 1000; // Minimum ₦1,000

  useEffect(() => {
    const { auth, db } = getFirebase();
    import('firebase/auth').then(async ({ onAuthStateChanged }) => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (!currentUser) {
          window.location.href = '/login';
          return;
        }
        
        setUser(currentUser);
        
        // Check onboarding status for artisans
        const onboardingRef = doc(db, 'phixer_onboarding', currentUser.uid);
        const onboardingDoc = await getDoc(onboardingRef);
        
        if (onboardingDoc.exists()) {
          const onboardingData = onboardingDoc.data();
          
          // If not approved, redirect to onboarding
          if (onboardingData.status !== 'approved') {
            window.location.href = '/onboarding';
            return;
          }
        } else {
          // No onboarding record, redirect to start onboarding
          window.location.href = '/onboarding';
          return;
        }
        
        // Continue with normal dashboard loading
        const profileDoc = await getDocs(query(collection(db, 'profiles'), where('__name__', '==', currentUser.uid), limit(1)));
        if (!profileDoc.empty) {
          const profileData = profileDoc.docs[0].data();
          setProfile(profileData);
          setAvailable(profileData.available || false);
          if (profileData.bankAccount) {
            setBankAccount(profileData.bankAccount);
          }
          // Populate profile form
          setProfileForm({
            name: profileData.name || '',
            email: profileData.email || currentUser.email,
            phone: profileData.phone || '',
            address: profileData.address || '',
            state: profileData.state || '',
            skills: profileData.skills || '',
            experience: profileData.experience || ''
          });
          if (profileData.coordinates?.lat && profileData.coordinates?.lng) {
            setArtisanCoords({ lat: profileData.coordinates.lat, lng: profileData.coordinates.lng });
          }
          // Populate settings form
          setSettingsForm({
            emailNotifications: profileData.emailNotifications ?? true,
            smsNotifications: profileData.smsNotifications ?? false,
            pushNotifications: profileData.pushNotifications ?? true,
            language: profileData.language || 'en',
            timezone: profileData.timezone || 'Africa/Lagos'
          });
        }
        
        setLoading(false);
      });
    });
  }, []);

  // Load wallet data
  useEffect(() => {
    if (!user) return;

    const { db } = getFirebase();
    const walletRef = doc(db, 'wallets', user.uid);
    
    const unsubscribe = onSnapshot(walletRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data() as Partial<Wallet> | undefined;
        setWallet({
          balance: data?.balance ?? 0,
          totalEarnings: data?.totalEarnings ?? 0,
          totalCashout: data?.totalCashout ?? 0,
          pendingBalance: data?.pendingBalance ?? 0,
        });
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
    if (!user) {
      alert('You must be signed in to update job status.');
      return;
    }

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

  async function handleSaveProfile() {
    if (!user) {
      alert('You must be signed in to update your profile.');
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
        state: profileForm.state,
        skills: profileForm.skills,
        experience: profileForm.experience,
        updatedAt: serverTimestamp(),
      });

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleSaveSettings() {
    if (!user) {
      alert('You must be signed in to update your settings.');
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

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSavingSettings(false);
    }
  }

  function handleClientRatingFormChange(jobId: string, field: 'rating' | 'feedback', value: number | string) {
    setClientRatingForms((prev) => {
      const current = prev[jobId] ?? { rating: 5, feedback: '' };
      return {
        ...prev,
        [jobId]: {
          ...current,
          [field]: value,
        },
      };
    });
  }

  async function handleSubmitClientReview(jobId: string) {
    if (!user) {
      alert('You must be signed in to rate the client.');
      return;
    }

    const form = clientRatingForms[jobId] ?? { rating: 5, feedback: '' };
    if (!(form.rating >= 1 && form.rating <= 5)) {
      alert('Please select a rating between 1 and 5.');
      return;
    }

    setSubmittingClientReview(jobId);
    try {
      const { db } = getFirebase();
      await updateDoc(doc(db, 'jobs', jobId), {
        artisanReview: {
          rating: form.rating,
          feedback: form.feedback,
          ratedAt: serverTimestamp(),
          artisanName: profile?.name || user.email || '',
        },
      });

      alert('Thanks! Your rating has been submitted.');
      setClientRatingForms((prev) => {
        const next = { ...prev };
        delete next[jobId];
        return next;
      });
    } catch (error) {
      console.error('Error submitting client review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmittingClientReview(null);
    }
  }

  function captureArtisanLocation(persist: boolean) {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported in this browser.');
      return;
    }
    setCapturingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setArtisanCoords(coords);
        if (persist && user) {
          try {
            const { db } = getFirebase();
            await updateDoc(doc(db, 'profiles', user.uid), {
              coordinates: coords,
              updatedAt: serverTimestamp(),
            });
            alert('Home location saved successfully!');
          } catch (error) {
            console.error('Error saving location:', error);
            alert('Failed to save location. Please try again.');
          }
        }
        setCapturingLocation(false);
      },
      (error) => {
        console.error('Geolocation error', error);
        alert('Unable to retrieve location. Please check your browser permissions.');
        setCapturingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleCashout(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setProcessingCashout(true);

    if (!user) {
      alert('You must be signed in to request a cashout.');
      setProcessingCashout(false);
      return;
    }

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
    if (!user) {
      alert('You must be signed in to save bank details.');
      return;
    }

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
      case 'pending-completion':
        return 'bg-amber-100 text-amber-700 border-amber-200';
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
  const pendingClientRatings = myJobs.filter((job) => job.status === 'completed' && !job.artisanReview?.rating);
  const artisanRatingStats = myJobs.reduce(
    (acc, job) => {
      const rating = job.clientReview?.rating;
      if (rating) {
        acc.sum += rating;
        acc.count += 1;
      }
      return acc;
    },
    { sum: 0, count: 0 }
  );
  const artisanAverageRating = artisanRatingStats.count ? artisanRatingStats.sum / artisanRatingStats.count : null;

  type JobWithDistance = Job & { distanceMiles?: number | null };
  const visibleAvailableJobs: JobWithDistance[] = useMemo(() => {
    const artisanState = profile?.state?.toLowerCase().trim();
    return availableJobs
      .map((job) => {
        let distanceMiles: number | null = null;
        if (artisanCoords && job.serviceCoordinates?.lat && job.serviceCoordinates?.lng) {
          const km = calculateDistanceKm(artisanCoords, {
            lat: job.serviceCoordinates.lat,
            lng: job.serviceCoordinates.lng,
          });
          distanceMiles = km / 1.60934;
        }
        return { ...job, distanceMiles };
      })
      .filter((job) => {
        const jobState = job.serviceState?.toLowerCase().trim();
        if (artisanState && jobState && artisanState !== jobState) {
          return false;
        }
        if (artisanCoords && job.distanceMiles != null && job.distanceMiles > 20) {
          return false;
        }
        if (artisanCoords && job.serviceCoordinates && job.distanceMiles == null) {
          return false;
        }
        return true;
      });
  }, [availableJobs, artisanCoords, profile?.state]);

  const broadcastableJob = myJobs.find((job) => ['accepted', 'in-progress'].includes(job.status));
  const broadcastLink = broadcastableJob ? `/artisan/location-broadcast?jobId=${broadcastableJob.id}` : null;

  const tabConfig: Array<{ id: ArtisanTab; label: string; icon: string; badge?: number }> = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'available', label: 'Available Jobs', icon: '🔔', badge: visibleAvailableJobs.length },
    { id: 'my-jobs', label: 'My Jobs', icon: '💼', badge: myJobs.length },
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
      <SupportChat user={user} role="artisan" />
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
                  <p className="text-xs uppercase tracking-wide text-neutral-500">Artisan Menu</p>
                  <p className="text-base font-semibold text-neutral-900">
                    {profile?.name || user?.displayName || user?.email?.split('@')[0]}
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
          <div className="border-t border-neutral-200 p-4 space-y-3">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
              Toggle your availability or update your profile anytime.
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  toggleAvailability();
                  setMobileNavOpen(false);
                }}
                className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white ${
                  available ? 'bg-green-600 hover:bg-green-700' : 'bg-neutral-600 hover:bg-neutral-700'
                }`}
              >
                <div className={`h-2 w-2 rounded-full ${available ? 'bg-white animate-pulse' : 'bg-neutral-300'}`} />
                {available ? 'Available' : 'Unavailable'}
              </button>
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
      </div>
      {/* Custom Dashboard Header */}
      <div className="border-b border-neutral-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
              <div className="flex w-full items-center justify-between gap-3 md:w-auto md:justify-start">
                <div className="flex items-center gap-3">
                  <Link href="/">
                    <Image src="/logo.png" alt="Phixall" width={48} height={48} className="h-12 w-12" priority />
                  </Link>
                  <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Artisan Dashboard</h1>
                    <p className="text-sm text-neutral-600">
                      Welcome back, <span className="font-semibold text-brand-600">{profile?.name || user?.displayName || user?.email?.split('@')[0]}</span>! 👋
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
      <div className="hidden border-b border-neutral-200 bg-white md:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap gap-3">{renderTabs()}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
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

              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-2xl">
                    ⭐
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-600">Your Rating</p>
                    {artisanAverageRating ? (
                      <>
                        <p className="mt-1 text-2xl font-bold text-neutral-900">{artisanAverageRating.toFixed(1)} / 5</p>
                        <p className="text-xs text-neutral-500">{artisanRatingStats.count} review(s)</p>
                      </>
                    ) : (
                      <p className="mt-1 text-sm text-neutral-500">No ratings yet</p>
                    )}
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

            {pendingClientRatings.length > 0 && (
              <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-blue-900">Rate your clients</h3>
                <p className="mt-1 text-sm text-blue-800">
                  Share feedback about recent clients to help us maintain great experiences.
                </p>

                <div className="mt-6 space-y-6">
                  {pendingClientRatings.map((job) => {
                    const form = clientRatingForms[job.id] ?? { rating: 5, feedback: '' };
                    return (
                      <div key={job.id} className="rounded-xl border border-white/50 bg-white/80 p-5 shadow-inner">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-neutral-500">Client</p>
                          <p className="text-lg font-semibold text-neutral-900">{job.clientName || 'Client'}</p>
                          <p className="text-sm text-neutral-600">{job.title}</p>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-3">
                          <div>
                            <label className="text-sm font-medium text-neutral-700">Client professionalism</label>
                            <select
                              value={form.rating}
                              onChange={(e) => handleClientRatingFormChange(job.id, 'rating', Number(e.target.value))}
                              className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                            >
                              {[5, 4, 3, 2, 1].map((rating) => {
                                const labels: Record<number, string> = {
                                  5: 'Excellent',
                                  4: 'Very Good',
                                  3: 'Good',
                                  2: 'Fair',
                                  1: 'Poor',
                                };
                                return (
                                  <option key={rating} value={rating}>
                                    {rating} - {labels[rating]}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-neutral-700">Comments (optional)</label>
                            <textarea
                              value={form.feedback}
                              onChange={(e) => handleClientRatingFormChange(job.id, 'feedback', e.target.value)}
                              rows={3}
                              className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                              placeholder="Share any helpful notes about this client"
                            />
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => handleSubmitClientReview(job.id)}
                            disabled={submittingClientReview === job.id}
                            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {submittingClientReview === job.id ? 'Submitting...' : 'Submit rating'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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
                <p className="mt-2 text-sm text-neutral-600">
                  {broadcastLink
                    ? 'Share your live location with clients for this job'
                    : 'Start or accept a job to enable live location sharing'}
                </p>
                {broadcastLink ? (
                  <Link
                    href={broadcastLink}
                    className="mt-4 inline-block rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
                  >
                    Broadcast for Job
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="mt-4 inline-block w-full rounded-lg border border-purple-200 px-4 py-2 text-sm font-semibold text-purple-300 cursor-not-allowed"
                  >
                    No active jobs
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
                                {formatTimestamp(transaction.createdAt)}
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

            <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">Filtering nearby jobs</p>
                  <p className="text-xs text-neutral-600">
                    Showing jobs in {profile?.state || 'your state'} within 20 miles of your location.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => captureArtisanLocation(false)}
                    className="rounded-lg border border-brand-300 px-3 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-50"
                    disabled={capturingLocation}
                  >
                    {capturingLocation ? 'Updating location…' : 'Refresh location'}
                  </button>
                  <button
                    type="button"
                    onClick={() => captureArtisanLocation(true)}
                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    disabled={capturingLocation}
                  >
                    Save as home base
                  </button>
                </div>
              </div>
              {!profile?.state && (
                <p className="mt-2 text-xs text-amber-700">
                  Add your state in the Profile tab to unlock better job matching.
                </p>
              )}
              {!artisanCoords && (
                <p className="mt-2 text-xs text-amber-700">
                  Share your current location to filter jobs by distance.
                </p>
              )}
            </div>

            <div className="mt-6 space-y-4">
              {visibleAvailableJobs.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-neutral-300 bg-white p-12 text-center">
                  <div className="text-5xl mb-4">📍</div>
                  <h3 className="text-lg font-semibold text-neutral-900">No jobs nearby</h3>
                  <p className="mt-2 text-neutral-600">
                    We couldn’t find jobs that match your state and distance preferences. Try refreshing your
                    location or updating your state.
                  </p>
                </div>
              ) : (
                visibleAvailableJobs.map((job) => (
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
                        {job.serviceAddress?.description && (
                          <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
                            <span>📍 {job.serviceAddress.description}</span>
                            {job.distanceMiles != null && (
                              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-700">
                                {job.distanceMiles.toFixed(1)} miles away
                              </span>
                            )}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                          {job.clientName && <span>Client: {job.clientName}</span>}
                          {job.scheduledAt && (
                            <span>Scheduled: {formatTimestamp(job.scheduledAt)}</span>
                          )}
                          <span>Posted: {formatTimestamp(job.createdAt)}</span>
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
                          <span>Scheduled: {formatTimestamp(job.scheduledAt)}</span>
                        )}
                        <span>Accepted: {formatTimestamp(job.createdAt)}</span>
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
                        {['accepted', 'in-progress'].includes(job.status) && (
                          <Link
                            href={`/artisan/location-broadcast?jobId=${job.id}`}
                            className="rounded-lg border border-purple-300 px-4 py-2 text-center text-sm font-medium text-purple-600 hover:bg-purple-50"
                          >
                            Broadcast Location
                          </Link>
                        )}
                        {job.status === 'in-progress' && (
                          <Link
                            href={`/artisan/job-completion/${job.id}`}
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 text-center"
                          >
                            Complete Job
                          </Link>
                        )}
                        {job.status === 'pending-completion' && (
                          <div className="flex items-center gap-2 text-amber-600">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium">Pending Approval</span>
                          </div>
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
                      State / Region
                    </label>
                    <input
                      type="text"
                      value={profileForm.state}
                      onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                      className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      placeholder="e.g., Lagos"
                    />
                    <p className="mt-1 text-xs text-neutral-500">Used to match you with nearby jobs.</p>
                    <button
                      type="button"
                      onClick={() => captureArtisanLocation(true)}
                      disabled={capturingLocation}
                      className="mt-3 rounded-lg border border-brand-300 px-3 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {capturingLocation ? 'Saving location…' : 'Use my current location as home base'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Skills & Expertise
                    </label>
                    <textarea
                      value={profileForm.skills}
                      onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                      rows={3}
                      className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      placeholder="e.g., Plumbing, Electrical, HVAC"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="text"
                      value={profileForm.experience}
                      onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                      className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      placeholder="e.g., 5 years"
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
                      <p className="text-sm text-neutral-600">Receive job updates via email</p>
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
                      <p className="text-sm text-neutral-600">Receive job updates via SMS</p>
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
                      <p className="text-sm text-neutral-600">Receive push notifications for new jobs</p>
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
