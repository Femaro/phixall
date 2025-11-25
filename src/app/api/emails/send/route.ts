import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, sendTemplateEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, html, text, templateId, variables } = body;

    if (!to) {
      return NextResponse.json(
        { error: 'Recipient email is required' },
        { status: 400 }
      );
    }

    let result;
    if (templateId && variables) {
      // Send using template
      result = await sendTemplateEmail(templateId, to, variables);
    } else if (subject && html) {
      // Send custom email
      result = await sendEmail({ to, subject, html, text });
    } else {
      return NextResponse.json(
        { error: 'Either templateId+variables or subject+html is required' },
        { status: 400 }
      );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    });
  } catch (error: any) {
    console.error('Error in email API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}

