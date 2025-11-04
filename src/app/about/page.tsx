export default function AboutPage() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-3xl font-semibold text-gray-900">About Phixall</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          Phixall Technical Company Limited is a fully automated facility management platform.
          Inspired by industry leaders, we combine service breadth with marketplace efficiency to
          deliver fast, reliable maintenance at scale.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="font-medium">Our Mission</p>
            <p className="mt-1 text-gray-600">Make maintenance reliable, transparent, and fast.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="font-medium">Coverage</p>
            <p className="mt-1 text-gray-600">Multi-city network of skilled professionals.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="font-medium">Quality</p>
            <p className="mt-1 text-gray-600">Ratings, reviews, and guaranteed workmanship.</p>
          </div>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-6">
            <p className="font-medium text-gray-900">What makes us different</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
              <li>Client and Artisan experiences built for speed and clarity</li>
              <li>Live tracking and transparent communications</li>
              <li>Compliance-ready records for corporate facilities</li>
              <li>Performance-backed network of trained professionals</li>
            </ul>
          </div>
          <div className="rounded-xl bg-gray-50 p-6">
            <p className="font-medium text-gray-900">Security & Trust</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
              <li>Secure authentication and role-based access</li>
              <li>Audit trails for quotes, approvals, and payments</li>
              <li>Data privacy aligned with best practices</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="font-medium text-gray-900">Our Story</p>
            <p className="mt-2 text-gray-700">Born from the need for dependable, transparent facility services, Phixall blends technology and trusted professionals to deliver outcomes you can measure.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="font-medium text-gray-900">Values</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
              <li>Reliability: on-time, every time</li>
              <li>Transparency: clear quotes and communication</li>
              <li>Quality: vetted artisans and guaranteed work</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-xl bg-white p-6 shadow-sm">
          <p className="font-medium text-gray-900">Leadership</p>
          <p className="mt-2 text-gray-700">Our leadership team brings experience across facility operations, engineering, and software platforms to scale service excellence.</p>
        </div>
      </section>
    </main>
  );
}


