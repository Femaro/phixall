import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseServer } from '@/lib/firebaseServer';
import { doc, updateDoc, getDoc, collection, addDoc, serverTimestamp, increment } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { billId, userId } = body;

    if (!billId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = getFirebaseServer();

    // Get bill data
    const billDoc = await getDoc(doc(db, 'bills', billId));
    if (!billDoc.exists()) {
      return NextResponse.json(
        { error: 'Bill not found' },
        { status: 404 }
      );
    }

    const billData = billDoc.data();

    // Validate user is the recipient
    if (billData.recipientId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized. You can only approve bills sent to you.' },
        { status: 403 }
      );
    }

    // Check if bill is pending
    if (billData.status !== 'pending') {
      return NextResponse.json(
        { error: 'Bill has already been processed' },
        { status: 400 }
      );
    }

    // Get wallet
    const walletRef = doc(db, 'wallets', userId);
    const walletDoc = await getDoc(walletRef);
    const wallet = walletDoc.data() || { balance: 0, heldBalance: 0 };

    const totalAmount = billData.amount;
    const depositHeld = billData.depositHeld || 1000;
    const remainingAmount = totalAmount - depositHeld;

    // Check if client has sufficient balance
    if (wallet.balance < remainingAmount) {
      return NextResponse.json(
        { error: `Insufficient wallet balance. Need ₦${remainingAmount.toLocaleString()}, have ₦${wallet.balance.toLocaleString()}` },
        { status: 400 }
      );
    }

    // Process payment
    await updateDoc(walletRef, {
      balance: increment(-remainingAmount),
      heldBalance: increment(-depositHeld),
      totalSpent: increment(totalAmount),
      updatedAt: serverTimestamp(),
    });

    // Update bill status
    await updateDoc(doc(db, 'bills', billId), {
      status: 'approved',
      approvedAt: serverTimestamp(),
      approvedBy: userId,
    });

    // Create transaction record
    await addDoc(collection(db, 'transactions'), {
      userId,
      type: 'job_payment',
      amount: totalAmount,
      description: `Bill payment for job: ${billData.jobTitle}`,
      status: 'completed',
      metadata: {
        billId,
        jobId: billData.jobId,
        depositHeld,
        remainingAmount,
      },
      createdAt: serverTimestamp(),
    });

    // Update job status if needed
    if (billData.jobId) {
      const jobDoc = await getDoc(doc(db, 'jobs', billData.jobId));
      if (jobDoc.exists()) {
        const jobData = jobDoc.data();
        if (jobData.status === 'materials-pending-payment') {
          await updateDoc(doc(db, 'jobs', billData.jobId), {
            status: 'materials-paid',
            updatedAt: serverTimestamp(),
          });
        }
      }
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Bill approved and payment processed successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error approving bill:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to approve bill' },
      { status: 500 }
    );
  }
}

