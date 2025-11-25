import { NextResponse } from 'next/server';
import { defaultEmailTemplates } from '@/lib/emailTemplates';

export async function GET() {
  return NextResponse.json({
    templates: defaultEmailTemplates,
  });
}

