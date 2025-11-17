import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuthState } from '@/hooks/useAuthState';

export default function AdminDashboard() {
  const { user } = useAuthState();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Platform Management</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Admin Features</Text>
        <Text style={styles.cardText}>
          Full admin dashboard features are available in the web application.
          Use the web dashboard for complete platform management.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Mobile Admin</Text>
        <Text style={styles.cardText}>
          Mobile admin features coming soon. For now, please use the web dashboard
          at phixall.com/admin
        </Text>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});

