import { NextResponse } from 'next/server';
import Stripe from 'stripe';

interface CheckoutRequestBody {
  amount: number;
  userId: string;
}

export async function POST(request: Request) {
	const key = process.env.STRIPE_SECRET_KEY;
	if (!key) {
		return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
	}

  let payload: Partial<CheckoutRequestBody> = {};
  try {
    payload = await request.json();
  } catch {
    // ignore, validation below will fail
  }

  const amount = Number(payload?.amount);
  if (!Number.isFinite(amount) || amount < 100) {
    return NextResponse.json({ error: 'Invalid amount. Minimum deposit is ₦100.' }, { status: 400 });
  }

  const userId = payload?.userId;
  if (!userId) {
    return NextResponse.json({ error: 'Missing user identifier.' }, { status: 400 });
  }

	const stripe = new Stripe(key, { apiVersion: '2025-10-29.clover' as Stripe.LatestApiVersion });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const unitAmount = Math.round(amount * 100);
	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		payment_method_types: ['card'],
		line_items: [
			{ price_data: { currency: 'ngn', unit_amount: unitAmount, product_data: { name: 'Phixall Wallet Deposit' } }, quantity: 1 }
		],
    metadata: {
      userId,
      amount: amount.toString(),
    },
    client_reference_id: userId,
		success_url: `${baseUrl}/client/dashboard?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${baseUrl}/client/dashboard?cancelled=1`,
	});
	return NextResponse.json({ url: session.url });
}
