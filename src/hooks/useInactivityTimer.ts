import { useEffect, useRef, useState, useCallback } from 'react';
import { signOut } from 'firebase/auth';
import { getFirebase } from '@/lib/firebaseClient';
import { useRouter } from 'next/navigation';

export interface InactivityTimerConfig {
  /**
   * Total inactivity timeout in milliseconds before logout
   * Default: 15 minutes (900000ms)
   */
  timeout?: number;
  /**
   * Time before logout to show warning in milliseconds
   * Default: 30 seconds (30000ms)
   */
  warningTime?: number;
  /**
   * Events to track for user activity
   * Default: ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
   */
  events?: string[];
  /**
   * Whether the timer is enabled
   * Default: true
   */
  enabled?: boolean;
}

const DEFAULT_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const DEFAULT_WARNING_TIME = 30 * 1000; // 30 seconds
const DEFAULT_EVENTS = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

export function useInactivityTimer(config: InactivityTimerConfig = {}) {
  const {
    timeout = DEFAULT_TIMEOUT,
    warningTime = DEFAULT_WARNING_TIME,
    events = DEFAULT_EVENTS,
    enabled = true,
  } = config;

  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(warningTime);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (!enabled) return;

    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Reset warning state
    setShowWarning(false);
    setTimeRemaining(warningTime);
    lastActivityRef.current = Date.now();

    // Set warning timeout (timeout - warningTime)
    const warningTimeout = timeout - warningTime;
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      
      // Start countdown interval
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - (lastActivityRef.current + warningTimeout);
        const remaining = Math.max(0, warningTime - elapsed);
        setTimeRemaining(remaining);
        
        if (remaining <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, 100);
    }, warningTimeout);

    // Set logout timeout
    timeoutRef.current = setTimeout(async () => {
      try {
        const { auth } = getFirebase();
        await signOut(auth);
        router.push('/login?reason=inactivity');
      } catch (error) {
        console.error('Error signing out:', error);
        // Force redirect even if signOut fails
        router.push('/login?reason=inactivity');
      }
    }, timeout);
  }, [timeout, warningTime, enabled, router]);

  const handleActivity = useCallback(() => {
    if (!enabled) return;
    resetTimer();
  }, [enabled, resetTimer]);

  const extendSession = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    if (!enabled) return;

    // Set initial timer
    resetTimer();

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, events, handleActivity, resetTimer]);

  return {
    showWarning,
    timeRemaining,
    extendSession,
  };
}

