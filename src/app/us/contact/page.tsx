'use client';

const EMAIL = 'ops@phixall.us';
const PHONE_DISPLAY = '(317) 832-6185';
const PHONE_HREF = 'tel:+13178326185';

export default function USContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-neutral-200 bg-gradient-to-br from-[#1e3a5f] to-[#2c3e50]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white lg:text-5xl">Contact Phixall US</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
              Reach our Indiana operations desk for facility support inquiries. We respond during business hours. Services are available only within Indiana.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Reach us directly</h2>

              <div className="mt-8 space-y-6">
                <div className="rounded-2xl border border-[#3498db]/30 bg-[#3498db]/5 p-6 shadow-sm ring-1 ring-neutral-100">
                  <div className="flex items-start gap-3">
                    <svg className="h-8 w-8 flex-shrink-0 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-neutral-600">Phone</div>
                      <a href={PHONE_HREF} className="text-2xl font-bold text-[#3498db] hover:underline">
                        {PHONE_DISPLAY}
                      </a>
                      <p className="mt-2 text-sm text-neutral-600">
                        Monday–Friday, 8:00 AM – 6:00 PM Eastern.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm ring-1 ring-neutral-100">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-900">
                    <svg className="h-6 w-6 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </h3>
                  <div className="mt-4 text-sm text-neutral-600">
                    <p>
                      <a href={`mailto:${EMAIL}`} className="font-semibold text-[#3498db] hover:underline">
                        {EMAIL}
                      </a>
                    </p>
                    <p className="mt-2 text-xs text-neutral-500">Tell us about your Indiana facility sites and the support you need.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="sticky top-24 rounded-2xl border border-[#3498db]/40 bg-gradient-to-br from-blue-50/80 to-white p-8 shadow-md ring-1 ring-[#3498db]/20">
                <h3 className="text-2xl font-bold tracking-tight text-neutral-900">Need facility support?</h3>
                <p className="mt-4 text-neutral-600">
                  Outline your Indiana facilities and priorities—we will align maintenance support, light repairs, painting, vendor coordination, and materials handling under one desk.
                </p>
                <a
                  href={`mailto:${EMAIL}?subject=${encodeURIComponent('Phixall US facility support inquiry')}`}
                  className="mt-6 block w-full rounded-xl border-2 border-[#3498db] bg-[#3498db] px-6 py-4 text-center text-base font-bold uppercase tracking-wide text-white transition-all hover:bg-[#2980b9]"
                >
                  Reach us now
                </a>

                <div className="mt-8 border-t border-neutral-200 pt-8">
                  <h4 className="font-bold text-neutral-900">Typical turnaround</h4>
                  <ul className="mt-4 space-y-3 text-sm text-neutral-600">
                    <li className="flex items-start gap-2">
                      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#27ae60]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Same-day acknowledgement for emailed requests submitted before 4:00 PM ET
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#27ae60]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Response within two business days once context is clarified
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-neutral-900">Indiana operations</h2>
          <p className="mx-auto mt-3 max-w-3xl text-center text-neutral-600">
            Phixall Facility Management LLC is an Indiana-based facility support company. Our team serves warehouses, logistics centers, and commercial facilities—available only within Indiana.
          </p>
        </div>
      </section>
    </main>
  );
}
