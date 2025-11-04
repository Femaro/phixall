import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold text-gray-900">Phixall</Link>
        <nav className="hidden gap-6 text-sm text-gray-700 md:flex">
          <Link href="/about" className="hover:text-black">About</Link>
          <Link href="/clients" className="hover:text-black">For Clients</Link>
          <Link href="/artisans" className="hover:text-black">For Artisans</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="rounded-md px-3 py-1.5 text-sm text-gray-900 hover:bg-gray-100">Sign in</Link>
          <Link href="/register" className="rounded-md bg-black px-3 py-1.5 text-sm text-white hover:opacity-90">Get Started</Link>
        </div>
      </div>
    </header>
  );
}


