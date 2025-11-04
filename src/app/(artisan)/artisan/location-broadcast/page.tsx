'use client';
export const dynamic = 'force-dynamic';
import React, { useEffect, useRef, useState } from 'react';
import { getFirebase } from '@/lib/firebaseClient';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function LocationBroadcastPage() {
	const [broadcasting, setBroadcasting] = useState(false);
	const watchIdRef = useRef<number | null>(null);

	useEffect(() => {
		return () => {
			if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
		};
	}, []);

  function start(): void {
    const { db } = getFirebase();
    const id = navigator.geolocation.watchPosition(async (pos) => {
      const payload = { lat: pos.coords.latitude, lng: pos.coords.longitude, updatedAt: serverTimestamp() } as any;
      // TODO: replace job-123 and artisan-uid
      await setDoc(doc(db, 'jobLocations', 'job-123'), { artisan: payload }, { merge: true });
    });
		watchIdRef.current = id;
		setBroadcasting(true);
	}

	function stop(): void {
		if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
		watchIdRef.current = null;
		setBroadcasting(false);
	}

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="mx-auto max-w-4xl">
				<h1 className="text-2xl font-semibold">Broadcast Location</h1>
				<p className="mt-1 text-sm text-gray-600">Send your current coordinates to clients in real-time.</p>
				<div className="mt-4 space-x-3">
					<button onClick={start} disabled={broadcasting} className="rounded-lg bg-black px-4 py-2.5 text-white disabled:opacity-60">Start</button>
					<button onClick={stop} disabled={!broadcasting} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm hover:bg-gray-50">Stop</button>
				</div>
			</div>
		</div>
	);
}
