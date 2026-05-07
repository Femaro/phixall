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

function IconSafetyAlert({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z"
      />
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

function IconLeaf({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21c4-3 7-7 7-12a7 7 0 10-14 0c0 5 3 9 7 12z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21V11" />
    </svg>
  );
}

function IconFlameShield({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 3s-4 4.5-4 9.5a4 4 0 108 0c0-5-4-9.5-4-9.5zm0 13.5v3"
      />
    </svg>
  );
}

type BadgeProps = {
  title: string;
  subtext: string;
  icon: ReactNode;
  emphasized?: boolean;
};

function BadgeCard({ title, subtext, icon, emphasized }: BadgeProps) {
  return (
    <div
      className={
        emphasized
          ? 'group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm ring-1 ring-slate-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 hover:ring-[#1e3a5f]/20'
          : 'group relative flex flex-col rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/8 hover:ring-[#1e3a5f]/15'
      }
    >
      <div
        className={
          emphasized
            ? 'flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-[#1e3a5f] transition group-hover:border-[#1e3a5f]/25 group-hover:bg-[#1e3a5f]/[0.06] group-hover:text-[#1e3a5f]'
            : 'flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[#1e3a5f] transition group-hover:border-[#1e3a5f]/25 group-hover:bg-[#1e3a5f]/[0.06]'
        }
      >
        {icon}
      </div>
      <h3
        className={
          emphasized
            ? 'mt-5 text-lg font-semibold leading-snug text-slate-900'
            : 'mt-4 text-base font-semibold leading-snug text-slate-900'
        }
      >
        {title}
      </h3>
      <p className={emphasized ? 'mt-2 text-sm leading-relaxed text-slate-600' : 'mt-1.5 text-xs leading-relaxed text-slate-600'}>
        {subtext}
      </p>
    </div>
  );
}

const verifiedCredentials: BadgeProps[] = [
  {
    title: 'ISNetworld Member',
    subtext: 'Safety & Compliance Vetted',
    icon: <IconShieldCheck className="h-8 w-8" />,
    emphasized: true,
  },
  {
    title: 'D&B Verified',
    subtext: 'Dun & Bradstreet Registered',
    icon: <IconBuildingVerified className="h-8 w-8" />,
    emphasized: true,
  },
  {
    title: 'Diverse Supplier',
    subtext: 'Minority-Owned Business Enterprise (MBE)',
    icon: <IconDiversity className="h-8 w-8" />,
    emphasized: true,
  },
];

const operationalStandards: BadgeProps[] = [
  {
    title: 'OSHA Compliant',
    subtext: '1910 & 1926 Safety Standards',
    icon: <IconSafetyAlert className="h-6 w-6" />,
  },
  {
    title: 'Quality Assured',
    subtext: 'Standardized QA/QC Framework',
    icon: <IconQuality className="h-6 w-6" />,
  },
  {
    title: 'EPA Aligned',
    subtext: 'Environmental & Waste Stewardship',
    icon: <IconLeaf className="h-6 w-6" />,
  },
  {
    title: 'Fire & Life Safety',
    subtext: 'NFPA Code Adherence',
    icon: <IconFlameShield className="h-6 w-6" />,
  },
];

export default function TrustComplianceBadges() {
  return (
    <section className="border-t border-neutral-200 bg-gradient-to-b from-slate-50 to-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Phixall Facility Management Company LLC</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">Trust &amp; compliance</h2>
          <p className="mt-4 text-base text-slate-600">
            Third-party verification and field standards you can reference in program reviews and RFPs.
          </p>
        </div>

        <div className="mt-14">
          <p className="mb-6 text-center text-xs font-bold uppercase tracking-widest text-[#1e3a5f]">
            Verified credentials
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {verifiedCredentials.map((badge) => (
              <BadgeCard key={badge.title} {...badge} />
            ))}
          </div>
        </div>

        <div className="mt-14">
          <p className="mb-5 text-center text-xs font-bold uppercase tracking-widest text-slate-600">
            Operational standards
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {operationalStandards.map((badge) => (
              <BadgeCard key={badge.title} {...badge} />
            ))}
          </div>
        </div>

        <p className="mx-auto mt-14 max-w-3xl text-center text-sm leading-relaxed text-slate-600">
          Phixall is committed to the highest standards of operational excellence. Our programs are modeled after international
          quality and safety benchmarks to ensure peak performance for our enterprise partners.
        </p>
      </div>
    </section>
  );
}
