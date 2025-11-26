import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseServer } from '@/lib/firebaseServer';
import { doc, updateDoc, getDoc, collection, addDoc, serverTimestamp, increment } from 'firebase/firestore';
import { sendTemplateEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceId, paymentMethod, paymentReference, clientId } = body;

    if (!invoiceId || !paymentMethod || !paymentReference || !clientId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = getFirebaseServer();

    // Get invoice
    const invoiceRef = doc(db, 'materialInvoices', invoiceId);
    const invoiceDoc = await getDoc(invoiceRef);

    if (!invoiceDoc.exists()) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    const invoiceData = invoiceDoc.data();

    if (invoiceData.status === 'paid') {
      return NextResponse.json(
        { error: 'Invoice already paid' },
        { status: 400 }
      );
    }

    // Get client wallet
    const walletRef = doc(db, 'wallets', clientId);
    const walletDoc = await getDoc(walletRef);
    const walletData = walletDoc.data() || { balance: 0 };

    if (walletData.balance < invoiceData.grandTotal) {
      return NextResponse.json(
        { error: 'Insufficient wallet balance' },
        { status: 400 }
      );
    }

    // Deduct from wallet
    await updateDoc(walletRef, {
      balance: increment(-invoiceData.grandTotal),
      totalSpent: increment(invoiceData.grandTotal),
      updatedAt: serverTimestamp(),
    });

    // Update invoice status
    await updateDoc(invoiceRef, {
      status: 'paid',
      paymentMethod,
      paymentReference,
      paidAt: serverTimestamp(),
    });

    // Create transaction record
    await addDoc(collection(db, 'transactions'), {
      userId: clientId,
      type: 'material_payment',
      amount: invoiceData.grandTotal,
      description: `Material payment for job ${invoiceData.jobId}`,
      status: 'completed',
      metadata: {
        invoiceId,
        jobId: invoiceData.jobId,
        materialCost: invoiceData.subtotal,
        markupRevenue: invoiceData.markupAmount,
        serviceFee: invoiceData.serviceFee,
        paymentMethod,
        paymentReference,
      },
      createdAt: serverTimestamp(),
    });

    // Update job status
    await updateDoc(doc(db, 'jobs', invoiceData.jobId), {
      materialStatus: 'materials-paid',
      updatedAt: serverTimestamp(),
    });

    // Add timeline event
    await addDoc(collection(db, 'jobTimeline'), {
      jobId: invoiceData.jobId,
      type: 'material-paid',
      description: `Material payment of ₦${invoiceData.grandTotal.toLocaleString()} received`,
      userId: clientId,
      userName: invoiceData.clientName,
      metadata: {
        invoiceId,
        amount: invoiceData.grandTotal,
        paymentMethod,
      },
      createdAt: serverTimestamp(),
    });

    // Send confirmation email
    try {
      await sendTemplateEmail('payment-received', invoiceData.clientEmail || '', {
        userName: invoiceData.clientName,
        amount: invoiceData.grandTotal.toLocaleString(),
        paymentType: 'Material Payment',
        paymentDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        reference: paymentReference,
      });
    } catch (emailError) {
      console.error('Failed to send payment confirmation email:', emailError);
    }

    return NextResponse.json(
      { success: true, message: 'Payment processed successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error processing material payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process payment' },
      { status: 500 }
    );
  }
}

