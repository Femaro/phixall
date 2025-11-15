export type SupportArticle = {
  id: string;
  role: 'client' | 'artisan' | 'admin' | 'general';
  tags: string[];
  title: string;
  content: string;
  roles?: Array<'client' | 'artisan' | 'admin' | 'general'>;
  priority?: number;
};

export const supportArticles: SupportArticle[] = [
  {
    id: 'client-request',
    role: 'client',
    tags: ['request', 'services', 'form'],
    title: 'How to request a service',
    content:
      'Open the Request Service tab, choose a category, add a title and description, pick a preferred schedule, and upload photos if available. You can toggle "Use different address" to specify a service location or share your current live location. Submit the form to create a job.',
  },
  {
    id: 'client-wallet',
    role: 'client',
    tags: ['wallet', 'payments', 'stripe'],
    title: 'Adding funds to your wallet',
    content:
      'In the Wallet tab, enter an amount (minimum ₦100) and click Deposit Funds. We redirect you to a secure Stripe checkout to complete payment. After success, the wallet updates automatically. If payment fails, you can retry or contact support.',
  },
  {
    id: 'client-verification',
    role: 'client',
    tags: ['rating', 'verification', 'reviews'],
    title: 'Verifying completed jobs & rating artisans',
    content:
      'When an artisan marks a job completed, you will see a verification card on the Overview tab. Rate the service from 1–5 stars, leave optional feedback, and submit. Ratings feed into the artisan profile and help the admin team monitor quality.',
  },
  {
    id: 'artisan-available',
    role: 'artisan',
    tags: ['availability', 'jobs', 'distance'],
    title: 'Managing availability & nearby jobs',
    content:
      'Toggle availability on the Overview tab. To receive distance-aware jobs, add your state and save your current location as your home base. The Available Jobs tab shows requests within your state and within 20 miles.',
  },
  {
    id: 'artisan-wallet',
    role: 'artisan',
    tags: ['wallet', 'cashout'],
    title: 'Earnings & cash outs',
    content:
      'Your wallet displays balance, total earnings, and pending amounts. To cash out, enter an amount (≥ ₦1,000) and confirm bank details. A 2.5% fee applies. Cash-outs enter a pending state until processed by admin.',
  },
  {
    id: 'admin-assign',
    role: 'admin',
    tags: ['assignment', 'state', 'jobs'],
    title: 'Assigning jobs to artisans',
    content:
      'Admins can assign a job from the Job Management tab. The modal filters artisans who are active in the job’s state. Attempting to assign outside the service state will show a warning.',
  },
  {
    id: 'general-subscription',
    role: 'general',
    tags: ['subscription', 'premium', 'plans'],
    title: 'Premium subscription plans',
    content:
      'Phixall offers Bronze, Gold, and Platinum plans with monthly or yearly billing. Each plan bundles a set number of service calls, response times, discounts, and inspections. Clients can subscribe via the Premium modal or the /subscription page.',
  },
];

