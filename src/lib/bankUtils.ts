/**
 * Bank account utilities for US and international users
 */

/**
 * US Bank Account Interface
 */
export interface USBankAccount {
  routingNumber: string; // 9 digits
  accountNumber: string;
  accountType: 'checking' | 'savings';
  accountHolderName: string;
}

/**
 * International Bank Account Interface (for non-US users)
 */
export interface InternationalBankAccount {
  bankCode: string;
  accountNumber: string; // 10 digits
  accountName: string;
}

/**
 * Validate US routing number (9 digits, checksum validation)
 */
export function validateUSRoutingNumber(routingNumber: string): { valid: boolean; error?: string } {
  const digits = routingNumber.replace(/\D/g, '');
  
  if (digits.length !== 9) {
    return { valid: false, error: 'Routing number must be 9 digits' };
  }

  // Basic checksum validation (ABA routing number algorithm)
  const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1];
  let sum = 0;
  
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i]) * weights[i];
  }
  
  if (sum % 10 !== 0) {
    return { valid: false, error: 'Invalid routing number checksum' };
  }

  return { valid: true };
}

/**
 * Validate US account number
 */
export function validateUSAccountNumber(accountNumber: string): { valid: boolean; error?: string } {
  const digits = accountNumber.replace(/\D/g, '');
  
  if (digits.length < 4 || digits.length > 17) {
    return { valid: false, error: 'Account number must be between 4 and 17 digits' };
  }

  return { valid: true };
}

/**
 * Validate international account number (10 digits - common format)
 */
export function validateInternationalAccountNumber(accountNumber: string): { valid: boolean; error?: string } {
  const digits = accountNumber.replace(/\D/g, '');
  
  if (digits.length !== 10) {
    return { valid: false, error: 'Account number must be 10 digits' };
  }

  return { valid: true };
}

/**
 * Format US routing number for display (XXXX-XXXX-X)
 */
export function formatUSRoutingNumber(routingNumber: string): string {
  const digits = routingNumber.replace(/\D/g, '').slice(0, 9);
  if (digits.length === 9) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8)}`;
  }
  return routingNumber;
}

/**
 * Mask account number for display (shows last 4 digits)
 */
export function maskAccountNumber(accountNumber: string, isUS: boolean): string {
  const digits = accountNumber.replace(/\D/g, '');
  if (digits.length < 4) return '****';
  
  const last4 = digits.slice(-4);
  return isUS ? `****${last4}` : `****${last4}`;
}

