'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { auth, db } from '@/lib/firebaseClient';
import { doc, updateDoc } from 'firebase/firestore';

export default function ArtisanDashboardPage(): JSX.Element {
	const [available, setAvailable] = useState(false);
	const [jobs, setJobs] = useState<Array<{ id: string; title: string; distance_km?: number }>>([]);

  useEffect(() => {
    // TODO: Wire realtime jobs via Firestore or WebSocket backend
  }, []);

  async function toggleAvailability(): Promise<void> {
    const next = !available;
    setAvailable(next);
    try {
      const uid = auth.currentUser?.uid;
      if (uid) await updateDoc(doc(db, 'profiles', uid), { available: next });
    } catch {}
  }

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="mx-auto max-w-4xl">
                <div className="flex items-center justify-between">
					<h1 className="text-2xl font-semibold">Artisan Dashboard</h1>
                    <button onClick={async ()=>{ const { signOut } = await import('firebase/auth'); await signOut(auth); window.location.href='/login'; }} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-100">Sign out</button>
				</div>

				<div className="mt-6 grid gap-6 md:grid-cols-2">
					<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
						<h2 className="text-lg font-medium">Availability</h2>
						<button onClick={toggleAvailability} className={`mt-3 rounded-lg px-4 py-2.5 text-white ${available ? 'bg-green-600' : 'bg-gray-700'}`}>
							{available ? 'Available' : 'Go Available'}
						</button>
						<p className="mt-2 text-sm text-gray-600">Receive new job alerts when available.</p>
					</div>

					<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
						<h2 className="text-lg font-medium">Job Notifications</h2>
						<ul className="mt-3 space-y-2">
							{jobs.length === 0 && <li className="text-sm text-gray-600">No jobs yet…</li>}
							{jobs.map((j) => (
								<li key={j.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
									<div>
										<p className="font-medium">{j.title}</p>
										<p className="text-xs text-gray-600">{j.distance_km ? `${j.distance_km} km away` : 'Distance unknown'}</p>
									</div>
									<div className="space-x-2">
										<button className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">Decline</button>
										<button className="rounded-md bg-black px-3 py-1.5 text-sm text-white hover:opacity-90">Accept</button>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
