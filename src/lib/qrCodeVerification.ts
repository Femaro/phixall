// Client-side only: use crypto-js
// Server-side: use Node.js crypto (in API routes)
const SECRET_KEY = process.env.NEXT_PUBLIC_QR_SECRET_KEY || 'phixall-qr-secret-key-change-in-production';

// Only import crypto-js on client-side
let CryptoJS: any;
if (typeof window !== 'undefined') {
  try {
    CryptoJS = require('crypto-js');
  } catch {
    // Fallback if not available
  }
}

export interface QRCodeData {
  jobId: string;
  phixerId: string;
  timestamp: number;
  token: string;
}

/**
 * Generate a verification token for QR code (client-side only)
 * For server-side, use Node.js crypto directly
 */
export function generateVerificationToken(jobId: string, phixerId: string, timestamp: number): string {
  if (typeof window === 'undefined') {
    throw new Error('generateVerificationToken should only be called client-side. Use server-side crypto in API routes.');
  }
  
  if (!CryptoJS) {
    throw new Error('CryptoJS not available. Make sure crypto-js is installed.');
  }
  
  const data = `${jobId}:${phixerId}:${timestamp}`;
  return CryptoJS.HMAC_SHA256(data, SECRET_KEY).toString();
}

/**
 * Create QR code data object
 */
export function createQRCodeData(jobId: string, phixerId: string): QRCodeData {
  const timestamp = Date.now();
  const token = generateVerificationToken(jobId, phixerId, timestamp);
  
  return {
    jobId,
    phixerId,
    timestamp,
    token,
  };
}

/**
 * Encode QR code data to JSON string
 */
export function encodeQRCodeData(data: QRCodeData): string {
  return JSON.stringify(data);
}

/**
 * Decode QR code data from JSON string
 */
export function decodeQRCodeData(encoded: string): QRCodeData | null {
  try {
    const data = JSON.parse(encoded) as QRCodeData;
    return data;
  } catch {
    return null;
  }
}

/**
 * Verify QR code data is valid
 */
export function verifyQRCodeData(data: QRCodeData): boolean {
  // Check if token is valid
  const expectedToken = generateVerificationToken(data.jobId, data.phixerId, data.timestamp);
  if (data.token !== expectedToken) {
    return false;
  }
  
  // Check if QR code is not expired (valid for 1 hour)
  const now = Date.now();
  const age = now - data.timestamp;
  const oneHour = 60 * 60 * 1000;
  
  if (age > oneHour) {
    return false;
  }
  
  return true;
}

/**
 * Verify QR code matches job and Phixer
 */
export function verifyQRCodeForJob(
  qrData: QRCodeData,
  jobId: string,
  expectedPhixerId: string
): { valid: boolean; error?: string } {
  // Verify token
  if (!verifyQRCodeData(qrData)) {
    return { valid: false, error: 'QR code is invalid or expired' };
  }
  
  // Verify job ID matches
  if (qrData.jobId !== jobId) {
    return { valid: false, error: 'QR code does not match this job' };
  }
  
  // Verify Phixer ID matches
  if (qrData.phixerId !== expectedPhixerId) {
    return { valid: false, error: 'QR code does not match assigned Phixer' };
  }
  
  return { valid: true };
}

