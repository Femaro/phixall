import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirebaseServer } from '@/lib/firebaseServer';
import { recordStripeCheckoutDeposit } from '@/lib/stripeDeposits';

interface ConfirmBody {
  sessionId?: string;
}

export async function POST(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  let payload: ConfirmBody = {};
  try {
    payload = await request.json();
  } catch {
    // ignored
  }

  const sessionId = payload.sessionId;
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing Stripe session id' }, { status: 400 });
  }

  const stripe = new Stripe(key, { apiVersion: '2025-10-29.clover' as Stripe.LatestApiVersion });

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    console.error('Stripe retrieve error', error);
    return NextResponse.json({ error: 'Unable to verify payment session' }, { status: 400 });
  }

  const { db } = getFirebaseServer();
  try {
    const wallet = await recordStripeCheckoutDeposit(db, session);
    return NextResponse.json({
      status: 'success',
      wallet,
    });
  } catch (error) {
    console.error('Error finalizing deposit', error);
    const message = error instanceof Error ? error.message : 'Failed to record deposit';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

