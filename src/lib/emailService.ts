import { defaultEmailTemplates, replaceTemplateVariables, type EmailTemplate } from './emailTemplates';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@phixall.com';
const FROM_NAME = process.env.FROM_NAME || 'Phixall';

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, ''),
        reply_to: options.replyTo,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      return { success: false, error: data.message || 'Failed to send email' };
    }

    return { success: true, messageId: data.id };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

export async function sendTemplateEmail(
  templateId: string,
  to: string | string[],
  variables: Record<string, string>
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const template = defaultEmailTemplates.find(t => t.id === templateId);
  
  if (!template) {
    return { success: false, error: `Template ${templateId} not found` };
  }

  const subject = replaceTemplateVariables(template.subject, variables);
  const body = replaceTemplateVariables(template.body, variables);
  
  // Convert plain text to HTML
  const html = body
    .split('\n')
    .map(line => {
      if (line.trim() === '') return '<br>';
      if (line.startsWith('- ')) return `<li>${line.substring(2)}</li>`;
      if (line.includes(':')) {
        const [label, value] = line.split(':');
        return `<p><strong>${label.trim()}:</strong> ${value.trim()}</p>`;
      }
      return `<p>${line}</p>`;
    })
    .join('')
    .replace(/<li>/g, '<ul><li>')
    .replace(/<\/li>/g, '</li></ul>')
    .replace(/<\/ul>\s*<ul>/g, '');

  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Phixall</h1>
          </div>
          <div class="content">
            ${html}
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Phixall. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject,
    html: fullHtml,
    text: body,
  });
}

export { defaultEmailTemplates, type EmailTemplate };

