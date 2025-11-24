'use client';
export const dynamic = 'force-dynamic';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { getFirebase } from '@/lib/firebaseClient';
import { doc, updateDoc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';

export default function LocationBroadcastPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm text-neutral-600">Loading broadcast tools...</div>}>
      <LocationBroadcastContent />
    </Suspense>
  );
}

function LocationBroadcastContent() {
	const [broadcasting, setBroadcasting] = useState(false);
	const watchIdRef = useRef<number | null>(null);
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');
  const overrideArtisanId = searchParams.get('artisanId');
  const [authUserId, setAuthUserId] = useState<string | null>(null);

	useEffect(() => {
    const { auth } = getFirebase();
    let unsubscribeAuth: (() => void) | undefined;
    let cancelled = false;
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      if (cancelled) return;
      unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
        setAuthUserId(currentUser?.uid ?? null);
      });
    });
		return () => {
      cancelled = true;
      if (unsubscribeAuth) unsubscribeAuth();
			if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
		};
	}, []);

  function start(): void {
    if (!jobId) {
      alert('Missing jobId in URL. Example: /phixer/location-broadcast?jobId=abc123');
      return;
    }
    const { auth, db } = getFirebase();
    const uid = overrideArtisanId || auth.currentUser?.uid || authUserId;
    if (!uid) {
      alert('You must be signed in to broadcast your location.');
      return;
    }
    if (!navigator.geolocation) {
      alert('Geolocation is not supported in this browser.');
      return;
    }
    const id = navigator.geolocation.watchPosition(async (pos) => {
      try {
        const locationRef = doc(db, 'jobLocations', jobId);
        // Use updateDoc with dot notation to create nested structure: Phixers.{uid}.{lat, lng, updatedAt}
        // updateDoc will create the document if it doesn't exist when using dot notation
        await updateDoc(locationRef, {
          [`Phixers.${uid}.lat`]: pos.coords.latitude,
          [`Phixers.${uid}.lng`]: pos.coords.longitude,
          [`Phixers.${uid}.updatedAt`]: serverTimestamp(),
        });
      } catch (error: any) {
        // If updateDoc fails (e.g., permission denied), try setDoc with merge as fallback
        if (error?.code === 'not-found' || error?.code === 'permission-denied') {
          try {
            const locationRef = doc(db, 'jobLocations', jobId);
            // Read existing document to preserve other Phixers' locations
            const locationDoc = await getDoc(locationRef);
            const existingData = locationDoc.exists() ? locationDoc.data() : {};
            
            // Merge new location into existing Phixers object
            await setDoc(locationRef, {
              ...existingData,
              Phixers: {
                ...(existingData.Phixers || {}),
                [uid]: {
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                  updatedAt: serverTimestamp(),
                }
              }
            }, { merge: true });
          } catch (fallbackError) {
            console.error('Error broadcasting location (fallback):', fallbackError);
            alert('Failed to broadcast location. Please try again.');
          }
        } else {
          console.error('Error broadcasting location', error);
          alert('Failed to broadcast location. Please try again.');
        }
      }
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
				<p className="mt-1 text-sm text-gray-600">
          Send your current coordinates to clients in real-time.
          {jobId ? ` (Job: ${jobId})` : ' Add ?jobId=YOUR_JOB_ID to the URL to begin.'}
        </p>
				<div className="mt-4 space-x-3">
					<button onClick={start} disabled={broadcasting} className="rounded-lg bg-black px-4 py-2.5 text-white disabled:opacity-60">Start</button>
					<button onClick={stop} disabled={!broadcasting} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm hover:bg-gray-50">Stop</button>
				</div>
			</div>
		</div>
	);
}
