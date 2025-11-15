import Link from 'next/link';

export const metadata = {
  title: 'API Documentation | Phixall',
  description:
    'Learn how to integrate with the Phixall platform. Discover authentication, endpoints, and best practices for building on top of our facility management services.',
};

type EndpointField = {
  field: string;
  type: string;
  note: string;
  required?: boolean;
};

type EndpointParam = {
  field: string;
  type: string;
  note: string;
};

type EndpointDefinition = {
  name: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  body?: EndpointField[];
  params?: EndpointParam[];
};

const endpoints: EndpointDefinition[] = [
  {
    name: 'Create Service Request',
    method: 'POST',
    path: '/v1/requests',
    description: 'Create a new maintenance/service request on behalf of a client.',
    body: [
      { field: 'clientId', type: 'string', required: true, note: 'Phixall client ID' },
      { field: 'title', type: 'string', required: true, note: 'Short summary of the request' },
      { field: 'description', type: 'string', required: true, note: 'Detailed description' },
      { field: 'category', type: 'string', required: true, note: 'plumbing | electrical | hvac | carpentry | cleaning | custom' },
      { field: 'scheduledAt', type: 'ISO8601 string', required: false, note: 'Optional preferred time' },
      { field: 'location', type: 'object', required: true, note: '{ address, city, state, lat, lng }' },
    ],
  },
  {
    name: 'List Requests',
    method: 'GET',
    path: '/v1/requests',
    description: 'Retrieve paginated requests filtered by status or client.',
    params: [
      { field: 'status', type: 'string', note: 'requested | accepted | in-progress | completed' },
      { field: 'clientId', type: 'string', note: 'Filter by client' },
      { field: 'page', type: 'number', note: 'Defaults to 1' },
      { field: 'pageSize', type: 'number', note: 'Defaults to 20, max 100' },
    ],
  },
  {
    name: 'Update Request Status',
    method: 'PATCH',
    path: '/v1/requests/{requestId}',
    description: 'Update the status of an existing request, assign an artisan, or attach verification data.',
    body: [
      { field: 'status', type: 'string', note: 'accepted | in-progress | completed | cancelled' },
      { field: 'artisanId', type: 'string', note: 'Optional artisan assignment' },
      { field: 'verification', type: 'object', note: '{ completedBy, notes, attachments }' },
    ],
  },
  {
    name: 'Wallet Snapshot',
    method: 'GET',
    path: '/v1/wallets/{userId}',
    description: 'Returns current wallet balance, credits, and pending payouts for a user.',
  },
];

const environments = [
  {
    label: 'Production',
    baseUrl: 'https://api.phixall.com',
    description: 'Live environment for real clients and artisans.',
  },
  {
    label: 'Sandbox',
    baseUrl: 'https://sandbox-api.phixall.com',
    description: 'Use this for testing. Data resets every Sunday at 00:00 GMT.',
  },
];

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="relative overflow-hidden border-b border-neutral-200 bg-white">
        <div className="absolute inset-0 opacity-40 blur-3xl" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, rgba(255,255,255,0) 60%)' }} />
        <div className="relative mx-auto max-w-5xl px-6 py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">API DOCUMENTATION</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-neutral-900 lg:text-5xl">
            Build on the Phixall platform.
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-neutral-600">
            Use our REST API to create service requests, monitor artisan activity, synchronize wallets, and automate your facility
            operations workflows. This guide covers environments, authentication, and the core endpoints you need to get started.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="mailto:api@phixall.com"
              className="inline-flex items-center rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 hover:shadow-glow"
            >
              Request API Access
            </a>
            <Link
              href="/help"
              className="inline-flex items-center rounded-lg border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50"
            >
              View Help Center
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 py-12 lg:grid-cols-2 lg:px-8">
          {environments.map((env) => (
            <div key={env.label} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{env.label}</p>
              <div className="mt-3 rounded-lg bg-white px-4 py-3 font-mono text-sm text-neutral-900 shadow-inner">
                {env.baseUrl}
              </div>
              <p className="mt-4 text-sm text-neutral-600">{env.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft">
              <h2 className="text-lg font-semibold text-neutral-900">Authentication</h2>
              <p className="mt-3 text-sm text-neutral-600">
                Authenticate every request using your secret API key via the <code className="rounded bg-neutral-100 px-1 py-0.5">Authorization</code>{' '}
                header.
              </p>
              <pre className="mt-4 rounded-xl bg-neutral-900 p-4 text-xs text-neutral-100 shadow-inner">
{`GET /v1/requests HTTP/1.1
Host: api.phixall.com
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json`}
              </pre>
              <p className="mt-4 text-xs text-neutral-500">
                For server-to-server integrations, rotate keys every 90 days and store them securely (e.g., Vault, AWS Secrets Manager).
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft">
              <h2 className="text-lg font-semibold text-neutral-900">Webhooks</h2>
              <p className="mt-3 text-sm text-neutral-600">
                Receive real-time notifications when a request status changes, an artisan starts a job, or a wallet payout clears.
              </p>
              <ul className="mt-4 space-y-3 text-sm text-neutral-600">
                <li><span className="font-semibold text-neutral-900">request.updated</span> — Every status update and assignment change.</li>
                <li><span className="font-semibold text-neutral-900">wallet.payout.created</span> — When a payout is initiated.</li>
                <li><span className="font-semibold text-neutral-900">wallet.payout.settled</span> — When a payout succeeds.</li>
              </ul>
              <p className="mt-4 text-xs text-neutral-500">Use the <code className="rounded bg-neutral-100 px-1 py-0.5">X-Phixall-Signature</code> header to verify webhook authenticity.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
          <div className="space-y-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Core Endpoints</p>
              <h2 className="mt-2 text-3xl font-bold text-neutral-900">Requests & Wallets</h2>
              <p className="mt-3 text-neutral-600">
                These are the most commonly used endpoints for facility management workflows.
              </p>
            </div>

            <div className="space-y-6">
              {endpoints.map((endpoint) => (
                <div key={endpoint.name} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase text-brand-700">
                      {endpoint.method}
                    </span>
                    <code className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">{endpoint.path}</code>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-neutral-900">{endpoint.name}</h3>
                  <p className="mt-1 text-sm text-neutral-600">{endpoint.description}</p>

                  {endpoint.params && (
                    <div className="mt-4 rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Query Parameters</p>
                      <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                        {endpoint.params.map((param) => (
                          <li key={param.field}>
                            <span className="font-semibold text-neutral-900">{param.field}</span> — {param.note} ({param.type})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {endpoint.body && (
                    <div className="mt-4 rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Request Body</p>
                      <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                        {endpoint.body.map((field) => (
                          <li key={field.field}>
                            <span className="font-semibold text-neutral-900">{field.field}</span>
                            {field.required ? <span className="ml-2 rounded bg-red-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-red-700">Required</span> : null}{' '}
                            — {field.note} ({field.type})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-purple-50 p-8 shadow-glow">
            <div className="flex flex-col gap-4 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Need more?</p>
                <h3 className="mt-2 text-2xl font-bold text-neutral-900">Enterprise & Partner Integrations</h3>
                <p className="mt-2 text-sm text-neutral-700">
                  Let us know if you need premium webhooks, SLA-backed response windows, or custom scopes. Our platform team will set up a discovery call within 1 business day.
                </p>
              </div>
              <div>
                <a
                  href="mailto:partners@phixall.com"
                  className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-neutral-800"
                >
                  Email partners@phixall.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

