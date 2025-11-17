import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthState } from '@/hooks/useAuthState';
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import { getFirebase } from '@/config/firebase';
import * as Location from 'expo-location';
import { calculateDistance, formatDistance } from '@/utils/distance';

interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  serviceCategory?: string;
  createdAt: any;
  scheduledAt?: any;
  artisanName?: string;
  artisanId?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientCompany?: string;
  serviceAddress?: {
    description?: string;
    lat?: number;
    lng?: number;
  };
  serviceAddressText?: string;
  serviceState?: string;
  attachments?: string[];
  amount?: number;
  clientReview?: {
    rating?: number;
    feedback?: string;
  };
}

export default function JobsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuthState();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [artisanLocation, setArtisanLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [jobDistances, setJobDistances] = useState<Record<string, number>>({});
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!user) return;

    const { db } = getFirebase();
    
    // Get user role first, then load jobs
    const fetchRoleAndJobs = async () => {
      try {
        const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
        const profile = profileDoc.data();
        const role = profile?.role || 'client';
        setUserRole(role);

        // Get artisan's current location for distance calculation
        if (role === 'artisan') {
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
        }

        // Load jobs based on role
        let jobsQuery;
        if (role === 'artisan') {
          // Artisans see their assigned jobs
          jobsQuery = query(
            collection(db, 'jobs'),
            where('artisanId', '==', user.uid),
            orderBy('createdAt', 'desc')
          );
        } else {
          // Clients see their own jobs
          jobsQuery = query(
            collection(db, 'jobs'),
            where('clientId', '==', user.uid),
            orderBy('createdAt', 'desc')
          );
        }

        unsubscribeRef.current = onSnapshot(jobsQuery, (snapshot) => {
          const jobsData: Job[] = [];
          const distances: Record<string, number> = {};

          snapshot.forEach((doc) => {
            const jobData = { id: doc.id, ...doc.data() } as Job;
            jobsData.push(jobData);

            // Calculate distance for artisans
            if (role === 'artisan' && artisanLocation && jobData.serviceAddress?.lat && jobData.serviceAddress?.lng) {
              const dist = calculateDistance(
                artisanLocation.lat,
                artisanLocation.lng,
                jobData.serviceAddress.lat,
                jobData.serviceAddress.lng
              );
              distances[jobData.id] = dist;
            }
          });

          setJobs(jobsData);
          setJobDistances(distances);
        });
      } catch (error) {
        console.error('Error fetching role:', error);
        setUserRole('client');
      }
    };

    fetchRoleAndJobs();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [user, artisanLocation]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
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

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '—';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  if (jobs.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No jobs found</Text>
          <Text style={styles.emptyText}>Request your first service to get started</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/(tabs)/request')}
          >
            <Text style={styles.buttonText}>Request Service</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>My Service Requests</Text>
        <Text style={styles.subtitle}>{jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}</Text>
      </View>

      <View style={styles.jobsList}>
        {jobs.map((job) => {
          const statusColors = getStatusColor(job.status);
          return (
            <TouchableOpacity
              key={job.id}
              style={styles.jobCard}
              onPress={() => router.push(`/(tabs)/job-detail?id=${job.id}`)}
            >
              <View style={styles.jobHeader}>
                <View style={styles.jobTitleRow}>
                  <Text style={styles.jobIcon}>{getCategoryIcon(job.serviceCategory)}</Text>
                  <View style={styles.jobTitleContainer}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <Text style={styles.jobDescription} numberOfLines={2}>
                      {job.description}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusColors.bg },
                  ]}
                >
                  <Text style={[styles.statusText, { color: statusColors.text }]}>
                    {job.status}
                  </Text>
                </View>
              </View>

              {userRole === 'artisan' && job.clientName && (
                <View style={styles.artisanInfo}>
                  <Text style={styles.artisanLabel}>Client:</Text>
                  <Text style={styles.artisanName}>{job.clientName}</Text>
                  {job.clientPhone && (
                    <Text style={styles.clientPhone}>{job.clientPhone}</Text>
                  )}
                </View>
              )}

              {userRole === 'client' && job.artisanName && (
                <View style={styles.artisanInfo}>
                  <Text style={styles.artisanLabel}>Assigned Artisan:</Text>
                  <Text style={styles.artisanName}>{job.artisanName}</Text>
                </View>
              )}

              {userRole === 'artisan' && job.serviceAddressText && (
                <View style={styles.addressInfo}>
                  <Text style={styles.addressLabel}>📍 Service Location:</Text>
                  <Text style={styles.addressText}>{job.serviceAddressText}</Text>
                  {jobDistances[job.id] !== undefined && (
                    <View style={styles.distanceBadge}>
                      <Text style={styles.distanceText}>
                        📏 {formatDistance(jobDistances[job.id])} away
                      </Text>
                    </View>
                  )}
                </View>
              )}

              <View style={styles.jobFooter}>
                <Text style={styles.jobDate}>Created: {formatDate(job.createdAt)}</Text>
                {job.scheduledAt && (
                  <Text style={styles.jobDate}>
                    Scheduled: {formatDate(job.scheduledAt)}
                  </Text>
                )}
              </View>

              {job.status === 'completed' && job.amount && (
                <View style={styles.amountContainer}>
                  <Text style={styles.amountLabel}>Amount:</Text>
                  <Text style={styles.amount}>₦{job.amount.toLocaleString()}</Text>
                </View>
              )}

              {userRole === 'artisan' && ['accepted', 'in-progress'].includes(job.status) && (
                <TouchableOpacity
                  style={styles.trackButton}
                  onPress={() => router.push(`/(tabs)/location-broadcast?jobId=${job.id}`)}
                >
                  <Text style={styles.trackButtonText}>📍 Share Location</Text>
                </TouchableOpacity>
              )}

              {userRole === 'client' && job.artisanId && ['accepted', 'in-progress'].includes(job.status) && (
                <TouchableOpacity
                  style={styles.trackButton}
                  onPress={() => router.push(`/(tabs)/tracking?jobId=${job.id}&artisanId=${job.artisanId}`)}
                >
                  <Text style={styles.trackButtonText}>📍 Track Artisan</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  jobsList: {
    padding: 16,
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitleRow: {
    flexDirection: 'row',
    flex: 1,
  },
  jobIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  jobTitleContainer: {
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
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  artisanInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  artisanLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  artisanName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  jobFooter: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  jobDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },
  amountLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  addressInfo: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
  },
  addressLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  clientPhone: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  trackButton: {
    marginTop: 12,
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  distanceBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
});

