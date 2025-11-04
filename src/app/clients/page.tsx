export default function ClientsPage() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-3xl font-semibold text-gray-900">For Clients</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          Manage maintenance with confidence: request services, approve quotes, track arrivals,
          and pay securely—optimized for both individual and corporate facilities.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="font-medium">Service Requests</p>
            <p className="mt-1 text-gray-600">Multi-step forms, media uploads, and scheduling.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="font-medium">Live Tracking</p>
            <p className="mt-1 text-gray-600">Map view with ETA and status updates.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="font-medium">Payments</p>
            <p className="mt-1 text-gray-600">Transparent quotes and secure checkout.</p>
          </div>
        </div>
        <div className="mt-8">
          <a href="/register" className="rounded-md bg-black px-4 py-2.5 text-white hover:opacity-90">Get Started</a>
        </div>
      </section>
    </main>
  );
}


