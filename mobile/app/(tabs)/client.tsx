import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthState } from '@/hooks/useAuthState';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { doc, onSnapshot as onDocSnapshot } from 'firebase/firestore';
import { getFirebase } from '@/config/firebase';

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
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back!</Text>
        <Text style={styles.subtitle}>Manage your facility services</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Wallet Balance</Text>
        <Text style={styles.balance}>₦{wallet.balance.toLocaleString()}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(tabs)/wallet')}
        >
          <Text style={styles.buttonText}>Manage Wallet</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Jobs</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/jobs')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {jobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No jobs yet</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/(tabs)/request')}
            >
              <Text style={styles.buttonText}>Request Service</Text>
            </TouchableOpacity>
          </View>
        ) : (
          jobs.slice(0, 5).map((job) => (
            <TouchableOpacity
              key={job.id}
              style={styles.jobCard}
              onPress={() => router.push(`/(tabs)/job-detail?id=${job.id}`)}
            >
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(job.status) + '20' },
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
              {job.artisanName && (
                <Text style={styles.artisanName}>Artisan: {job.artisanName}</Text>
              )}
              <Text style={styles.jobDate}>Created: {formatDate(job.createdAt)}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={() => router.push('/(tabs)/request')}
      >
        <Text style={styles.primaryButtonText}>+ Request New Service</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  card: {
    margin: 16,
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
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
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
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  artisanName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  jobDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  primaryButton: {
    margin: 16,
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

