import { NextRequest, NextResponse } from 'next/server';
import { initiateBackgroundCheck } from '@/lib/checkr';
import { getFirebaseServer } from '@/lib/firebaseServer';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

/**
 * API route to initiate Checkr background check for US artisans
 * This is called when a US artisan completes onboarding
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, artisanData } = body;

    if (!userId || !artisanData) {
      return NextResponse.json(
        { success: false, error: 'User ID and artisan data are required' },
        { status: 400 }
      );
    }

    // Only proceed if this is a US user (should be checked client-side first)
    if (!artisanData.isUS) {
      return NextResponse.json(
        { success: false, error: 'Background check only available for US users' },
        { status: 400 }
      );
    }

    // Extract name parts
    const nameParts = artisanData.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    if (!firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: 'Full name is required' },
        { status: 400 }
      );
    }

    // Initiate background check with Checkr
    const checkrResult = await initiateBackgroundCheck({
      firstName,
      lastName,
      email: artisanData.email,
      phone: artisanData.phoneNumber,
      dob: artisanData.dob, // Optional - format: YYYY-MM-DD
      ssnLast4: artisanData.bvn, // SSN last 4 digits for US users
      zipcode: artisanData.zipCode,
      driverLicenseNumber: artisanData.idType === 'drivers-license' ? artisanData.idNumber : undefined,
      driverLicenseState: artisanData.state,
      userId,
    });

    // Save Checkr data to onboarding record
    const { db } = getFirebaseServer();
    const onboardingRef = doc(db, 'phixer_onboarding', userId);

    await updateDoc(onboardingRef, {
      checkrBackgroundCheck: {
        candidateId: checkrResult.candidateId,
        reportId: checkrResult.reportId,
        invitationId: checkrResult.invitationId,
        initiatedAt: serverTimestamp(),
        status: 'pending',
      },
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      data: {
        candidateId: checkrResult.candidateId,
        reportId: checkrResult.reportId,
        invitationId: checkrResult.invitationId,
      },
    });
  } catch (error: any) {
    console.error('Checkr background check initiation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to initiate background check',
      },
      { status: 500 }
    );
  }
}

