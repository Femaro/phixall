import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { getFirebaseServer } from '@/lib/firebaseServer';
import { doc, updateDoc, setDoc, increment, serverTimestamp, addDoc, collection } from 'firebase/firestore';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

/**
 * Verify Paystack webhook signature
 */
function verifyPaystackSignature(body: string, signature: string): boolean {
  const hash = createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(body)
    .digest('hex');
  return hash === signature;
}

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-paystack-signature');
    
    if (!signature) {
      return NextResponse.json(
        { success: false, error: 'No signature provided' },
        { status: 400 }
      );
    }

    const body = await req.text();
    const isValid = verifyPaystackSignature(body, signature);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    const { db } = getFirebaseServer();

    // Handle different event types
    switch (event.event) {
      case 'charge.success': {
        const data = event.data;
        const metadata = data.metadata;
        const amountInNaira = data.amount / 100;

        // Record transaction
        await addDoc(collection(db, 'transactions'), {
          reference: data.reference,
          amount: amountInNaira,
          type: metadata.type || 'payment',
          userId: metadata.userId,
          jobId: metadata.jobId || null,
          status: 'completed',
          paymentMethod: 'paystack',
          channel: data.channel,
          createdAt: serverTimestamp(),
          webhookProcessed: true,
          paystackData: {
            transaction_date: data.transaction_date,
            customer: data.customer,
            authorization: data.authorization,
          },
        });

        // Update wallet for wallet funding
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

        // Update job payment status
        if (metadata.type === 'job_payment' && metadata.jobId) {
          const jobRef = doc(db, 'jobs', metadata.jobId);
          await updateDoc(jobRef, {
            paymentStatus: 'paid',
            paymentReference: data.reference,
            paidAt: serverTimestamp(),
          });
        }

        break;
      }

      case 'transfer.success': {
        // Handle successful payout to Phixer
        const data = event.data;
        const reference = data.reference;

        // Update transaction status
        await addDoc(collection(db, 'transactions'), {
          reference,
          amount: data.amount / 100,
          type: 'payout',
          status: 'completed',
          paymentMethod: 'paystack_transfer',
          createdAt: serverTimestamp(),
          webhookProcessed: true,
          transferData: {
            recipient: data.recipient,
            transfer_code: data.transfer_code,
            reason: data.reason,
          },
        });

        break;
      }

      case 'transfer.failed': {
        // Handle failed payout
        const data = event.data;
        
        await addDoc(collection(db, 'transactions'), {
          reference: data.reference,
          amount: data.amount / 100,
          type: 'payout',
          status: 'failed',
          paymentMethod: 'paystack_transfer',
          createdAt: serverTimestamp(),
          webhookProcessed: true,
          error: data.reason || 'Transfer failed',
        });

        break;
      }

      default:
        console.log('Unhandled webhook event:', event.event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
