'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    {
      name: 'Getting Started',
      icon: '🚀',
      articles: [
        { title: 'How to create an account', content: 'Step-by-step guide to signing up for Phixall' },
        { title: 'Setting up your profile', content: 'Complete your profile for better experience' },
        { title: 'How to request a service', content: 'Learn how to submit your first service request' },
        { title: 'Understanding pricing', content: 'How our pricing and payment system works' },
      ],
    },
    {
      name: 'For Clients',
      icon: '🏢',
      articles: [
        { title: 'How to find the right artisan', content: 'Tips for selecting qualified professionals' },
        { title: 'Tracking your job', content: 'Use real-time GPS tracking to monitor progress' },
        { title: 'Payment and invoicing', content: 'How payments work and accessing invoices' },
        { title: 'Leaving reviews and ratings', content: 'Share your experience to help others' },
        { title: 'Cancellation policy', content: 'When and how you can cancel a service' },
        { title: 'Getting refunds', content: 'Our satisfaction guarantee and refund process' },
      ],
    },
    {
      name: 'For Artisans',
      icon: '🔧',
      articles: [
        { title: 'Applying to become an artisan', content: 'Requirements and application process' },
        { title: 'Accepting and completing jobs', content: 'Best practices for job management' },
        { title: 'Setting your rates', content: 'How to price your services competitively' },
        { title: 'Getting paid', content: 'Payment schedule and withdrawal options' },
        { title: 'Building your reputation', content: 'Tips for earning 5-star reviews' },
        { title: 'Safety guidelines', content: 'Staying safe while on the job' },
      ],
    },
    {
      name: 'Account & Settings',
      icon: '⚙️',
      articles: [
        { title: 'Updating your profile', content: 'How to edit your account information' },
        { title: 'Changing your password', content: 'Steps to reset or update your password' },
        { title: 'Notification settings', content: 'Manage your email and push notifications' },
        { title: 'Privacy settings', content: 'Control what information is visible' },
        { title: 'Deleting your account', content: 'How to permanently close your account' },
      ],
    },
    {
      name: 'Payments & Billing',
      icon: '💳',
      articles: [
        { title: 'Payment methods', content: 'Accepted payment options and how to add them' },
        { title: 'Understanding fees', content: 'Breakdown of service fees and charges' },
        { title: 'Viewing payment history', content: 'Access your transaction records' },
        { title: 'Disputing charges', content: 'How to resolve payment issues' },
        { title: 'Tax documentation', content: 'Accessing receipts and tax forms' },
      ],
    },
    {
      name: 'Safety & Trust',
      icon: '🛡️',
      articles: [
        { title: 'How we verify artisans', content: 'Our vetting and background check process' },
        { title: 'Staying safe during jobs', content: 'Safety tips for clients and artisans' },
        { title: 'Reporting safety concerns', content: 'How to report issues immediately' },
        { title: 'Insurance and liability', content: 'Understanding coverage and protections' },
        { title: 'Emergency support', content: '24/7 emergency hotline information' },
      ],
    },
    {
      name: 'Troubleshooting',
      icon: '🔍',
      articles: [
        { title: 'App is not loading', content: 'Solutions for loading and connection issues' },
        { title: 'Cannot log in', content: 'Troubleshooting login problems' },
        { title: 'Payment failed', content: 'Common payment issues and solutions' },
        { title: 'Not receiving notifications', content: 'Fix notification delivery problems' },
        { title: 'GPS tracking not working', content: 'Enable location services properly' },
      ],
    },
    {
      name: 'Policies & Legal',
      icon: '📄',
      articles: [
        { title: 'Terms of Service', content: 'Our platform rules and guidelines', link: '/terms' },
        { title: 'Privacy Policy', content: 'How we handle your data', link: '/privacy' },
        { title: 'Cancellation policy', content: 'Rules for canceling services' },
        { title: 'Refund policy', content: 'When and how refunds are issued' },
        { title: 'Community guidelines', content: 'Expected behavior on our platform' },
      ],
    },
  ];

  const filteredCategories = selectedCategory
    ? categories.filter((cat) => cat.name === selectedCategory)
    : categories;

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-brand-50/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-neutral-900 lg:text-6xl">
              How Can We
              <span className="text-gradient"> Help You?</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
              Search our knowledge base or browse categories below to find answers to your questions.
            </p>
            <div className="mx-auto mt-8 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-2 border-neutral-300 bg-white px-6 py-4 pr-12 text-neutral-900 placeholder-neutral-400 shadow-soft transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <svg className="absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <h2 className="text-lg font-semibold text-neutral-900">Popular Topics</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              'Getting Started',
              'Payments',
              'Safety',
              'Account Settings',
              'Troubleshooting',
            ].map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedCategory(selectedCategory === topic ? null : topic)}
                className={`border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === topic
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-neutral-300 bg-white text-neutral-700 hover:border-brand-600 hover:text-brand-600'
                }`}
              >
                {topic}
              </button>
            ))}
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-8">
            {filteredCategories.map((category) => (
              <div key={category.name} className="border border-neutral-200 bg-white p-8 shadow-soft">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center bg-brand-100 text-2xl">
                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900">{category.name}</h2>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {category.articles.map((article) => (
                    <Link
                      key={article.title}
                      href={article.link || '#'}
                      className="group border border-neutral-200 bg-neutral-50 p-4 transition-all hover:border-brand-600 hover:bg-white hover:shadow-soft"
                    >
                      <h3 className="font-semibold text-neutral-900 group-hover:text-brand-600">
                        {article.title}
                      </h3>
                      <p className="mt-2 text-sm text-neutral-600">{article.content}</p>
                      <div className="mt-3 flex items-center gap-2 text-sm font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
                        Read more
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
              Still Need Help?
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Our support team is here to assist you 24/7
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: '💬',
                title: 'Live Chat',
                description: 'Chat with our support team in real-time',
                action: 'Start Chat',
                href: '/contact',
              },
              {
                icon: '📧',
                title: 'Email Support',
                description: 'Send us a detailed message',
                action: 'Send Email',
                href: '/contact',
              },
              {
                icon: '📞',
                title: 'Phone Support',
                description: 'Call us for immediate assistance',
                action: 'View Number',
                href: '/contact',
              },
            ].map((option) => (
              <div key={option.title} className="border border-neutral-200 bg-white p-8 text-center shadow-soft">
                <div className="text-5xl">{option.icon}</div>
                <h3 className="mt-6 text-xl font-bold text-neutral-900">{option.title}</h3>
                <p className="mt-3 text-neutral-600">{option.description}</p>
                <Link
                  href={option.href}
                  className="mt-6 inline-block bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-700"
                >
                  {option.action}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}




