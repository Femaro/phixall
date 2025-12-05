import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthState } from '@/hooks/useAuthState';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { doc, onSnapshot as onDocSnapshot, getDoc } from 'firebase/firestore';
import { getFirebase } from '@/config/firebase';
import { SupportChat } from '@/components/SupportChat';

interface Job {
  id: string;
  title: string;
  status: string;
  createdAt: any;
  artisanName?: string;
}

export default function ClientDashboard() {
  const router = useRouter();
  const { user } = useAuthState();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [wallet, setWallet] = useState({ balance: 0, totalSpent: 0 });
  const [refreshing, setRefreshing] = useState(false);
  const [clientAverageRating, setClientAverageRating] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const { db } = getFirebase();

    // Load jobs
    const jobsQuery = query(
      collection(db, 'jobs'),
      where('clientId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeJobs = onSnapshot(jobsQuery, (snapshot) => {
      const jobsData: Job[] = [];
      snapshot.forEach((doc) => {
        jobsData.push({ id: doc.id, ...doc.data() } as Job);
      });
      setJobs(jobsData);
    });

    // Load wallet
    const walletRef = doc(db, 'wallets', user.uid);
    const unsubscribeWallet = onDocSnapshot(walletRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setWallet({
          balance: data.balance || 0,
          totalSpent: data.totalSpent || 0,
        });
      }
    });

    // Load client profile (rating and name)
    const loadProfile = async () => {
      try {
        const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
        if (profileDoc.exists()) {
          const profile = profileDoc.data();
          if (profile.clientAverageRating !== undefined) {
            setClientAverageRating(profile.clientAverageRating);
          }
          // Get user name from profile, displayName, or email
          const name = profile.name || user.displayName || user.email?.split('@')[0] || 'User';
          setUserName(name);
        } else {
          // Fallback to displayName or email if profile doesn't exist
          const name = user.displayName || user.email?.split('@')[0] || 'User';
          setUserName(name);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        // Fallback to displayName or email on error
        const name = user.displayName || user.email?.split('@')[0] || 'User';
        setUserName(name);
      }
    };
    loadProfile();

    return () => {
      unsubscribeJobs();
      unsubscribeWallet();
    };
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested':
        return '#F59E0B';
      case 'accepted':
        return '#3B82F6';
      case 'in-progress':
        return '#8B5CF6';
      case 'completed':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '—';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/(tabs)/request')}
          activeOpacity={0.7}
        >
          <Text style={styles.searchIcon}>☰</Text>
          <Text style={styles.searchPlaceholder}>Request service</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>
            {userName ? `Hi, ${userName.split(' ')[0]}` : 'Welcome back'}
          </Text>
          {clientAverageRating !== null && (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>
                {'★'.repeat(Math.round(clientAverageRating))} {clientAverageRating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>

        {/* Wallet Card */}
        <TouchableOpacity
          style={styles.walletCard}
          onPress={() => router.push('/(tabs)/wallet')}
          activeOpacity={0.8}
        >
          <View style={styles.walletHeader}>
            <Text style={styles.walletLabel}>Wallet Balance</Text>
            <Text style={styles.walletArrow}>→</Text>
          </View>
          <Text style={styles.walletAmount}>₦{wallet.balance.toLocaleString()}</Text>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/jobs')}
            activeOpacity={0.7}
          >
            <Text style={styles.quickActionIcon}>☰</Text>
            <Text style={styles.quickActionLabel}>My Jobs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/wallet')}
            activeOpacity={0.7}
          >
            <Text style={styles.quickActionIcon}>$</Text>
            <Text style={styles.quickActionLabel}>Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/(auth)/onboarding')}
            activeOpacity={0.7}
          >
            <Text style={styles.quickActionIcon}>⚙</Text>
            <Text style={styles.quickActionLabel}>Become Phixer</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Jobs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Jobs</Text>
            {jobs.length > 0 && (
              <TouchableOpacity onPress={() => router.push('/(tabs)/jobs')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            )}
          </View>

          {jobs.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>☰</Text>
              <Text style={styles.emptyTitle}>No jobs yet</Text>
              <Text style={styles.emptyText}>Request a service to get started</Text>
            </View>
          ) : (
            jobs.slice(0, 5).map((job) => (
              <TouchableOpacity
                key={job.id}
                style={styles.jobCard}
                onPress={() => router.push(`/(tabs)/job-detail?id=${job.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.jobCardContent}>
                  <View style={styles.jobCardHeader}>
                    <View style={styles.jobCardLeft}>
                      <Text style={styles.jobTitle}>{job.title}</Text>
                      {job.artisanName && (
                        <Text style={styles.jobPhixer}>Phixer: {job.artisanName}</Text>
                      )}
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(job.status) + '15' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(job.status) },
                        ]}
                      >
                        {job.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.jobDate}>{formatDate(job.createdAt)}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <SupportChat role="client" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  searchContainer: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#000000',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 20,
    color: '#6B7280',
    marginRight: 12,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#9CA3AF',
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ratingBadge: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ratingText: {
    fontSize: 12,
    color: '#FBBF24',
    fontWeight: '600',
  },
  walletCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  walletLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  walletArrow: {
    fontSize: 18,
    color: '#6B7280',
  },
  walletAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionIcon: {
    fontSize: 24,
    color: '#111827',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  seeAll: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    opacity: 0.7,
  },
  emptyCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    color: '#6B7280',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  jobCardContent: {
    padding: 16,
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobCardLeft: {
    flex: 1,
    marginRight: 12,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  jobPhixer: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  jobDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  bottomSpacer: {
    height: 20,
  },
});

