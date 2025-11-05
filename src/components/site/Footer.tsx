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
              Professional facility management connecting clients with skilled artisans nationwide.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">Platform</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/clients" className="text-neutral-600 transition-colors hover:text-brand-600">For Clients</Link></li>
              <li><Link href="/artisans" className="text-neutral-600 transition-colors hover:text-brand-600">For Artisans</Link></li>
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
              <li><a href="#" className="text-neutral-600 transition-colors hover:text-brand-600">Twitter</a></li>
              <li><a href="#" className="text-neutral-600 transition-colors hover:text-brand-600">LinkedIn</a></li>
              <li><a href="#" className="text-neutral-600 transition-colors hover:text-brand-600">Instagram</a></li>
              <li><a href="#" className="text-neutral-600 transition-colors hover:text-brand-600">Facebook</a></li>
            </ul>
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


