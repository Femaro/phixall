/**
 * Phone number utilities for formatting and validation
 */

/**
 * Get phone number placeholder based on location
 */
export function getPhonePlaceholder(isUS: boolean | null): string {
  if (isUS === null) {
    return '+234 800 000 0000'; // Default during SSR
  }
  return isUS ? '+1 (555) 123-4567' : '+234 800 000 0000';
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string, isUS: boolean | null): string {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  if (isUS) {
    // US format: (555) 123-4567
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 11 && digits[0] === '1') {
      // With country code
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
  } else {
    // International format: +234 800 000 0000 (example)
    if (digits.length === 11 && digits[0] === '0') {
      // Remove leading 0 and add +234
      return `+234 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
    } else if (digits.length === 13 && digits.startsWith('234')) {
      // Already has country code
      return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
    } else if (digits.length === 10) {
      // 10 digits, assume international format
      return `+234 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }
  }
  
  // Return as-is if can't format
  return phone;
}

/**
 * Validate phone number based on location
 */
export function validatePhoneNumber(phone: string, isUS: boolean | null): { valid: boolean; error?: string } {
  const digits = phone.replace(/\D/g, '');
  
  if (isUS) {
    // US: 10 digits (with or without country code)
    if (digits.length === 10) {
      return { valid: true };
    } else if (digits.length === 11 && digits[0] === '1') {
      return { valid: true };
    }
    return { valid: false, error: 'Please enter a valid US phone number (10 digits)' };
  } else {
    // International: 11 digits (starting with 0) or 13 digits (with country code)
    if (digits.length === 11 && digits[0] === '0') {
      return { valid: true };
    } else if (digits.length === 13 && digits.startsWith('234')) {
      return { valid: true };
    } else if (digits.length === 10) {
      return { valid: true }; // Assume international format without leading 0
    }
    return { valid: false, error: 'Please enter a valid phone number' };
  }
}

