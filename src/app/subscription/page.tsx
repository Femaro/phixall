'use client';
import { useState } from 'react';
import Link from 'next/link';
import StructuredData from '@/components/seo/StructuredData';
import { generateBreadcrumbSchema } from '@/lib/structuredData';

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Subscriptions', url: '/subscription' },
]);

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      tier: 'bronze',
      name: 'Bronze',
      icon: '🥉',
      color: 'from-amber-600 to-amber-700',
      borderColor: 'border-amber-200',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      price: 25000,
      yearlyPrice: 270000, // 10% discount
      servicesIncluded: [
        'Basic Plumbing Repairs',
        'Electrical Troubleshooting',
        'General Maintenance'
      ],
      benefits: [
        '2 service calls per month',
        'Standard response (24-48 hours)',
        'Basic priority support',
        '5% discount on additional services'
      ],
      popular: false
    },
    {
      tier: 'gold',
      name: 'Gold',
      icon: '🥇',
      color: 'from-yellow-500 to-yellow-600',
      borderColor: 'border-yellow-200',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      price: 50000,
      yearlyPrice: 540000, // 10% discount
      servicesIncluded: [
        'All Bronze services',
        'HVAC Maintenance',
        'Carpentry & Repairs',
        'Painting Touch-ups'
      ],
      benefits: [
        '5 service calls per month',
        'Priority response (12-24 hours)',
        'Priority artisan assignment',
        '10% discount on additional services',
        'Quarterly facility inspection'
      ],
      popular: true
    },
    {
      tier: 'platinum',
      name: 'Platinum',
      icon: '💎',
      color: 'from-purple-600 to-purple-700',
      borderColor: 'border-purple-200',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      price: 100000,
      yearlyPrice: 1080000, // 10% discount
      servicesIncluded: [
        'All Gold services',
        'Roofing Inspections & Repairs',
        'Landscaping & Gardening',
        'Deep Cleaning Services',
        'Emergency Repairs (24/7)'
      ],
      benefits: [
        'Unlimited service calls',
        'Emergency response (2-4 hours)',
        'Dedicated account manager',
        'Premium artisan assignment',
        '20% discount on additional services',
        'Monthly facility inspection',
        'Preventive maintenance planning'
      ],
      popular: false
    }
  ];

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <main className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-brand-50/30">
      {/* Hero Section */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700">
              Premium Subscriptions
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-neutral-900 lg:text-5xl">
              Choose Your Facility Maintenance Plan
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600">
              Subscribe to a premium plan and enjoy hassle-free facility maintenance with predictable monthly costs and priority service.
            </p>

            {/* Billing Toggle */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-neutral-900' : 'text-neutral-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  billingCycle === 'yearly' ? 'bg-brand-600' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-neutral-900' : 'text-neutral-500'}`}>
                Yearly
                <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                  Save 10%
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => {
              const price = billingCycle === 'monthly' ? plan.price : plan.yearlyPrice / 12;
              const totalPrice = billingCycle === 'monthly' ? plan.price : plan.yearlyPrice;
              
              return (
                <div
                  key={plan.tier}
                  className={`relative rounded-2xl border-2 bg-white p-8 shadow-xl transition-all hover:shadow-2xl ${
                    plan.popular ? 'border-brand-600 ring-4 ring-brand-100' : plan.borderColor
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-4 py-1 text-xs font-semibold text-white shadow-lg">
                        ⭐ Most Popular
                      </span>
                    </div>
                  )}

                  {/* Header */}
                  <div className="text-center">
                    <div className="text-5xl">{plan.icon}</div>
                    <h3 className="mt-4 text-2xl font-bold text-neutral-900">{plan.name}</h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-neutral-900">
                        ₦{price.toLocaleString()}
                      </span>
                      <span className="text-neutral-600">/month</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className="mt-2 text-sm text-neutral-500">
                        ₦{totalPrice.toLocaleString()} billed annually
                      </p>
                    )}
                  </div>

                  {/* Services Included */}
                  <div className="mt-8">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                      Services Included
                    </h4>
                    <ul className="mt-4 space-y-3">
                      {plan.servicesIncluded.map((service) => (
                        <li key={service} className="flex items-start gap-3">
                          <svg className="h-5 w-5 flex-shrink-0 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-neutral-700">{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div className="mt-8">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                      Benefits
                    </h4>
                    <ul className="mt-4 space-y-3">
                      {plan.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-3">
                          <svg className="h-5 w-5 flex-shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-neutral-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={`/register?subscription=${plan.tier}`}
                    className={`mt-8 block w-full rounded-lg py-3 text-center text-sm font-semibold shadow-md transition-all hover:shadow-lg ${
                      plan.popular
                        ? 'bg-brand-600 text-white hover:bg-brand-700'
                        : `bg-gradient-to-r ${plan.color} text-white hover:opacity-90`
                    }`}
                  >
                    Subscribe to {plan.name}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="border-t border-neutral-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900">Detailed Comparison</h2>
            <p className="mt-4 text-lg text-neutral-600">
              See all features side by side
            </p>
          </div>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="pb-4 pr-4 text-left text-sm font-semibold text-neutral-900">Feature</th>
                  <th className="px-4 pb-4 text-center text-sm font-semibold text-neutral-900">Bronze</th>
                  <th className="px-4 pb-4 text-center text-sm font-semibold text-neutral-900">Gold</th>
                  <th className="px-4 pb-4 text-center text-sm font-semibold text-neutral-900">Platinum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                <tr>
                  <td className="py-4 pr-4 text-sm text-neutral-700">Service Calls Per Month</td>
                  <td className="px-4 py-4 text-center text-sm text-neutral-900">2</td>
                  <td className="px-4 py-4 text-center text-sm text-neutral-900">5</td>
                  <td className="px-4 py-4 text-center text-sm font-semibold text-green-600">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 text-sm text-neutral-700">Response Time</td>
                  <td className="px-4 py-4 text-center text-sm text-neutral-900">24-48h</td>
                  <td className="px-4 py-4 text-center text-sm text-neutral-900">12-24h</td>
                  <td className="px-4 py-4 text-center text-sm text-neutral-900">2-4h</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 text-sm text-neutral-700">Emergency Services (24/7)</td>
                  <td className="px-4 py-4 text-center">❌</td>
                  <td className="px-4 py-4 text-center">❌</td>
                  <td className="px-4 py-4 text-center">✅</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 text-sm text-neutral-700">Facility Inspections</td>
                  <td className="px-4 py-4 text-center text-sm text-neutral-900">-</td>
                  <td className="px-4 py-4 text-center text-sm text-neutral-900">Quarterly</td>
                  <td className="px-4 py-4 text-center text-sm text-neutral-900">Monthly</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 text-sm text-neutral-700">Dedicated Account Manager</td>
                  <td className="px-4 py-4 text-center">❌</td>
                  <td className="px-4 py-4 text-center">❌</td>
                  <td className="px-4 py-4 text-center">✅</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 text-sm text-neutral-700">Discount on Additional Services</td>
                  <td className="px-4 py-4 text-center text-sm text-neutral-900">5%</td>
                  <td className="px-4 py-4 text-center text-sm text-neutral-900">10%</td>
                  <td className="px-4 py-4 text-center text-sm text-neutral-900">20%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-neutral-200 py-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900">Frequently Asked Questions</h2>
          </div>

          <div className="mt-12 space-y-6">
            {[
              {
                q: 'Can I change my subscription plan?',
                a: 'Yes! You can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades apply at the next billing cycle.'
              },
              {
                q: 'What happens if I exceed my service call limit?',
                a: 'You can still request services, but they will be billed separately at standard rates with your tier discount applied.'
              },
              {
                q: 'Can I cancel my subscription?',
                a: 'Yes, you can cancel anytime. Your access continues until the end of your current billing period with no additional charges.'
              },
              {
                q: 'Are there any setup fees?',
                a: 'No setup fees! You only pay the monthly subscription fee. Your first service call is included in your subscription.'
              },
              {
                q: 'How do emergency services work for Platinum members?',
                a: 'Platinum members get 24/7 emergency response with a guaranteed 2-4 hour arrival time for urgent repairs.'
              }
            ].map((faq, index) => (
              <div key={index} className="rounded-xl border border-neutral-200 bg-white p-6">
                <h3 className="font-semibold text-neutral-900">{faq.q}</h3>
                <p className="mt-2 text-neutral-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-200 bg-gradient-to-br from-brand-600 to-brand-700 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-white lg:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-brand-100">
            Choose a plan and enjoy hassle-free facility maintenance today.
          </p>
          <div className="mt-8">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-brand-600 shadow-lg transition-all hover:bg-neutral-50 hover:shadow-xl"
            >
              Start Your Subscription
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}

