import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuthState } from '@/hooks/useAuthState';
import { doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import { getFirebase } from '@/config/firebase';
import { signOut } from 'firebase/auth';

export default function Index() {
  const { user, loading: authLoading } = useAuthState();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        const fetchRole = async () => {
          try {
            const { db } = getFirebase();
            const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
            const profile = profileDoc.data();
            setRole(profile?.role || 'client');
          } catch (error) {
            console.error('Error fetching role:', error);
            setRole('client');
          } finally {
            setLoading(false);
          }
        };
        fetchRole();
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Redirect admin users to web app
  if (role === 'admin') {
    const handleLogout = async () => {
      Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              const { auth } = getFirebase();
              await signOut(auth);
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]);
    };

    return (
      <View style={styles.adminContainer}>
        <Text style={styles.adminTitle}>Admin Dashboard</Text>
        <Text style={styles.adminText}>
          Admin features are only available on the web application.
        </Text>
        <Text style={styles.adminLink}>
          Please visit phixall.com/admin to access the admin dashboard.
        </Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (role === 'artisan') {
    return <Redirect href="/(tabs)/artisan" />;
  }

  // Default to client
  return <Redirect href="/(tabs)/client" />;
}

const styles = StyleSheet.create({
  adminContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F9FAFB',
  },
  adminTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  adminText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  adminLink: {
    fontSize: 14,
    color: '#2563EB',
    textAlign: 'center',
    marginBottom: 32,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    minWidth: 120,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

