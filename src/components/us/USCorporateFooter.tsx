'use client';

import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/app/logo.png';

export default function USCorporateFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/us" className="flex items-center gap-3">
              <Image src={Logo} alt="Phixall" width={56} height={56} className="drop-shadow-lg" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-neutral-900">PHIXALL.US</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#3498db]">Enterprise Solutions</span>
              </div>
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-neutral-600">
              Phixall, powered by Phixall Facility Management LLC, provides comprehensive facility management services for commercial, industrial, and residential properties across the United States. ISO 9001, OSHA, and EPA certified.
            </p>
            
            {/* Certifications */}
            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Certifications</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {['ISO 9001', 'OSHA', 'EPA', 'LEED', 'NFPA'].map((cert) => (
                  <div key={cert} className="flex items-center gap-1.5 border border-neutral-300 bg-white px-3 py-1.5">
                    <svg className="h-4 w-4 text-[#27ae60]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-semibold text-neutral-700">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Services</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/us/services/commercial" className="text-neutral-600 transition-colors hover:text-[#3498db]">Commercial Facilities</Link></li>
              <li><Link href="/us/services/warehouse-industrial" className="text-neutral-600 transition-colors hover:text-[#3498db]">Warehouse & Industrial</Link></li>
              <li><Link href="/us/services/residential" className="text-neutral-600 transition-colors hover:text-[#3498db]">Residential Properties</Link></li>
              <li><Link href="/us/services/offshore-marine" className="text-neutral-600 transition-colors hover:text-[#3498db]">Offshore & Marine</Link></li>
              <li><Link href="/us/services/hvac-mechanical" className="text-neutral-600 transition-colors hover:text-[#3498db]">HVAC & Mechanical</Link></li>
              <li><Link href="/us/services/electrical-power" className="text-neutral-600 transition-colors hover:text-[#3498db]">Electrical & Power</Link></li>
              <li><Link href="/us/services/plumbing-water" className="text-neutral-600 transition-colors hover:text-[#3498db]">Plumbing & Water</Link></li>
              <li><Link href="/us/services/fire-safety" className="text-neutral-600 transition-colors hover:text-[#3498db]">Fire Safety</Link></li>
              <li><Link href="/us/services/supplies-procurement" className="text-neutral-600 transition-colors hover:text-[#3498db]">Supplies & Procurement</Link></li>
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Industries</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/us/industries/healthcare" className="text-neutral-600 transition-colors hover:text-[#3498db]">Healthcare</Link></li>
              <li><Link href="/us/industries/education" className="text-neutral-600 transition-colors hover:text-[#3498db]">Education</Link></li>
              <li><Link href="/us/industries/manufacturing" className="text-neutral-600 transition-colors hover:text-[#3498db]">Manufacturing</Link></li>
              <li><Link href="/us/industries/retail" className="text-neutral-600 transition-colors hover:text-[#3498db]">Retail</Link></li>
              <li><Link href="/us/industries/logistics" className="text-neutral-600 transition-colors hover:text-[#3498db]">Logistics</Link></li>
              <li><Link href="/us/industries/hospitality" className="text-neutral-600 transition-colors hover:text-[#3498db]">Hospitality</Link></li>
              <li><Link href="/us/industries/government" className="text-neutral-600 transition-colors hover:text-[#3498db]">Government</Link></li>
              <li><Link href="/us/industries/technology" className="text-neutral-600 transition-colors hover:text-[#3498db]">Technology</Link></li>
            </ul>
          </div>

          {/* Company & Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Company</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/us/about" className="text-neutral-600 transition-colors hover:text-[#3498db]">About Us</Link></li>
              <li><Link href="/us/contact" className="text-neutral-600 transition-colors hover:text-[#3498db]">Contact</Link></li>
              <li><Link href="/us/request-quote" className="text-neutral-600 transition-colors hover:text-[#3498db]">Request Quote</Link></li>
              <li>
                <a href="https://phixall.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-neutral-600 transition-colors hover:text-[#3498db]">
                  Facility Management App
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">24/7 Emergency</div>
              <a href="tel:1-800-PHIXALL" className="mt-2 flex items-center gap-2 text-lg font-bold text-[#e67e22] hover:underline">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                1-800-PHIXALL
              </a>
            </div>
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
                Phixall is powered by Phixall Facility Management LLC. Licensed, insured, and certified.
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
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
