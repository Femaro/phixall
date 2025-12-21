/**
 * Date and time utilities for US and international users
 */

/**
 * Format date based on user location
 * US: MM/DD/YYYY
 * International: DD/MM/YYYY
 */
export function formatDate(date: Date | string | number, isUS: boolean | null): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  if (isUS === null) {
    // Default during SSR
    return dateObj.toLocaleDateString('en-US');
  }

  if (isUS) {
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  return dateObj.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Format time based on user location
 * US: 12-hour format (3:45 PM)
 * International: 24-hour format (15:45)
 */
export function formatTime(date: Date | string | number, isUS: boolean | null): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  if (isUS === null) {
    return dateObj.toLocaleTimeString('en-US');
  }

  if (isUS) {
    return dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  return dateObj.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Format date and time together
 */
export function formatDateTime(date: Date | string | number, isUS: boolean | null): string {
  return `${formatDate(date, isUS)} ${formatTime(date, isUS)}`;
}

/**
 * Get timezone abbreviation based on user location
 */
export function getTimezoneAbbreviation(isUS: boolean | null): string {
  if (isUS === null) {
    return 'UTC';
  }

  if (isUS) {
    // Try to detect actual US timezone
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz.includes('Eastern')) return 'EST/EDT';
      if (tz.includes('Central')) return 'CST/CDT';
      if (tz.includes('Mountain')) return 'MST/MDT';
      if (tz.includes('Pacific')) return 'PST/PDT';
      return 'EST/EDT'; // Default to Eastern
    } catch {
      return 'EST/EDT';
    }
  }

  return 'WAT';
}

/**
 * Get business hours based on location
 */
export function getBusinessHours(isUS: boolean | null): { open: string; close: string; timezone: string } {
  if (isUS) {
    return {
      open: '9:00 AM',
      close: '5:00 PM',
      timezone: getTimezoneAbbreviation(isUS),
    };
  }

  return {
    open: '9:00 AM',
    close: '5:00 PM',
    timezone: 'WAT',
  };
}

