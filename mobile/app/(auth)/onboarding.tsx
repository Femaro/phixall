import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthState } from '@/hooks/useAuthState';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebase } from '@/config/firebase';

export default function OnboardingScreen() {
  const router = useRouter();
  const { user } = useAuthState();
  const [formData, setFormData] = useState({
    trade: '',
    experience: '',
    location: '',
    phone: '',
    skills: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.trade || !formData.experience || !formData.location || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in');
      return;
    }

    setLoading(true);
    try {
      const { db } = getFirebase();
      await setDoc(doc(db, 'phixer_onboarding', user.uid), {
        trade: formData.trade,
        experience: formData.experience,
        location: formData.location,
        phone: formData.phone,
        skills: formData.skills,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      Alert.alert(
        'Application Submitted',
        'Your application is under review. You will be notified once approved.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/artisan'),
          },
        ]
      );
    } catch (error) {
      console.error('Onboarding error:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const trades = [
    'Plumbing',
    'Electrical',
    'HVAC',
    'Carpentry',
    'Painting',
    'Cleaning',
    'Appliance Repair',
    'Other',
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Artisan Onboarding</Text>
        <Text style={styles.subtitle}>Complete your profile to get started</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Trade / Skill *</Text>
          <View style={styles.tradeGrid}>
            {trades.map((trade) => (
              <TouchableOpacity
                key={trade}
                style={[
                  styles.tradeButton,
                  formData.trade === trade && styles.tradeButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, trade })}
              >
                <Text
                  style={[
                    styles.tradeText,
                    formData.trade === trade && styles.tradeTextActive,
                  ]}
                >
                  {trade}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Years of Experience *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 5"
            placeholderTextColor="#9CA3AF"
            value={formData.experience}
            onChangeText={(text) => setFormData({ ...formData, experience: text })}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            placeholder="City, State"
            placeholderTextColor="#9CA3AF"
            value={formData.location}
            onChangeText={(text) => setFormData({ ...formData, location: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="+234 800 000 0000"
            placeholderTextColor="#9CA3AF"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Additional Skills</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="List any additional skills or certifications..."
            placeholderTextColor="#9CA3AF"
            value={formData.skills}
            onChangeText={(text) => setFormData({ ...formData, skills: text })}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit Application</Text>
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
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
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
    minHeight: 100,
    textAlignVertical: 'top',
  },
  tradeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tradeButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tradeButtonActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  tradeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  tradeTextActive: {
    color: '#2563EB',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

