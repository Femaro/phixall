import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = new URL(req.url);
  const pathname = url.pathname;

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isProtected = pathname.startsWith('/dashboard') || pathname.startsWith('/profile');

  if (!session && isProtected) {
    const loginUrl = new URL('/login', url.origin);
    return NextResponse.redirect(loginUrl);
  }

  if (session && isAuthPage) {
    const dashboardUrl = new URL('/dashboard', url.origin);
    return NextResponse.redirect(dashboardUrl);
  }

  return res;
}

export const config = {
  matcher: ['/login', '/register', '/dashboard/:path*', '/profile/:path*'],
};


