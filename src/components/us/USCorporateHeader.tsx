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
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white shadow-sm">
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
                  className="absolute left-0 top-full mt-2 w-80 border border-neutral-200 bg-white shadow-xl"
                >
                  <div className="grid gap-1 p-4">
                    <Link href="/us/services/commercial" className="block border-l-4 border-transparent px-4 py-3 text-sm font-medium text-neutral-700 transition-all hover:border-[#3498db] hover:bg-neutral-50 hover:text-[#3498db]">
                      <div className="font-bold">Commercial Facilities</div>
                      <div className="text-xs text-neutral-500">Office Buildings, Retail, Corporate</div>
                    </Link>
                    <Link href="/us/services/warehouse-industrial" className="block border-l-4 border-transparent px-4 py-3 text-sm font-medium text-neutral-700 transition-all hover:border-[#3498db] hover:bg-neutral-50 hover:text-[#3498db]">
                      <div className="font-bold">Warehouse & Industrial</div>
                      <div className="text-xs text-neutral-500">Distribution, Manufacturing, Cold Storage</div>
                    </Link>
                    <Link href="/us/services/residential" className="block border-l-4 border-transparent px-4 py-3 text-sm font-medium text-neutral-700 transition-all hover:border-[#3498db] hover:bg-neutral-50 hover:text-[#3498db]">
                      <div className="font-bold">Residential Properties</div>
                      <div className="text-xs text-neutral-500">Multi-Family, Condos, Senior Living</div>
                    </Link>
                    <Link href="/us/services/offshore-marine" className="block border-l-4 border-transparent px-4 py-3 text-sm font-medium text-neutral-700 transition-all hover:border-[#3498db] hover:bg-neutral-50 hover:text-[#3498db]">
                      <div className="font-bold">Offshore & Marine</div>
                      <div className="text-xs text-neutral-500">Ports, Maritime, Offshore Platforms</div>
                    </Link>
                    <Link href="/us/services/hvac-mechanical" className="block border-l-4 border-transparent px-4 py-3 text-sm font-medium text-neutral-700 transition-all hover:border-[#3498db] hover:bg-neutral-50 hover:text-[#3498db]">
                      <div className="font-bold">HVAC & Mechanical</div>
                      <div className="text-xs text-neutral-500">Climate Control, Energy Management</div>
                    </Link>
                    <Link href="/us/services/electrical-power" className="block border-l-4 border-transparent px-4 py-3 text-sm font-medium text-neutral-700 transition-all hover:border-[#3498db] hover:bg-neutral-50 hover:text-[#3498db]">
                      <div className="font-bold">Electrical & Power</div>
                      <div className="text-xs text-neutral-500">Power Systems, Backup, Distribution</div>
                    </Link>
                    <Link href="/us/services/plumbing-water" className="block border-l-4 border-transparent px-4 py-3 text-sm font-medium text-neutral-700 transition-all hover:border-[#3498db] hover:bg-neutral-50 hover:text-[#3498db]">
                      <div className="font-bold">Plumbing & Water</div>
                      <div className="text-xs text-neutral-500">Water Systems, Treatment, Wastewater</div>
                    </Link>
                    <Link href="/us/services/fire-safety" className="block border-l-4 border-transparent px-4 py-3 text-sm font-medium text-neutral-700 transition-all hover:border-[#3498db] hover:bg-neutral-50 hover:text-[#3498db]">
                      <div className="font-bold">Fire Safety & Suppression</div>
                      <div className="text-xs text-neutral-500">Fire Alarms, Sprinklers, Compliance</div>
                    </Link>
                    <Link href="/us/services/supplies-procurement" className="block border-l-4 border-transparent px-4 py-3 text-sm font-medium text-neutral-700 transition-all hover:border-[#3498db] hover:bg-neutral-50 hover:text-[#3498db]">
                      <div className="font-bold">Supplies & Procurement</div>
                      <div className="text-xs text-neutral-500">MRO Supplies, Vendor Management</div>
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
                  className="absolute left-0 top-full mt-2 w-64 border border-neutral-200 bg-white shadow-xl"
                >
                  <div className="grid gap-1 p-4">
                    <Link href="/us/industries/healthcare" className="block px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:text-[#3498db]">Healthcare</Link>
                    <Link href="/us/industries/education" className="block px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:text-[#3498db]">Education</Link>
                    <Link href="/us/industries/manufacturing" className="block px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:text-[#3498db]">Manufacturing</Link>
                    <Link href="/us/industries/retail" className="block px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:text-[#3498db]">Retail</Link>
                    <Link href="/us/industries/logistics" className="block px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:text-[#3498db]">Logistics</Link>
                    <Link href="/us/industries/hospitality" className="block px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:text-[#3498db]">Hospitality</Link>
                    <Link href="/us/industries/government" className="block px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:text-[#3498db]">Government</Link>
                    <Link href="/us/industries/technology" className="block px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:text-[#3498db]">Technology</Link>
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
                  <Link href="/us/services/commercial" className="block text-sm text-neutral-700 hover:text-[#3498db]">Commercial Facilities</Link>
                  <Link href="/us/services/warehouse-industrial" className="block text-sm text-neutral-700 hover:text-[#3498db]">Warehouse & Industrial</Link>
                  <Link href="/us/services/residential" className="block text-sm text-neutral-700 hover:text-[#3498db]">Residential Properties</Link>
                  <Link href="/us/services/offshore-marine" className="block text-sm text-neutral-700 hover:text-[#3498db]">Offshore & Marine</Link>
                  <Link href="/us/services/hvac-mechanical" className="block text-sm text-neutral-700 hover:text-[#3498db]">HVAC & Mechanical</Link>
                  <Link href="/us/services/electrical-power" className="block text-sm text-neutral-700 hover:text-[#3498db]">Electrical & Power</Link>
                  <Link href="/us/services/plumbing-water" className="block text-sm text-neutral-700 hover:text-[#3498db]">Plumbing & Water</Link>
                  <Link href="/us/services/fire-safety" className="block text-sm text-neutral-700 hover:text-[#3498db]">Fire Safety</Link>
                  <Link href="/us/services/supplies-procurement" className="block text-sm text-neutral-700 hover:text-[#3498db]">Supplies & Procurement</Link>
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

      {/* Emergency Banner */}
      <div className="border-t border-[#e67e22] bg-[#e67e22] px-6 py-2 text-center">
        <a href="tel:1-800-PHIXALL" className="inline-flex items-center gap-2 text-sm font-bold text-white hover:underline">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          24/7 Emergency Service: 1-800-PHIXALL
        </a>
      </div>
    </header>
  );
}
