export default function Home() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-5xl">
              Facility management made simple
            </h1>
            <p className="mt-4 text-gray-600">
              Phixall connects facility owners with vetted artisans for fast, reliable services.
              Request, track, and pay—all in one place.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="/register" className="rounded-md bg-black px-4 py-2.5 text-white hover:opacity-90">Get Started</a>
              <a href="/clients" className="rounded-md border border-gray-300 px-4 py-2.5 text-sm hover:bg-gray-50">Learn more</a>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="font-medium">On-demand services</p>
                <p className="mt-1 text-gray-600">Plumbing, electrical, HVAC, and more.</p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="font-medium">Live tracking</p>
                <p className="mt-1 text-gray-600">Realtime ETA and location updates.</p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="font-medium">Secure payments</p>
                <p className="mt-1 text-gray-600">Transparent pricing and receipts.</p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="font-medium">Rated artisans</p>
                <p className="mt-1 text-gray-600">Vetted professionals with reviews.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-semibold text-gray-900">How it works</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="font-medium">1. Request</p>
              <p className="mt-1 text-gray-600">Describe the issue and pick a time.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="font-medium">2. Match</p>
              <p className="mt-1 text-gray-600">We match you with a nearby artisan.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="font-medium">3. Track & pay</p>
              <p className="mt-1 text-gray-600">Live tracking, quotes, and secure checkout.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
