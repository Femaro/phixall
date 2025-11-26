import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import QRCode from 'react-qr-code';
import { createQRCodeData, encodeQRCodeData } from '@/lib/qrCodeVerification';

interface QRCodeDisplayProps {
  jobId: string;
  phixerId: string;
  onRefresh?: () => void;
}

export function QRCodeDisplay({ jobId, phixerId, onRefresh }: QRCodeDisplayProps) {
  const [qrData, setQrData] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<number>(0);

  useEffect(() => {
    generateQRCode();
    // Refresh QR code every 30 minutes
    const interval = setInterval(generateQRCode, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [jobId, phixerId]);

  const generateQRCode = () => {
    const data = createQRCodeData(jobId, phixerId);
    const encoded = encodeQRCodeData(data);
    setQrData(encoded);
    setExpiresAt(data.timestamp + 60 * 60 * 1000); // 1 hour from now
  };

  if (!qrData) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Generating QR code...</Text>
      </View>
    );
  }

  const timeRemaining = Math.max(0, expiresAt - Date.now());
  const minutesRemaining = Math.floor(timeRemaining / 60000);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verification QR Code</Text>
      <Text style={styles.subtitle}>Show this to the client to verify your identity</Text>
      
      <View style={styles.qrContainer}>
        <QRCode
          value={qrData}
          size={250}
          style={styles.qrCode}
          bgColor="#FFFFFF"
          fgColor="#000000"
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          ⏱️ Valid for: {minutesRemaining} minutes
        </Text>
        <Text style={styles.infoText}>
          📍 Make sure you're at the job location
        </Text>
      </View>

      {onRefresh && (
        <TouchableOpacity style={styles.refreshButton} onPress={generateQRCode}>
          <Text style={styles.refreshButtonText}>🔄 Refresh QR Code</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  qrCode: {
    height: 250,
    width: 250,
  },
  infoContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  refreshButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#2563EB',
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
});

