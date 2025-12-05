import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter, Redirect } from 'expo-router';
import { useAuthState } from '@/hooks/useAuthState';
import { doc, collection, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebase } from '@/config/firebase';

export default function RequestServiceScreen() {
  const router = useRouter();
  const { user } = useAuthState();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    serviceCategory: '',
    scheduledAt: '',
  });
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string; state?: string } | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    requestPermissions();
    
    // Check user role
    const checkRole = async () => {
      if (!user) {
        setLoadingRole(false);
        return;
      }
      
      try {
        const { db } = getFirebase();
        const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
        const profile = profileDoc.data();
        setUserRole(profile?.role || 'client');
      } catch (error) {
        console.error('Error fetching role:', error);
        setUserRole('client');
      } finally {
        setLoadingRole(false);
      }
    };
    
    checkRole();
  }, [user]);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    
    if (locationStatus !== 'granted') {
      Alert.alert('Permission Required', 'Location permission is needed to submit service requests.');
    }
  };

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      // Reverse geocode to get address and state
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      const firstResult = geocode[0];
      const address = firstResult?.formattedAddress || `${latitude}, ${longitude}`;
      const state = firstResult?.region || firstResult?.administrativeArea || null;

      setLocation({ lat: latitude, lng: longitude, address, state: state || undefined });
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Failed to get location. Please try again.');
    } finally {
      setLocationLoading(false);
    }
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map((asset) => asset.uri)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.serviceCategory) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (useCurrentLocation && !location) {
      Alert.alert('Error', 'Please get your current location');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in');
      return;
    }

    setLoading(true);
    try {
      const { auth, db, storage } = getFirebase();
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Get user profile for address
      const profileDoc = await getDoc(doc(db, 'profiles', currentUser.uid));
      const profile = profileDoc.data();

      // Create job document first
      const jobRef = doc(collection(db, 'jobs'));
      const attachmentUrls: string[] = [];

      // Upload images
      for (const imageUri of images) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const fileRef = ref(storage, `jobs/${jobRef.id}/${Date.now()}-image.jpg`);
        await uploadBytes(fileRef, blob);
        const url = await getDownloadURL(fileRef);
        attachmentUrls.push(url);
      }

      const serviceAddress = useCurrentLocation && location
        ? {
            description: location.address,
            lat: location.lat,
            lng: location.lng,
          }
        : {
            description: profile?.address || '',
            state: profile?.state || '',
          };

      const serviceState = useCurrentLocation && location?.state
        ? location.state
        : profile?.state || null;

      await setDoc(jobRef, {
        clientId: currentUser.uid,
        clientName: profile?.name || currentUser.displayName || currentUser.email,
        clientEmail: profile?.email || currentUser.email,
        clientPhone: profile?.phone || '',
        title: formData.title,
        description: formData.description,
        serviceCategory: formData.serviceCategory,
        scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt) : null,
        serviceAddress,
        serviceState,
        serviceCoordinates: location
          ? { lat: location.lat, lng: location.lng }
          : null,
        serviceAddressText: serviceAddress.description,
        status: 'requested',
        createdByRole: 'client',
        attachments: attachmentUrls,
        createdAt: serverTimestamp(),
      });

      Alert.alert('Success', 'Service request submitted successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Error submitting request:', error);
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'plumbing', label: '⚙ Plumbing & Leak Repair' },
    { value: 'electrical', label: '⚡ Electrical & Lighting' },
    { value: 'hvac', label: '❄ HVAC & Ventilation' },
    { value: 'appliance', label: '⚙ Appliance Installation' },
    { value: 'painting', label: '◉ Painting & Drywall' },
    { value: 'carpentry', label: '☰ Carpentry & Doors' },
    { value: 'cleaning', label: '○ Cleaning Services' },
    { value: 'other', label: '☰ Other' },
  ];

  // Prevent artisans from accessing request screen
  if (loadingRole) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (userRole === 'artisan' || userRole === 'admin') {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>🚫</Text>
          <Text style={styles.errorTitle}>Access Denied</Text>
          <Text style={styles.errorText}>
            {userRole === 'artisan' 
              ? 'Artisans cannot make service requests. Please use the client app to request services.'
              : 'Admin users cannot make service requests.'}
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Request Service</Text>
        <Text style={styles.subtitle}>Fill in the details below</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Service Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.categoryButton,
                  formData.serviceCategory === cat.value && styles.categoryButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, serviceCategory: cat.value })}
              >
                <Text
                  style={[
                    styles.categoryText,
                    formData.serviceCategory === cat.value && styles.categoryTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Job Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Fix leaking kitchen faucet"
            placeholderTextColor="#9CA3AF"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the issue in detail..."
            placeholderTextColor="#9CA3AF"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={5}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Service Location</Text>
          <View style={styles.locationOption}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setUseCurrentLocation(!useCurrentLocation)}
            >
              <View
                style={[
                  styles.checkboxInner,
                  useCurrentLocation && styles.checkboxChecked,
                ]}
              />
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>Use current location</Text>
          </View>

          {useCurrentLocation && (
            <View style={styles.locationActions}>
              {location ? (
                <View style={styles.locationInfo}>
                  <Text style={styles.locationText}>{location.address}</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.locationButton}
                  onPress={getCurrentLocation}
                  disabled={locationLoading}
                >
                  {locationLoading ? (
                    <ActivityIndicator color="#2563EB" />
                  ) : (
                    <Text style={styles.locationButtonText}>Get Current Location</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Attachments (Photos)</Text>
          <TouchableOpacity style={styles.imageButton} onPress={pickImages}>
            <Text style={styles.imageButtonText}>+ Add Photos</Text>
          </TouchableOpacity>
          {images.length > 0 && (
            <ScrollView horizontal style={styles.imageList}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageItem}>
                  <Text style={styles.imageRemove} onPress={() => removeImage(index)}>
                    ×
                  </Text>
                  <Text style={styles.imagePlaceholder}>📷</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Request</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  categoryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
  },
  categoryButtonActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#2563EB',
    fontWeight: '600',
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  checkboxChecked: {
    backgroundColor: '#2563EB',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
  },
  locationActions: {
    marginTop: 8,
  },
  locationButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  locationButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  locationInfo: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 14,
  },
  locationText: {
    fontSize: 14,
    color: '#374151',
  },
  imageButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  imageList: {
    marginTop: 12,
  },
  imageItem: {
    width: 80,
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imagePlaceholder: {
    fontSize: 32,
  },
  imageRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    color: '#fff',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F9FAFB',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

