import { Metadata } from 'next';
import USCorporateHeader from '@/components/us/USCorporateHeader';
import USCorporateFooter from '@/components/us/USCorporateFooter';

export const metadata: Metadata = {
  title: 'Warehouse Facility Management Solutions | Phixall US',
  description:
    'Specialized warehouse facility management including electrical, plumbing, trades, procurement, advisory, engineering PM, engineering services, and controls—with nationwide coordination.',
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
  openGraph: {
    title: 'Warehouse Facility Management Solutions | Phixall US',
    description:
      'Trades, procurement, advisory, engineering PM, engineering services, and controls for warehouse and industrial programs across the United States.',
    type: 'website',
  },
};

export default function USLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="isolate min-h-[100dvh] bg-[var(--background)] font-sans tracking-tight text-neutral-950 antialiased">
      <USCorporateHeader />
      {children}
      <USCorporateFooter />
    </div>
  );
}
