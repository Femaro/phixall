import { NextResponse } from 'next/server';

export async function middleware() {
	// Supabase middleware removed. For Firebase, protect routes client-side or implement session cookies.
	return NextResponse.next();
}

export const config = { matcher: [] };
