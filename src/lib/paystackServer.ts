/**
 * Paystack Server Utility
 * Server-side functions for payment processing
 */

'use server';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

interface PaystackAPIResponse {
  status: boolean;
  message: string;
  data?: any;
}

/**
 * Initialize a transaction
 */
export async function initializeTransaction(params: {
  email: string;
  amount: number; // in kobo
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, any>;
  channels?: string[];
}): Promise<PaystackAPIResponse> {
  try {
    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error initializing transaction:', error);
    return {
      status: false,
      message: error instanceof Error ? error.message : 'Failed to initialize transaction',
    };
  }
}

/**
 * Verify a transaction
 */
export async function verifyTransaction(reference: string): Promise<PaystackAPIResponse> {
  try {
    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return {
      status: false,
      message: error instanceof Error ? error.message : 'Failed to verify transaction',
    };
  }
}

/**
 * Create a customer
 */
export async function createCustomer(params: {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
}): Promise<PaystackAPIResponse> {
  try {
    const response = await fetch(`${PAYSTACK_BASE_URL}/customer`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating customer:', error);
    return {
      status: false,
      message: error instanceof Error ? error.message : 'Failed to create customer',
    };
  }
}

/**
 * Fetch customer details
 */
export async function fetchCustomer(emailOrCode: string): Promise<PaystackAPIResponse> {
  try {
    const response = await fetch(`${PAYSTACK_BASE_URL}/customer/${emailOrCode}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching customer:', error);
    return {
      status: false,
      message: error instanceof Error ? error.message : 'Failed to fetch customer',
    };
  }
}

/**
 * Create a transfer recipient (for payouts to Phixers)
 */
export async function createTransferRecipient(params: {
  type: 'nuban' | 'mobile_money' | 'basa';
  name: string;
  account_number: string;
  bank_code: string;
  currency?: string;
}): Promise<PaystackAPIResponse> {
  try {
    const response = await fetch(`${PAYSTACK_BASE_URL}/transferrecipient`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...params,
        currency: params.currency || 'NGN',
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating transfer recipient:', error);
    return {
      status: false,
      message: error instanceof Error ? error.message : 'Failed to create transfer recipient',
    };
  }
}

/**
 * Initiate a transfer (payout to Phixers)
 */
export async function initiateTransfer(params: {
  amount: number; // in kobo
  recipient: string; // recipient code
  reason?: string;
  reference?: string;
}): Promise<PaystackAPIResponse> {
  try {
    const response = await fetch(`${PAYSTACK_BASE_URL}/transfer`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'balance',
        ...params,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error initiating transfer:', error);
    return {
      status: false,
      message: error instanceof Error ? error.message : 'Failed to initiate transfer',
    };
  }
}

/**
 * List all banks (for bank account collection)
 */
export async function listBanks(country: string = 'nigeria'): Promise<PaystackAPIResponse> {
  try {
    const response = await fetch(`${PAYSTACK_BASE_URL}/bank?country=${country}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error listing banks:', error);
    return {
      status: false,
      message: error instanceof Error ? error.message : 'Failed to list banks',
    };
  }
}

/**
 * Resolve account number (verify bank account)
 */
export async function resolveAccountNumber(params: {
  account_number: string;
  bank_code: string;
}): Promise<PaystackAPIResponse> {
  try {
    const response = await fetch(
      `${PAYSTACK_BASE_URL}/bank/resolve?account_number=${params.account_number}&bank_code=${params.bank_code}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error resolving account:', error);
    return {
      status: false,
      message: error instanceof Error ? error.message : 'Failed to resolve account',
    };
  }
}


