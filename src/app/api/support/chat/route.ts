import { NextResponse } from 'next/server';
import { generateSupportReply } from '@/lib/supportBot';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      role,
      message,
      history,
    }: {
      role: 'client' | 'Phixer' | 'admin';
      message: string;
      history?: Array<{
        sender: 'user' | 'assistant' | 'agent';
        text: string;
        createdAt?: string;
      }>;
    } = body;

    if (!role || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const ai = await generateSupportReply({
      role,
      message,
      history: (history ?? []).map((msg) => ({
        sender: msg.sender,
        text: msg.text,
        createdAt: msg.createdAt ?? new Date().toISOString(),
      })),
    });

    return NextResponse.json(ai);
  } catch (error) {
    console.error('Support chat error', error);
    return NextResponse.json(
      { error: 'Unable to process support request. Please try again.' },
      { status: 500 }
    );
  }
}


