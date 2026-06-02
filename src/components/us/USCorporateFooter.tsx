'use client';

import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/app/logo.png';
import { US_CORE_SERVICES } from '@/data/usCoreServices';
import { US_INDUSTRIES } from '@/data/usIndustries';

export default function USCorporateFooter() {
  return (
    <footer className="border-t-4 border-t-[#3498db]/40 border-neutral-200 bg-gradient-to-b from-neutral-50 to-neutral-100/80">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/us" className="flex items-center">
              <Image src={Logo} alt="Phixall" width={72} height={72} />
            </Link>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Services</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {US_CORE_SERVICES.map((service) => (
                <li key={service.id}>
                  <Link href={service.href} className="text-neutral-600 transition-colors hover:text-[#3498db]">
                    {service.navLabel}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/us/services" className="text-neutral-600 transition-colors hover:text-[#3498db]">
                  Browse all services
                </Link>
              </li>
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Industries</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/us/industries" className="text-neutral-600 transition-colors hover:text-[#3498db]">
                  All industries
                </Link>
              </li>
              {US_INDUSTRIES.map((industry) => (
                <li key={industry.id}>
                  <Link
                    href={`/us/industries#${industry.id}`}
                    className="text-neutral-600 transition-colors hover:text-[#3498db]"
                  >
                    {industry.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Company</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/us/about" className="text-neutral-600 transition-colors hover:text-[#3498db]">About Us</Link></li>
              <li><Link href="/us/contact" className="text-neutral-600 transition-colors hover:text-[#3498db]">Contact us</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-200 bg-neutral-100">
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center text-sm text-neutral-600 md:text-left">
              <p>© {new Date().getFullYear()} Phixall Facility Management LLC. All rights reserved.</p>
              <p className="mt-1 text-xs text-neutral-500">
                Phixall is powered by Phixall Facility Management LLC. Licensed and insured.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-500">
              <div className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>SSL Secure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Insured</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Licensed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
