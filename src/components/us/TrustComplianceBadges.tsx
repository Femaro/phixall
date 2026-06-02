'use client';

import type { ReactNode } from 'react';

function IconShieldCheck({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

function IconBuildingVerified({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11l2 2 4-4" />
    </svg>
  );
}

function IconDiversity({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function IconQuality({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}

function IconLocation({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

type TrustItem = {
  title: string;
  subtext: string;
  icon: ReactNode;
};

function CompactBadge({ title, subtext, icon }: TrustItem) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200/80 bg-white px-4 py-3">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-50 text-[#1e3a5f]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-snug text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{subtext}</p>
      </div>
    </div>
  );
}

const verifiedCredentials: TrustItem[] = [
  {
    title: 'ISNetworld Member',
    subtext: 'Contractor management network participant',
    icon: <IconShieldCheck className="h-5 w-5" />,
  },
  {
    title: 'D&B Verified',
    subtext: 'Dun & Bradstreet registered',
    icon: <IconBuildingVerified className="h-5 w-5" />,
  },
  {
    title: 'Diverse Supplier',
    subtext: 'Minority-owned business enterprise (MBE)',
    icon: <IconDiversity className="h-5 w-5" />,
  },
];

const operationalStandards: TrustItem[] = [
  {
    title: 'Quality Assured',
    subtext: 'Consistent service delivery standards',
    icon: <IconQuality className="h-4 w-4" />,
  },
  {
    title: 'Indiana-Based',
    subtext: 'Services available only within Indiana',
    icon: <IconLocation className="h-4 w-4" />,
  },
];

export default function TrustComplianceBadges() {
  return (
    <section className="border-t border-neutral-200 bg-slate-50/80 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#3498db]">Trust &amp; credentials</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
              Professional facility support
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-600 sm:text-right">
            A small, Indiana-based team focused on facility support services.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {verifiedCredentials.map((badge) => (
            <CompactBadge key={badge.title} {...badge} />
          ))}
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {operationalStandards.map((badge) => (
            <CompactBadge key={badge.title} {...badge} />
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Phixall Facility Management LLC · Insured · Indiana-based operations only
        </p>
      </div>
    </section>
  );
}
