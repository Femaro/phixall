'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';
import StructuredData from '@/components/seo/StructuredData';
import { organizationSchema, generateBreadcrumbSchema } from '@/lib/structuredData';

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Careers', url: '/careers' },
]);

const jobPostingSchema = {
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: 'Administrative Staff (Full-Time)',
  description: 'Phixall is looking for a highly organized and proactive Administrative Staff member to support day-to-day operations, ensuring seamless coordination between clients, Phixers, and company leadership.',
  identifier: {
    '@type': 'PropertyValue',
    name: 'Phixall',
    value: 'ADMIN-STAFF-001',
  },
  datePosted: '2025-11-24',
  employmentType: 'FULL_TIME',
  hiringOrganization: {
    '@type': 'Organization',
    name: 'Phixall',
    sameAs: 'https://www.phixall.com',
  },
  jobLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NG',
      addressLocality: 'Remote/Hybrid',
    },
  },
  baseSalary: {
    '@type': 'MonetaryAmount',
    currency: 'NGN',
  },
  workHours: 'Full-Time',
};

export default function CareersPage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/careers/apply', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Application submitted successfully!' });
        (e.target as HTMLFormElement).reset();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to submit application. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again or contact us directly.' });
    } finally {
      setSubmitting(false);
    }
  };

  const jobPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: 'Administrative Staff (Full-Time)',
    description: 'Phixall is looking for a highly organized and proactive Administrative Staff member to support day-to-day operations, ensuring seamless coordination between clients, Phixers, and company leadership.',
    identifier: {
      '@type': 'PropertyValue',
      name: 'Phixall',
      value: 'ADMIN-STAFF-001',
    },
    datePosted: '2025-11-24',
    employmentType: 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Phixall',
      sameAs: 'https://www.phixall.com',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'NG',
        addressLocality: 'Remote/Hybrid',
      },
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'NGN',
    },
    workHours: 'Full-Time',
  };

  return (
    <>
      <StructuredData data={[organizationSchema, breadcrumbSchema, jobPostingSchema]} />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-brand-50/30">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-32">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
                Join Our Team
              </div>
              <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-neutral-900 lg:text-6xl">
                Build the Future of
                <span className="text-gradient"> Facility Management</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
                Join Phixall and help revolutionize how Africa manages facilities. We&apos;re looking for passionate, driven individuals to grow with us.
              </p>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="border-t border-neutral-200 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-900">Open Positions</h2>
              <p className="mt-4 text-lg text-neutral-600">
                Explore our current job openings and find the perfect role for you.
              </p>
            </div>

            {/* Job Posting */}
            <article className="border-2 border-neutral-200 bg-white shadow-soft rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-8 py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Administrative Staff (Full-Time)</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-brand-100">
                      <span className="flex items-center gap-1.5">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Remote/Hybrid
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Operations & Support
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Full-Time
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 py-8">
                {/* About Phixall */}
                <div className="mb-8">
                  <h4 className="text-xl font-bold text-neutral-900 mb-4">About Phixall</h4>
                  <p className="text-neutral-700 leading-relaxed">
                    Phixall is a service platform that connects customers with vetted Phixers for home repairs, maintenance, and renovations. As we continue expanding, we are looking for a highly organized and proactive Administrative Staff member to support day-to-day operations, ensuring seamless coordination between clients, Phixers, and company leadership.
                  </p>
                </div>

                {/* Job Summary */}
                <div className="mb-8">
                  <h4 className="text-xl font-bold text-neutral-900 mb-4">Job Summary</h4>
                  <p className="text-neutral-700 leading-relaxed">
                    The Administrative Staff will manage the Phixall admin portal, coordinate Phixers, handle clients, manage job requests, oversee billing processes, provide support, and liaise directly with C-Staff to ensure operational efficiency. This position serves as a central communication and administrative hub for the company.
                  </p>
                </div>

                {/* Key Responsibilities */}
                <div className="mb-8">
                  <h4 className="text-xl font-bold text-neutral-900 mb-4">Key Responsibilities</h4>
                  <div className="space-y-6">
                    <div>
                      <h5 className="font-semibold text-neutral-900 mb-2">1. Portal & Operations Management</h5>
                      <ul className="list-disc list-inside space-y-1 text-neutral-700 ml-4">
                        <li>Manage and update the Phixall admin portal</li>
                        <li>Monitor new job requests and assign them to appropriate Phixers</li>
                        <li>Track job progress, follow up on pending tasks, and ensure deadlines are met</li>
                        <li>Maintain accurate and up-to-date records of jobs, client interactions, and Phixer performance</li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-neutral-900 mb-2">2. Phixer Management</h5>
                      <ul className="list-disc list-inside space-y-1 text-neutral-700 ml-4">
                        <li>Onboard new Phixers and verify documentation</li>
                        <li>Coordinate schedules, availability, and job allocation</li>
                        <li>Handle inquiries, provide guidance, and resolve issues raised by Phixers</li>
                        <li>Monitor performance metrics and escalate concerns to leadership</li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-neutral-900 mb-2">3. Client Management & Support</h5>
                      <ul className="list-disc list-inside space-y-1 text-neutral-700 ml-4">
                        <li>Serve as the primary contact for clients regarding services, updates, and concerns</li>
                        <li>Respond to inquiries via email, chat, or phone in a prompt and professional manner</li>
                        <li>Provide real-time job updates and follow-ups to ensure client satisfaction</li>
                        <li>Handle complaints, service issues, and escalate complex matters to management when needed</li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-neutral-900 mb-2">4. Liaison with C-Staff</h5>
                      <ul className="list-disc list-inside space-y-1 text-neutral-700 ml-4">
                        <li>Provide regular updates to the CEO and C-Staff on operations, issues, and opportunities</li>
                        <li>Coordinate internal communication and ensure leadership has all necessary information for decision-making</li>
                        <li>Support C-Staff with administrative tasks and project follow-ups</li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-neutral-900 mb-2">5. Billing & Financial Administration</h5>
                      <ul className="list-disc list-inside space-y-1 text-neutral-700 ml-4">
                        <li>Prepare and issue invoices for completed jobs</li>
                        <li>Track payments, follow up on outstanding balances, and reconcile billing records</li>
                        <li>Maintain accurate financial documentation and support basic bookkeeping tasks</li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-neutral-900 mb-2">6. Resource & Logistics Coordination</h5>
                      <ul className="list-disc list-inside space-y-1 text-neutral-700 ml-4">
                        <li>Ensure Phixers have needed tools, materials, and resources when required</li>
                        <li>Coordinate dispatch or procurement of supplies as applicable</li>
                        <li>Track inventory levels and report shortages</li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-neutral-900 mb-2">7. Reporting & Documentation</h5>
                      <ul className="list-disc list-inside space-y-1 text-neutral-700 ml-4">
                        <li>Generate weekly and monthly reports on operations, performance, and billing</li>
                        <li>Maintain updated documentation, SOPs, and administrative files</li>
                        <li>Assist management with planning, research, and process improvement initiatives</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Qualifications */}
                <div className="mb-8">
                  <h4 className="text-xl font-bold text-neutral-900 mb-4">Qualifications & Requirements</h4>
                  
                  <div className="mb-6">
                    <h5 className="font-semibold text-neutral-900 mb-3">Education & Experience</h5>
                    <ul className="list-disc list-inside space-y-1 text-neutral-700 ml-4">
                      <li>OND / HND / Bachelor&apos;s Degree in Business Administration, Management, or a related field</li>
                      <li>1–3 years experience in administrative, operations, or customer/client support roles</li>
                      <li>Experience working with service platforms, field operations, or technician networks is an advantage</li>
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h5 className="font-semibold text-neutral-900 mb-3">Skills & Competencies</h5>
                    <ul className="list-disc list-inside space-y-1 text-neutral-700 ml-4">
                      <li>Strong organizational and multitasking skills</li>
                      <li>Excellent verbal and written communication</li>
                      <li>Proficiency with digital tools such as:
                        <ul className="list-circle list-inside ml-6 mt-1 space-y-1">
                          <li>CRM systems</li>
                          <li>Billing or invoicing software</li>
                          <li>Google Workspace / Microsoft Office</li>
                        </ul>
                      </li>
                      <li>Ability to work under pressure and manage multiple requests simultaneously</li>
                      <li>High attention to detail and professionalism</li>
                      <li>Strong customer service skills</li>
                      <li>Problem-solving and critical-thinking ability</li>
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h5 className="font-semibold text-neutral-900 mb-3">Personal Qualities</h5>
                    <ul className="list-disc list-inside space-y-1 text-neutral-700 ml-4">
                      <li>Reliable, proactive, and self-driven</li>
                      <li>Strong integrity, confidentiality, and professionalism</li>
                      <li>Able to work both independently and within a team</li>
                      <li>Fast learner with adaptability in a dynamic environment</li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-semibold text-neutral-900 mb-3">Preferred (but not required)</h5>
                    <ul className="list-disc list-inside space-y-1 text-neutral-700 ml-4">
                      <li>Experience in logistics, field coordination, or tech-enabled service companies</li>
                      <li>Familiarity with workflow tools (e.g., Notion, Trello, Monday.com)</li>
                      <li>Basic finance or accounting knowledge</li>
                    </ul>
                  </div>
                </div>

                {/* Application Form */}
                <div className="border-t border-neutral-200 pt-8 mt-8">
                  <h4 className="text-xl font-bold text-neutral-900 mb-4">Apply for This Position</h4>
                  <p className="text-neutral-600 mb-6">
                    Ready to join our team? Fill out the application form below and we&apos;ll get back to you soon.
                  </p>
                  
                  {message && (
                    <div className={`mb-6 rounded-lg p-4 ${
                      message.type === 'success' 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      <p className="font-medium">{message.text}</p>
                    </div>
                  )}
                  
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="position" value="Administrative Staff (Full-Time)" />
                    
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-semibold text-neutral-900 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          required
                          className="w-full border-2 border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-semibold text-neutral-900 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          required
                          className="w-full border-2 border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-neutral-900 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full border-2 border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        placeholder="john.doe@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-neutral-900 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        className="w-full border-2 border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        placeholder="+234 800 000 0000"
                      />
                    </div>

                    <div>
                      <label htmlFor="experience" className="block text-sm font-semibold text-neutral-900 mb-2">
                        Years of Experience *
                      </label>
                      <select
                        id="experience"
                        name="experience"
                        required
                        className="w-full border-2 border-neutral-300 bg-white px-4 py-3 text-neutral-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      >
                        <option value="">Select experience level</option>
                        <option value="0-1">0-1 years</option>
                        <option value="1-2">1-2 years</option>
                        <option value="2-3">2-3 years</option>
                        <option value="3+">3+ years</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="education" className="block text-sm font-semibold text-neutral-900 mb-2">
                        Highest Education Level *
                      </label>
                      <select
                        id="education"
                        name="education"
                        required
                        className="w-full border-2 border-neutral-300 bg-white px-4 py-3 text-neutral-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      >
                        <option value="">Select education level</option>
                        <option value="OND">OND</option>
                        <option value="HND">HND</option>
                        <option value="Bachelor">Bachelor&apos;s Degree</option>
                        <option value="Master">Master&apos;s Degree</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="coverLetter" className="block text-sm font-semibold text-neutral-900 mb-2">
                        Cover Letter *
                      </label>
                      <textarea
                        id="coverLetter"
                        name="coverLetter"
                        rows={6}
                        required
                        className="w-full border-2 border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                      />
                    </div>

                    <div>
                      <label htmlFor="resume" className="block text-sm font-semibold text-neutral-900 mb-2">
                        Resume/CV *
                      </label>
                      <input
                        type="file"
                        id="resume"
                        name="resume"
                        accept=".pdf,.doc,.docx"
                        required
                        className="w-full border-2 border-neutral-300 bg-white px-4 py-3 text-neutral-900 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      />
                      <p className="mt-2 text-sm text-neutral-500">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                    </div>

                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="consent"
                        name="consent"
                        required
                        className="mt-1 h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
                      />
                      <label htmlFor="consent" className="ml-3 text-sm text-neutral-600">
                        I consent to Phixall processing my personal data for recruitment purposes. *
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-brand-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </form>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-neutral-900">Don&apos;t See a Role That Fits?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
                We&apos;re always looking for talented individuals. Send us your resume and we&apos;ll keep you in mind for future opportunities.
              </p>
              <div className="mt-8">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                >
                  Get in Touch
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

