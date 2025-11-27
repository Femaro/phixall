import { NextRequest, NextResponse } from 'next/server';
import { initializeTransaction } from '@/lib/paystackServer';
import { toKobo, generateReference } from '@/lib/paystackClient';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, amount, jobId, userId, type } = body;

    if (!email || !amount) {
      return NextResponse.json(
        { success: false, error: 'Email and amount are required' },
        { status: 400 }
      );
    }

    const reference = generateReference();
    const amountInKobo = toKobo(amount);

    const result = await initializeTransaction({
      email,
      amount: amountInKobo,
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/callback`,
      metadata: {
        jobId,
        userId,
        type, // 'job_payment', 'wallet_funding', 'subscription'
        custom_fields: [
          {
            display_name: 'Payment Type',
            variable_name: 'payment_type',
            value: type || 'job_payment',
          },
        ],
      },
      channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
    });

    if (result.status) {
      return NextResponse.json({
        success: true,
        data: {
          authorization_url: result.data.authorization_url,
          access_code: result.data.access_code,
          reference: result.data.reference,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}


