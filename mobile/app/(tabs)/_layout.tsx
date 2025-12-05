import { Tabs, Redirect } from 'expo-router';
import { useAuthState } from '@/hooks/useAuthState';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getFirebase } from '@/config/firebase';
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { signOut } from 'firebase/auth';

export default function TabsLayout() {
  const { user, loading: authLoading } = useAuthState();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
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
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Redirect admin users - they should use web app
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
      <View style={styles.adminMessage}>
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

  // Check for Phixer role (supports both 'Phixer' and legacy 'artisan' for backward compatibility)
  if (role === 'Phixer' || role === 'phixer' || role === 'artisan') {
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#2563EB',
          tabBarInactiveTintColor: '#6B7280',
        }}
      >
        <Tabs.Screen
          name="phixer"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>≡</Text>,
          }}
        />
        {/* Hide legacy artisan tab */}
        <Tabs.Screen
          name="artisan"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="jobs"
          options={{
            title: 'Jobs',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>☰</Text>,
          }}
        />
        <Tabs.Screen
          name="earnings"
          options={{
            title: 'Earnings',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>$</Text>,
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: 'Notifications',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>◉</Text>,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>○</Text>,
          }}
        />
        {/* Hide client/admin only tabs */}
        <Tabs.Screen
          name="client"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="request"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="admin"
          options={{
            href: null,
          }}
        />
        {/* Hide detail and tracking screens from tabs */}
        <Tabs.Screen
          name="job-detail"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="tracking"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="location-broadcast"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="job-completion"
          options={{
            href: null,
          }}
        />
      </Tabs>
    );
  }

  // Client tabs (default)
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
      }}
    >
      <Tabs.Screen
        name="client"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⌂</Text>,
        }}
      />
      <Tabs.Screen
        name="request"
        options={{
          title: 'Request',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>+</Text>,
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>☰</Text>,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>$</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>○</Text>,
        }}
      />
      {/* Hide artisan/admin only tabs */}
      <Tabs.Screen
        name="artisan"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          href: null,
        }}
      />
      {/* Hide detail and tracking screens from tabs */}
      <Tabs.Screen
        name="job-detail"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="tracking"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="location-broadcast"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="job-completion"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  adminMessage: {
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
    marginTop: 16,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

