import Link from 'next/link';

export default function SafetyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-brand-50/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-32">
          <div className="text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center bg-brand-600 text-white">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-neutral-900 lg:text-6xl">
              Safety & Trust
              <span className="text-gradient"> at Phixall</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
              Your safety and security are our top priorities. We have implemented comprehensive measures to ensure safe, reliable experiences for all users.
            </p>
          </div>
        </div>
      </section>

      {/* Core Safety Features */}
      <section className="border-t border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
              How We Keep You Safe
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Multi-layered safety measures for peace of mind
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: '🔍',
                title: 'Thorough Vetting',
                description: 'All artisans undergo identity verification, background checks, skills assessments, and reference checks before joining our platform.',
              },
              {
                icon: '✅',
                title: 'Certification Verification',
                description: 'We verify licenses, certifications, and insurance coverage for all professional trades requiring credentials.',
              },
              {
                icon: '⭐',
                title: 'Ratings & Reviews',
                description: 'Transparent rating system allows users to review past performance and make informed decisions.',
              },
              {
                icon: '📍',
                title: 'Real-Time Tracking',
                description: 'GPS tracking enables you to monitor artisan location and estimated arrival time for added security.',
              },
              {
                icon: '💬',
                title: 'In-App Communication',
                description: 'All communication happens through our platform, creating a documented record for safety and quality assurance.',
              },
              {
                icon: '🔒',
                title: 'Secure Payments',
                description: 'PCI-compliant payment processing with funds held securely until job completion and approval.',
              },
              {
                icon: '📞',
                title: '24/7 Support',
                description: 'Our dedicated safety team is available around the clock to address any concerns or emergencies.',
              },
              {
                icon: '🚨',
                title: 'Emergency Response',
                description: 'Instant access to emergency hotline with direct escalation to our safety team and local authorities if needed.',
              },
              {
                icon: '⚖️',
                title: 'Dispute Resolution',
                description: 'Fair mediation process for resolving conflicts between clients and artisans.',
              },
            ].map((feature) => (
              <div key={feature.title} className="border border-neutral-200 bg-white p-8 shadow-soft">
                <div className="text-5xl">{feature.icon}</div>
                <h3 className="mt-6 text-xl font-bold text-neutral-900">{feature.title}</h3>
                <p className="mt-3 text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Clients */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
            Safety Tips for Clients
          </h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold text-neutral-900">Before the Job</h3>
              <ul className="mt-4 space-y-3">
                {[
                  'Review artisan profiles, ratings, and reviews thoroughly',
                  'Verify artisan credentials and insurance coverage',
                  'Communicate job details clearly through the platform',
                  'Ensure pets are secured and valuable items are stored safely',
                  'Have someone present during the appointment when possible',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-3">
                    <svg className="h-6 w-6 flex-shrink-0 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-900">During the Job</h3>
              <ul className="mt-4 space-y-3">
                {[
                  'Verify artisan identity upon arrival',
                  'Monitor work progress and communicate concerns immediately',
                  'Use in-app messaging for all communication',
                  'Report any safety concerns to our support team',
                  'Trust your instincts—if something feels wrong, contact support',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-3">
                    <svg className="h-6 w-6 flex-shrink-0 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-900">After the Job</h3>
              <ul className="mt-4 space-y-3">
                {[
                  'Inspect work thoroughly before approving payment',
                  'Leave honest, detailed reviews to help other users',
                  'Report any issues or concerns within 48 hours',
                  'Request warranty or guarantee documentation',
                  'Keep all receipts and job documentation',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-3">
                    <svg className="h-6 w-6 flex-shrink-0 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-900">Payment Security</h3>
              <ul className="mt-4 space-y-3">
                {[
                  'Always pay through the Phixall platform',
                  'Never share payment information directly with artisans',
                  'Review invoices carefully before approving payment',
                  'Report any payment irregularities immediately',
                  'Keep digital receipts for your records',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-3">
                    <svg className="h-6 w-6 flex-shrink-0 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* For Artisans */}
      <section className="border-t border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
            Safety Tips for Artisans
          </h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold text-neutral-900">Personal Safety</h3>
              <ul className="mt-4 space-y-3">
                {[
                  'Review job details and location before accepting',
                  'Share your schedule with a trusted contact',
                  'Enable location sharing during active jobs',
                  'Trust your instincts—decline jobs that feel unsafe',
                  'Report any threatening or inappropriate client behavior',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-3">
                    <svg className="h-6 w-6 flex-shrink-0 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-900">Professional Standards</h3>
              <ul className="mt-4 space-y-3">
                {[
                  'Follow all safety regulations and building codes',
                  'Use proper personal protective equipment (PPE)',
                  'Maintain valid insurance coverage',
                  'Communicate clearly about job scope and timeline',
                  'Document work progress with photos',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-3">
                    <svg className="h-6 w-6 flex-shrink-0 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-900">Payment Protection</h3>
              <ul className="mt-4 space-y-3">
                {[
                  'Only accept payment through the Phixall platform',
                  'Document all work with photos and notes',
                  'Provide detailed invoices for transparency',
                  'Report payment disputes immediately',
                  'Never share bank account details with clients',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-3">
                    <svg className="h-6 w-6 flex-shrink-0 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-900">Emergency Situations</h3>
              <ul className="mt-4 space-y-3">
                {[
                  'Contact our 24/7 safety hotline immediately',
                  'Do not confront aggressive or threatening clients',
                  'Leave the premises if you feel unsafe',
                  'Contact local authorities if needed',
                  'Document incidents with photos and notes',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-3">
                    <svg className="h-6 w-6 flex-shrink-0 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="border-t border-neutral-200 bg-brand-50">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center lg:px-8">
          <div className="inline-flex h-16 w-16 items-center justify-center bg-red-600 text-white">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-neutral-900">Emergency Support</h2>
          <p className="mt-4 text-neutral-700">
            If you experience a safety emergency while using our platform, contact us immediately:
          </p>
          <div className="mt-8 space-y-4">
            <div className="border border-neutral-200 bg-white p-6">
              <p className="font-semibold text-neutral-900">24/7 Emergency Hotline</p>
              <p className="mt-2 text-2xl font-bold text-brand-600">+234 XXX XXX XXXX</p>
            </div>
            <div className="border border-neutral-200 bg-white p-6">
              <p className="font-semibold text-neutral-900">Emergency Email</p>
              <p className="mt-2 text-lg text-brand-600">emergency@phixall.com</p>
            </div>
          </div>
          <p className="mt-8 text-sm text-neutral-600">
            For life-threatening emergencies, call local emergency services (Police: 112, Fire: 112) first, then contact us.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-200 bg-gradient-to-br from-brand-600 to-brand-700">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
            Questions About Safety?
          </h2>
          <p className="mt-6 text-lg text-brand-100">
            Our support team is here to help address any safety concerns or questions.
          </p>
          <div className="mt-8">
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 bg-white px-8 py-4 text-base font-semibold text-brand-600 shadow-lg transition-all hover:bg-neutral-50 hover:shadow-xl"
            >
              Contact Support
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}




