import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirebaseServer } from '@/lib/firebaseServer';
import { recordStripeCheckoutDeposit } from '@/lib/stripeDeposits';

export async function POST(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!key || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook not configured' }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
  }

  const stripe = new Stripe(key, { apiVersion: '2024-06-20' });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Stripe webhook signature verification failed', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { db } = getFirebaseServer();

    try {
      await recordStripeCheckoutDeposit(db, session);
    } catch (error) {
      console.error('Failed to persist Stripe deposit', error);
      return NextResponse.json({ error: 'Failed to persist deposit' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

