import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Controls & Automation | Phixall US',
  description:
    'Control systems, automation, instrumentation, and integration support tailored to warehouses and industrial environments.',
  openGraph: {
    title: 'Controls & Automation | Phixall US',
    description:
      'Industrial controls, automation modernization, instrumentation, panels, sequences of operations, validation, and commissioning support.',
    type: 'website',
  },
};

export default function ControlsAutomationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
