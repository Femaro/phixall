/**
 * Paystack Client Utility
 * Handles payment initialization and verification
 */

export interface PaystackConfig {
  email: string;
  amount: number; // Amount in kobo (NGN minor unit)
  reference?: string;
  currency?: string;
  channels?: string[];
  metadata?: Record<string, any>;
  callback_url?: string;
}

export interface PaystackResponse {
  status: boolean;
  message: string;
  data?: any;
}

/**
 * Initialize Paystack payment popup
 */
export function initializePaystackPayment(config: PaystackConfig) {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  
  if (!publicKey) {
    throw new Error('Paystack public key not configured');
  }

  if (typeof window === 'undefined') {
    throw new Error('This function can only be called in the browser');
  }

  // Load Paystack script if not already loaded
  if (!window.PaystackPop) {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    document.body.appendChild(script);
    
    return new Promise((resolve) => {
      script.onload = () => {
        resolve(openPaystackPopup(config, publicKey));
      };
    });
  }

  return openPaystackPopup(config, publicKey);
}

function openPaystackPopup(config: PaystackConfig, publicKey: string) {
  return new Promise((resolve, reject) => {
    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: config.email,
      amount: config.amount,
      currency: config.currency || 'NGN',
      ref: config.reference || generateReference(),
      channels: config.channels || ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
      metadata: config.metadata || {},
      callback: function (response: any) {
        resolve(response);
      },
      onClose: function () {
        reject(new Error('Payment cancelled'));
      },
    });
    
    handler.openIframe();
  });
}

/**
 * Generate unique payment reference
 */
export function generateReference(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `PXL-${timestamp}-${random}`;
}

/**
 * Convert amount from Naira to Kobo (deprecated - use toMinorUnit)
 * @deprecated Use toMinorUnit instead
 */
export function toKobo(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Convert amount from Kobo to Naira (deprecated - use fromMinorUnit)
 * @deprecated Use fromMinorUnit instead
 */
export function toNaira(amount: number): number {
  return amount / 100;
}

/**
 * Format currency for display based on location
 */
export function formatCurrency(amount: number, currency: 'USD' | 'NGN' = 'NGN'): string {
  const locale = currency === 'USD' ? 'en-US' : 'en-NG';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Get currency based on user location
 */
export function getCurrency(isUS: boolean | null): 'USD' | 'NGN' {
  return isUS === true ? 'USD' : 'NGN';
}

/**
 * Get security deposit amount based on currency
 */
export function getSecurityDeposit(currency: 'USD' | 'NGN'): number {
  return currency === 'USD' ? 50 : 1000; // $50 for US, ₦1000 for others
}

/**
 * Convert amount to minor unit (cents for USD, kobo for NGN)
 */
export function toMinorUnit(amount: number, currency: 'USD' | 'NGN'): number {
  return Math.round(amount * 100);
}

/**
 * Convert amount from minor unit (cents to USD, kobo to NGN)
 */
export function fromMinorUnit(amount: number, currency: 'USD' | 'NGN'): number {
  return amount / 100;
}

// Extend Window interface for Paystack
declare global {
  interface Window {
    PaystackPop: any;
  }
}


