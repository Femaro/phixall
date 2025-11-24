import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthState } from '@/hooks/useAuthState';
import { doc, onSnapshot } from 'firebase/firestore';
import { getFirebase } from '@/config/firebase';
import * as Location from 'expo-location';

export default function TrackingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuthState();
  const [artisanLocation, setArtisanLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [clientLocation, setClientLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Loading map...');
  const mapRef = useRef<MapView>(null);
  const jobId = params.jobId as string;
  const artisanId = params.artisanId as string;

  useEffect(() => {
    if (!jobId || !artisanId) {
      setStatus('Missing job or artisan ID');
      setLoading(false);
      return;
    }

    const { db } = getFirebase();

    // Listen for artisan location updates
    const unsubscribe = onSnapshot(doc(db, 'jobLocations', jobId), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const artisanLoc = data?.artisans?.[artisanId];
        if (artisanLoc?.lat && artisanLoc?.lng) {
          setArtisanLocation({
            latitude: artisanLoc.lat,
            longitude: artisanLoc.lng,
          });
          setStatus('Tracking artisan...');
          
          // Center map on artisan location
          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude: artisanLoc.lat,
              longitude: artisanLoc.lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        } else {
          setStatus('Waiting for artisan location updates...');
        }
      } else {
        setStatus('Waiting for artisan to start location sharing...');
      }
      setLoading(false);
    });

    // Get client's current location
    const getClientLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setClientLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      } catch (error) {
        console.error('Error getting client location:', error);
      }
    };

    getClientLocation();

    return () => {
      unsubscribe();
    };
  }, [jobId, artisanId]);

  const initialRegion = artisanLocation || {
    latitude: 6.5244, // Lagos default
    longitude: 3.3792,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Live Tracking</Text>
        <Text style={styles.status}>{status}</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      ) : (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {artisanLocation && (
            <Marker
              coordinate={artisanLocation}
              title="Artisan Location"
              description="Artisan is here"
            >
              <View style={styles.artisanMarker}>
                <Text style={styles.markerText}>A</Text>
              </View>
            </Marker>
          )}
          {clientLocation && (
            <Marker
              coordinate={clientLocation}
              title="Your Location"
              description="You are here"
            >
              <View style={styles.clientMarker}>
                <Text style={styles.markerText}>C</Text>
              </View>
            </Marker>
          )}
        </MapView>
      )}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Tracking Information</Text>
        <Text style={styles.infoText}>
          {artisanLocation
            ? 'Artisan location is being updated in real-time'
            : 'Waiting for artisan to start sharing location'}
        </Text>
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
  status: {
    fontSize: 14,
    color: '#6B7280',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  map: {
    flex: 1,
  },
  artisanMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  clientMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  markerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
  },
});

