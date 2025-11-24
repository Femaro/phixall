'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getFirebase } from '@/lib/firebaseClient';
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Topbar from "@/components/site/Topbar";
import InactivityGuard from "@/components/dashboard/InactivityGuard";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<'client' | 'Phixer' | 'admin'>('client');
  
  // Check if current path is a dashboard route (not marketing pages)
  const isDashboard = pathname?.startsWith('/client/') || 
                      pathname?.startsWith('/phixer/') || 
                      pathname?.startsWith('/admin/') ||
                      pathname === '/client' ||
                      pathname === '/phixer' ||
                      pathname === '/admin';

  // Get user role for inactivity timer configuration
  useEffect(() => {
    if (!isDashboard) return;

    const { auth, db } = getFirebase();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const profileRef = doc(db, 'profiles', user.uid);
          const profileSnap = await getDoc(profileRef);
          if (profileSnap.exists()) {
            const role = profileSnap.data().role;
            const normalizedRole = typeof role === 'string' ? role : String(role);
            if (normalizedRole === 'admin') {
              setUserRole('admin');
            } else if (normalizedRole === 'Phixer' || normalizedRole === 'phixer' || normalizedRole === 'artisan') {
              setUserRole('Phixer');
            } else {
              setUserRole('client');
            }
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
    });

    return () => unsubscribe();
  }, [isDashboard]);

  return (
    <>
      {!isDashboard && <Topbar />}
      {!isDashboard && <Navbar />}
      <InactivityGuard role={userRole}>
        {children}
      </InactivityGuard>
      {!isDashboard && <Footer />}
    </>
  );
}


