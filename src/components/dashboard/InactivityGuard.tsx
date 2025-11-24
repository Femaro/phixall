'use client';

import { useInactivityTimer } from '@/hooks/useInactivityTimer';
import InactivityWarningModal from '@/components/auth/InactivityWarningModal';
import { signOut } from 'firebase/auth';
import { getFirebase } from '@/lib/firebaseClient';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

interface InactivityGuardProps {
  children: React.ReactNode;
  /**
   * User role to determine timeout duration
   */
  role?: 'client' | 'Phixer' | 'admin';
  /**
   * Custom timeout in milliseconds (overrides role-based timeout)
   */
  customTimeout?: number;
}

/**
 * Role-based timeout configuration (in milliseconds)
 */
const ROLE_TIMEOUTS = {
  admin: 10 * 60 * 1000, // 10 minutes for admin (more sensitive)
  client: 15 * 60 * 1000, // 15 minutes for clients
  Phixer: 15 * 60 * 1000, // 15 minutes for Phixers
} as const;

export default function InactivityGuard({
  children,
  role = 'client',
  customTimeout,
}: InactivityGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Determine timeout based on role or custom value
  const timeout = customTimeout ?? ROLE_TIMEOUTS[role] ?? ROLE_TIMEOUTS.client;
  
  // Only enable on dashboard routes
  const isDashboardRoute = pathname?.startsWith('/client/') || 
                          pathname?.startsWith('/phixer/') || 
                          pathname?.startsWith('/admin/') ||
                          pathname === '/client' ||
                          pathname === '/phixer' ||
                          pathname === '/admin';

  const { showWarning, timeRemaining, extendSession } = useInactivityTimer({
    timeout,
    warningTime: 30 * 1000, // 30 seconds warning
    enabled: isDashboardRoute,
  });

  const handleExtend = () => {
    extendSession();
  };

  const handleLogout = async () => {
    try {
      const { auth } = getFirebase();
      await signOut(auth);
      router.push('/login?reason=inactivity');
    } catch (error) {
      console.error('Error signing out:', error);
      router.push('/login?reason=inactivity');
    }
  };

  return (
    <>
      {children}
      {isDashboardRoute && (
        <InactivityWarningModal
          isOpen={showWarning}
          timeRemaining={timeRemaining}
          onExtend={handleExtend}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

