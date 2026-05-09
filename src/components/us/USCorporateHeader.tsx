'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import Logo from '@/app/logo.png';

export default function USCorporateHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const industriesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleIndustriesEnter = () => {
    if (industriesTimeoutRef.current) {
      clearTimeout(industriesTimeoutRef.current);
    }
    setIndustriesOpen(true);
  };

  const handleIndustriesLeave = () => {
    industriesTimeoutRef.current = setTimeout(() => {
      setIndustriesOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (servicesTimeoutRef.current) {
        clearTimeout(servicesTimeoutRef.current);
      }
      if (industriesTimeoutRef.current) {
        clearTimeout(industriesTimeoutRef.current);
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
              <Image src={Logo} alt="Phixall" width={64} height={64} />
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
                    <Link href="/us/services/electrical" className="rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:border-[#3498db]/30 hover:bg-neutral-50 hover:text-[#3498db]">
                      <div className="font-bold">Electrical Services</div>
                      <div className="text-xs text-neutral-500">Power, lighting, backup systems</div>
                    </Link>
                    <Link href="/us/services/plumbing" className="rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:border-[#3498db]/30 hover:bg-neutral-50 hover:text-[#3498db]">
                      <div className="font-bold">Plumbing Services</div>
                      <div className="text-xs text-neutral-500">Industrial plumbing, piping</div>
                    </Link>
                    <Link href="/us/services/carpentry" className="rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:border-[#3498db]/30 hover:bg-neutral-50 hover:text-[#3498db]">
                      <div className="font-bold">Carpentry Services</div>
                      <div className="text-xs text-neutral-500">Shelving, docks, woodwork</div>
                    </Link>
                    <Link href="/us/services/painting" className="rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:border-[#3498db]/30 hover:bg-neutral-50 hover:text-[#3498db]">
                      <div className="font-bold">Painting Services</div>
                      <div className="text-xs text-neutral-500">Coatings, markings, finishes</div>
                    </Link>
                    <Link href="/us/services/supplies" className="rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:border-[#3498db]/30 hover:bg-neutral-50 hover:text-[#3498db]">
                      <div className="font-bold">Installation Item Supplies</div>
                      <div className="text-xs text-neutral-500">MRO, equipment parts</div>
                    </Link>
                    <Link href="/us/services/advisory" className="rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:border-[#3498db]/30 hover:bg-neutral-50 hover:text-[#3498db]">
                      <div className="font-bold">Facility Management Advisory</div>
                      <div className="text-xs text-neutral-500">Optimization, compliance</div>
                    </Link>
                    <Link href="/us/services/engineering-project-management-support" className="rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:border-[#3498db]/30 hover:bg-neutral-50 hover:text-[#3498db]">
                      <div className="font-bold">Eng. Project Management Support</div>
                      <div className="text-xs text-neutral-500">Schedules, governance, turnover</div>
                    </Link>
                    <Link href="/us/services/controls-and-automation" className="rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:border-[#3498db]/30 hover:bg-neutral-50 hover:text-[#3498db]">
                      <div className="font-bold">Controls &amp; Automation</div>
                      <div className="text-xs text-neutral-500">PLC-adjacent, panels, OT/IT edges</div>
                    </Link>
                  </div>
                  <div className="border-t border-neutral-200 px-4 py-2.5">
                    <Link href="/us/services" className="text-xs font-semibold uppercase tracking-wide text-[#3498db] hover:underline">
                      View all services
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Industries Dropdown */}
            <div 
              className="relative"
              onMouseEnter={handleIndustriesEnter}
              onMouseLeave={handleIndustriesLeave}
            >
              <button
                className="flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-neutral-700 transition-colors hover:text-[#3498db]"
              >
                Industries
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {industriesOpen && (
                <div
                  className="absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-neutral-200/80 bg-white/95 shadow-xl shadow-neutral-900/10 ring-1 ring-black/5 backdrop-blur-md"
                >
                  <div className="grid gap-1 p-4">
                    <Link href="/us/industries/ecommerce" className="block px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:text-[#3498db]">E-Commerce Warehouses</Link>
                    <Link href="/us/industries/logistics" className="block px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:text-[#3498db]">Logistics & 3PL</Link>
                    <Link href="/us/industries/manufacturing" className="block px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:text-[#3498db]">Manufacturing</Link>
                    <Link href="/us/industries/cold-storage" className="block px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:text-[#3498db]">Cold Storage</Link>
                    <Link href="/us/industries/retail-distribution" className="block px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:text-[#3498db]">Retail Distribution</Link>
                    <Link href="/us/industries/food-beverage" className="block px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:text-[#3498db]">Food & Beverage</Link>
                    <Link href="/us/industries/pharmaceutical" className="block px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:text-[#3498db]">Pharmaceutical</Link>
                    <Link href="/us/industries/automotive-parts" className="block px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:text-[#3498db]">Automotive Parts</Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/us/about" className="text-sm font-semibold uppercase tracking-wide text-neutral-700 transition-colors hover:text-[#3498db]">
              About
            </Link>
            
            <Link href="/us/contact" className="text-sm font-semibold uppercase tracking-wide text-neutral-700 transition-colors hover:text-[#3498db]">
              Contact
            </Link>

            {/* CTA Button */}
            <Link
              href="/us/request-quote"
              className="border-2 border-[#3498db] bg-[#3498db] px-6 py-2 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-[#2980b9]"
            >
              Request Quote
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
                  <Link href="/us/services/electrical" className="block text-sm text-neutral-700 hover:text-[#3498db]">Electrical Services</Link>
                  <Link href="/us/services/plumbing" className="block text-sm text-neutral-700 hover:text-[#3498db]">Plumbing Services</Link>
                  <Link href="/us/services/carpentry" className="block text-sm text-neutral-700 hover:text-[#3498db]">Carpentry Services</Link>
                  <Link href="/us/services/painting" className="block text-sm text-neutral-700 hover:text-[#3498db]">Painting Services</Link>
                  <Link href="/us/services/supplies" className="block text-sm text-neutral-700 hover:text-[#3498db]">Installation Item Supplies</Link>
                  <Link href="/us/services/advisory" className="block text-sm text-neutral-700 hover:text-[#3498db]">Facility Management Advisory</Link>
                  <Link href="/us/services/engineering-project-management-support" className="block text-sm text-neutral-700 hover:text-[#3498db]">Eng. Project Management Support</Link>
                  <Link href="/us/services/controls-and-automation" className="block text-sm text-neutral-700 hover:text-[#3498db]">Controls &amp; Automation</Link>
                  <Link href="/us/services" className="block text-sm font-semibold text-[#3498db]">All services</Link>
                </div>
              </div>
              
              <Link href="/us/about" className="block text-sm font-semibold text-neutral-700 hover:text-[#3498db]">About</Link>
              <Link href="/us/contact" className="block text-sm font-semibold text-neutral-700 hover:text-[#3498db]">Contact</Link>
              
              <Link
                href="/us/request-quote"
                className="block border-2 border-[#3498db] bg-[#3498db] px-4 py-3 text-center text-sm font-bold uppercase text-white"
              >
                Request Quote
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
