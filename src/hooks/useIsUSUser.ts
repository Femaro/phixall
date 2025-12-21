'use client';

import { useState, useEffect } from 'react';
import { isUSUser } from '@/lib/location';

/**
 * Client-side hook to detect if user is in the United States
 * Returns null during initial render (SSR), then boolean once client-side detection completes
 */
export function useIsUSUser(): boolean | null {
  const [isUS, setIsUS] = useState<boolean | null>(null);

  useEffect(() => {
    // Only run on client-side
    setIsUS(isUSUser());
  }, []);

  return isUS;
}

