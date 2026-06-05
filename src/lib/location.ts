/**
 * Location detection utilities for determining if user is in the United States
 */

/**
 * Detects if the user is likely in the United States based on browser locale and timezone
 * This is a client-side detection that works without requiring geolocation permissions
 */
export function isUSUser(): boolean {
  if (typeof window === 'undefined') {
    // Server-side: default to false, will be determined client-side
    return false;
  }

  // Check timezone (most reliable client-side indicator)
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const usTimezones = [
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'America/Phoenix', 'America/Anchorage', 'America/Adak', 'Pacific/Honolulu',
    'America/Detroit', 'America/Indiana/Indianapolis', 'America/Indiana/Vincennes',
    'America/Indiana/Winamac', 'America/Indiana/Marengo', 'America/Indiana/Petersburg',
    'America/Indiana/Vevay', 'America/Kentucky/Louisville', 'America/Kentucky/Monticello',
    'America/Indiana/Tell_City', 'America/Indiana/Knox', 'America/Menominee',
    'America/North_Dakota/Center', 'America/North_Dakota/New_Salem',
    'America/North_Dakota/Beulah', 'America/Boise', 'America/Juneau',
    'America/Sitka', 'America/Metlakatla', 'America/Yakutat', 'America/Nome'
  ];
  
  // Check if timezone starts with America/ and is in our US list
  if (timezone.startsWith('America/') || timezone.startsWith('Pacific/')) {
    if (usTimezones.some(tz => timezone === tz)) {
      return true;
    }
    // Additional check: if it's an America timezone, check common US patterns
    if (timezone.includes('New_York') || timezone.includes('Los_Angeles') || 
        timezone.includes('Chicago') || timezone.includes('Denver') ||
        timezone.includes('Phoenix') || timezone.includes('Anchorage')) {
      return true;
    }
  }

  // Check locale/language
  const locale = navigator.language || navigator.languages?.[0] || 'en';
  if (locale.startsWith('en-US')) {
    return true;
  }

  // Fallback: check if locale country code is US
  const parts = locale.split('-');
  if (parts.length > 1 && parts[1] === 'US') {
    return true;
  }

  return false;
}

/**
 * Hook to get user location status (client-side only)
 * Returns null on server-side, boolean on client-side
 */
export function useIsUSUser(): boolean | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return isUSUser();
}

/**
 * Get company name based on user location
 */
export function getCompanyName(_isUS: boolean | null): string {
  return 'Phixall Technical Company Limited';
}

/**
 * Get owner/operator text for marketing copy
 */
export function getOwnerText(_isUS: boolean | null): string {
  return 'Phixall, a product of Phixall Technical Company Limited';
}

/**
 * US States list for validation
 */
export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia'
];

/**
 * Check if a user profile indicates they are in the US
 * Checks state, address, and coordinates
 */
export function isUSProfile(profile: {
  state?: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
} | null | undefined): boolean {
  if (!profile) return false;

  // Check state
  if (profile.state) {
    const stateUpper = profile.state.trim();
    if (US_STATES.some(usState => usState.toLowerCase() === stateUpper.toLowerCase())) {
      return true;
    }
    // Check common abbreviations
    const usStateAbbr = [
      'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID',
      'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN',
      'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND',
      'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT',
      'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
    ];
    if (usStateAbbr.includes(stateUpper.toUpperCase())) {
      return true;
    }
  }

  // Check address for US indicators
  if (profile.address) {
    const addressUpper = profile.address.toUpperCase();
    // Check for US zip code pattern (5 digits or 5+4)
    if (/\b\d{5}(-\d{4})?\b/.test(profile.address)) {
      return true;
    }
    // Check for common US address patterns
    if (addressUpper.includes('USA') || addressUpper.includes('UNITED STATES') || 
        addressUpper.includes('US,') || addressUpper.endsWith(', US')) {
      return true;
    }
  }

  // Check coordinates - US is roughly between 24-50°N and 66-125°W
  if (profile.coordinates?.lat && profile.coordinates?.lng) {
    const { lat, lng } = profile.coordinates;
    // US mainland bounds (approximate)
    if (lat >= 24 && lat <= 50 && lng >= -125 && lng <= -66) {
      return true;
    }
    // Alaska bounds (approximate)
    if (lat >= 51 && lat <= 72 && lng >= -180 && lng <= -130) {
      return true;
    }
    // Hawaii bounds (approximate)
    if (lat >= 18 && lat <= 23 && lng >= -161 && lng <= -154) {
      return true;
    }
  }  return false;
}
