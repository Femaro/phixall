'use client';

import { useState } from 'react';
import { getFirebase } from '@/lib/firebaseClient';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useIsUSUser } from '@/hooks/useIsUSUser';

interface TaxFormProps {
  userId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * W-9 Tax Form for US artisans
 * Required for tax reporting (1099 forms)
 */
export default function TaxForm({ userId, onSuccess, onError }: TaxFormProps) {
  const isUS = useIsUSUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', // Legal name or business name
    businessName: '', // If different from name
    taxClassification: 'individual' as 'individual' | 'c-corp' | 's-corp' | 'partnership' | 'trust' | 'llc' | 'other',
    exemptPayee: false,
    exemptFromFATCA: false,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    ssn: '', // Social Security Number (full for W-9, but we'll encrypt)
    ein: '', // Employer Identification Number (if business)
    signature: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isUS) {
      onError?.('Tax form only required for US users');
      return;
    }

    // Validation
    if (!formData.name.trim()) {
      onError?.('Legal name is required');
      return;
    }

    if (!formData.ssn.trim() && !formData.ein.trim()) {
      onError?.('Either SSN or EIN is required');
      return;
    }

    if (formData.ssn && formData.ssn.replace(/\D/g, '').length !== 9) {
      onError?.('SSN must be 9 digits');
      return;
    }

    if (formData.ein && formData.ein.replace(/\D/g, '').length !== 9) {
      onError?.('EIN must be 9 digits');
      return;
    }

    if (!formData.signature.trim()) {
      onError?.('Signature is required');
      return;
    }

    setLoading(true);

    try {
      const { db } = getFirebase();
      const taxFormRef = doc(db, 'tax_forms', userId);

      // Encrypt sensitive data (in production, use proper encryption)
      const ssnDigits = formData.ssn.replace(/\D/g, '');
      const einDigits = formData.ein.replace(/\D/g, '');

      await setDoc(taxFormRef, {
        userId,
        name: formData.name,
        businessName: formData.businessName || null,
        taxClassification: formData.taxClassification,
        exemptPayee: formData.exemptPayee,
        exemptFromFATCA: formData.exemptFromFATCA,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        ssn: ssnDigits ? `***-**-${ssnDigits.slice(-4)}` : null, // Only store last 4 for display
        ssnFull: ssnDigits || null, // In production, encrypt this
        ein: einDigits || null,
        signature: formData.signature,
        date: formData.date,
        formType: 'W-9',
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error saving tax form:', error);
      onError?.('Failed to save tax form');
    } finally {
      setLoading(false);
    }
  };

  if (!isUS) {
    return null; // Don't show for non-US users
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">W-9 Tax Information</h3>
        <p className="text-sm text-neutral-600 mb-6">
          This form is required for tax reporting purposes. We will use this information to issue 1099 forms at the end of the tax year.
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
              Name (as shown on your tax return) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              required
            />
          </div>

          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-neutral-700">
              Business name (if different from above)
            </label>
            <input
              type="text"
              id="businessName"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label htmlFor="taxClassification" className="block text-sm font-medium text-neutral-700">
              Tax Classification <span className="text-red-500">*</span>
            </label>
            <select
              id="taxClassification"
              value={formData.taxClassification}
              onChange={(e) => setFormData({ ...formData, taxClassification: e.target.value as any })}
              className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              required
            >
              <option value="individual">Individual/Sole Proprietor</option>
              <option value="c-corp">C Corporation</option>
              <option value="s-corp">S Corporation</option>
              <option value="partnership">Partnership</option>
              <option value="trust">Trust/Estate</option>
              <option value="llc">Limited Liability Company</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ssn" className="block text-sm font-medium text-neutral-700">
                SSN (Social Security Number)
              </label>
              <input
                type="text"
                id="ssn"
                value={formData.ssn}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                  const formatted = value.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
                  setFormData({ ...formData, ssn: formatted || value });
                }}
                placeholder="123-45-6789"
                className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <p className="mt-1 text-xs text-neutral-500">Required if no EIN</p>
            </div>

            <div>
              <label htmlFor="ein" className="block text-sm font-medium text-neutral-700">
                EIN (Employer Identification Number)
              </label>
              <input
                type="text"
                id="ein"
                value={formData.ein}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                  const formatted = value.replace(/(\d{2})(\d{7})/, '$1-$2');
                  setFormData({ ...formData, ein: formatted || value });
                }}
                placeholder="12-3456789"
                className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <p className="mt-1 text-xs text-neutral-500">Required if no SSN</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-neutral-700">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-neutral-700">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-neutral-700">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-neutral-700">
                ZIP Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData({ ...formData, zipCode: value });
                }}
                placeholder="12345"
                className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="signature" className="block text-sm font-medium text-neutral-700">
              Signature <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="signature"
              value={formData.signature}
              onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
              placeholder="Type your full name to sign"
              className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              required
            />
            <p className="mt-1 text-xs text-neutral-500">By typing your name, you certify that the information provided is correct</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-neutral-200">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-600 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Submit W-9 Form'}
          </button>
        </div>
      </div>
    </form>
  );
}

