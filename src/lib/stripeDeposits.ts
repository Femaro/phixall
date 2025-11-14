import Stripe from 'stripe';
import { doc, getDoc, increment, serverTimestamp, setDoc, type Firestore } from 'firebase/firestore';

export async function recordStripeCheckoutDeposit(db: Firestore, session: Stripe.Checkout.Session) {
  if (session.payment_status !== 'paid') {
    throw new Error('Payment not completed yet');
  }

  const userId = session.metadata?.userId || session.client_reference_id;
  if (!userId) {
    throw new Error('Session missing user metadata');
  }

  const amountMinor = session.amount_total ?? 0;
  const amount = amountMinor / 100;
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Invalid session amount');
  }

  const transactionRef = doc(db, 'transactions', session.id);
  const existingTx = await getDoc(transactionRef);
  if (existingTx.exists()) {
    const walletSnap = await getDoc(doc(db, 'wallets', userId));
    return walletSnap.data();
  }

  await setDoc(transactionRef, {
    userId,
    type: 'deposit',
    amount,
    description: 'Wallet deposit via Stripe',
    status: 'completed',
    stripeSessionId: session.id,
    createdAt: serverTimestamp(),
  });

  const walletRef = doc(db, 'wallets', userId);
  const walletExisting = await getDoc(walletRef);
  if (!walletExisting.exists()) {
    await setDoc(walletRef, {
      balance: 0,
      totalDeposits: 0,
      totalSpent: 0,
      createdAt: serverTimestamp(),
    });
  }

  await setDoc(
    walletRef,
    {
      balance: increment(amount),
      totalDeposits: increment(amount),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  const walletSnap = await getDoc(walletRef);
  return walletSnap.data();
}

