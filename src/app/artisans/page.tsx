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
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-6">
            <p className="font-medium text-gray-900">Grow your business</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
              <li>Consistent job pipeline</li>
              <li>Professional quotes and invoicing</li>
              <li>Training resources and certifications</li>
            </ul>
          </div>
          <div className="rounded-xl bg-gray-50 p-6">
            <p className="font-medium text-gray-900">Fair, transparent payouts</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
              <li>Clear commission and fees</li>
              <li>On-time payments</li>
              <li>Track earnings and history</li>
            </ul>
          </div>
        </div>
        <div className="mt-10">
          <a href="/register" className="rounded-md bg-brand-600 px-4 py-2.5 text-white hover:bg-brand-700">Join as an Artisan</a>
        </div>
      </section>
    </main>
  );
}


