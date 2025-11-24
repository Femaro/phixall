'use client';

import { useState } from 'react';
import { initializePaystackPayment, toKobo, formatCurrency } from '@/lib/paystackClient';

interface PaymentButtonProps {
  email: string;
  amount: number; // Amount in Naira
  jobId?: string;
  userId: string;
  type?: 'job_payment' | 'wallet_funding' | 'subscription';
  onSuccess?: (reference: string) => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export default function PaymentButton({
  email,
  amount,
  jobId,
  userId,
  type = 'job_payment',
  onSuccess,
  onError,
  className,
  children,
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Initialize payment on server
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount,
          jobId,
          userId,
          type,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to initialize payment');
      }

      // Open Paystack popup
      const paymentResponse: any = await initializePaystackPayment({
        email,
        amount: toKobo(amount),
        reference: result.data.reference,
        metadata: {
          jobId,
          userId,
          type,
        },
      });

      // Verify payment on server
      const verifyResponse = await fetch(
        `/api/payments/verify?reference=${paymentResponse.reference}`
      );
      const verifyResult = await verifyResponse.json();

      if (verifyResult.success) {
        onSuccess?.(paymentResponse.reference);
      } else {
        throw new Error(verifyResult.error || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={
        className ||
        'rounded-lg bg-brand-600 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50'
      }
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          Processing...
        </span>
      ) : (
        children || `Pay ${formatCurrency(amount)}`
      )}
    </button>
  );
}

