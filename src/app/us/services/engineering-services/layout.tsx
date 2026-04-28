import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Engineering Services | Phixall US',
  description:
    'Industrial and warehouse-aligned engineering services: technical studies, field engineering, commissioning support, as-built documentation, and technical reviews.',
  openGraph: {
    title: 'Engineering Services | Phixall US',
    description:
      'Design support and field-aligned engineering services for warehouses, logistics, and industrial facilities nationwide.',
    type: 'website',
  },
};

export default function EngineeringServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
