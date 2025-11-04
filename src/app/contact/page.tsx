export default function ContactPage() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-3xl font-semibold text-gray-900">Contact</h1>
        <p className="mt-4 max-w-3xl text-gray-700">Have a question or want to chat about your facility needs? Send a message and our team will respond promptly.</p>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <form className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input className="mt-1 w-full rounded-md border border-gray-300 p-2.5" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" className="mt-1 w-full rounded-md border border-gray-300 p-2.5" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea rows={5} className="mt-1 w-full rounded-md border border-gray-300 p-2.5" placeholder="How can we help?" />
              </div>
              <button className="rounded-md bg-brand-600 px-4 py-2.5 text-white hover:bg-brand-700" type="button">Send</button>
            </div>
          </form>
          <div className="rounded-xl bg-gray-50 p-6">
            <p className="font-medium text-gray-900">Contact details</p>
            <ul className="mt-2 space-y-2 text-sm text-gray-700">
              <li>Email: support@phixall.com</li>
              <li>Phone: +234 000 000 0000</li>
              <li>Hours: 24/7</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}


