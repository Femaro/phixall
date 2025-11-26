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
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-200 pt-8">
          <p className="text-center text-sm text-neutral-500">
            © {new Date().getFullYear()} Phixall Technical Company Limited. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}


