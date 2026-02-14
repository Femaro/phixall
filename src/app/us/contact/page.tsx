'use client';

import Link from 'next/link';

export default function USContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-neutral-200 bg-gradient-to-br from-[#1e3a5f] to-[#2c3e50]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white lg:text-5xl">Contact Enterprise Sales</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
              Get in touch with our enterprise facility management team. We're here to help 24/7.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Methods */}
            <div>
              <h2 className="text-3xl font-bold text-neutral-900">Get In Touch</h2>
              <p className="mt-4 text-lg text-neutral-600">
                Our enterprise sales and support teams are available around the clock to discuss your facility management needs.
              </p>

              <div className="mt-8 space-y-6">
                {/* Emergency Line */}
                <div className="border-4 border-[#e67e22] bg-orange-50 p-6">
                  <div className="flex items-center gap-3">
                    <svg className="h-8 w-8 text-[#e67e22]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-neutral-600">24/7 Emergency Hotline</div>
                      <a href="tel:1-800-PHIXALL" className="text-2xl font-bold text-[#e67e22] hover:underline">1-800-PHIXALL</a>
                    </div>
                  </div>
                </div>

                {/* Enterprise Sales */}
                <div className="border-2 border-neutral-200 bg-white p-6">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-900">
                    <svg className="h-6 w-6 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Enterprise Sales
                  </h3>
                  <div className="mt-4 space-y-2 text-sm text-neutral-600">
                    <p><strong>Phone:</strong> <a href="tel:1-800-749-2551" className="text-[#3498db] hover:underline">1-800-749-2551</a></p>
                    <p><strong>Email:</strong> <a href="mailto:enterprise@phixall.com" className="text-[#3498db] hover:underline">enterprise@phixall.com</a></p>
                    <p><strong>Hours:</strong> Monday-Friday, 8:00 AM - 6:00 PM EST</p>
                  </div>
                </div>

                {/* General Inquiries */}
                <div className="border-2 border-neutral-200 bg-white p-6">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-900">
                    <svg className="h-6 w-6 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    General Inquiries
                  </h3>
                  <div className="mt-4 space-y-2 text-sm text-neutral-600">
                    <p><strong>Email:</strong> <a href="mailto:info@phixall.com" className="text-[#3498db] hover:underline">info@phixall.com</a></p>
                    <p><strong>Support:</strong> <a href="mailto:support@phixall.com" className="text-[#3498db] hover:underline">support@phixall.com</a></p>
                  </div>
                </div>

                {/* Corporate Headquarters */}
                <div className="border-2 border-neutral-200 bg-white p-6">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-900">
                    <svg className="h-6 w-6 text-[#3498db]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    Corporate Headquarters
                  </h3>
                  <div className="mt-4 space-y-2 text-sm text-neutral-600">
                    <p><strong>Phixall Facility Management LLC</strong></p>
                    <p>United States</p>
                    <p><strong>Business Hours:</strong> Monday-Friday, 8:00 AM - 6:00 PM EST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Request Quote CTA */}
            <div>
              <div className="sticky top-24 border-2 border-[#3498db] bg-blue-50/50 p-8">
                <h3 className="text-2xl font-bold text-neutral-900">Request a Custom Quote</h3>
                <p className="mt-4 text-neutral-600">
                  Fill out our enterprise quote form and receive a customized facility management solution within 24 hours.
                </p>
                <Link 
                  href="/us/request-quote"
                  className="mt-6 block w-full border-2 border-[#3498db] bg-[#3498db] px-6 py-4 text-center text-base font-bold uppercase text-white transition-all hover:bg-[#2980b9]"
                >
                  Request Enterprise Quote
                </Link>

                <div className="mt-8 border-t border-neutral-300 pt-8">
                  <h4 className="font-bold text-neutral-900">What to Expect</h4>
                  <ul className="mt-4 space-y-3 text-sm text-neutral-600">
                    <li className="flex items-start gap-2">
                      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#27ae60]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Response within 24 hours
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#27ae60]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Dedicated account manager
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#27ae60]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Custom solution design
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#27ae60]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Transparent pricing
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#27ae60]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      On-site assessment available
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Offices */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-neutral-900">Regional Service Centers</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-neutral-600">
            With service centers across all 50 states, we provide fast local response with nationwide consistency.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { region: 'Northeast', states: 'NY, NJ, PA, CT, MA, ME, NH, VT, RI' },
              { region: 'Southeast', states: 'FL, GA, NC, SC, VA, TN, AL, MS, LA' },
              { region: 'Midwest', states: 'IL, OH, MI, IN, WI, MN, MO, IA, KS' },
              { region: 'Southwest', states: 'TX, AZ, NM, OK, AR' },
              { region: 'West', states: 'CA, OR, WA, NV, UT, CO' },
              { region: 'Northwest', states: 'ID, MT, WY, ND, SD' },
              { region: 'Mid-Atlantic', states: 'MD, DE, WV, DC' },
              { region: 'Pacific', states: 'HI, AK' }
            ].map((region) => (
              <div key={region.region} className="border-2 border-neutral-200 bg-white p-6">
                <h3 className="font-bold text-neutral-900">{region.region}</h3>
                <p className="mt-2 text-xs text-neutral-600">{region.states}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
