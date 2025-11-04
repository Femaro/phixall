export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-600">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p>© {new Date().getFullYear()} Phixall Technical Company Limited</p>
          <div className="flex items-center gap-4">
            <a href="/about" className="hover:text-brand-700">About</a>
            <a href="/clients" className="hover:text-brand-700">Clients</a>
            <a href="/artisans" className="hover:text-brand-700">Artisans</a>
            <a href="/contact" className="hover:text-brand-700">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}


