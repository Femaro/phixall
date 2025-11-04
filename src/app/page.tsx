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
              <a href="/register" className="rounded-md bg-brand-600 px-4 py-2.5 text-white hover:bg-brand-700">Get Started</a>
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

      <section className="border-t border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-semibold text-gray-900">Popular services</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              'Plumbing & Leak Repair',
              'Electrical & Lighting',
              'HVAC & Ventilation',
              'Appliance Installation',
              'Painting & Drywall',
              'Carpentry & Doors',
            ].map((s) => (
              <div key={s} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="font-medium text-gray-900">{s}</p>
                <p className="mt-1 text-sm text-gray-600">Fast response and guaranteed workmanship.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brand-100">
              <p className="text-3xl font-semibold text-brand-700">10k+</p>
              <p className="mt-1 text-gray-600">Jobs completed</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brand-100">
              <p className="text-3xl font-semibold text-brand-700">4.8/5</p>
              <p className="mt-1 text-gray-600">Average rating</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brand-100">
              <p className="text-3xl font-semibold text-brand-700">24/7</p>
              <p className="mt-1 text-gray-600">Support availability</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-semibold text-gray-900">Why choose Phixall</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="font-medium">For Clients</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                <li>Multi-step request forms with media uploads</li>
                <li>Live ETA and map tracking</li>
                <li>Transparent quotes and digital invoices</li>
                <li>Corporate dashboards for multi-site operations</li>
              </ul>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="font-medium">For Artisans</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                <li>Availability toggle and instant job alerts</li>
                <li>Professional quoting tools</li>
                <li>Earnings dashboard and withdrawals</li>
                <li>Training resources and certifications</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-semibold text-gray-900">Coverage</h2>
          <p className="mt-2 max-w-3xl text-gray-700">Nationwide network in major cities with expanding regional coverage. Contact us to confirm availability in your area.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {['Lagos','Abuja','Port Harcourt','Kano','Ibadan','Abeokuta'].map((city) => (
              <div key={city} className="rounded-xl border border-gray-200 bg-white p-4 text-gray-800">
                {city}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-semibold text-gray-900">Testimonials</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { quote: 'Fast response and professional work—highly recommend.', author: 'Facility Manager, Retail' },
              { quote: 'Clear quotes and great communication throughout.', author: 'Property Owner' },
              { quote: 'Reliable artisans and on-time delivery.', author: 'Operations Lead' },
            ].map((t, i) => (
              <div key={i} className="rounded-xl bg-white p-6 shadow-sm">
                <p className="text-gray-800">“{t.quote}”</p>
                <p className="mt-2 text-sm text-gray-600">{t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-semibold text-gray-900">FAQs</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              { q: 'How quickly can I book a service?', a: 'Most requests are confirmed within hours, with same-day options in supported areas.' },
              { q: 'Are artisans vetted?', a: 'Yes. Identity, skills, and track record are verified with ongoing performance reviews.' },
              { q: 'Do you support corporate facilities?', a: 'Yes. We offer multi-location dashboards, approvals, and reporting for enterprises.' },
              { q: 'What payment methods are supported?', a: 'Card payments via secure checkout, with invoices and receipts provided.' },
            ].map((f, i) => (
              <div key={i} className="rounded-xl bg-white p-6 shadow-sm">
                <p className="font-medium text-gray-900">{f.q}</p>
                <p className="mt-1 text-gray-700">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-14 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Ready to get started?</h2>
          <p className="mt-2 text-gray-600">Create your account and request your first service in minutes.</p>
          <a href="/register" className="mt-6 inline-block rounded-md bg-brand-600 px-5 py-2.5 text-white hover:bg-brand-700">Create an account</a>
        </div>
      </section>
    </main>
  );
}
