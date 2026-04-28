import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Engineering Project Management Support | Phixall US',
  description:
    'Schedules, PMO-style governance, documentation, vendor coordination, and change control for facility and industrial capital projects across the United States.',
  openGraph: {
    title: 'Engineering Project Management Support | Phixall US',
    description:
      'Facility and capital-project PM support: milestones, schedules, risk management, documentation, and execution discipline.',
    type: 'website',
  },
};

export default function EngineeringPMCLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
