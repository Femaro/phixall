'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RequestQuotePage() {
  const [formData, setFormData] = useState({
    // Company Info
    companyName: '',
    industry: '',
    // Contact Info
    fullName: '',
    title: '',
    email: '',
    phone: '',
    // Facility Info
    facilityType: '',
    facilitySize: '',
    numberOfLocations: '1',
    locations: '',
    // Services Needed
    services: [] as string[],
    // Additional Info
    timeline: '',
    budget: '',
    currentProvider: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const serviceOptions = [
    'Electrical Services',
    'Plumbing Services',
    'Carpentry Services',
    'Painting Services',
    'Installation Item Supplies',
    'Facility Management Advisory',
    'Preventive Maintenance Program',
    'Engineering Project Management Support',
    'Engineering Services',
    'Controls & Automation',
  ];

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual form submission to your backend
    console.log('Form data:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
          <div className="border-4 border-[#27ae60] bg-green-50 p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-[#27ae60]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h1 className="mt-6 text-3xl font-bold text-neutral-900">Thank You for Your Request!</h1>
            <p className="mt-4 text-lg text-neutral-600">
              We've received your quote request. Our enterprise sales team will review your requirements and contact you within 24 hours.
            </p>
            <div className="mt-8 space-y-4">
              <p className="text-sm text-neutral-600">
                <strong>Next Steps:</strong>
              </p>
              <ul className="text-left text-sm text-neutral-600">
                <li>• Our team will analyze your facility needs</li>
                <li>• We'll prepare a customized quote and service plan</li>
                <li>• A dedicated account manager will reach out to discuss details</li>
                <li>• We'll schedule a facility assessment if needed</li>
              </ul>
            </div>
            <div className="mt-8 border-t border-neutral-200 pt-8">
              <p className="text-sm font-semibold text-neutral-700">Need assistance?</p>
              <p className="mt-2 text-sm text-neutral-600">
                Or send an email to{' '}
                <a href="mailto:ops@phixall.us" className="font-bold text-[#3498db] hover:underline">
                  ops@phixall.us
                </a>
              </p>
            </div>
            <Link href="/us" className="mt-8 inline-block border-2 border-[#3498db] bg-[#3498db] px-8 py-3 text-sm font-bold uppercase text-white transition-all hover:bg-[#2980b9]">
              Return to Homepage
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-neutral-200 bg-gradient-to-br from-[#1e3a5f] to-[#2c3e50]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white lg:text-5xl">Request Warehouse Services Quote</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
              Get a customized warehouse facility management solution tailored to your specific needs. Fill out the form below and our team will contact you within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Company Information */}
            <div className="border-2 border-neutral-200 p-8">
              <h2 className="text-2xl font-bold text-neutral-900">Company Information</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="mt-2 w-full border-2 border-neutral-300 px-4 py-3 focus:border-[#3498db] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700">Industry *</label>
                  <select
                    required
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    className="mt-2 w-full border-2 border-neutral-300 px-4 py-3 focus:border-[#3498db] focus:outline-none"
                  >
                    <option value="">Select Industry</option>
                    <option value="ecommerce">E-Commerce</option>
                    <option value="logistics">Logistics & 3PL</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="cold-storage">Cold Storage</option>
                    <option value="retail">Retail Distribution</option>
                    <option value="food-beverage">Food & Beverage</option>
                    <option value="pharmaceutical">Pharmaceutical</option>
                    <option value="automotive">Automotive Parts</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-2 border-neutral-200 p-8">
              <h2 className="text-2xl font-bold text-neutral-900">Contact Information</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="mt-2 w-full border-2 border-neutral-300 px-4 py-3 focus:border-[#3498db] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700">Title/Position *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="mt-2 w-full border-2 border-neutral-300 px-4 py-3 focus:border-[#3498db] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="mt-2 w-full border-2 border-neutral-300 px-4 py-3 focus:border-[#3498db] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="mt-2 w-full border-2 border-neutral-300 px-4 py-3 focus:border-[#3498db] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Facility Information */}
            <div className="border-2 border-neutral-200 p-8">
              <h2 className="text-2xl font-bold text-neutral-900">Facility Information</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700">Facility Type *</label>
                  <select
                    required
                    value={formData.facilityType}
                    onChange={(e) => setFormData({...formData, facilityType: e.target.value})}
                    className="mt-2 w-full border-2 border-neutral-300 px-4 py-3 focus:border-[#3498db] focus:outline-none"
                  >
                    <option value="">Select Facility Type</option>
                    <option value="warehouse">Warehouse/Distribution Center</option>
                    <option value="ecommerce">E-Commerce Fulfillment Center</option>
                    <option value="cold-storage">Cold Storage Facility</option>
                    <option value="manufacturing">Manufacturing Warehouse</option>
                    <option value="3pl">3PL/Logistics Facility</option>
                    <option value="food-beverage">Food & Beverage Distribution</option>
                    <option value="pharmaceutical">Pharmaceutical Warehouse</option>
                    <option value="automotive">Automotive Parts Distribution</option>
                    <option value="other">Other Warehouse Type</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700">Facility Size (sq ft) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 50,000"
                    value={formData.facilitySize}
                    onChange={(e) => setFormData({...formData, facilitySize: e.target.value})}
                    className="mt-2 w-full border-2 border-neutral-300 px-4 py-3 focus:border-[#3498db] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700">Number of Locations *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.numberOfLocations}
                    onChange={(e) => setFormData({...formData, numberOfLocations: e.target.value})}
                    className="mt-2 w-full border-2 border-neutral-300 px-4 py-3 focus:border-[#3498db] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700">Locations (Cities/States)</label>
                  <input
                    type="text"
                    placeholder="e.g., New York, NY; Los Angeles, CA"
                    value={formData.locations}
                    onChange={(e) => setFormData({...formData, locations: e.target.value})}
                    className="mt-2 w-full border-2 border-neutral-300 px-4 py-3 focus:border-[#3498db] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Services Needed */}
            <div className="border-2 border-neutral-200 p-8">
              <h2 className="text-2xl font-bold text-neutral-900">Services Needed</h2>
              <p className="mt-2 text-sm text-neutral-600">Select all services you're interested in</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {serviceOptions.map((service) => (
                  <label key={service} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="mt-1 h-5 w-5 border-2 border-neutral-300"
                    />
                    <span className="text-sm text-neutral-700">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="border-2 border-neutral-200 p-8">
              <h2 className="text-2xl font-bold text-neutral-900">Additional Information</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700">Timeline *</label>
                  <select
                    required
                    value={formData.timeline}
                    onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                    className="mt-2 w-full border-2 border-neutral-300 px-4 py-3 focus:border-[#3498db] focus:outline-none"
                  >
                    <option value="">Select Timeline</option>
                    <option value="immediate">Immediate (Within 30 days)</option>
                    <option value="1-3months">1-3 Months</option>
                    <option value="3-6months">3-6 Months</option>
                    <option value="6+months">6+ Months</option>
                    <option value="exploring">Just Exploring Options</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700">Annual Budget Range</label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    className="mt-2 w-full border-2 border-neutral-300 px-4 py-3 focus:border-[#3498db] focus:outline-none"
                  >
                    <option value="">Select Budget Range</option>
                    <option value="<50k">Less than $50,000</option>
                    <option value="50k-100k">$50,000 - $100,000</option>
                    <option value="100k-250k">$100,000 - $250,000</option>
                    <option value="250k-500k">$250,000 - $500,000</option>
                    <option value="500k-1m">$500,000 - $1,000,000</option>
                    <option value="1m+">$1,000,000+</option>
                    <option value="tbd">To Be Determined</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-semibold text-neutral-700">Current Provider (if any)</label>
                <input
                  type="text"
                  placeholder="Current facility management provider"
                  value={formData.currentProvider}
                  onChange={(e) => setFormData({...formData, currentProvider: e.target.value})}
                  className="mt-2 w-full border-2 border-neutral-300 px-4 py-3 focus:border-[#3498db] focus:outline-none"
                />
              </div>
              <div className="mt-6">
                <label className="block text-sm font-semibold text-neutral-700">Additional Details or Requirements</label>
                <textarea
                  rows={6}
                  placeholder="Tell us more about your facility management needs, specific challenges, or requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="mt-2 w-full border-2 border-neutral-300 px-4 py-3 focus:border-[#3498db] focus:outline-none"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between border-t-2 border-neutral-200 pt-8">
              <p className="text-sm text-neutral-600">
                * Required fields
              </p>
              <button
                type="submit"
                className="border-2 border-[#3498db] bg-[#3498db] px-12 py-4 text-base font-bold uppercase tracking-wide text-white transition-all hover:bg-[#2980b9]"
              >
                Submit Quote Request
              </button>
            </div>
          </form>

          {/* Contact */}
          <div className="mt-12 border-2 border-[#3498db] bg-blue-50 p-8 text-center">
            <p className="text-lg text-neutral-700">
              Or send an email to{' '}
              <a href="mailto:ops@phixall.us" className="font-bold text-[#3498db] hover:underline">
                ops@phixall.us
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
