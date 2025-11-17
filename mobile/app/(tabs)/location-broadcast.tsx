import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthState } from '@/hooks/useAuthState';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebase } from '@/config/firebase';
import * as Location from 'expo-location';

export default function LocationBroadcastScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuthState();
  const [broadcasting, setBroadcasting] = useState(false);
  const [status, setStatus] = useState('Ready to broadcast');
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const jobId = params.jobId as string;

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
    };
  }, []);

  const startBroadcasting = async () => {
    if (!jobId) {
      Alert.alert('Error', 'Missing job ID');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be signed in to broadcast location');
      return;
    }

    try {
      const { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();
      if (permissionStatus !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to broadcast your location');
        return;
      }

      const { db } = getFirebase();
      setBroadcasting(true);
      setStatus('Broadcasting location...');

      // Start watching position
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        async (location) => {
          try {
            const payload = {
              lat: location.coords.latitude,
              lng: location.coords.longitude,
              updatedAt: serverTimestamp(),
            };

            await setDoc(
              doc(db, 'jobLocations', jobId),
              {
                [`artisans.${user.uid}`]: payload,
              },
              { merge: true }
            );

            setStatus(`Location updated: ${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`);
          } catch (error) {
            console.error('Error broadcasting location:', error);
            setStatus('Error updating location');
          }
        }
      );

      subscriptionRef.current = subscription;
    } catch (error) {
      console.error('Error starting broadcast:', error);
      Alert.alert('Error', 'Failed to start location broadcast');
      setBroadcasting(false);
      setStatus('Ready to broadcast');
    }
  };

  const stopBroadcasting = async () => {
    if (subscriptionRef.current) {
      try {
        subscriptionRef.current.remove();
      } catch (error) {
        console.error('Error stopping location updates:', error);
      }
      subscriptionRef.current = null;
    }
    setBroadcasting(false);
    setStatus('Broadcasting stopped');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Location Broadcast</Text>
        <Text style={styles.subtitle}>
          Share your location with clients in real-time
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Status</Text>
          <Text style={styles.statusText}>{status}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How it works</Text>
          <Text style={styles.infoText}>
            • Start broadcasting to share your location{'\n'}
            • Your location updates every 5 seconds{'\n'}
            • Clients can track you in real-time{'\n'}
            • Stop broadcasting when job is complete
          </Text>
        </View>

        <View style={styles.actions}>
          {!broadcasting ? (
            <TouchableOpacity
              style={[styles.button, styles.startButton]}
              onPress={startBroadcasting}
            >
              <Text style={styles.buttonText}>📍 Start Broadcasting</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.stopButton]}
              onPress={stopBroadcasting}
            >
              <Text style={styles.buttonText}>⏹ Stop Broadcasting</Text>
            </TouchableOpacity>
          )}
        </View>

        {broadcasting && (
          <View style={styles.broadcastingIndicator}>
            <ActivityIndicator size="small" color="#EF4444" />
            <Text style={styles.broadcastingText}>Broadcasting active</Text>
          </View>
        )}
      </View>
    </View>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  content: {
    padding: 16,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  actions: {
    marginBottom: 16,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#10B981',
  },
  stopButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  broadcastingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  broadcastingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '600',
  },
});

