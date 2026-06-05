'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { US_CORE_SERVICES } from '@/data/usCoreServices';

export default function USCorporateHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleServicesEnter = () => {
    if (servicesTimeoutRef.current) {
      clearTimeout(servicesTimeoutRef.current);
    }
    setServicesOpen(true);
  };

  const handleServicesLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setServicesOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (servicesTimeoutRef.current) {
        clearTimeout(servicesTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/90 shadow-sm shadow-neutral-900/5 backdrop-blur-md transition-shadow">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/us" className="flex items-center">
              <Image
                src="/us/logo.png?v=2"
                alt="Phixall.us"
                width={1613}
                height={1539}
                className="h-16 w-auto bg-transparent"
                unoptimized
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 lg:flex">
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={handleServicesEnter}
              onMouseLeave={handleServicesLeave}
            >
              <button
                className="flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-neutral-700 transition-colors hover:text-[#3498db]"
              >
                Services
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {servicesOpen && (
                <div
                  className="absolute left-0 top-full z-50 mt-2 max-h-[min(80vh,28rem)] w-[min(100vw-2rem,44rem)] overflow-y-auto rounded-xl border border-neutral-200/80 bg-white/95 shadow-xl shadow-neutral-900/10 ring-1 ring-black/5 backdrop-blur-md"
                >
                  <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-2 sm:gap-2 sm:p-4">
                    {US_CORE_SERVICES.map((service) => (
                      <Link
                        key={service.id}
                        href={service.href}
                        className="rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:border-[#3498db]/30 hover:bg-neutral-50 hover:text-[#3498db]"
                      >
                        <div className="font-bold">{service.navLabel}</div>
                        <div className="text-xs text-neutral-500">{service.navSubtext}</div>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-neutral-200 px-4 py-2.5">
                    <Link href="/us/services" className="text-xs font-semibold uppercase tracking-wide text-[#3498db] hover:underline">
                      View all services
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/us/about" className="text-sm font-semibold uppercase tracking-wide text-neutral-700 transition-colors hover:text-[#3498db]">
              About
            </Link>

            {/* CTA Button */}
            <Link
              href="/us/contact"
              className="border-2 border-[#3498db] bg-[#3498db] px-6 py-2 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-[#2980b9]"
            >
              Reach us now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden"
          >
            <svg className="h-6 w-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-neutral-200 py-4 lg:hidden">
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-sm font-bold uppercase tracking-wider text-neutral-500">Services</div>
                <div className="space-y-2 pl-4">
                  {US_CORE_SERVICES.map((service) => (
                    <Link key={service.id} href={service.href} className="block text-sm text-neutral-700 hover:text-[#3498db]">
                      {service.navLabel}
                    </Link>
                  ))}
                  <Link href="/us/services" className="block text-sm font-semibold text-[#3498db]">All services</Link>
                </div>
              </div>
              
              <Link href="/us/about" className="block text-sm font-semibold text-neutral-700 hover:text-[#3498db]">About</Link>

              <Link
                href="/us/contact"
                className="block border-2 border-[#3498db] bg-[#3498db] px-4 py-3 text-center text-sm font-bold uppercase text-white"
              >
                Reach us now
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
