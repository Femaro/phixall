import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseServer } from '@/lib/firebaseServer';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { decodeQRCodeData } from '@/lib/qrCodeVerification';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { qrCodeData, jobId, clientId } = body;

    if (!qrCodeData || !jobId || !clientId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = getFirebaseServer();

    // Get job document
    const jobRef = doc(db, 'jobs', jobId);
    const jobSnap = await getDoc(jobRef);

    if (!jobSnap.exists()) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    const jobData = jobSnap.data();

    // Verify client owns the job
    if (jobData.clientId !== clientId) {
      return NextResponse.json(
        { error: 'Unauthorized: You do not own this job' },
        { status: 403 }
      );
    }

    // Decode QR code data
    const decodedData = decodeQRCodeData(qrCodeData);
    if (!decodedData) {
      return NextResponse.json(
        { error: 'Invalid QR code format' },
        { status: 400 }
      );
    }

    // Verify token server-side
    const SECRET_KEY = process.env.NEXT_PUBLIC_QR_SECRET_KEY || 'phixall-qr-secret-key-change-in-production';
    const data = `${decodedData.jobId}:${decodedData.phixerId}:${decodedData.timestamp}`;
    const expectedToken = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex');
    
    if (decodedData.token !== expectedToken) {
      return NextResponse.json(
        { error: 'QR code token is invalid' },
        { status: 400 }
      );
    }

    // Check if QR code is not expired (valid for 1 hour)
    const now = Date.now();
    const age = now - decodedData.timestamp;
    const oneHour = 60 * 60 * 1000;
    
    if (age > oneHour) {
      return NextResponse.json(
        { error: 'QR code has expired' },
        { status: 400 }
      );
    }

    // Get expected Phixer ID
    const expectedPhixerId = jobData.phixerId || jobData.artisanId;
    if (!expectedPhixerId) {
      return NextResponse.json(
        { error: 'No Phixer assigned to this job' },
        { status: 400 }
      );
    }

    // Verify job ID and Phixer ID match
    if (decodedData.jobId !== jobId) {
      return NextResponse.json(
        { error: 'QR code does not match this job' },
        { status: 400 }
      );
    }

    if (decodedData.phixerId !== expectedPhixerId) {
      return NextResponse.json(
        { error: 'QR code does not match assigned Phixer' },
        { status: 400 }
      );
    }

    // Update job with verification
    await updateDoc(jobRef, {
      clientVerified: true,
      clientVerifiedAt: serverTimestamp(),
      status: jobData.status === 'accepted' ? 'in-progress' : jobData.status,
    });

    return NextResponse.json({
      success: true,
      message: 'Phixer verified successfully',
      verified: true,
    });
  } catch (error: any) {
    console.error('Error verifying QR code:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify QR code' },
      { status: 500 }
    );
  }
}

