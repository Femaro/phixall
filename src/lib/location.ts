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
export function getCompanyName(isUS: boolean | null): string {
  if (isUS === null) {
    // Server-side: return generic name
    return 'Phixall';
  }
  return isUS ? 'Claeva International LLC' : 'Phixall Technical Company Limited';
}

/**
 * Get owner/operator text based on user location
 */
export function getOwnerText(isUS: boolean | null): string {
  if (isUS === null) {
    return 'Phixall';
  }
  if (isUS) {
    return 'Phixall, a product of Claeva International LLC';
  }
  return 'Phixall';
}

