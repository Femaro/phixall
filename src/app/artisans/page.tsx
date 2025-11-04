export default function ArtisansPage() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-3xl font-semibold text-gray-900">For Artisans</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          Your all-in-one business tool: set availability, receive job alerts, quote professionally,
          and track earnings in a modern, simple dashboard.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="font-medium">Availability</p>
            <p className="mt-1 text-gray-600">Go online to receive real-time requests.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="font-medium">Job Notifications</p>
            <p className="mt-1 text-gray-600">Accept or decline with transparent payouts.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="font-medium">Earnings</p>
            <p className="mt-1 text-gray-600">Track cleared funds and request withdrawals.</p>
          </div>
        </div>
        <div className="mt-8">
          <a href="/register" className="rounded-md bg-black px-4 py-2.5 text-white hover:opacity-90">Join as an Artisan</a>
        </div>
      </section>
    </main>
  );
}


