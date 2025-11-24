import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseServer } from '@/lib/firebaseServer';
import { doc, getDoc, updateDoc, increment, serverTimestamp, addDoc, collection, setDoc } from 'firebase/firestore';
import { createTransferRecipient, initiateTransfer } from '@/lib/paystackServer';
import { toKobo } from '@/lib/paystackClient';

const PLATFORM_FEE_PERCENTAGE = 0.10; // 10% platform fee

export async function POST(req: NextRequest) {
  try {
    const { jobId, finalAmount } = await req.json();

    if (!jobId || !finalAmount) {
      return NextResponse.json(
        { success: false, error: 'Job ID and final amount are required' },
        { status: 400 }
      );
    }

    const { db } = getFirebaseServer();

    // Get job details
    const jobRef = doc(db, 'jobs', jobId);
    const jobSnap = await getDoc(jobRef);

    if (!jobSnap.exists()) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    const job = jobSnap.data();
    const deposit = job.deposit || 1000;
    const phixerId = job.phixerId || job.artisanId;
    const clientId = job.clientId;

    if (!phixerId) {
      return NextResponse.json(
        { success: false, error: 'No Phixer assigned to this job' },
        { status: 400 }
      );
    }

    // Calculate amounts
    const platformFee = finalAmount * PLATFORM_FEE_PERCENTAGE;
    const phixerPayout = finalAmount - platformFee;
    const remainingAmount = finalAmount - deposit; // Amount to charge from wallet (after deposit)

    // Get client wallet
    const clientWalletRef = doc(db, 'wallets', clientId);
    const clientWalletSnap = await getDoc(clientWalletRef);

    if (!clientWalletSnap.exists()) {
      return NextResponse.json(
        { success: false, error: 'Client wallet not found' },
        { status: 404 }
      );
    }

    const clientWallet = clientWalletSnap.data();
    const availableBalance = clientWallet.balance || 0;
    const heldBalance = clientWallet.heldBalance || 0;

    // Check if client has enough balance (excluding held deposit)
    if (availableBalance < remainingAmount) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient wallet balance. Required: ₦${remainingAmount.toLocaleString()}, Available: ₦${availableBalance.toLocaleString()}`,
        },
        { status: 400 }
      );
    }

    // Deduct remaining amount from client wallet and release held deposit
    await updateDoc(clientWalletRef, {
      balance: availableBalance - remainingAmount,
      heldBalance: Math.max(0, heldBalance - deposit),
      updatedAt: serverTimestamp(),
    });

    // Update Phixer wallet
    const phixerWalletRef = doc(db, 'wallets', phixerId);
    await setDoc(
      phixerWalletRef,
      {
        balance: increment(phixerPayout),
        totalEarnings: increment(phixerPayout),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    // Record transactions
    await addDoc(collection(db, 'transactions'), {
      userId: clientId,
      jobId,
      type: 'job_payment',
      amount: finalAmount,
      status: 'completed',
      description: `Payment for job: ${job.title}`,
      createdAt: serverTimestamp(),
    });

    await addDoc(collection(db, 'transactions'), {
      userId: phixerId,
      jobId,
      type: 'payout',
      amount: phixerPayout,
      platformFee,
      status: 'completed',
      description: `Payout for job: ${job.title}`,
      createdAt: serverTimestamp(),
    });

    await addDoc(collection(db, 'transactions'), {
      userId: 'platform',
      jobId,
      type: 'platform_fee',
      amount: platformFee,
      status: 'completed',
      description: `Platform fee for job: ${job.title}`,
      createdAt: serverTimestamp(),
    });

    // Update job status
    await updateDoc(jobRef, {
      status: 'completed',
      paymentStatus: 'paid',
      finalAmount,
      platformFee,
      phixerPayout,
      paidAt: serverTimestamp(),
      completedAt: serverTimestamp(),
    });

    // Try to initiate bank transfer to Phixer (if bank account is configured)
    try {
      const bankAccountRef = doc(db, 'bank_accounts', phixerId);
      const bankAccountSnap = await getDoc(bankAccountRef);

      if (bankAccountSnap.exists() && bankAccountSnap.data().verified) {
        const bankAccount = bankAccountSnap.data();

        // Create transfer recipient
        const recipientResult = await createTransferRecipient({
          type: 'nuban',
          name: bankAccount.accountName,
          account_number: bankAccount.accountNumber,
          bank_code: bankAccount.bankCode,
        });

        if (recipientResult.status) {
          // Initiate transfer
          const transferResult = await initiateTransfer({
            amount: toKobo(phixerPayout),
            recipient: recipientResult.data.recipient_code,
            reason: `Payout for job: ${job.title}`,
            reference: `PXL-PAYOUT-${jobId}-${Date.now()}`,
          });

          if (transferResult.status) {
            await addDoc(collection(db, 'transactions'), {
              userId: phixerId,
              jobId,
              type: 'bank_transfer',
              amount: phixerPayout,
              status: 'pending',
              transferCode: transferResult.data.transfer_code,
              description: `Bank transfer for job: ${job.title}`,
              createdAt: serverTimestamp(),
            });
          }
        }
      }
    } catch (transferError) {
      console.error('Error initiating bank transfer:', transferError);
      // Continue even if transfer fails - funds are in wallet
    }

    return NextResponse.json({
      success: true,
      data: {
        finalAmount,
        platformFee,
        phixerPayout,
        remainingCharged: remainingAmount,
        depositUsed: deposit,
      },
    });
  } catch (error) {
    console.error('Job completion error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to complete job payment' },
      { status: 500 }
    );
  }
}

