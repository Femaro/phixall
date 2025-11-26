'use client';

import React, { useState, useRef, useEffect } from 'react';

interface QRCodeScannerProps {
  jobId: string;
  expectedPhixerId: string;
  onVerify: (verified: boolean, error?: string) => void;
}

export function QRCodeScanner({ jobId, expectedPhixerId, onVerify }: QRCodeScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup: stop camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setError(null);
      setScanning(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Use QR scanner library to detect QR codes
      // For now, we'll use a manual input fallback
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please use manual input.');
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const handleManualInput = async (qrCodeData: string) => {
    try {
      const response = await fetch('/api/jobs/verify-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrCodeData,
          jobId,
          clientId: '', // Will be set from auth context
        }),
      });

      const data = await response.json();
      if (response.ok) {
        onVerify(true);
      } else {
        onVerify(false, data.error);
      }
    } catch (err: any) {
      onVerify(false, err.message || 'Verification failed');
    }
  };

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Verify Phixer Identity</h3>
      
      {!scanning ? (
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            Scan the QR code displayed on the Phixer&apos;s mobile app to verify their identity.
          </p>
          
          <button
            onClick={startScanning}
            className="w-full rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            📷 Start Camera Scanner
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-neutral-500">OR</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Enter QR Code Data Manually
            </label>
            <textarea
              placeholder="Paste QR code data here..."
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              rows={3}
              onChange={(e) => {
                if (e.target.value.trim()) {
                  handleManualInput(e.target.value.trim());
                }
              }}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full rounded-lg"
              autoPlay
              playsInline
              style={{ maxHeight: '400px' }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-2 border-brand-500 rounded-lg" style={{ width: '250px', height: '250px' }}></div>
            </div>
          </div>

          <button
            onClick={stopScanning}
            className="w-full rounded-lg bg-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-300"
          >
            Stop Scanning
          </button>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

