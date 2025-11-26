'use client';
export const dynamic = 'force-dynamic';
import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getFirebase } from '@/lib/firebaseClient';
import { addDoc, collection, serverTimestamp, query, where, onSnapshot, updateDoc, doc, orderBy, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter, useSearchParams } from 'next/navigation';
import type { User as FirebaseUser } from 'firebase/auth';
import { Loader } from '@googlemaps/js-api-loader';
import { SupportChat } from '@/components/support/SupportChat';

interface ClientProfile {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  state?: string;
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
  artisanId?: string; // Legacy field for backward compatibility
  artisanName?: string; // Legacy field for backward compatibility
  phixerId?: string;
  phixerName?: string;
  clientId: string;
  attachments?: string[];
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

type AddressComponent = {
  long_name?: string;
  short_name?: string;
  types: string[];
};

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
  const paystackReference = searchParams.get('reference');
  const cancelledPayment = searchParams.get('cancelled');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
    const [useAlternativeAddress, setUseAlternativeAddress] = useState(false);
  const [serviceAddress, setServiceAddress] = useState<{ placeId?: string; description?: string; lat?: number; lng?: number; state?: string }>({});
    const [addressQuery, setAddressQuery] = useState('');
    const [addressSuggestions, setAddressSuggestions] = useState<Array<{ description: string; place_id: string }>>([]);
    const [fetchingAddressSuggestions, setFetchingAddressSuggestions] = useState(false);
  const [resolvingAddress, setResolvingAddress] = useState(false);
  const [gettingCurrentLocation, setGettingCurrentLocation] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);
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
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumBillingCycle, setPremiumBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  
  // Profile states
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    state: '',
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
  const [verificationForms, setVerificationForms] = useState<Record<string, { rating: number; feedback: string }>>({});
  const [submittingVerification, setSubmittingVerification] = useState<string | null>(null);

  useEffect(() => {
    const { auth } = getFirebase();
    let unsubscribe: (() => void) | undefined;
    
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (!currentUser) {
          router.push('/login');
        } else {
          setUser(currentUser);
          setLoading(false);
        }
      });
    });
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [router]);

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
          state: profile.state || '',
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
    
    const unsubscribe = onSnapshot(walletRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data() as Partial<Wallet> | undefined;
        setWallet({
          balance: data?.balance ?? 0,
          totalDeposits: data?.totalDeposits ?? 0,
          totalSpent: data?.totalSpent ?? 0,
        });
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

    if (useAlternativeAddress && !serviceAddress.description) {
      setMessage({ text: 'Please select a service address or use your current location.', type: 'error' });
      setSubmitting(false);
      return;
    }

    try {
      const { auth, db, storage } = getFirebase();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        window.location.href = '/login';
        return;
      }

      // Check wallet balance - Minimum ₦1000 required
      const MINIMUM_DEPOSIT = 1000;
      const walletRef = doc(db, 'wallets', currentUser.uid);
      const walletSnap = await getDoc(walletRef);
      const currentBalance = walletSnap.exists() ? (walletSnap.data().balance || 0) : 0;

      if (currentBalance < MINIMUM_DEPOSIT) {
        setMessage({
          text: `Insufficient wallet balance. Minimum ₦${MINIMUM_DEPOSIT.toLocaleString()} required to create a service request. Current balance: ₦${currentBalance.toLocaleString()}`,
          type: 'error',
        });
        setSubmitting(false);
        // Redirect to wallet page after 3 seconds
        setTimeout(() => {
          setActiveTab('wallet');
        }, 3000);
        return;
      }

      const jobRef = doc(collection(db, 'jobs'));
      const attachmentUrls: string[] = [];

      // Validate file count (10 files max)
      const MAX_FILES = 10;
      if (files && files.length > MAX_FILES) {
        setMessage({
          text: `Maximum ${MAX_FILES} files allowed. Please select fewer files.`,
          type: 'error',
        });
        setSubmitting(false);
        return;
      }

      // Validate file sizes (10MB max for images/videos)
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      if (files && files.length > 0) {
        for (const file of Array.from(files)) {
          if (file.size > MAX_FILE_SIZE) {
            setMessage({
              text: `File "${file.name}" exceeds the maximum size of 10MB. Please compress or select a smaller file.`,
              type: 'error',
            });
            setSubmitting(false);
            return;
          }
        }
        for (const file of Array.from(files)) {
          const fileRef = ref(storage, `jobs/${jobRef.id}/${Date.now()}-${file.name}`);
          await uploadBytes(fileRef, file);
          const url = await getDownloadURL(fileRef);
          attachmentUrls.push(url);
        }
      }

      const jobServiceAddress = useAlternativeAddress
        ? serviceAddress
        : {
            description: profileForm.address || userProfile?.address || '',
            state: profileForm.state || userProfile?.state || '',
          };
      const jobServiceState =
        (useAlternativeAddress ? serviceAddress.state : profileForm.state || userProfile?.state) || null;
      
      // Hold deposit in wallet
      const walletData = walletSnap.data() || { heldBalance: 0 };
      await updateDoc(walletRef, {
        balance: currentBalance - MINIMUM_DEPOSIT,
        heldBalance: (walletData.heldBalance || 0) + MINIMUM_DEPOSIT,
        updatedAt: serverTimestamp(),
      });

      // Create job with deposit information
      await setDoc(jobRef, {
        clientId: currentUser.uid,
        clientName: userProfile?.name || currentUser.displayName || currentUser.email,
        clientEmail: userProfile?.email || currentUser.email,
        clientPhone: userProfile?.phone || '',
        clientCompany: userProfile?.company || '',
        title,
        description,
        serviceCategory,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        serviceAddress: jobServiceAddress,
        serviceCoordinates:
          jobServiceAddress?.lat && jobServiceAddress?.lng
            ? {
                lat: jobServiceAddress.lat,
                lng: jobServiceAddress.lng,
              }
            : null,
        serviceAddressText: jobServiceAddress.description || '',
        serviceState: jobServiceState,
        status: 'requested',
        createdByRole: 'client',
        attachments: attachmentUrls,
        artifact: 'service-request',
        deposit: MINIMUM_DEPOSIT,
        depositHeld: true,
        paymentStatus: 'deposit_held',
        createdAt: serverTimestamp(),
      });

      // Record deposit transaction
      await addDoc(collection(db, 'transactions'), {
        userId: currentUser.uid,
        jobId: jobRef.id,
        type: 'deposit_hold',
        amount: MINIMUM_DEPOSIT,
        status: 'completed',
        description: `Deposit held for job: ${title}`,
        createdAt: serverTimestamp(),
      });

      setMessage({ text: `Service request submitted successfully! ₦${MINIMUM_DEPOSIT.toLocaleString()} deposit has been held from your wallet and will be part of the final bill.`, type: 'success' });
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

      // Use Paystack payment initialization
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email || userProfile?.email,
          amount: amount * 100, // Convert to kobo (Paystack uses kobo)
          metadata: {
            userId: user.uid,
            type: 'wallet_deposit',
            userName: userProfile?.name || user.displayName || user.email,
          },
        }),
      });
      const data = await response.json();
      if (!response.ok || !data?.authorization_url) {
        setMessage({ text: data?.error || 'Failed to initialize payment.', type: 'error' });
        setProcessingPayment(false);
        return;
      }

      // Redirect to Paystack payment page
      window.location.href = data.authorization_url as string;
    } catch (error) {
      console.error('Error processing deposit:', error);
      setMessage({ text: 'Failed to start deposit. Please try again.', type: 'error' });
      setProcessingPayment(false);
    }
  }

  const confirmPaystackPayment = useCallback(async (reference: string) => {
    setVerifyingSessionId(reference);
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference }),
      });
      const data = await response.json();
      if (!response.ok || data?.status !== 'success') {
        setMessage({ text: data?.error || 'Unable to verify payment. Contact support with your receipt.', type: 'error' });
        return;
      }
      setMessage({ text: 'Payment confirmed! Your wallet will update shortly.', type: 'success' });
      setProcessedSessionId(reference);
      setDepositAmount('');
      router.replace('/client/dashboard');
    } catch (error) {
      console.error('Error confirming payment:', error);
      setMessage({ text: 'Failed to verify payment. Please contact support.', type: 'error' });
    } finally {
      setVerifyingSessionId(null);
    }
  }, [router]);

  useEffect(() => {
    if (!paystackReference || verifyingSessionId || processedSessionId === paystackReference) {
      return;
    }
    confirmPaystackPayment(paystackReference);
  }, [paystackReference, verifyingSessionId, processedSessionId, confirmPaystackPayment]);

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
        state: profileForm.state,
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

  async function handlePremiumSubscribe(planTier: PremiumPlan['tier']) {
    if (!user) {
      setMessage({ text: 'You must be signed in to subscribe.', type: 'error' });
      return;
    }

    const selected = premiumPlans.find((plan) => plan.tier === planTier);
    if (!selected) {
      setMessage({ text: 'Plan not found. Please try again.', type: 'error' });
      return;
    }

    const amount = premiumBillingCycle === 'monthly' ? selected.price : selected.yearlyPrice;
    setProcessingPlan(planTier);
    setMessage(null);

    try {
      // Use Paystack payment initialization
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email || userProfile?.email,
          amount: amount * 100, // Convert to kobo
          metadata: {
            userId: user.uid,
            type: 'premium_subscription',
            plan: planTier,
            billingCycle: premiumBillingCycle,
            userName: userProfile?.name || user.displayName || user.email,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok || !data?.authorization_url) {
        setMessage({ text: data?.error || 'Failed to initialize payment.', type: 'error' });
        return;
      }

      // Redirect to Paystack payment page
      window.location.href = data.authorization_url as string;
    } catch (error) {
      console.error('Error starting subscription checkout:', error);
      setMessage({ text: 'Failed to start subscription checkout. Please try again.', type: 'error' });
    } finally {
      setProcessingPlan(null);
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

  function handleAddressInput(value: string) {
    setAddressQuery(value);
    if (!addressAutocomplete || value.trim().length < 3) {
      setAddressSuggestions([]);
      return;
    }
    setFetchingAddressSuggestions(true);
    addressAutocomplete.getPlacePredictions(
      {
        input: value,
        componentRestrictions: { country: ['ng'] },
      },
      (predictions, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !predictions) {
          setAddressSuggestions([]);
        } else {
          setAddressSuggestions(predictions.map((prediction) => ({ description: prediction.description, place_id: prediction.place_id! })));
        }
        setFetchingAddressSuggestions(false);
      }
    );
  }

  function handleSelectAddress(prediction: { place_id: string; description: string }) {
    if (!mapsLoaded || typeof window === 'undefined') return;
    setResolvingAddress(true);
    setAddressQuery(prediction.description);
    setAddressSuggestions([]);

    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    service.getDetails(
      {
        placeId: prediction.place_id,
        fields: ['geometry', 'formatted_address', 'address_components'],
      },
      (place, status) => {
        setResolvingAddress(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const stateComponent = place.address_components?.find((component: AddressComponent) =>
            component.types.includes('administrative_area_level_1')
          );
          setServiceAddress({
            placeId: prediction.place_id,
            description: place.formatted_address || prediction.description,
            lat: place.geometry?.location?.lat(),
            lng: place.geometry?.location?.lng(),
            state: stateComponent?.long_name || stateComponent?.short_name,
          });
        }
      }
    );
  }

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setMessage({ text: 'Geolocation not supported in this browser.', type: 'error' });
      return;
    }
    setGettingCurrentLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          let formattedAddress = '';
          let stateName = '';
          if (mapsApiKey) {
            try {
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${mapsApiKey}`
              );
              const data = await response.json();
              const primaryResult = data.results?.[0];
              formattedAddress = primaryResult?.formatted_address || '';
              const stateComponent = primaryResult?.address_components?.find((component: AddressComponent) =>
                component.types.includes('administrative_area_level_1')
              );
              stateName = stateComponent?.long_name || stateComponent?.short_name || '';
            } catch (error) {
              console.warn('Failed to reverse geocode current location', error);
            }
          }
          setUseAlternativeAddress(true);
          setServiceAddress({
            description: formattedAddress || 'Current location',
            lat: latitude,
            lng: longitude,
            state: stateName,
          });
          setAddressQuery(formattedAddress);
        } finally {
          setGettingCurrentLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error', error);
        setMessage({ text: 'Unable to fetch current location.', type: 'error' });
        setGettingCurrentLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function handleVerificationFormChange(jobId: string, field: 'rating' | 'feedback', value: number | string) {
    setVerificationForms((prev) => {
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

  async function handleVerifyJob(jobId: string) {
    if (!user) {
      setMessage({ text: 'You must be signed in to verify a job.', type: 'error' });
      return;
    }

    const form = verificationForms[jobId] ?? { rating: 5, feedback: '' };
    if (!(form.rating >= 1 && form.rating <= 5)) {
      setMessage({ text: 'Please provide a rating between 1 and 5.', type: 'error' });
      return;
    }

    setSubmittingVerification(jobId);
    try {
      const { db } = getFirebase();
      await updateDoc(doc(db, 'jobs', jobId), {
        clientVerified: true,
        clientReview: {
          rating: form.rating,
          feedback: form.feedback,
          verifiedAt: serverTimestamp(),
          clientName: userProfile?.name || user.email || '',
        },
      });

      setMessage({ text: 'Thanks! Your review was submitted.', type: 'success' });
      setVerificationForms((prev) => {
        const next = { ...prev };
        delete next[jobId];
        return next;
      });
    } catch (error) {
      console.error('Error verifying job:', error);
      setMessage({ text: 'Failed to submit review. Please try again.', type: 'error' });
    } finally {
      setSubmittingVerification(null);
    }
  }

  async function handleVerifyQRCode(jobId: string, qrCodeData: string) {
    if (!user) {
      setMessage({ text: 'You must be signed in to verify a Phixer.', type: 'error' });
      return;
    }

    try {
      const response = await fetch('/api/jobs/verify-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrCodeData,
          jobId,
          clientId: user.uid,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ text: 'Phixer verified successfully!', type: 'success' });
        // Close modal
        const modal = document.getElementById(`qr-modal-${jobId}`);
        if (modal) {
          (modal as HTMLDialogElement).close();
        }
      } else {
        setMessage({ text: data.error || 'Verification failed', type: 'error' });
      }
    } catch (error: any) {
      setMessage({ text: error.message || 'Failed to verify QR code', type: 'error' });
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
  const pendingVerifications = jobs.filter((job) => job.status === 'completed' && !job.clientVerified);
  const clientRatingStats = jobs.reduce(
    (acc, job) => {
      const rating = job.artisanReview?.rating;
      if (rating) {
        acc.sum += rating;
        acc.count += 1;
      }
      return acc;
    },
    { sum: 0, count: 0 }
  );
  const clientAverageRating = clientRatingStats.count ? clientRatingStats.sum / clientRatingStats.count : null;

  type PremiumPlan = {
    tier: 'bronze' | 'gold' | 'platinum';
    name: string;
    icon: string;
    color: string;
    price: number;
    yearlyPrice: number;
    servicesIncluded: string[];
    benefits: string[];
    popular?: boolean;
    accent: string;
  };

  const premiumPlans: PremiumPlan[] = [
    {
      tier: 'bronze',
      name: 'Bronze',
      icon: '🥉',
      color: 'from-amber-500 to-amber-600',
      price: 25000,
      yearlyPrice: 270000,
      servicesIncluded: ['Basic plumbing repairs', 'Electrical troubleshooting', 'General maintenance'],
      benefits: ['2 service calls per month', 'Standard response (24-48 hours)', 'Basic priority support', '5% discount on extra services'],
      accent: 'text-amber-600 bg-amber-50',
    },
    {
      tier: 'gold',
      name: 'Gold',
      icon: '🥇',
      color: 'from-yellow-500 to-yellow-600',
      price: 50000,
      yearlyPrice: 540000,
      servicesIncluded: ['All Bronze services', 'HVAC maintenance', 'Carpentry & repairs', 'Painting touch-ups'],
      benefits: ['5 service calls per month', 'Priority response (12-24 hours)', 'Priority artisan assignment', '10% discount on extra services', 'Quarterly facility inspection'],
      popular: true,
      accent: 'text-yellow-600 bg-yellow-50',
    },
    {
      tier: 'platinum',
      name: 'Platinum',
      icon: '💎',
      color: 'from-purple-600 to-purple-700',
      price: 100000,
      yearlyPrice: 1080000,
      servicesIncluded: ['All Gold services', 'Roofing inspections & repairs', 'Landscaping & gardening', 'Deep cleaning services', 'Emergency repairs (24/7)'],
      benefits: ['Unlimited service calls', 'Emergency response (2-4 hours)', 'Dedicated account manager', 'Premium artisan assignment', '20% discount on extra services', 'Monthly facility inspection'],
      accent: 'text-purple-600 bg-purple-50',
    },
  ];

  const tabConfig: Array<{ id: ClientTab; label: string; icon: string; badge?: number }> = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'request', label: 'Request Service', icon: '➕' },
    { id: 'jobs', label: 'My Jobs', icon: '📋', badge: jobs.length },
    { id: 'wallet', label: 'Wallet', icon: '💰' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    if (!mapsApiKey) return;
    const loader = new Loader({
      apiKey: mapsApiKey,
      libraries: ['places'],
    });
    loader
      .load()
      .then(() => setMapsLoaded(true))
      .catch((error) => {
        console.error('Failed to load Google Maps libraries', error);
      });
  }, [mapsApiKey]);

  useEffect(() => {
    if (!useAlternativeAddress) {
      setServiceAddress({});
      setAddressQuery('');
      setAddressSuggestions([]);
    }
  }, [useAlternativeAddress]);

  const addressAutocomplete = useMemo(() => {
    if (!mapsLoaded || typeof window === 'undefined' || !window.google?.maps?.places) {
      return null;
    }
    return new window.google.maps.places.AutocompleteService();
  }, [mapsLoaded]);

  // Early return while loading to prevent queries before auth - MUST be after all hooks
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mb-4"></div>
          <p className="text-sm text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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

  const trackableJob = jobs.find((job) => (job.phixerId || job.artisanId) && ['accepted', 'in-progress'].includes(job.status));
  const trackableJobLink = trackableJob ? `/client/tracking?jobId=${trackableJob.id}&phixerId=${trackableJob.phixerId || trackableJob.artisanId}` : null;

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
      <SupportChat user={user} role="client" />
      {showPremiumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-brand-600">Go Premium</p>
                <h3 className="text-xl font-bold text-neutral-900">Choose a subscription plan</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPremiumModal(false)}
                className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100"
                aria-label="Close premium plans modal"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-neutral-600">Select your billing cycle</p>
                <div className="flex items-center gap-3 rounded-full border border-neutral-200 px-3 py-1">
                  <span className={`text-sm font-medium ${premiumBillingCycle === 'monthly' ? 'text-neutral-900' : 'text-neutral-400'}`}>Monthly</span>
                  <button
                    type="button"
                    onClick={() => setPremiumBillingCycle(premiumBillingCycle === 'monthly' ? 'yearly' : 'monthly')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      premiumBillingCycle === 'yearly' ? 'bg-brand-600' : 'bg-neutral-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        premiumBillingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className={`text-sm font-medium ${premiumBillingCycle === 'yearly' ? 'text-neutral-900' : 'text-neutral-400'}`}>
                    Yearly
                    <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Save 10%</span>
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {premiumPlans.map((plan) => {
                  const displayAmount = premiumBillingCycle === 'monthly' ? plan.price : plan.yearlyPrice;
                  const priceLabel = premiumBillingCycle === 'monthly' ? 'per month' : 'per year';
                  return (
                    <div
                      key={plan.tier}
                      className={`rounded-2xl border-2 bg-white p-4 shadow-sm transition-all hover:shadow-lg ${
                        plan.popular ? 'border-brand-600 ring-2 ring-brand-100' : 'border-neutral-200'
                      }`}
                    >
                      {plan.popular && (
                        <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                          ⭐ Most Popular
                        </span>
                      )}
                      <div className="text-4xl">{plan.icon}</div>
                      <h4 className="mt-2 text-lg font-semibold text-neutral-900">{plan.name}</h4>
                      <div className="mt-2">
                        <p className="text-3xl font-bold text-neutral-900">₦{displayAmount.toLocaleString()}</p>
                        <p className="text-xs uppercase tracking-wide text-neutral-500">{priceLabel}</p>
                      </div>
                      <div className={`mt-3 rounded-lg px-3 py-2 text-xs font-semibold ${plan.accent}`}>
                        {plan.servicesIncluded[0]}
                      </div>
                      <ul className="mt-4 space-y-2 text-sm text-neutral-600">
                        {plan.benefits.slice(0, 3).map((benefit) => (
                          <li key={benefit} className="flex items-start gap-2">
                            <svg className="mt-0.5 h-4 w-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        onClick={() => handlePremiumSubscribe(plan.tier)}
                        disabled={processingPlan === plan.tier}
                        className={`mt-5 inline-flex w-full items-center justify-center rounded-lg py-2 text-sm font-semibold text-white shadow transition-all ${
                          plan.popular ? 'bg-brand-600 hover:bg-brand-700' : `bg-gradient-to-r ${plan.color} hover:opacity-90`
                        } ${processingPlan === plan.tier ? 'cursor-not-allowed opacity-70' : ''}`}
                      >
                        {processingPlan === plan.tier ? 'Processing...' : `Subscribe to ${plan.name}`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
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
          <div className="border-t border-neutral-200 p-4 space-y-4">
            <div className="rounded-xl border border-brand-200 bg-brand-50 p-4 text-center">
              <p className="text-sm font-medium text-brand-800">Go Premium</p>
              <p className="mt-1 text-xs text-brand-700/80">Unlock priority support and bundled maintenance.</p>
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  setShowPremiumModal(true);
                }}
                className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
              >
                View Plans
              </button>
            </div>
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
                type="button"
                onClick={() => setShowPremiumModal(true)}
                className="hidden items-center gap-2 rounded-lg border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm transition-colors hover:bg-brand-50 md:flex"
              >
                <svg className="h-4 w-4 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
                Go Premium
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

              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-2xl">
                    ⭐
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-600">Your Rating</p>
                    {clientAverageRating ? (
                      <>
                        <p className="mt-1 text-2xl font-bold text-neutral-900">
                          {clientAverageRating.toFixed(1)} / 5
                        </p>
                        <p className="text-xs text-neutral-500">{clientRatingStats.count} review(s)</p>
                      </>
                    ) : (
                      <p className="mt-1 text-sm text-neutral-500">No ratings yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {pendingVerifications.length > 0 && (
              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-amber-900">Confirm completed jobs</h3>
                <p className="mt-1 text-sm text-amber-800">
                  Please verify the work and rate your artisan so we can keep quality high.
                </p>

                <div className="mt-6 space-y-6">
                  {pendingVerifications.map((job) => {
                    const form = verificationForms[job.id] ?? { rating: 5, feedback: '' };
                    return (
                      <div key={job.id} className="rounded-xl border border-white/40 bg-white/80 p-5 shadow-inner">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-neutral-500">Job</p>
                          <p className="text-lg font-semibold text-neutral-900">{job.title}</p>
                          <p className="text-sm text-neutral-600">{job.description}</p>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-3">
                          <div>
                            <label className="text-sm font-medium text-neutral-700">Overall rating</label>
                            <select
                              value={form.rating}
                              onChange={(e) => handleVerificationFormChange(job.id, 'rating', Number(e.target.value))}
                              className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                            >
                              {[5, 4, 3, 2, 1].map((rating) => {
                                const ratingText: Record<number, string> = {
                                  5: 'Excellent',
                                  4: 'Very Good',
                                  3: 'Good',
                                  2: 'Fair',
                                  1: 'Poor',
                                };
                                return (
                                <option key={rating} value={rating}>
                                    {rating} - {ratingText[rating]}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-neutral-700">Comments (optional)</label>
                            <textarea
                              value={form.feedback}
                              onChange={(e) => handleVerificationFormChange(job.id, 'feedback', e.target.value)}
                              rows={3}
                              className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                              placeholder="Tell us how it went"
                            />
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => handleVerifyJob(job.id)}
                            disabled={submittingVerification === job.id}
                            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {submittingVerification === job.id ? 'Submitting...' : 'Verify & Submit Review'}
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

                <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">Service Location</p>
                      <p className="text-xs text-neutral-600">
                        Use your profile address or specify a different location for this job.
                      </p>
                    </div>
                    <label className="inline-flex items-center gap-3 text-sm font-medium text-neutral-700">
                      <span>Use different address</span>
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border border-neutral-300 text-brand-600 focus:ring-brand-500"
                        checked={useAlternativeAddress}
                        onChange={(e) => setUseAlternativeAddress(e.target.checked)}
                      />
                    </label>
                  </div>

                  {useAlternativeAddress ? (
                    <>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-neutral-700">Search address</label>
                        <input
                          type="text"
                          value={addressQuery}
                          onChange={(e) => handleAddressInput(e.target.value)}
                          placeholder="Type part of the service address..."
                          className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        />
                        {fetchingAddressSuggestions && (
                          <p className="mt-2 text-xs text-neutral-500">Searching address suggestions...</p>
                        )}
                        {addressSuggestions.length > 0 && (
                          <div className="mt-2 rounded-lg border border-neutral-200 bg-white shadow-lg">
                            {addressSuggestions.map((suggestion) => (
                              <button
                                key={suggestion.place_id}
                                type="button"
                                onClick={() => handleSelectAddress(suggestion)}
                                className="block w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-brand-50"
                              >
                                {suggestion.description}
                              </button>
                            ))}
                          </div>
                        )}
                        {resolvingAddress && (
                          <p className="mt-2 text-xs text-neutral-500">Retrieving address details…</p>
                        )}
                      </div>

                      {serviceAddress.description && (
                        <div className="mt-4 rounded-lg border border-brand-100 bg-white/80 p-3 text-sm text-neutral-700">
                          <p className="font-medium text-neutral-900">Selected address</p>
                          <p>{serviceAddress.description}</p>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        disabled={gettingCurrentLocation}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-brand-300 bg-white px-4 py-2 text-sm font-medium text-brand-700 shadow-sm transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {gettingCurrentLocation ? 'Detecting location...' : 'Use my current location'}
                      </button>
                    </>
                  ) : (
                    <div className="mt-4 rounded-lg border border-neutral-200 bg-white/80 p-3 text-sm text-neutral-700">
                      <p>
                        We’ll use your profile address:{' '}
                        <span className="font-semibold">
                          {profileForm.address || userProfile?.address || 'No address on file'}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">Attachments (Photos/Videos)</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="mt-2 block w-full text-sm text-neutral-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
                    onChange={(e) => {
                      const selectedFiles = e.target.files;
                      if (selectedFiles && selectedFiles.length > 10) {
                        setMessage({
                          text: 'Maximum 10 files allowed. Please select fewer files.',
                          type: 'error',
                        });
                        e.target.value = ''; // Clear the input
                        return;
                      }
                      setFiles(selectedFiles);
                    }}
                  />
                  <p className="mt-1 text-xs text-neutral-500">Upload photos or videos to help artisans understand the job (Max 10 files, 10MB per file)</p>
                </div>

                {/* Wallet Balance Notice */}
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <div className="flex gap-3">
                    <span className="text-2xl">💰</span>
                    <div className="flex-1">
                      <p className="font-medium text-yellow-900">Payment Notice</p>
                      <p className="mt-1 text-sm text-yellow-800">
                        A deposit of <strong>₦1,000</strong> will be held from your wallet when you submit this request.
                        This amount will be part of your final bill upon job completion.
                      </p>
                      <p className="mt-2 text-sm text-yellow-800">
                        Current wallet balance: <strong>₦{(wallet?.balance || 0).toLocaleString()}</strong>
                        {wallet && wallet.balance < 1000 && (
                          <span className="ml-2 text-red-600 font-medium">
                            (Insufficient - Please fund your wallet first)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 border-t border-neutral-200 pt-6">
                  <button
                    type="submit"
                    disabled={submitting || (wallet && wallet.balance < 1000)}
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
                        {(job.phixerId || job.artisanId) && ['accepted', 'in-progress'].includes(job.status) && (
                          <div className="flex flex-col gap-2">
                            {!job.clientVerified && job.status === 'accepted' && (
                              <button
                                onClick={() => {
                                  const modal = document.getElementById(`qr-modal-${job.id}`);
                                  if (modal) {
                                    (modal as HTMLDialogElement).showModal();
                                  }
                                }}
                                className="rounded-lg bg-green-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-green-700"
                              >
                                ✓ Verify Phixer
                              </button>
                            )}
                            <Link
                              href={`/client/tracking?jobId=${job.id}&phixerId=${job.phixerId || job.artisanId}`}
                              className="rounded-lg bg-brand-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-brand-700"
                            >
                              {job.status === 'in-progress' ? 'Track Live' : 'View Tracking'}
                            </Link>
                          </div>
                        )}
                        {job.clientVerified && (
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <span>✓</span>
                            <span>Verified</span>
                          </div>
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
                      State / Region
                    </label>
                    <input
                      type="text"
                      value={profileForm.state}
                      onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                      className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      placeholder="e.g., Lagos"
                    />
                    <p className="mt-1 text-xs text-neutral-500">Used to match you with local artisans.</p>
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
