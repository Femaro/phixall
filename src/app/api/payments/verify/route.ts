import { NextRequest, NextResponse } from 'next/server';
import { verifyTransaction } from '@/lib/paystackServer';
import { getFirebaseServer } from '@/lib/firebaseServer';
import { doc, updateDoc, setDoc, increment, serverTimestamp, addDoc, collection } from 'firebase/firestore';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { success: false, error: 'Payment reference is required' },
        { status: 400 }
      );
    }

    const result = await verifyTransaction(reference);

    if (!result.status) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }

    const paymentData = result.data;

    // Only process successful payments
    if (paymentData.status !== 'success') {
      return NextResponse.json({
        success: false,
        error: 'Payment was not successful',
        status: paymentData.status,
      });
    }

    // Update Firestore based on payment type
    const { db } = getFirebaseServer();
    const metadata = paymentData.metadata;
    const amountInNaira = paymentData.amount / 100;

    try {
      // Record transaction
      await addDoc(collection(db, 'transactions'), {
        reference: paymentData.reference,
        amount: amountInNaira,
        type: metadata.type || 'job_payment',
        userId: metadata.userId,
        jobId: metadata.jobId || null,
        status: 'completed',
        paymentMethod: 'paystack',
        channel: paymentData.channel,
        createdAt: serverTimestamp(),
        paystackData: {
          transaction_date: paymentData.transaction_date,
          customer: paymentData.customer,
          authorization: paymentData.authorization,
        },
      });

      // Update wallet if it's a wallet funding
      if (metadata.type === 'wallet_funding' && metadata.userId) {
        const walletRef = doc(db, 'wallets', metadata.userId);
        await setDoc(
          walletRef,
          {
            balance: increment(amountInNaira),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      // Update job payment status if it's a job payment
      if (metadata.type === 'job_payment' && metadata.jobId) {
        const jobRef = doc(db, 'jobs', metadata.jobId);
        await updateDoc(jobRef, {
          paymentStatus: 'paid',
          paymentReference: paymentData.reference,
          paidAt: serverTimestamp(),
        });
      }

      return NextResponse.json({
        success: true,
        data: {
          reference: paymentData.reference,
          amount: amountInNaira,
          status: paymentData.status,
          channel: paymentData.channel,
          paid_at: paymentData.paid_at,
        },
      });
    } catch (firestoreError) {
      console.error('Firestore update error:', firestoreError);
      return NextResponse.json(
        { success: false, error: 'Payment verified but failed to update records' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}

