export default function AboutPage() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-3xl font-semibold text-gray-900">About Phixall</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          Phixall Technical Company Limited is a fully automated facility management platform.
          We connect facility owners with vetted artisans to manage requests, quotes, tracking,
          and payments in one seamless web experience.
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
      </section>
    </main>
  );
}


