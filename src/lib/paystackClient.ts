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
 * Convert amount from Naira to Kobo
 */
export function toKobo(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Convert amount from Kobo to Naira
 */
export function toNaira(amount: number): number {
  return amount / 100;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount);
}

// Extend Window interface for Paystack
declare global {
  interface Window {
    PaystackPop: any;
  }
}


