import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthState } from '@/hooks/useAuthState';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { doc, updateDoc, onSnapshot as onDocSnapshot } from 'firebase/firestore';
import { getFirebase } from '@/config/firebase';
import * as Location from 'expo-location';
import { calculateDistance, formatDistance } from '@/utils/distance';

interface Job {
  id: string;
  title: string;
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
}

export default function ArtisanDashboard() {
  const router = useRouter();
  const { user } = useAuthState();
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [available, setAvailable] = useState(true);
  const [earnings, setEarnings] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [artisanLocation, setArtisanLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [jobDistances, setJobDistances] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user) return;

    const { db } = getFirebase();

    // Get artisan's current location for distance calculation
    const getArtisanLocation = async () => {
      try {
        const { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();
        if (permissionStatus === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setArtisanLocation({
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          });
        }
      } catch (error) {
        console.error('Error getting artisan location:', error);
      }
    };

    getArtisanLocation();

    // Load available jobs (jobs without artisan)
    const availableJobsQuery = query(
      collection(db, 'jobs'),
      where('status', '==', 'requested'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeAvailable = onSnapshot(availableJobsQuery, (snapshot) => {
      const jobsData: Job[] = [];
      const distances: Record<string, number> = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.phixerId && !data.artisanId) {
          const jobData = { id: doc.id, ...data } as Job;
          jobsData.push(jobData);

          // Calculate distance if location is available
          if (artisanLocation && jobData.serviceAddress?.lat && jobData.serviceAddress?.lng) {
            const dist = calculateDistance(
              artisanLocation.lat,
              artisanLocation.lng,
              jobData.serviceAddress.lat,
              jobData.serviceAddress.lng
            );
            distances[jobData.id] = dist;
          }
        }
      });
      setAvailableJobs(jobsData.slice(0, 5));
      setJobDistances(distances);
    });

    // Load my jobs (query both phixerId and artisanId for backward compatibility)
    const myJobsQuery = query(
      collection(db, 'jobs'),
      where('phixerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    
    // Also query legacy artisanId field for backward compatibility
    const legacyJobsQuery = query(
      collection(db, 'jobs'),
      where('artisanId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    // Use refs to track data from both queries and merge them
    const phixerJobsRef = React.useRef<Job[]>([]);
    const artisanJobsRef = React.useRef<Job[]>([]);
    
    const mergeAndSetMyJobs = () => {
      // Combine both arrays and deduplicate by ID
      const combined = [...phixerJobsRef.current, ...artisanJobsRef.current];
      const uniqueMap = new Map<string, Job>();
      combined.forEach(job => {
        if (!uniqueMap.has(job.id)) {
          uniqueMap.set(job.id, job);
        }
      });
      setMyJobs(Array.from(uniqueMap.values()));
    };

    const unsubscribeMyJobs = onSnapshot(myJobsQuery, (snapshot) => {
      phixerJobsRef.current = [];
      snapshot.forEach((doc) => {
        phixerJobsRef.current.push({ id: doc.id, ...doc.data() } as Job);
      });
      mergeAndSetMyJobs();
    });
    
    const unsubscribeLegacyJobs = onSnapshot(legacyJobsQuery, (snapshot) => {
      artisanJobsRef.current = [];
      snapshot.forEach((doc) => {
        artisanJobsRef.current.push({ id: doc.id, ...doc.data() } as Job);
      });
      mergeAndSetMyJobs();
    });

    // Load earnings (from wallet)
    const walletRef = doc(db, 'wallets', user.uid);
    const unsubscribeWallet = onDocSnapshot(walletRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setEarnings(data.balance || 0);
      }
    });

    return () => {
      unsubscribeAvailable();
      unsubscribeMyJobs();
      unsubscribeLegacyJobs();
      unsubscribeWallet();
    };
  }, [user, artisanLocation]);

  const toggleAvailability = async () => {
    // In a real app, this would update a profile field
    setAvailable(!available);
  };

  const acceptJob = async (jobId: string) => {
    if (!user) return;

    try {
      const { db } = getFirebase();
      await updateDoc(doc(db, 'jobs', jobId), {
        artisanId: user.uid,
        status: 'accepted',
        acceptedAt: new Date(),
      });
    } catch (error) {
      console.error('Error accepting job:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getCategoryIcon = (category?: string) => {
    const icons: Record<string, string> = {
      plumbing: '🔧',
      electrical: '⚡',
      hvac: '❄️',
      appliance: '🔨',
      painting: '🎨',
      carpentry: '🚪',
      cleaning: '🧹',
    };
    return icons[category || ''] || '📦';
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back!</Text>
        <Text style={styles.subtitle}>Manage your jobs and earnings</Text>
      </View>

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

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Earnings</Text>
        <Text style={styles.earnings}>₦{earnings.toLocaleString()}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(tabs)/earnings')}
        >
          <Text style={styles.buttonText}>View Earnings</Text>
        </TouchableOpacity>
      </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Jobs</Text>
            <View style={styles.sectionHeaderRight}>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/notifications')}
                style={styles.notificationButton}
              >
                <Text style={styles.notificationIcon}>🔔</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/(tabs)/jobs')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
          </View>

        {availableJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No available jobs</Text>
          </View>
        ) : (
          availableJobs.map((job) => (
            <TouchableOpacity key={job.id} style={styles.jobCard}>
              <View style={styles.jobHeader}>
                <Text style={styles.jobIcon}>{getCategoryIcon(job.serviceCategory)}</Text>
                <View style={styles.jobInfo}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  {job.clientName && (
                    <Text style={styles.clientName}>Client: {job.clientName}</Text>
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
                </View>
              </View>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => acceptJob(job.id)}
              >
                <Text style={styles.acceptButtonText}>Accept Job</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Jobs</Text>
          <Text style={styles.jobCount}>{myJobs.length}</Text>
        </View>

        {myJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔧</Text>
            <Text style={styles.emptyText}>No active jobs</Text>
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
                  <Text style={styles.jobStatus}>Status: {job.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
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
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  earnings: {
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
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    padding: 4,
  },
  notificationIcon: {
    fontSize: 20,
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
  jobCount: {
    fontSize: 14,
    color: '#6B7280',
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
    alignItems: 'center',
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
  clientName: {
    fontSize: 14,
    color: '#6B7280',
  },
  jobStatus: {
    fontSize: 14,
    color: '#6B7280',
  },
  acceptButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
});

