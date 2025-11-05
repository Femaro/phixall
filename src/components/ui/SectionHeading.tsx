type Props = { title: string; subtitle?: string; align?: 'left' | 'center' };

export default function SectionHeading({ title, subtitle, align = 'left' }: Props) {
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
    </div>
  );
}



