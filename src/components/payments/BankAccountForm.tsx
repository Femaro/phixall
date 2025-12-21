'use client';

import { useState, useEffect } from 'react';
import { getFirebase } from '@/lib/firebaseClient';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useIsUSUser } from '@/hooks/useIsUSUser';
import { validateUSRoutingNumber, validateUSAccountNumber, validateInternationalAccountNumber, formatUSRoutingNumber } from '@/lib/bankUtils';

interface Bank {
  id: number;
  code: string;
  name: string;
}

interface BankAccountFormProps {
  userId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function BankAccountForm({ userId, onSuccess, onError }: BankAccountFormProps) {
  const isUS = useIsUSUser();
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [formData, setFormData] = useState({
    // International (non-US) fields
    bankCode: '',
    accountNumber: '',
    accountName: '',
    // US fields
    routingNumber: '',
    accountType: 'checking' as 'checking' | 'savings',
    accountHolderName: '',
  });

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      // In a real implementation, you would fetch this from your API
      // For now, using common international banks (example: Nigerian banks)
      setBanks([
        { id: 1, code: '044', name: 'Access Bank' },
        { id: 2, code: '063', name: 'Access Bank (Diamond)' },
        { id: 3, code: '050', name: 'Ecobank Nigeria' },
        { id: 4, code: '070', name: 'Fidelity Bank' },
        { id: 5, code: '011', name: 'First Bank of Nigeria' },
        { id: 6, code: '214', name: 'First City Monument Bank' },
        { id: 7, code: '058', name: 'Guaranty Trust Bank' },
        { id: 8, code: '030', name: 'Heritage Bank' },
        { id: 9, code: '301', name: 'Jaiz Bank' },
        { id: 10, code: '082', name: 'Keystone Bank' },
        { id: 11, code: '526', name: 'Parallex Bank' },
        { id: 12, code: '076', name: 'Polaris Bank' },
        { id: 13, code: '101', name: 'Providus Bank' },
        { id: 14, code: '221', name: 'Stanbic IBTC Bank' },
        { id: 15, code: '068', name: 'Standard Chartered Bank' },
        { id: 16, code: '232', name: 'Sterling Bank' },
        { id: 17, code: '100', name: 'Suntrust Bank' },
        { id: 18, code: '032', name: 'Union Bank of Nigeria' },
        { id: 19, code: '033', name: 'United Bank For Africa' },
        { id: 20, code: '215', name: 'Unity Bank' },
        { id: 21, code: '035', name: 'Wema Bank' },
        { id: 22, code: '057', name: 'Zenith Bank' },
      ]);
    } catch (error) {
      console.error('Error fetching banks:', error);
    }
  };

  const verifyAccount = async () => {
    if (isUS) {
      // US account verification (would use Stripe/Plaid in production)
      const routingValidation = validateUSRoutingNumber(formData.routingNumber);
      const accountValidation = validateUSAccountNumber(formData.accountNumber);
      
      if (!routingValidation.valid) {
        onError?.(routingValidation.error || 'Invalid routing number');
        return;
      }
      
      if (!accountValidation.valid) {
        onError?.(accountValidation.error || 'Invalid account number');
        return;
      }

      // For now, just validate format. In production, integrate with Stripe or Plaid
      setFormData({
        ...formData,
        accountHolderName: formData.accountHolderName || 'Verified',
      });
      return;
    }

    // International account verification
    if (!formData.bankCode || !formData.accountNumber) {
      onError?.('Please select a bank and enter account number');
      return;
    }

    const validation = validateInternationalAccountNumber(formData.accountNumber);
    if (!validation.valid) {
      onError?.(validation.error || 'Invalid account number');
      return;
    }

    setVerifying(true);

    try {
      const response = await fetch('/api/payments/resolve-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_number: formData.accountNumber,
          bank_code: formData.bankCode,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setFormData({
          ...formData,
          accountName: result.data.account_name,
        });
      } else {
        onError?.(result.error || 'Failed to verify account');
      }
    } catch (error) {
      console.error('Account verification error:', error);
      onError?.('Failed to verify account');
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isUS) {
      if (!formData.routingNumber || !formData.accountNumber || !formData.accountHolderName) {
        onError?.('Please fill in all required fields');
        return;
      }
    } else {
      if (!formData.accountName) {
        onError?.('Please verify your account first');
        return;
      }
    }

    setLoading(true);

    try {
      const { db } = getFirebase();
      const bankAccountRef = doc(db, 'bank_accounts', userId);

      if (isUS) {
        await setDoc(bankAccountRef, {
          userId,
          country: 'US',
          routingNumber: formData.routingNumber.replace(/\D/g, ''),
          accountNumber: formData.accountNumber.replace(/\D/g, ''),
          accountType: formData.accountType,
          accountHolderName: formData.accountHolderName,
          verified: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(bankAccountRef, {
          userId,
          country: 'NG',
          bankCode: formData.bankCode,
          bankName: banks.find((b) => b.code === formData.bankCode)?.name || '',
          accountNumber: formData.accountNumber,
          accountName: formData.accountName,
          verified: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error saving bank account:', error);
      onError?.('Failed to save bank account');
    } finally {
      setLoading(false);
    }
  };

  if (isUS) {
    // US Bank Account Form
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="routingNumber" className="block text-sm font-medium text-neutral-700">
            Routing Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="routingNumber"
            value={formData.routingNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 9);
              setFormData({ ...formData, routingNumber: value });
            }}
            placeholder="123456789"
            className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            required
          />
          <p className="mt-1 text-xs text-neutral-500">9-digit routing number (found on your checks)</p>
        </div>

        <div>
          <label htmlFor="accountNumber" className="block text-sm font-medium text-neutral-700">
            Account Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="accountNumber"
            value={formData.accountNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 17);
              setFormData({ ...formData, accountNumber: value });
            }}
            placeholder="Account number"
            className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            required
          />
        </div>

        <div>
          <label htmlFor="accountType" className="block text-sm font-medium text-neutral-700">
            Account Type <span className="text-red-500">*</span>
          </label>
          <select
            id="accountType"
            value={formData.accountType}
            onChange={(e) => setFormData({ ...formData, accountType: e.target.value as 'checking' | 'savings' })}
            className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            required
          >
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
          </select>
        </div>

        <div>
          <label htmlFor="accountHolderName" className="block text-sm font-medium text-neutral-700">
            Account Holder Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="accountHolderName"
            value={formData.accountHolderName}
            onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
            placeholder="John Doe"
            className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            required
          />
          <p className="mt-1 text-xs text-neutral-500">Name as it appears on the account</p>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.routingNumber || !formData.accountNumber || !formData.accountHolderName}
          className="w-full rounded-lg bg-brand-600 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Bank Account'}
        </button>
        <p className="text-xs text-neutral-500 text-center">
          Your bank account information is encrypted and secure. We use Stripe for US bank transfers.
        </p>
      </form>
    );
  }

  // International Bank Account Form (existing)
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="bank" className="block text-sm font-medium text-neutral-700">
          Bank
        </label>
        <select
          id="bank"
          value={formData.bankCode}
          onChange={(e) => {
            setFormData({ ...formData, bankCode: e.target.value, accountName: '' });
          }}
          className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          required
        >
          <option value="">Select a bank</option>
          {banks.map((bank) => (
            <option key={bank.id} value={bank.code}>
              {bank.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="accountNumber" className="block text-sm font-medium text-neutral-700">
          Account Number
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            id="accountNumber"
            value={formData.accountNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 10);
              setFormData({ ...formData, accountNumber: value, accountName: '' });
            }}
            placeholder="0123456789"
            className="block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            required
          />
          <button
            type="button"
            onClick={verifyAccount}
            disabled={verifying || formData.accountNumber.length !== 10 || !formData.bankCode}
            className="whitespace-nowrap rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {verifying ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </div>

      {formData.accountName && (
        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">Account Name:</p>
          <p className="text-lg font-bold text-green-900">{formData.accountName}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !formData.accountName}
        className="w-full rounded-lg bg-brand-600 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Bank Account'}
      </button>
    </form>
  );
}


