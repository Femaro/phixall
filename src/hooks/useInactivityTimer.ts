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

  const clearAllTimers = useCallback(() => {
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
  }, []);

  const resetTimer = useCallback(() => {
    if (!enabled) {
      clearAllTimers();
      setShowWarning(false);
      return;
    }

    // Clear existing timeouts
    clearAllTimers();

    // Reset warning state
    setShowWarning(false);
    setTimeRemaining(warningTime);
    lastActivityRef.current = Date.now();

    // Set warning timeout (timeout - warningTime)
    const warningTimeout = timeout - warningTime;
    warningTimeoutRef.current = setTimeout(() => {
      if (!enabled) return;
      setShowWarning(true);
      
      // Start countdown interval
      intervalRef.current = setInterval(() => {
        if (!enabled) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return;
        }
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
      if (!enabled) return;
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
  }, [timeout, warningTime, enabled, router, clearAllTimers]);

  const handleActivity = useCallback(() => {
    if (!enabled) return;
    resetTimer();
  }, [enabled, resetTimer]);

  const extendSession = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  // Set up event listeners (always track activity, even if timer is disabled)
  useEffect(() => {
    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [events, handleActivity]);

  // Initialize and manage timer based on enabled state
  useEffect(() => {
    if (enabled) {
      // Start timer when enabled
      resetTimer();
    } else {
      // Clear everything when disabled
      clearAllTimers();
      setShowWarning(false);
      setTimeRemaining(warningTime);
    }

    // Cleanup on unmount
    return () => {
      clearAllTimers();
    };
  }, [enabled, resetTimer, clearAllTimers, warningTime]);

  return {
    showWarning,
    timeRemaining,
    extendSession,
  };
}

