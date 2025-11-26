import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/app/logo.png';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center">
              <Image src={Logo} alt="Phixall" width={56} height={56} className="drop-shadow-lg" style={{ filter: 'contrast(1.2) brightness(1.1)' }} />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600">
              Professional facility management company connecting clients with skilled artisans nationwide.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">Platform</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/clients" className="text-neutral-600 transition-colors hover:text-brand-600">For Clients</Link></li>
              <li><Link href="/artisans" className="text-neutral-600 transition-colors hover:text-brand-600">For Artisans</Link></li>
              <li><Link href="/api-docs" className="text-neutral-600 transition-colors hover:text-brand-600">API Documentation</Link></li>
              <li><Link href="/about" className="text-neutral-600 transition-colors hover:text-brand-600">About Us</Link></li>
              <li><Link href="/contact" className="text-neutral-600 transition-colors hover:text-brand-600">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">Resources</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/help" className="text-neutral-600 transition-colors hover:text-brand-600">Help Center</Link></li>
              <li><Link href="/services" className="text-neutral-600 transition-colors hover:text-brand-600">Services</Link></li>
              <li><Link href="/careers" className="text-neutral-600 transition-colors hover:text-brand-600">Careers</Link></li>
              <li><Link href="/safety" className="text-neutral-600 transition-colors hover:text-brand-600">Safety</Link></li>
              <li><Link href="/privacy" className="text-neutral-600 transition-colors hover:text-brand-600">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-neutral-600 transition-colors hover:text-brand-600">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">Connect</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href="https://www.linkedin.com/company/phixall/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-600 transition-colors hover:text-brand-600"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/phixall"
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-600 transition-colors hover:text-brand-600"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/phixalltech/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-600 transition-colors hover:text-brand-600"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/phixallng"
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-600 transition-colors hover:text-brand-600"
                >
                  Twitter / X
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-900">Mobile App</h4>
              <div className="flex flex-col gap-2">
                <a
                  href="https://apps.apple.com/app/phixall"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 2.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  App Store
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.phixall.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L6.05,2.66L14.54,11.15L20.16,10.81M17.3,12L6.05,2.66L14.54,11.15L17.3,12Z"/>
                  </svg>
                  Google Play
                </a>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-900">Certifications</h4>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-2.5 py-2 text-[10px] font-medium text-neutral-700 transition-colors hover:border-brand-300 hover:bg-brand-50">
                  <svg className="h-4 w-4 flex-shrink-0 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="truncate">Data Safe</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-2.5 py-2 text-[10px] font-medium text-neutral-700 transition-colors hover:border-brand-300 hover:bg-brand-50">
                  <svg className="h-4 w-4 flex-shrink-0 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="truncate">ISO 27001</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-2.5 py-2 text-[10px] font-medium text-neutral-700 transition-colors hover:border-brand-300 hover:bg-brand-50">
                  <svg className="h-4 w-4 flex-shrink-0 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="truncate">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-center text-sm text-neutral-500 sm:text-left">
              © {new Date().getFullYear()} Phixall Technical Company Limited. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-500">
              <div className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Secure Site</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
                <span>PCI DSS Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


