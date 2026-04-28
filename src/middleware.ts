import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const GEO_OPT_OUT_COOKIE = 'geo_redirect_opt_out';
const BYPASS_QUERY = 'bypass_geo';

const PHIXALL_US_ORIGIN = 'https://phixall.us';

function normalizeHost(host: string): string {
	return host.split(',')[0]?.trim().replace(/:\d+$/, '').toLowerCase() ?? '';
}

function isPhixallUsHostname(host: string): boolean {
	const h = normalizeHost(host);
	return h === 'phixall.us' || h.endsWith('.phixall.us');
}

function isPhixallDotComHostname(host: string): boolean {
	const h = normalizeHost(host);
	return h === 'phixall.com' || h === 'www.phixall.com';
}

function clientIp(request: NextRequest): string | undefined {
	const xff = request.headers.get('x-forwarded-for');
	const first = xff?.split(',')[0]?.trim();
	if (first) return first;
	return request.headers.get('x-real-ip')?.trim() ?? undefined;
}

function isAllowlistedIp(request: NextRequest): boolean {
	const raw = process.env.US_REDIRECT_ALLOWLIST_IPS;
	if (!raw) return false;
	const ip = clientIp(request);
	if (!ip) return false;
	const allowed = raw
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
	return allowed.includes(ip);
}

function hasOptOutCookie(request: NextRequest): boolean {
	return request.cookies.get(GEO_OPT_OUT_COOKIE)?.value === '1';
}

function isGeoRedirectDisabledByEnv(): boolean {
	if (process.env.NODE_ENV === 'development') return true;
	if (
		process.env.VERCEL_ENV === 'preview' &&
		process.env.ENABLE_US_DOTCOM_REDIRECT !== 'true'
	) {
		return true;
	}
	return false;
}

/**
 * US visitors on phixall.com → phixall.us (307, path + query preserved).
 * Bypass: US_REDIRECT_ALLOWLIST_IPS, cookie from ?bypass_geo=US_REDIRECT_BYPASS_SECRET.
 */
export function middleware(request: NextRequest) {
	const hostname = request.headers.get('host') || '';
	const { pathname, search } = request.nextUrl;

	if (isPhixallUsHostname(hostname)) {
		if (pathname.startsWith('/us')) {
			return NextResponse.next();
		}
		if (pathname === '/' || pathname === '') {
			const url = request.nextUrl.clone();
			url.pathname = '/us';
			return NextResponse.redirect(url);
		}
		return NextResponse.next();
	}

	if (!isPhixallDotComHostname(hostname)) {
		return NextResponse.next();
	}

	const bypassSecret = process.env.US_REDIRECT_BYPASS_SECRET;
	const queryBypass = request.nextUrl.searchParams.get(BYPASS_QUERY);
	if (bypassSecret && queryBypass === bypassSecret) {
		const res = NextResponse.next();
		res.cookies.set(GEO_OPT_OUT_COOKIE, '1', {
			httpOnly: true,
			secure: process.env.NODE_ENV !== 'development',
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 24 * 90,
		});
		return res;
	}

	if (isAllowlistedIp(request) || hasOptOutCookie(request)) {
		return NextResponse.next();
	}

	if (isGeoRedirectDisabledByEnv()) {
		return NextResponse.next();
	}

	/** Vercel: `request.geo` at runtime on edge; typings may omit `geo`. */
	const geoCountry =
		request.headers.get('x-vercel-ip-country') ??
		(
			request as NextRequest & {
				geo?: { country?: string };
			}
		).geo?.country;
	if (geoCountry !== 'US') {
		return NextResponse.next();
	}

	const target = `${PHIXALL_US_ORIGIN}${pathname}${search}`;
	return NextResponse.redirect(target, 307);
}

export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
};
