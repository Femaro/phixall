'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Topbar from "@/components/site/Topbar";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Check if current path is a dashboard route (not marketing pages)
  const isDashboard = pathname?.startsWith('/client/') || 
                      pathname?.startsWith('/artisan/') || 
                      pathname?.startsWith('/admin/') ||
                      pathname === '/client' ||
                      pathname === '/artisan' ||
                      pathname === '/admin';

  return (
    <>
      {!isDashboard && <Topbar />}
      {!isDashboard && <Navbar />}
      {children}
      {!isDashboard && <Footer />}
    </>
  );
}


