import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthState } from '@/hooks/useAuthState';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebase } from '@/config/firebase';
import * as Location from 'expo-location';
import { calculateDistance, formatDistance } from '@/utils/distance';

interface JobDetail {
  id: string;
  title: string;
  description: string;
  status: string;
  serviceCategory?: string;
  createdAt: any;
  scheduledAt?: any;
  clientId: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientCompany?: string;
  artisanId?: string; // Legacy field for backward compatibility
  artisanName?: string; // Legacy field for backward compatibility
  phixerId?: string;
  phixerName?: string;
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
    clientName?: string;
  };
  artisanReview?: {
    rating?: number;
    feedback?: string;
    artisanName?: string;
  };
}

export default function JobDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuthState();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [artisanLocation, setArtisanLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    if (!user || !params.id) return;

    const { db } = getFirebase();

    const fetchJobAndRole = async () => {
      try {
        // Get user role
        const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
        const profile = profileDoc.data();
        const role = profile?.role || 'client';
        setUserRole(role);

        // Get job details
        const jobDoc = await getDoc(doc(db, 'jobs', params.id as string));
        if (jobDoc.exists()) {
          const jobData = { id: jobDoc.id, ...jobDoc.data() } as JobDetail;
          setJob(jobData);

          // If artisan, calculate distance to service location
          if (role === 'artisan' && jobData.serviceAddress?.lat && jobData.serviceAddress?.lng) {
            try {
              const { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();
              if (permissionStatus === 'granted') {
                const location = await Location.getCurrentPositionAsync({});
                const artisanLoc = {
                  lat: location.coords.latitude,
                  lng: location.coords.longitude,
                };
                setArtisanLocation(artisanLoc);

                const dist = calculateDistance(
                  artisanLoc.lat,
                  artisanLoc.lng,
                  jobData.serviceAddress.lat,
                  jobData.serviceAddress.lng
                );
                setDistance(dist);
              }
            } catch (error) {
              console.error('Error getting artisan location:', error);
            }
          }
        } else {
          Alert.alert('Error', 'Job not found');
          router.back();
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        Alert.alert('Error', 'Failed to load job details');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndRole();
  }, [user, params.id]);

  const updateJobStatus = async (newStatus: string) => {
    if (!job || !user) return;

    setUpdating(true);
    try {
      const { db } = getFirebase();
      await updateDoc(doc(db, 'jobs', job.id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      setJob({ ...job, status: newStatus });
      Alert.alert('Success', `Job status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating job:', error);
      Alert.alert('Error', 'Failed to update job status');
    } finally {
      setUpdating(false);
    }
  };

  const startTracking = () => {
    if (!job) return;
    const phixerId = job.phixerId || job.artisanId || user?.uid;
    router.push(`/(tabs)/tracking?jobId=${job.id}&phixerId=${phixerId}`);
  };

  const startBroadcasting = () => {
    if (!job) return;
    router.push(`/(tabs)/location-broadcast?jobId=${job.id}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading job details...</Text>
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Job not found</Text>
      </View>
    );
  }

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

  const statusColors = getStatusColor(job.status);
  const isArtisan = userRole === 'artisan';
  const isClient = userRole === 'client';
  const canTrack = (job.phixerId || job.artisanId) && ['accepted', 'in-progress'].includes(job.status);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Job Details</Text>
      </View>

      <View style={styles.content}>
        {/* Job Header */}
        <View style={styles.jobHeader}>
          <View style={styles.jobTitleRow}>
            <Text style={styles.jobIcon}>{getCategoryIcon(job.serviceCategory)}</Text>
            <View style={styles.jobTitleContainer}>
              <Text style={styles.jobTitle}>{job.title}</Text>
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
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{job.description}</Text>
        </View>

        {/* Service Address - Prominent Display */}
        {job.serviceAddressText && (
          <View style={styles.addressSection}>
            <Text style={styles.sectionTitle}>📍 Service Address</Text>
            <View style={styles.addressCard}>
              <Text style={styles.addressText}>{job.serviceAddressText}</Text>
              {job.serviceState && (
                <Text style={styles.addressState}>{job.serviceState}</Text>
              )}
              {userRole === 'artisan' && job.serviceAddress?.lat && job.serviceAddress?.lng && (
                <View style={styles.distanceContainer}>
                  {distance !== null ? (
                    <>
                      <Text style={styles.distanceLabel}>Distance from you:</Text>
                      <Text style={styles.distanceValue}>{formatDistance(distance)}</Text>
                    </>
                  ) : (
                    <Text style={styles.distanceLoading}>Calculating distance...</Text>
                  )}
                </View>
              )}
            </View>
          </View>
        )}

        {/* Service Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category:</Text>
            <Text style={styles.detailValue}>{job.serviceCategory || 'N/A'}</Text>
          </View>
          {job.serviceState && !job.serviceAddressText && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>State:</Text>
              <Text style={styles.detailValue}>{job.serviceState}</Text>
            </View>
          )}
        </View>

        {/* Client/Artisan Info */}
        {isArtisan && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Client Information</Text>
            {job.clientName && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Name:</Text>
                <Text style={styles.detailValue}>{job.clientName}</Text>
              </View>
            )}
            {job.clientEmail && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>{job.clientEmail}</Text>
              </View>
            )}
            {job.clientPhone && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{job.clientPhone}</Text>
              </View>
            )}
            {job.clientCompany && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Company:</Text>
                <Text style={styles.detailValue}>{job.clientCompany}</Text>
              </View>
            )}
          </View>
        )}

        {isClient && (job.phixerName || job.artisanName) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assigned Artisan</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name:</Text>
              <Text style={styles.detailValue}>{job.phixerName || job.artisanName}</Text>
            </View>
          </View>
        )}

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Created:</Text>
            <Text style={styles.detailValue}>{formatDate(job.createdAt)}</Text>
          </View>
          {job.scheduledAt && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Scheduled:</Text>
              <Text style={styles.detailValue}>{formatDate(job.scheduledAt)}</Text>
            </View>
          )}
        </View>

        {/* Attachments */}
        {job.attachments && job.attachments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attachments</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {job.attachments.map((url, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Text style={styles.imagePlaceholder}>📷 Image {index + 1}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Amount */}
        {job.amount && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Amount:</Text>
              <Text style={styles.amount}>₦{job.amount.toLocaleString()}</Text>
            </View>
          </View>
        )}

        {/* Reviews */}
        {job.clientReview && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Client Review</Text>
            <View style={styles.reviewContainer}>
              <Text style={styles.reviewRating}>
                {'⭐'.repeat(job.clientReview.rating || 0)}
              </Text>
              {job.clientReview.feedback && (
                <Text style={styles.reviewFeedback}>{job.clientReview.feedback}</Text>
              )}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          {isArtisan && job.status === 'accepted' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => updateJobStatus('in-progress')}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.actionButtonText}>Start Job</Text>
              )}
            </TouchableOpacity>
          )}

          {isArtisan && job.status === 'in-progress' && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={() => router.push(`/(tabs)/job-completion?jobId=${job.id}`)}
                disabled={updating}
              >
                <Text style={styles.actionButtonText}>Complete Job</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={startBroadcasting}
              >
                <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                  📍 Broadcast Location
                </Text>
              </TouchableOpacity>
            </>
          )}

          {isArtisan && job.status === 'pending-completion' && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingText}>
                ⏳ Completion form submitted. Waiting for admin approval.
              </Text>
            </View>
          )}

          {isClient && canTrack && (
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={startTracking}
            >
              <Text style={styles.actionButtonText}>📍 Track Artisan</Text>
            </TouchableOpacity>
          )}

          {isClient && job.status === 'requested' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.dangerButton]}
              onPress={() => {
                Alert.alert(
                  'Cancel Job',
                  'Are you sure you want to cancel this job?',
                  [
                    { text: 'No', style: 'cancel' },
                    {
                      text: 'Yes',
                      style: 'destructive',
                      onPress: () => updateJobStatus('cancelled'),
                    },
                  ]
                );
              }}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.actionButtonText}>Cancel Job</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
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
  header: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginBottom: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  content: {
    padding: 16,
  },
  jobHeader: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  jobTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  jobIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  jobTitleContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  section: {
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
    fontWeight: '500',
  },
  imageContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    fontSize: 24,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },
  amountLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  reviewContainer: {
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  reviewRating: {
    fontSize: 18,
    marginBottom: 8,
  },
  reviewFeedback: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  actions: {
    marginTop: 8,
    marginBottom: 24,
  },
  actionButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  dangerButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#2563EB',
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
    marginTop: 40,
  },
  addressSection: {
    marginBottom: 16,
  },
  addressCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  addressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  addressState: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  distanceContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#DBEAFE',
  },
  distanceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  distanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  distanceLoading: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  pendingText: {
    fontSize: 14,
    color: '#D97706',
    textAlign: 'center',
    fontWeight: '500',
  },
});

