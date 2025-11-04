'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardPage(): JSX.Element {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!isMounted) return;
      const session = data.session;
      if (!session) {
        window.location.href = '/login';
        return;
      }
      setEmail(session.user.email ?? null);
      // Ensure profile row exists (safe no-op if already present)
      try {
        await fetch('/api/profile/init', { method: 'POST' });
      } catch (_e) {
        // ignore
      }
      setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-700">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <a
            href="/logout"
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-100"
          >
            Sign out
          </a>
        </div>
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-gray-800">Welcome{email ? `, ${email}` : ''}.</p>
          <p className="mt-1 text-sm text-gray-600">
            This page is protected. You were redirected here after authentication.
          </p>
        </div>
      </div>
    </div>
  );
}


