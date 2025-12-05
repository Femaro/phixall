import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Switch,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthState } from '@/hooks/useAuthState';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  getDoc,
  doc,
  updateDoc,
  onSnapshot as onDocSnapshot,
  addDoc,
  serverTimestamp,
  setDoc,
  getDocs,
} from 'firebase/firestore';
import { getFirebase } from '@/config/firebase';
import * as Location from 'expo-location';
import { calculateDistance, formatDistance } from '@/utils/distance';
import { SupportChat } from '@/components/SupportChat';
import { RatingForm } from '@/components/RatingForm';
import { MenuDrawer } from '@/components/MenuDrawer';

type PhixerTab = 'overview' | 'available' | 'my-jobs' | 'wallet' | 'profile' | 'settings';

interface Job {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdAt: any;
  clientName?: string;
  serviceCategory?: string;
  serviceAddress?: {
    description?: string;
    lat?: number;
    lng?: number;
  };
  serviceAddressText?: string;
  serviceState?: string;
  amount?: number;
  clientReview?: {
    rating?: number;
    feedback?: string;
  };
  artisanReview?: {
    rating?: number;
    feedback?: string;
  };
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

interface Profile {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  state?: string;
  skills?: string;
  experience?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
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
  artisanAverageRating?: number;
  available?: boolean;
}

export default function ArtisanDashboard() {
  const router = useRouter();
  const { user } = useAuthState();
  const [activeTab, setActiveTab] = useState<PhixerTab>('overview');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallet, setWallet] = useState<Wallet>({
    balance: 0,
    totalEarnings: 0,
    totalCashout: 0,
    pendingBalance: 0,
  });
  const [available, setAvailable] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [artisanLocation, setArtisanLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [jobDistances, setJobDistances] = useState<Record<string, number>>({});
  const [profile, setProfile] = useState<Profile | null>(null);
  const profileStateRef = useRef<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [artisanAverageRating, setArtisanAverageRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Wallet states
  const [cashoutAmount, setCashoutAmount] = useState('');
  const [processingCashout, setProcessingCashout] = useState(false);
  const [bankAccount, setBankAccount] = useState({
    accountNumber: '',
    bankName: '',
    accountName: '',
  });

  // Profile states
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    address: '',
    state: '',
    skills: '',
    experience: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [capturingLocation, setCapturingLocation] = useState(false);

  // Settings states
  const [settingsForm, setSettingsForm] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    language: 'en',
    timezone: 'Africa/Lagos',
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Rating states
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [ratingJobId, setRatingJobId] = useState<string | null>(null);
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());

  const CASHOUT_FEE_PERCENT = 2.5;
  const MIN_CASHOUT = 1000;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    try {
      const { db } = getFirebase();
      if (!db) {
        console.error('Firebase database not initialized');
        setLoading(false);
        return;
      }

    // Load profile
    const loadProfile = async () => {
      try {
        const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
        if (!isMounted) return;
        
        if (profileDoc.exists()) {
          const profileData = profileDoc.data() as Profile;
          if (!isMounted) return;
          
          setProfile(profileData);
          profileStateRef.current = profileData.state || null;
          setAvailable(profileData.available ?? false);
          setArtisanAverageRating(profileData.artisanAverageRating ?? null);
          const name = profileData.name || user.displayName || user.email?.split('@')[0] || 'User';
          setUserName(name);

          // Populate forms
          setProfileForm({
            name: profileData.name || '',
            phone: profileData.phone || '',
            address: profileData.address || '',
            state: profileData.state || '',
            skills: profileData.skills || '',
            experience: profileData.experience || '',
          });

          if (profileData.bankAccount) {
            setBankAccount({
              accountNumber: profileData.bankAccount.accountNumber || '',
              bankName: profileData.bankAccount.bankName || '',
              accountName: profileData.bankAccount.accountName || '',
            });
          }

          setSettingsForm({
            emailNotifications: profileData.emailNotifications ?? true,
            smsNotifications: profileData.smsNotifications ?? false,
            pushNotifications: profileData.pushNotifications ?? true,
            language: profileData.language || 'en',
            timezone: profileData.timezone || 'Africa/Lagos',
          });

          if (profileData.coordinates) {
            setArtisanLocation(profileData.coordinates);
          }
        } else {
          if (!isMounted) return;
          const name = user.displayName || user.email?.split('@')[0] || 'User';
          setUserName(name);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        if (isMounted) {
          const name = user.displayName || user.email?.split('@')[0] || 'User';
          setUserName(name);
          setLoading(false);
        }
      }
    };

    loadProfile();

    // Get current location
    const getArtisanLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setArtisanLocation({
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          });
        }
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    getArtisanLocation();

    // Load wallet
    const walletRef = doc(db, 'wallets', user.uid);
    const unsubscribeWallet = onDocSnapshot(
      walletRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setWallet({
            balance: data.balance || 0,
            totalEarnings: data.totalEarnings || 0,
            totalCashout: data.totalCashout || 0,
            pendingBalance: data.pendingBalance || 0,
          });
        } else {
          // Create wallet if it doesn't exist
          setDoc(walletRef, {
            balance: 0,
            totalEarnings: 0,
            totalCashout: 0,
            pendingBalance: 0,
            createdAt: serverTimestamp(),
          }).catch((error) => {
            console.error('Error creating wallet:', error);
          });
        }
      },
      (error) => {
        console.error('Error loading wallet:', error);
        // Set default wallet values on error
        setWallet({
          balance: 0,
          totalEarnings: 0,
          totalCashout: 0,
          pendingBalance: 0,
        });
      }
    );

    // Load transactions
    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeTransactions = onSnapshot(
      transactionsQuery,
      (snapshot) => {
        if (!isMounted) return;
        const transactionsData: Transaction[] = [];
        snapshot.forEach((doc) => {
          try {
            transactionsData.push({ id: doc.id, ...doc.data() } as Transaction);
          } catch (error) {
            console.error('Error processing transaction:', error);
          }
        });
        setTransactions(transactionsData);
      },
      (error) => {
        console.error('Error loading transactions:', error);
        // If index is missing, try query without orderBy
        if (isMounted) {
          if (error.code === 'failed-precondition') {
            const simpleQuery = query(
              collection(db, 'transactions'),
              where('userId', '==', user.uid)
            );
            onSnapshot(
              simpleQuery,
              (snapshot) => {
                if (!isMounted) return;
                const transactionsData: Transaction[] = [];
                snapshot.forEach((doc) => {
                  try {
                    transactionsData.push({ id: doc.id, ...doc.data() } as Transaction);
                  } catch (err) {
                    console.error('Error processing transaction:', err);
                  }
                });
                // Sort manually
                transactionsData.sort((a, b) => {
                  const aTime = a.createdAt?.toDate?.()?.getTime() || 0;
                  const bTime = b.createdAt?.toDate?.()?.getTime() || 0;
                  return bTime - aTime;
                });
                setTransactions(transactionsData);
              },
              (err) => {
                console.error('Error loading transactions (fallback):', err);
                if (isMounted) {
                  setTransactions([]);
                }
              }
            );
          } else {
            setTransactions([]);
          }
        }
      }
    );

    // Load available jobs
    const availableJobsQuery = query(
      collection(db, 'jobs'),
      where('status', '==', 'requested'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeAvailable = onSnapshot(
      availableJobsQuery,
      (snapshot) => {
        if (!isMounted) return;
        const jobsData: Job[] = [];
        const distances: Record<string, number> = {};

        snapshot.forEach((doc) => {
          try {
            const data = doc.data();
            if (!data.phixerId && !data.artisanId) {
              const jobData = { id: doc.id, ...data } as Job;

              // Filter by state (use profile state if available)
              const artisanState = profileStateRef.current;
              if (artisanState && jobData.serviceState) {
                if (jobData.serviceState.toLowerCase().trim() !== artisanState.toLowerCase().trim()) {
                  return;
                }
              }

              // Calculate and filter by distance
              if (artisanLocation && jobData.serviceAddress?.lat && jobData.serviceAddress?.lng) {
                try {
                  const dist = calculateDistance(
                    artisanLocation.lat,
                    artisanLocation.lng,
                    jobData.serviceAddress.lat,
                    jobData.serviceAddress.lng
                  );

                  if (dist > 32) {
                    return; // Skip jobs beyond 20 miles
                  }

                  distances[jobData.id] = dist;
                } catch (distError) {
                  console.error('Error calculating distance:', distError);
                }
              }

              jobsData.push(jobData);
            }
          } catch (error) {
            console.error('Error processing job:', error);
          }
        });
        if (isMounted) {
          setAvailableJobs(jobsData);
          setJobDistances(distances);
        }
      },
      (error) => {
        console.error('Error loading available jobs:', error);
        // If index is missing, try query without orderBy
        if (isMounted) {
          if (error.code === 'failed-precondition') {
            const simpleQuery = query(
              collection(db, 'jobs'),
              where('status', '==', 'requested')
            );
            onSnapshot(
              simpleQuery,
              (snapshot) => {
                if (!isMounted) return;
                const jobsData: Job[] = [];
                snapshot.forEach((doc) => {
                  try {
                    const data = doc.data();
                    if (!data.phixerId && !data.artisanId) {
                      jobsData.push({ id: doc.id, ...data } as Job);
                    }
                  } catch (err) {
                    console.error('Error processing job:', err);
                  }
                });
                // Sort manually
                jobsData.sort((a, b) => {
                  const aTime = a.createdAt?.toDate?.()?.getTime() || 0;
                  const bTime = b.createdAt?.toDate?.()?.getTime() || 0;
                  return bTime - aTime;
                });
                setAvailableJobs(jobsData);
              },
              (err) => {
                console.error('Error loading available jobs (fallback):', err);
                if (isMounted) {
                  setAvailableJobs([]);
                }
              }
            );
          } else {
            setAvailableJobs([]);
          }
        }
      }
    );

    // Load my jobs
    const myJobsQuery = query(
      collection(db, 'jobs'),
      where('phixerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const legacyJobsQuery = query(
      collection(db, 'jobs'),
      where('artisanId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const phixerJobsRef = useRef<Job[]>([]);
    const artisanJobsRef = useRef<Job[]>([]);

    const mergeAndSetMyJobs = () => {
      const combined = [...phixerJobsRef.current, ...artisanJobsRef.current];
      const uniqueMap = new Map<string, Job>();
      combined.forEach((job) => {
        if (!uniqueMap.has(job.id)) {
          uniqueMap.set(job.id, job);
        }
      });
      setMyJobs(Array.from(uniqueMap.values()));
    };

    const unsubscribeMyJobs = onSnapshot(
      myJobsQuery,
      (snapshot) => {
        if (!isMounted) return;
        phixerJobsRef.current = [];
        snapshot.forEach((doc) => {
          try {
            phixerJobsRef.current.push({ id: doc.id, ...doc.data() } as Job);
          } catch (error) {
            console.error('Error processing phixer job:', error);
          }
        });
        if (isMounted) {
          mergeAndSetMyJobs();
        }
      },
      (error) => {
        console.error('Error loading phixer jobs:', error);
        // Try without orderBy if index is missing
        if (isMounted && error.code === 'failed-precondition') {
          const simpleQuery = query(
            collection(db, 'jobs'),
            where('phixerId', '==', user.uid)
          );
          onSnapshot(
            simpleQuery,
            (snapshot) => {
              if (!isMounted) return;
              phixerJobsRef.current = [];
              snapshot.forEach((doc) => {
                try {
                  phixerJobsRef.current.push({ id: doc.id, ...doc.data() } as Job);
                } catch (err) {
                  console.error('Error processing job:', err);
                }
              });
              if (isMounted) {
                mergeAndSetMyJobs();
              }
            },
            (err) => {
              console.error('Error loading phixer jobs (fallback):', err);
            }
          );
        }
      }
    );

    const unsubscribeLegacyJobs = onSnapshot(
      legacyJobsQuery,
      (snapshot) => {
        if (!isMounted) return;
        artisanJobsRef.current = [];
        snapshot.forEach((doc) => {
          try {
            artisanJobsRef.current.push({ id: doc.id, ...doc.data() } as Job);
          } catch (error) {
            console.error('Error processing artisan job:', error);
          }
        });
        if (isMounted) {
          mergeAndSetMyJobs();
        }
      },
      (error) => {
        console.error('Error loading artisan jobs:', error);
        // Try without orderBy if index is missing
        if (isMounted && error.code === 'failed-precondition') {
          const simpleQuery = query(
            collection(db, 'jobs'),
            where('artisanId', '==', user.uid)
          );
          onSnapshot(
            simpleQuery,
            (snapshot) => {
              if (!isMounted) return;
              artisanJobsRef.current = [];
              snapshot.forEach((doc) => {
                try {
                  artisanJobsRef.current.push({ id: doc.id, ...doc.data() } as Job);
                } catch (err) {
                  console.error('Error processing job:', err);
                }
              });
              if (isMounted) {
                mergeAndSetMyJobs();
              }
            },
            (err) => {
              console.error('Error loading artisan jobs (fallback):', err);
            }
          );
        }
      }
    );

      return () => {
        isMounted = false;
        unsubscribeWallet();
        unsubscribeTransactions();
        unsubscribeAvailable();
        unsubscribeMyJobs();
        unsubscribeLegacyJobs();
      };
    } catch (error) {
      console.error('Error initializing phixer dashboard:', error);
      setLoading(false);
    }
  }, [user, artisanLocation]);

  const toggleAvailability = async () => {
    if (!user) return;
    try {
      const { db } = getFirebase();
      await updateDoc(doc(db, 'profiles', user.uid), {
        available: !available,
        updatedAt: serverTimestamp(),
      });
      setAvailable(!available);
    } catch (error) {
      console.error('Error updating availability:', error);
      Alert.alert('Error', 'Failed to update availability');
    }
  };

  const acceptJob = async (jobId: string) => {
    if (!user) return;
    try {
      const { db } = getFirebase();
      await updateDoc(doc(db, 'jobs', jobId), {
        phixerId: user.uid,
        artisanId: user.uid, // Legacy support
        status: 'accepted',
        acceptedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      Alert.alert('Success', 'Job accepted successfully!');
    } catch (error) {
      console.error('Error accepting job:', error);
      Alert.alert('Error', 'Failed to accept job. Please try again.');
    }
  };

  const captureLocation = async (persist: boolean) => {
    setCapturingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };

      setArtisanLocation(coords);

      if (persist && user) {
        const { db } = getFirebase();
        await updateDoc(doc(db, 'profiles', user.uid), {
          coordinates: coords,
          updatedAt: serverTimestamp(),
        });
        Alert.alert('Success', 'Home location saved successfully!');
      }
    } catch (error) {
      console.error('Error capturing location:', error);
      Alert.alert('Error', 'Failed to capture location');
    } finally {
      setCapturingLocation(false);
    }
  };

  const handleCashout = async () => {
    if (!user) return;

    const amount = parseFloat(cashoutAmount);
    if (amount < MIN_CASHOUT) {
      Alert.alert('Error', `Minimum cashout is ₦${MIN_CASHOUT.toLocaleString()}`);
      return;
    }

    if (amount > wallet.balance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    if (!bankAccount.accountNumber || !bankAccount.bankName) {
      Alert.alert('Error', 'Please add your bank account details first');
      return;
    }

    setProcessingCashout(true);
    try {
      const { db } = getFirebase();
      const fee = (amount * CASHOUT_FEE_PERCENT) / 100;
      const netAmount = amount - fee;

      // Create cashout transaction
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        type: 'cashout',
        amount: -amount,
        netAmount: netAmount,
        fee: fee,
        description: `Cashout to ${bankAccount.accountName} (${bankAccount.accountNumber})`,
        status: 'pending',
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
      const walletDoc = await getDoc(walletRef);
      const currentWallet = walletDoc.data() as Wallet;

      await updateDoc(walletRef, {
        balance: (currentWallet?.balance || 0) - amount,
        totalCashout: (currentWallet?.totalCashout || 0) + amount,
        pendingBalance: (currentWallet?.pendingBalance || 0) + amount,
        updatedAt: serverTimestamp(),
      });

      Alert.alert('Success', 'Cashout request submitted. Funds will be transferred within 24 hours.');
      setCashoutAmount('');
    } catch (error) {
      console.error('Error processing cashout:', error);
      Alert.alert('Error', 'Failed to process cashout. Please try again.');
    } finally {
      setProcessingCashout(false);
    }
  };

  const saveBankAccount = async () => {
    if (!user) return;
    try {
      const { db } = getFirebase();
      await updateDoc(doc(db, 'profiles', user.uid), {
        bankAccount: bankAccount,
        updatedAt: serverTimestamp(),
      });
      Alert.alert('Success', 'Bank account saved successfully!');
    } catch (error) {
      console.error('Error saving bank account:', error);
      Alert.alert('Error', 'Failed to save bank account');
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      const { db } = getFirebase();
      await updateDoc(doc(db, 'profiles', user.uid), {
        name: profileForm.name,
        phone: profileForm.phone,
        address: profileForm.address,
        state: profileForm.state,
        skills: profileForm.skills,
        experience: profileForm.experience,
        updatedAt: serverTimestamp(),
      });
      profileStateRef.current = profileForm.state || null;
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    setSavingSettings(true);
    try {
      const { db } = getFirebase();
      await updateDoc(doc(db, 'profiles', user.uid), {
        emailNotifications: settingsForm.emailNotifications,
        smsNotifications: settingsForm.smsNotifications,
        pushNotifications: settingsForm.pushNotifications,
        language: settingsForm.language,
        timezone: settingsForm.timezone,
        updatedAt: serverTimestamp(),
      });
      Alert.alert('Success', 'Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getCategoryIcon = (category?: string) => {
    const icons: Record<string, string> = {
      plumbing: '⚙',
      electrical: '⚡',
      hvac: '❄',
      appliance: '⚙',
      painting: '◉',
      carpentry: '☰',
      cleaning: '○',
    };
    return icons[category || ''] || '☰';
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '—';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'accepted':
        return { bg: '#DBEAFE', text: '#2563EB' };
      case 'in-progress':
        return { bg: '#E9D5FF', text: '#7C3AED' };
      case 'completed':
        return { bg: '#D1FAE5', text: '#059669' };
      case 'cancelled':
        return { bg: '#FEE2E2', text: '#DC2626' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const stats = {
    active: myJobs.filter((j) => ['accepted', 'in-progress'].includes(j.status)).length,
    completed: myJobs.filter((j) => j.status === 'completed').length,
    pending: myJobs.filter((j) => j.status === 'pending-completion').length,
  };

  const pendingClientRatings = myJobs.filter(
    (job) => job.status === 'completed' && !job.artisanReview
  );

  const tabConfig: Array<{ id: PhixerTab; label: string; icon: string; badge?: number }> = [
    { id: 'overview', label: 'Overview', icon: '≡' },
    { id: 'available', label: 'Available', icon: '◉', badge: availableJobs.length },
    { id: 'my-jobs', label: 'My Jobs', icon: '☰', badge: myJobs.length },
    { id: 'wallet', label: 'Wallet', icon: '$' },
    { id: 'profile', label: 'Profile', icon: '○' },
    { id: 'settings', label: 'Settings', icon: '⚙' },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  const renderOverview = () => (
    <ScrollView style={styles.tabContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome {userName ? userName.split(' ')[0] : 'back'}!</Text>
        <Text style={styles.subtitle}>Manage your jobs and earnings</Text>
        {artisanAverageRating !== null && artisanAverageRating !== undefined && (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Your Rating:</Text>
            <Text style={styles.ratingValue}>
              {'★'.repeat(Math.round(artisanAverageRating || 0))} {(artisanAverageRating || 0).toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>$</Text>
          <Text style={styles.statValue}>₦{wallet.balance.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Balance</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>◉</Text>
          <Text style={styles.statValue}>{stats.active}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>✓</Text>
          <Text style={styles.statValue}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {/* Availability */}
      <View style={styles.card}>
        <View style={styles.availabilityRow}>
          <View>
            <Text style={styles.cardTitle}>Availability</Text>
            <Text style={styles.cardSubtitle}>
              {available ? 'Available for jobs' : 'Not available'}
            </Text>
          </View>
          <Switch value={available} onValueChange={toggleAvailability} />
        </View>
      </View>

      {/* Pending Client Ratings */}
      {pendingClientRatings.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Rate Your Clients</Text>
          <Text style={styles.cardSubtitle}>
            {pendingClientRatings.length} completed job{pendingClientRatings.length > 1 ? 's' : ''} need rating
          </Text>
          {pendingClientRatings.slice(0, 3).map((job) => (
            <TouchableOpacity
              key={job.id}
              style={styles.ratingButton}
              onPress={() => {
                setRatingJobId(job.id);
                setShowRatingForm(true);
              }}
            >
              <Text style={styles.ratingButtonText}>★ Rate {job.clientName || 'Client'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Recent Jobs */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Jobs</Text>
          <TouchableOpacity onPress={() => setActiveTab('my-jobs')}>
            <Text style={styles.seeAll}>View All →</Text>
          </TouchableOpacity>
        </View>
        {myJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>☰</Text>
            <Text style={styles.emptyText}>No jobs yet</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setActiveTab('available')}
            >
              <Text style={styles.buttonText}>Browse Jobs</Text>
            </TouchableOpacity>
          </View>
        ) : (
          myJobs.slice(0, 5).map((job) => (
            <TouchableOpacity
              key={job.id}
              style={styles.jobCard}
              onPress={() => router.push(`/(tabs)/job-detail?id=${job.id}`)}
            >
              <View style={styles.jobHeader}>
                <Text style={styles.jobIcon}>{getCategoryIcon(job.serviceCategory)}</Text>
                <View style={styles.jobInfo}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(job.status).bg },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: getStatusColor(job.status).text }]}>
                      {job.status}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => setActiveTab('available')}
        >
          <Text style={styles.quickActionIcon}>◉</Text>
          <Text style={styles.quickActionText}>Available Jobs</Text>
          <Text style={styles.quickActionSubtext}>{availableJobs.length} jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => setActiveTab('wallet')}
        >
          <Text style={styles.quickActionIcon}>$</Text>
          <Text style={styles.quickActionText}>Cash Out</Text>
          <Text style={styles.quickActionSubtext}>Withdraw earnings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderAvailableJobs = () => (
    <ScrollView style={styles.tabContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Available Jobs</Text>
        <Text style={styles.subtitle}>Browse and accept job opportunities</Text>
      </View>

      {/* Location Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Filtering nearby jobs</Text>
        <Text style={styles.cardSubtitle}>
          Showing jobs in {profileStateRef.current || profile?.state || 'your state'} within 20 miles
        </Text>
        <View style={styles.locationActions}>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => captureLocation(false)}
            disabled={capturingLocation}
          >
            <Text style={styles.locationButtonText}>
              {capturingLocation ? 'Updating...' : 'Refresh Location'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.locationButton, styles.locationButtonSecondary]}
            onPress={() => captureLocation(true)}
            disabled={capturingLocation}
          >
            <Text style={[styles.locationButtonText, styles.locationButtonTextSecondary]}>
              Save as Home Base
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {availableJobs.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>○</Text>
          <Text style={styles.emptyText}>No jobs nearby</Text>
          <Text style={styles.emptySubtext}>
            Try refreshing your location or updating your state in Profile
          </Text>
        </View>
      ) : (
        availableJobs.map((job) => (
          <View key={job.id} style={styles.jobCard}>
            <View style={styles.jobHeader}>
              <Text style={styles.jobIcon}>{getCategoryIcon(job.serviceCategory)}</Text>
              <View style={styles.jobInfo}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                {job.description && (
                  <Text style={styles.jobDescription} numberOfLines={2}>
                    {job.description}
                  </Text>
                )}
                {job.serviceAddressText && (
                  <Text style={styles.addressText} numberOfLines={1}>
                    📍 {job.serviceAddressText}
                  </Text>
                )}
                {jobDistances[job.id] !== undefined && (
                  <View style={styles.distanceBadge}>
                    <Text style={styles.distanceText}>
                      📏 {formatDistance(jobDistances[job.id])} away
                    </Text>
                  </View>
                )}
                {job.clientName && (
                  <Text style={styles.clientName}>Client: {job.clientName}</Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => acceptJob(job.id)}
            >
              <Text style={styles.acceptButtonText}>Accept Job</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );

  const renderMyJobs = () => (
    <ScrollView style={styles.tabContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.header}>
        <Text style={styles.greeting}>My Jobs</Text>
        <Text style={styles.subtitle}>{myJobs.length} total job{myJobs.length !== 1 ? 's' : ''}</Text>
      </View>

      {myJobs.length === 0 ? (
        <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>☰</Text>
            <Text style={styles.emptyText}>No jobs yet</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setActiveTab('available')}
          >
            <Text style={styles.buttonText}>Browse Available Jobs</Text>
          </TouchableOpacity>
        </View>
      ) : (
        myJobs.map((job) => {
          const isExpanded = expandedJobs.has(job.id);
          return (
            <TouchableOpacity
              key={job.id}
              style={styles.jobCard}
              onPress={() => router.push(`/(tabs)/job-detail?id=${job.id}`)}
            >
              <View style={styles.jobHeader}>
                <Text style={styles.jobIcon}>{getCategoryIcon(job.serviceCategory)}</Text>
                <View style={styles.jobInfo}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(job.status).bg },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: getStatusColor(job.status).text }]}>
                      {job.status}
                    </Text>
                  </View>
                  {job.clientName && (
                    <Text style={styles.clientName}>Client: {job.clientName}</Text>
                  )}
                  {job.serviceAddressText && (
                    <Text style={styles.addressText} numberOfLines={1}>
                      📍 {job.serviceAddressText}
                    </Text>
                  )}
                  {job.amount && (
                    <Text style={styles.jobAmount}>Amount: ₦{job.amount.toLocaleString()}</Text>
                  )}
                </View>
              </View>
              {job.status === 'completed' && !job.artisanReview && (
                <TouchableOpacity
                  style={styles.ratingButton}
                  onPress={() => {
                    setRatingJobId(job.id);
                    setShowRatingForm(true);
                  }}
                >
                  <Text style={styles.ratingButtonText}>★ Rate Client</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );

  const renderWallet = () => (
    <ScrollView style={styles.tabContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Wallet</Text>
        <Text style={styles.subtitle}>Manage your earnings and cash out</Text>
      </View>

      {/* Wallet Stats */}
      <View style={styles.walletStats}>
        <View style={styles.walletStatCard}>
          <Text style={styles.walletStatIcon}>$</Text>
          <Text style={styles.walletStatValue}>₦{wallet.balance.toLocaleString()}</Text>
          <Text style={styles.walletStatLabel}>Available Balance</Text>
        </View>
        <View style={styles.walletStatCard}>
          <Text style={styles.walletStatIcon}>↑</Text>
          <Text style={styles.walletStatValue}>₦{wallet.totalEarnings.toLocaleString()}</Text>
          <Text style={styles.walletStatLabel}>Total Earnings</Text>
        </View>
        <View style={styles.walletStatCard}>
          <Text style={styles.walletStatIcon}>→</Text>
          <Text style={styles.walletStatValue}>₦{wallet.totalCashout.toLocaleString()}</Text>
          <Text style={styles.walletStatLabel}>Total Cashout</Text>
        </View>
      </View>

      {/* Bank Account Form */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bank Account Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Bank Name"
          placeholderTextColor="#9CA3AF"
          value={bankAccount.bankName}
          onChangeText={(text) => setBankAccount({ ...bankAccount, bankName: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Account Number"
          placeholderTextColor="#9CA3AF"
          value={bankAccount.accountNumber}
          onChangeText={(text) => setBankAccount({ ...bankAccount, accountNumber: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Account Name"
          placeholderTextColor="#9CA3AF"
          value={bankAccount.accountName}
          onChangeText={(text) => setBankAccount({ ...bankAccount, accountName: text })}
        />
        <TouchableOpacity style={styles.button} onPress={saveBankAccount}>
          <Text style={styles.buttonText}>Save Bank Account</Text>
        </TouchableOpacity>
      </View>

      {/* Cashout Form */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cash Out</Text>
        <Text style={styles.cardSubtitle}>
          {CASHOUT_FEE_PERCENT}% transaction fee applies
        </Text>
        <TextInput
          style={styles.input}
          placeholder={`Minimum: ₦${MIN_CASHOUT.toLocaleString()}`}
          placeholderTextColor="#9CA3AF"
          value={cashoutAmount}
          onChangeText={setCashoutAmount}
          keyboardType="numeric"
        />
        {cashoutAmount && parseFloat(cashoutAmount) >= MIN_CASHOUT && (
          <View style={styles.feeBreakdown}>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Amount:</Text>
              <Text style={styles.feeValue}>₦{parseFloat(cashoutAmount).toLocaleString()}</Text>
            </View>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Fee ({CASHOUT_FEE_PERCENT}%):</Text>
              <Text style={styles.feeValue}>
                -₦{((parseFloat(cashoutAmount) * CASHOUT_FEE_PERCENT) / 100).toFixed(2)}
              </Text>
            </View>
            <View style={[styles.feeRow, styles.feeRowTotal]}>
              <Text style={styles.feeLabelTotal}>You Receive:</Text>
              <Text style={styles.feeValueTotal}>
                ₦{(parseFloat(cashoutAmount) - (parseFloat(cashoutAmount) * CASHOUT_FEE_PERCENT) / 100).toLocaleString()}
              </Text>
            </View>
          </View>
        )}
        <TouchableOpacity
          style={[styles.button, styles.buttonSuccess, (processingCashout || !bankAccount.accountNumber) && styles.buttonDisabled]}
          onPress={handleCashout}
          disabled={processingCashout || !bankAccount.accountNumber}
        >
          {processingCashout ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Cash Out</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.hintText}>Funds will be transferred within 24 hours</Text>
      </View>

      {/* Transaction History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transaction History</Text>
        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>☰</Text>
            <Text style={styles.emptyText}>No transactions yet</Text>
          </View>
        ) : (
          transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionHeader}>
                <View style={styles.transactionIcon}>
                  <Text style={styles.transactionIconText}>
                    {transaction.type === 'earning' ? '+' : transaction.type === 'cashout' ? '→' : '-'}
                  </Text>
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                  <Text style={styles.transactionDate}>{formatDate(transaction.createdAt)}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          transaction.status === 'completed'
                            ? '#D1FAE5'
                            : transaction.status === 'pending'
                            ? '#FEF3C7'
                            : '#FEE2E2',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            transaction.status === 'completed'
                              ? '#059669'
                              : transaction.status === 'pending'
                              ? '#D97706'
                              : '#DC2626',
                        },
                      ]}
                    >
                      {transaction.status}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    transaction.type === 'earning' ? styles.transactionAmountPositive : styles.transactionAmountNegative,
                  ]}
                >
                  {transaction.type === 'earning' ? '+' : '-'}₦
                  {Math.abs(transaction.amount).toLocaleString()}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );

  const renderProfile = () => (
    <ScrollView style={styles.tabContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Profile</Text>
        <Text style={styles.subtitle}>Manage your account information</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Information</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#9CA3AF"
          value={profileForm.name}
          onChangeText={(text) => setProfileForm({ ...profileForm, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#9CA3AF"
          value={profileForm.phone}
          onChangeText={(text) => setProfileForm({ ...profileForm, phone: text })}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          placeholderTextColor="#9CA3AF"
          value={profileForm.address}
          onChangeText={(text) => setProfileForm({ ...profileForm, address: text })}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="State"
          placeholderTextColor="#9CA3AF"
          value={profileForm.state}
          onChangeText={(text) => setProfileForm({ ...profileForm, state: text })}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Professional Information</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Skills (e.g., Plumbing, Electrical, HVAC)"
          placeholderTextColor="#9CA3AF"
          value={profileForm.skills}
          onChangeText={(text) => setProfileForm({ ...profileForm, skills: text })}
          multiline
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Experience (e.g., 5 years in plumbing)"
          placeholderTextColor="#9CA3AF"
          value={profileForm.experience}
          onChangeText={(text) => setProfileForm({ ...profileForm, experience: text })}
          multiline
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Location</Text>
        <Text style={styles.cardSubtitle}>
          {artisanLocation
            ? `Current: ${artisanLocation.lat.toFixed(4)}, ${artisanLocation.lng.toFixed(4)}`
            : 'No location set'}
        </Text>
        <View style={styles.locationActions}>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => captureLocation(false)}
            disabled={capturingLocation}
          >
            <Text style={styles.locationButtonText}>
              {capturingLocation ? 'Capturing...' : 'Get Current Location'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.locationButton, styles.locationButtonSecondary]}
            onPress={() => captureLocation(true)}
            disabled={capturingLocation}
          >
            <Text style={[styles.locationButtonText, styles.locationButtonTextSecondary]}>
              Save as Home Base
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, savingProfile && styles.buttonDisabled]}
        onPress={handleSaveProfile}
        disabled={savingProfile}
      >
        {savingProfile ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Profile</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );

  const renderSettings = () => (
    <ScrollView style={styles.tabContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Settings</Text>
        <Text style={styles.subtitle}>Manage your preferences</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Notifications</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Email Notifications</Text>
            <Text style={styles.settingDescription}>Receive updates via email</Text>
          </View>
          <Switch
            value={settingsForm.emailNotifications}
            onValueChange={(value) => setSettingsForm({ ...settingsForm, emailNotifications: value })}
          />
        </View>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>SMS Notifications</Text>
            <Text style={styles.settingDescription}>Receive updates via SMS</Text>
          </View>
          <Switch
            value={settingsForm.smsNotifications}
            onValueChange={(value) => setSettingsForm({ ...settingsForm, smsNotifications: value })}
          />
        </View>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Text style={styles.settingDescription}>Receive push notifications</Text>
          </View>
          <Switch
            value={settingsForm.pushNotifications}
            onValueChange={(value) => setSettingsForm({ ...settingsForm, pushNotifications: value })}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Preferences</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Language</Text>
          <TextInput
            style={styles.input}
            placeholder="Language (e.g., en)"
            placeholderTextColor="#9CA3AF"
            value={settingsForm.language}
            onChangeText={(text) => setSettingsForm({ ...settingsForm, language: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Timezone</Text>
          <TextInput
            style={styles.input}
            placeholder="Timezone (e.g., Africa/Lagos)"
            placeholderTextColor="#9CA3AF"
            value={settingsForm.timezone}
            onChangeText={(text) => setSettingsForm({ ...settingsForm, timezone: text })}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, savingSettings && styles.buttonDisabled]}
        onPress={handleSaveSettings}
        disabled={savingSettings}
      >
        {savingSettings ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Settings</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'available':
        return renderAvailableJobs();
      case 'my-jobs':
        return renderMyJobs();
      case 'wallet':
        return renderWallet();
      case 'profile':
        return renderProfile();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  // Main tabs shown in header (most important)
  const mainTabs = tabConfig.slice(0, 3); // Overview, Available, My Jobs
  // Secondary tabs in drawer
  const drawerTabs = tabConfig.slice(3); // Wallet, Profile, Settings

  const menuItems = drawerTabs.map(tab => ({
    id: tab.id,
    label: tab.label,
    icon: tab.icon,
    badge: tab.badge,
    onPress: () => setActiveTab(tab.id),
  }));

  return (
    <View style={styles.container}>
      {/* Header with Hamburger and Main Tabs */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.hamburgerButton}
          onPress={() => setDrawerVisible(true)}
        >
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.mainTabBar}
          contentContainerStyle={styles.mainTabBarContent}
        >
          {mainTabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.mainTab, activeTab === tab.id && styles.mainTabActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.mainTabIcon, activeTab === tab.id && styles.mainTabIconActive]}>
                {tab.icon}
              </Text>
              <Text style={[styles.mainTabLabel, activeTab === tab.id && styles.mainTabLabelActive]}>
                {tab.label}
              </Text>
              {tab.badge !== undefined && tab.badge > 0 && (
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>{tab.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Menu Drawer */}
      <MenuDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        items={menuItems}
        activeItemId={activeTab}
      />

      {/* Rating Form Modal */}
      {ratingJobId && user && (
        <RatingForm
          visible={showRatingForm}
          onClose={() => {
            setShowRatingForm(false);
            setRatingJobId(null);
          }}
          jobId={ratingJobId}
          userId={user.uid}
          userRole="Phixer"
          targetRole="client"
          targetName={myJobs.find((j) => j.id === ratingJobId)?.clientName || 'Client'}
        />
      )}

      {/* Support Chat */}
      <SupportChat role="Phixer" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  headerContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  hamburgerButton: {
    padding: 12,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerIcon: {
    fontSize: 24,
    color: '#111827',
  },
  mainTabBar: {
    flex: 1,
  },
  mainTabBarContent: {
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  mainTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
    position: 'relative',
  },
  mainTabActive: {
    backgroundColor: '#EFF6FF',
  },
  mainTabIcon: {
    fontSize: 20,
    marginBottom: 4,
    color: '#6B7280',
  },
  mainTabIconActive: {
    color: '#2563EB',
  },
  mainTabLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  mainTabLabelActive: {
    color: '#2563EB',
    fontWeight: '600',
  },
  headerBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#2563EB',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  headerBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  ratingLabel: {
    fontSize: 12,
    color: '#92400E',
    marginRight: 6,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  card: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  section: {
    padding: 16,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  seeAll: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  jobDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  jobStatus: {
    fontSize: 14,
    color: '#6B7280',
  },
  jobAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
    marginTop: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  clientName: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  addressText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  distanceBadge: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },
  acceptButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonSuccess: {
    backgroundColor: '#10B981',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  ratingButton: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  ratingButtonText: {
    color: '#92400E',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  quickActionSubtext: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  locationActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  locationButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  locationButtonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  locationButtonTextSecondary: {
    color: '#2563EB',
  },
  walletStats: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  walletStatCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  walletStatIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  walletStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  walletStatLabel: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    marginBottom: 12,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  feeBreakdown: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  feeRowTotal: {
    borderTopWidth: 1,
    borderTopColor: '#D97706',
    paddingTop: 8,
    marginTop: 4,
  },
  feeLabel: {
    fontSize: 13,
    color: '#92400E',
  },
  feeValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
  },
  feeLabelTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
  },
  feeValueTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
  },
  hintText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIconText: {
    fontSize: 24,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionAmountPositive: {
    color: '#059669',
  },
  transactionAmountNegative: {
    color: '#DC2626',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
});
