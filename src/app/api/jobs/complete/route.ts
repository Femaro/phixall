import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseServer } from '@/lib/firebaseServer';
import { doc, updateDoc, getDoc, collection, addDoc, serverTimestamp, increment } from 'firebase/firestore';
import { sendTemplateEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, finalAmount, phixerId, adminId } = body;

    if (!jobId || !finalAmount || !phixerId || !adminId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = getFirebaseServer();

    // Get job data
    const jobDoc = await getDoc(doc(db, 'jobs', jobId));
    if (!jobDoc.exists()) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    const jobData = jobDoc.data();
    const clientId = jobData.clientId;
    const assignedPhixerId = jobData.phixerId || jobData.artisanId;

    // Validate that billing is only to job client and assigned Phixer
    if (phixerId !== assignedPhixerId) {
      return NextResponse.json(
        { error: 'Billing can only be sent to the Phixer assigned to this job' },
        { status: 403 }
      );
    }

    // Verify admin has permission
    const adminDoc = await getDoc(doc(db, 'profiles', adminId));
    if (!adminDoc.exists() || adminDoc.data()?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins can process job completion payments.' },
        { status: 403 }
      );
    }

    // Get material invoice if exists
    const materialInvoiceId = jobData.materialInvoiceId;
    let materialCost = 0;
    let markupRevenue = 0;

    if (materialInvoiceId) {
      const invoiceDoc = await getDoc(doc(db, 'materialInvoices', materialInvoiceId));
      if (invoiceDoc.exists()) {
        const invoiceData = invoiceDoc.data();
        materialCost = invoiceData.subtotal || 0;
        markupRevenue = invoiceData.markupAmount || 0;
      }
    }

    // Deposit already held (₦1,000) - this is part of the final amount
    const depositHeld = 1000;
    
    // Calculate amounts
    // finalAmount already includes service amount + materials
    // We need to charge the remaining amount (finalAmount - depositHeld) from client
    const remainingAmount = finalAmount - depositHeld;
    const serviceFee = finalAmount * 0.1; // 10% service fee
    const phixerPayout = finalAmount - serviceFee - materialCost; // Remaining after service fee and material cost

    // Charge client (deduct remaining amount from wallet, deposit already held)
    const clientWalletRef = doc(db, 'wallets', clientId);
    const clientWalletDoc = await getDoc(clientWalletRef);
    const clientWallet = clientWalletDoc.data() || { balance: 0, heldBalance: 0 };

    // Release held deposit and charge remaining
    const newBalance = clientWallet.balance - remainingAmount;
    if (newBalance < 0) {
      return NextResponse.json(
        { error: `Client has insufficient wallet balance. Need ₦${remainingAmount.toLocaleString()}, has ₦${clientWallet.balance.toLocaleString()}` },
        { status: 400 }
      );
    }

    await updateDoc(clientWalletRef, {
      balance: newBalance,
      heldBalance: increment(-depositHeld), // Release held deposit
      totalSpent: increment(finalAmount),
      updatedAt: serverTimestamp(),
    });

    // Credit Phixer (add to wallet)
    const phixerWalletRef = doc(db, 'wallets', phixerId);
    await updateDoc(phixerWalletRef, {
      balance: increment(phixerPayout),
      totalEarnings: increment(phixerPayout),
      updatedAt: serverTimestamp(),
    });

    // Create transaction records
    // Client payment
    await addDoc(collection(db, 'transactions'), {
      userId: clientId,
      type: 'job_payment',
      amount: finalAmount,
      description: `Job completion payment for ${jobData.title}`,
      status: 'completed',
      metadata: {
        jobId,
        serviceFee,
        materialCost,
        phixerPayout,
      },
      createdAt: serverTimestamp(),
    });

    // Phixer earning
    await addDoc(collection(db, 'transactions'), {
      userId: phixerId,
      type: 'earning',
      amount: phixerPayout,
      description: `Earnings from job: ${jobData.title}`,
      status: 'completed',
      jobId,
      createdAt: serverTimestamp(),
    });

    // Platform revenue (service fee + markup)
    const platformRevenue = serviceFee + markupRevenue;
    if (platformRevenue > 0) {
      await addDoc(collection(db, 'transactions'), {
        userId: 'platform',
        type: 'revenue',
        amount: platformRevenue,
        description: `Platform revenue from job: ${jobData.title}`,
        status: 'completed',
        metadata: {
          jobId,
          serviceFee,
          markupRevenue,
        },
        createdAt: serverTimestamp(),
      });
    }

    // Update job status
    await updateDoc(doc(db, 'jobs', jobId), {
      status: 'completed',
      amount: finalAmount,
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Add timeline event
    await addDoc(collection(db, 'jobTimeline'), {
      jobId,
      type: 'job-resumed',
      description: `Job completed. Final amount: ₦${finalAmount.toLocaleString()}`,
      metadata: {
        finalAmount,
        serviceFee,
        materialCost,
        phixerPayout,
        platformRevenue,
      },
      createdAt: serverTimestamp(),
    });

    // Send notifications
    const phixerProfile = await getDoc(doc(db, 'profiles', phixerId));
    const phixerName = phixerProfile.data()?.name || 'Phixer';

    try {
      await sendTemplateEmail('payout-processed', phixerProfile.data()?.email || '', {
        phixerName,
        amount: phixerPayout.toLocaleString(),
        jobTitle: jobData.title,
        payoutDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        status: 'Completed',
      });
    } catch (emailError) {
      console.error('Failed to send payout email:', emailError);
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Job completion processed successfully',
        breakdown: {
          finalAmount,
          serviceFee,
          materialCost,
          phixerPayout,
          platformRevenue,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error processing job completion:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process job completion' },
      { status: 500 }
    );
  }
}
