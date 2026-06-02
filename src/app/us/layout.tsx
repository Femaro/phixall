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
    'On-shore warehouse and industrial facility management in Indiana—trades, coatings, procurement, project support, automation coordination, and owner\'s-representative services with coordinated on-site technicians.',
  keywords: [
    'warehouse facility management',
    'warehouse electrical services',
    'warehouse plumbing services',
    'warehouse carpentry services',
    'warehouse painting services',
    'warehouse installation supplies',
    'facility management advisory',
    'automation coordination',
    'owners representative',
    'owners rep facility',
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
      'Trades, coatings, procurement, project support, automation coordination, and owner\'s-representative services for land-based warehouse and industrial programs in authorized Indiana service areas.',
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
