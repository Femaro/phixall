import { NextRequest, NextResponse } from 'next/server';
import { resolveAccountNumber } from '@/lib/paystackServer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { account_number, bank_code } = body;

    if (!account_number || !bank_code) {
      return NextResponse.json(
        { success: false, error: 'Account number and bank code are required' },
        { status: 400 }
      );
    }

    const result = await resolveAccountNumber({
      account_number,
      bank_code,
    });

    if (result.status) {
      return NextResponse.json({
        success: true,
        data: {
          account_number: result.data.account_number,
          account_name: result.data.account_name,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.message || 'Failed to resolve account' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Account resolution error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to resolve account' },
      { status: 500 }
    );
  }
}


