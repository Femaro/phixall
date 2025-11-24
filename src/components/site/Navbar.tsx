'use client';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/app/logo.png';
import { useState } from 'react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const services = [
    { name: 'Plumbing', href: '/services#plumbing', icon: '🔧' },
    { name: 'Electrical', href: '/services#electrical', icon: '⚡' },
    { name: 'HVAC', href: '/services#hvac', icon: '❄️' },
    { name: 'Carpentry', href: '/services#carpentry', icon: '🔨' },
    { name: 'Painting', href: '/services#painting', icon: '🎨' },
    { name: 'Plumbing Repairs', href: '/services#plumbing-repairs', icon: '🚰' },
    { name: 'Roofing', href: '/services#roofing', icon: '🏠' },
    { name: 'Landscaping', href: '/services#landscaping', icon: '🌿' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-neutral-200/50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image src={Logo} alt="Phixall" width={56} height={56} className="drop-shadow-lg" style={{ filter: 'contrast(1.2) brightness(1.1)' }} />
        </Link>
        
        <nav className="hidden items-center gap-8 text-[15px] font-medium text-neutral-700 lg:flex">
          <Link href="/about" className="transition-colors hover:text-brand-600">About</Link>
          
          {/* Services Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button className="flex items-center gap-1 transition-colors hover:text-brand-600">
              Services
              <svg className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {servicesOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-neutral-200 bg-white shadow-xl">
                <div className="p-2">
                  {services.map((service) => (
                    <Link
                      key={service.name}
                      href={service.href}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-neutral-700 transition-colors hover:bg-brand-50 hover:text-brand-600"
                    >
                      <span className="text-xl">{service.icon}</span>
                      <span>{service.name}</span>
                    </Link>
                  ))}
                  <div className="mt-2 border-t border-neutral-200 pt-2">
                    <Link
                      href="/subscription"
                      className="flex items-center gap-3 rounded-lg bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-100"
                    >
                      <span className="text-xl">💎</span>
                      <span>Premium Subscriptions</span>
                    </Link>
                    <Link
                      href="/services"
                      className="mt-2 flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-50"
                    >
                      View All Services
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <Link href="/clients" className="transition-colors hover:text-brand-600">For Clients</Link>
          <Link href="/phixers" className="transition-colors hover:text-brand-600">For Phixers</Link>
          <Link href="/contact" className="transition-colors hover:text-brand-600">Contact</Link>
        </nav>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/login" 
            className="hidden rounded-lg px-4 py-2 text-[15px] font-medium text-neutral-700 transition-colors hover:bg-neutral-100 lg:block"
          >
            Sign in
          </Link>
          <Link 
            href="/register" 
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md"
          >
            Get Started
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden rounded-lg p-2 text-neutral-700 hover:bg-neutral-100"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-neutral-200/50 bg-white px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            <Link href="/about" className="rounded-lg px-3 py-2 text-[15px] font-medium text-neutral-700 hover:bg-neutral-100">About</Link>
            
            {/* Mobile Services Dropdown */}
            <div>
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-[15px] font-medium text-neutral-700 hover:bg-neutral-100"
              >
                <span>Services</span>
                <svg className={`h-4 w-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {mobileServicesOpen && (
                <div className="mt-2 ml-3 space-y-1 border-l-2 border-brand-200 pl-4">
                  {services.map((service) => (
                    <Link
                      key={service.name}
                      href={service.href}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-brand-50 hover:text-brand-600"
                    >
                      <span>{service.icon}</span>
                      <span>{service.name}</span>
                    </Link>
                  ))}
                  <Link
                    href="/subscription"
                    className="flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-100"
                  >
                    <span>💎</span>
                    <span>Premium Subscriptions</span>
                  </Link>
                  <Link
                    href="/services"
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-50"
                  >
                    View All Services
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
            
            <Link href="/clients" className="rounded-lg px-3 py-2 text-[15px] font-medium text-neutral-700 hover:bg-neutral-100">For Clients</Link>
            <Link href="/phixers" className="rounded-lg px-3 py-2 text-[15px] font-medium text-neutral-700 hover:bg-neutral-100">For Phixers</Link>
            <Link href="/contact" className="rounded-lg px-3 py-2 text-[15px] font-medium text-neutral-700 hover:bg-neutral-100">Contact</Link>
            <Link href="/login" className="rounded-lg px-3 py-2 text-[15px] font-medium text-neutral-700 hover:bg-neutral-100">Sign in</Link>
          </nav>
        </div>
      )}
    </header>
  );
}



