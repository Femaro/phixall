export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  category: 'application' | 'job' | 'payment' | 'notification' | 'custom';
}

export const defaultEmailTemplates: EmailTemplate[] = [
  {
    id: 'application-received',
    name: 'Application Received',
    subject: 'Thank You for Your Application - Phixall',
    body: `Dear {{firstName}} {{lastName}},

Thank you for applying for the {{position}} position at Phixall.

We have successfully received your application and our team will review it carefully. We appreciate your interest in joining our team and will get back to you within 5-7 business days.

Application Details:
- Position: {{position}}
- Applied: {{appliedDate}}

If you have any questions, please don't hesitate to contact us.

Best regards,
Phixall Recruitment Team`,
    variables: ['firstName', 'lastName', 'position', 'appliedDate'],
    category: 'application',
  },
  {
    id: 'application-shortlisted',
    name: 'Application Shortlisted',
    subject: 'Congratulations! Your Application Has Been Shortlisted - Phixall',
    body: `Dear {{firstName}} {{lastName}},

We are pleased to inform you that your application for the {{position}} position has been shortlisted!

Our team was impressed with your qualifications and experience. We would like to invite you to the next stage of our recruitment process.

Next Steps:
- Our team will contact you within the next few days to schedule an interview
- Please ensure your contact information is up to date

We look forward to speaking with you soon.

Best regards,
Phixall Recruitment Team`,
    variables: ['firstName', 'lastName', 'position'],
    category: 'application',
  },
  {
    id: 'application-rejected',
    name: 'Application Rejected',
    subject: 'Update on Your Application - Phixall',
    body: `Dear {{firstName}} {{lastName}},

Thank you for your interest in the {{position}} position at Phixall.

After careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.

We appreciate the time you took to apply and encourage you to keep an eye on our careers page for future opportunities that may be a better fit.

We wish you the best in your career endeavors.

Best regards,
Phixall Recruitment Team`,
    variables: ['firstName', 'lastName', 'position'],
    category: 'application',
  },
  {
    id: 'job-assigned',
    name: 'Job Assigned to Phixer',
    subject: 'New Job Assignment - Phixall',
    body: `Hello {{phixerName}},

A new job has been assigned to you!

Job Details:
- Title: {{jobTitle}}
- Client: {{clientName}}
- Location: {{jobLocation}}
- Budget: ₦{{budget}}

Please review the job details in your dashboard and confirm your acceptance.

Best regards,
Phixall Team`,
    variables: ['phixerName', 'jobTitle', 'clientName', 'jobLocation', 'budget'],
    category: 'job',
  },
  {
    id: 'job-completed',
    name: 'Job Completed',
    subject: 'Job Completion Confirmed - Phixall',
    body: `Dear {{clientName}},

Your service request "{{jobTitle}}" has been completed!

The Phixer has submitted the completion form and our team is reviewing it. Once approved, you will be charged the final amount.

Job Details:
- Title: {{jobTitle}}
- Phixer: {{phixerName}}
- Status: Pending Approval

Thank you for using Phixall!

Best regards,
Phixall Team`,
    variables: ['clientName', 'jobTitle', 'phixerName'],
    category: 'job',
  },
  {
    id: 'payment-received',
    name: 'Payment Received',
    subject: 'Payment Confirmed - Phixall',
    body: `Dear {{userName}},

Your payment of ₦{{amount}} has been successfully processed.

Transaction Details:
- Amount: ₦{{amount}}
- Type: {{paymentType}}
- Date: {{paymentDate}}
- Reference: {{reference}}

Your wallet balance has been updated accordingly.

Thank you for your payment!

Best regards,
Phixall Team`,
    variables: ['userName', 'amount', 'paymentType', 'paymentDate', 'reference'],
    category: 'payment',
  },
  {
    id: 'payout-processed',
    name: 'Payout Processed',
    subject: 'Earnings Payout Processed - Phixall',
    body: `Hello {{phixerName}},

Your earnings payout has been processed!

Payout Details:
- Amount: ₦{{amount}}
- Job: {{jobTitle}}
- Date: {{payoutDate}}
- Status: {{status}}

The funds have been transferred to your registered bank account.

Thank you for your excellent work!

Best regards,
Phixall Team`,
    variables: ['phixerName', 'amount', 'jobTitle', 'payoutDate', 'status'],
    category: 'payment',
  },
];

export function replaceTemplateVariables(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
  }
  return result;
}

