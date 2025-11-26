import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseServer } from '@/lib/firebaseServer';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { decodeQRCodeData, verifyQRCodeForJob } from '@/lib/qrCodeVerification';

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

    // Get expected Phixer ID
    const expectedPhixerId = jobData.phixerId || jobData.artisanId;
    if (!expectedPhixerId) {
      return NextResponse.json(
        { error: 'No Phixer assigned to this job' },
        { status: 400 }
      );
    }

    // Verify QR code
    const verification = verifyQRCodeForJob(decodedData, jobId, expectedPhixerId);
    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.error || 'QR code verification failed' },
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

