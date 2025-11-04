import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST() {
	const key = process.env.STRIPE_SECRET_KEY;
	if (!key) {
		return NextResponse.json({ url: 'https://stripe.com/docs/payments/checkout' });
	}
	const stripe = new Stripe(key, { apiVersion: '2024-06-20' as any });
	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		payment_method_types: ['card'],
		line_items: [
			{ price_data: { currency: 'usd', unit_amount: 1000, product_data: { name: 'Phixall Service' } }, quantity: 1 }
		],
		success_url: process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/client/dashboard?paid=1` : 'http://localhost:3000/client/dashboard?paid=1',
		cancel_url: process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/client/dashboard?cancel=1` : 'http://localhost:3000/client/dashboard?cancel=1',
	});
	return NextResponse.json({ url: session.url });
}
