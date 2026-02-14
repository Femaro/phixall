import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
	const hostname = request.headers.get('host') || '';
	
	// If accessing from phixall.us domain, redirect to /us routes
	if (hostname.includes('phixall.us')) {
		const { pathname, search } = request.nextUrl;
		
		// If already on /us route, continue normally
		if (pathname.startsWith('/us')) {
			return NextResponse.next();
		}
		
		// If on root or other routes, redirect to /us equivalent
		if (pathname === '/' || pathname === '') {
			// Redirect root to /us homepage
			const url = request.nextUrl.clone();
			url.pathname = '/us';
			return NextResponse.redirect(url);
		}
		
		// For other routes, optionally redirect to /us or show 404
		// For now, let them through
		return NextResponse.next();
	}
	
	// For phixall.com or other domains, continue normally
	return NextResponse.next();
}

export const config = { 
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	]
};
