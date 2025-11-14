import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Subscription Plans - Bronze, Gold & Platinum',
  description: 'Choose from Bronze, Gold, or Platinum subscription tiers for comprehensive facility management services. Monthly premium plans with increasing benefits. Perfect for businesses of all sizes.',
  keywords: [
    'facility management subscription',
    'premium maintenance plans',
    'Bronze tier',
    'Gold tier',
    'Platinum tier',
    'monthly facility services',
    'subscription pricing',
  ],
  openGraph: {
    title: 'Phixall Premium Subscriptions - Choose Your Tier',
    description: 'Bronze, Gold, or Platinum - Choose the subscription tier that fits your facility needs.',
    url: '/subscription',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Phixall Subscription Plans',
      }
    ],
  },
  alternates: {
    canonical: '/subscription',
  },
};

export default function SubscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


