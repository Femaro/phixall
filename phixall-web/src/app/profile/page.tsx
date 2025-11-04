'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';

export default function ProfilePage(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!isMounted) return;
      const session = data.session;
      if (!session) {
        window.location.href = '/login';
        return;
      }
      setUserId(session.user.id);
      setEmail(session.user.email ?? null);

      // Try to load existing avatar via public URL convention
      // We look for a file at avatars/<userId>/avatar
      const path = `${session.user.id}/avatar`;
      const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
      if (pub && pub.publicUrl) {
        setAvatarUrl(pub.publicUrl);
      }
      setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const files = e.target.files;
    if (!files || files.length === 0 || !userId) return;
    const file = files[0];
    setUploading(true);
    try {
      // Store at avatars/<userId>/avatar (no extension needed)
      const filePath = `${userId}/avatar`;
      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true, cacheControl: '3600' });
      if (error) throw error;

      const { data: pub } = supabase.storage.from('avatars').getPublicUrl(filePath);
      if (pub && pub.publicUrl) {
        setAvatarUrl(pub.publicUrl + `?t=${Date.now()}`);
      }

      // Optionally update profile row if column exists (safe to ignore failures)
      try {
        await supabase.from('profiles').update({ avatar_url: filePath }).eq('id', userId);
      } catch (_e) {
        // ignore if column doesn't exist
      }
    } catch (_e) {
      // noop – UI stays as-is
    } finally {
      setUploading(false);
      // reset input value to allow re-upload of same file
      e.currentTarget.value = '';
    }
  }

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
          <h1 className="text-2xl font-semibold">Profile</h1>
          <a
            href="/logout"
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-100"
          >
            Sign out
          </a>
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-full bg-gray-100">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                  No avatar
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">{email ?? '—'}</p>
              <p className="text-sm text-gray-600">User ID: {userId}</p>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">Upload new avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="mt-1 block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border file:border-gray-300 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-gray-50"
            />
            {uploading && <p className="mt-2 text-sm text-gray-600">Uploading…</p>}
          </div>
        </div>

        <div className="mt-4">
          <a href="/dashboard" className="text-sm text-black underline-offset-2 hover:underline">
            Back to dashboard
          </a>
        </div>
      </div>
    </div>
  );
}


