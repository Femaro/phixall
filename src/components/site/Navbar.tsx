import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Phixall" width={28} height={28} />
          <span className="font-semibold text-gray-900">Phixall</span>
        </Link>
        <nav className="hidden gap-6 text-sm text-gray-700 md:flex">
          <Link href="/about" className="hover:text-brand-700">About</Link>
          <Link href="/clients" className="hover:text-brand-700">For Clients</Link>
          <Link href="/artisans" className="hover:text-brand-700">For Artisans</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="rounded-md px-3 py-1.5 text-sm text-gray-900 hover:bg-gray-100">Sign in</Link>
          <Link href="/register" className="rounded-md bg-brand-600 px-3 py-1.5 text-sm text-white hover:bg-brand-700">Get Started</Link>
        </div>
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700" />
    </header>
  );
}


