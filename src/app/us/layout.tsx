import { Metadata } from 'next';
import USCorporateHeader from '@/components/us/USCorporateHeader';
import USCorporateFooter from '@/components/us/USCorporateFooter';
import PhixallUsJsonLd from '@/components/us/PhixallUsJsonLd';
import { getMarketingSiteOrigin, getPhixallUsOrigin } from '@/lib/phixallUsSite';

const phixallUsOrigin = getPhixallUsOrigin();

export const metadata: Metadata = {
  metadataBase: new URL(phixallUsOrigin),
  title: 'Warehouse Facility Management Solutions | Phixall US',
  description:
    'Specialized on-shore warehouse and industrial facility management in Indiana—electrical, plumbing, trades, procurement, advisory, engineering PM, engineering services, and controls with coordinated on-site technicians.',
  keywords: [
    'warehouse facility management',
    'warehouse electrical services',
    'warehouse plumbing services',
    'warehouse carpentry services',
    'warehouse painting services',
    'warehouse installation supplies',
    'facility management advisory',
    'engineering services',
    'controls automation',
    'engineering project management',
    'warehouse maintenance USA',
    'distribution center services',
    'warehouse operations management'
  ],
  alternates: {
    languages: {
      'en-US': `${phixallUsOrigin}/us`,
      'x-default': `${getMarketingSiteOrigin()}/`,
    },
  },
  openGraph: {
    title: 'Warehouse Facility Management Solutions | Phixall US',
    description:
      'Trades, procurement, advisory, engineering PM, engineering services, and controls for land-based warehouse and industrial programs in authorized Indiana service areas.',
    type: 'website',
    url: '/us',
  },
};

export default function USLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="isolate min-h-[100dvh] bg-[var(--background)] font-sans tracking-tight text-neutral-950 antialiased">
      <PhixallUsJsonLd />
      <USCorporateHeader />
      {children}
      <USCorporateFooter />
    </div>
  );
}
