'use client';
export const dynamic = 'force-dynamic';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { getFirebase } from '@/lib/firebaseClient';
import { doc, onSnapshot } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';

export default function ClientTrackingPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm text-neutral-600">Loading tracking...</div>}>
      <ClientTrackingContent />
    </Suspense>
  );
}

function ClientTrackingContent() {
	const mapRef = useRef<HTMLDivElement | null>(null);
	const [status, setStatus] = useState('Loading map…');
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');
  const phixerId = searchParams.get('phixerId') || searchParams.get('artisanId'); // Support both for backward compatibility

	useEffect(() => {
    	let map: google.maps.Map | null = null;
    	let artisanMarker: google.maps.Marker | null = null;
    	let ignore = false;
        let unsubscribe: undefined | (() => void);

		async function init() {
      if (!jobId || !phixerId) {
        setStatus('Missing job or Phixer identifier');
        return;
      }
			try {
                const loader = new Loader({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '', version: 'weekly' });
                const googleObj = await loader.load();
                if (!mapRef.current) return;
                map = new googleObj.maps.Map(mapRef.current, { center: { lat: 6.5244, lng: 3.3792 }, zoom: 11 });
				setStatus('Listening for Phixer location…');

                // Firestore live updates for a demo job id
                const { db } = getFirebase();
                const unsub = onSnapshot(doc(db, 'jobLocations', jobId), (snap) => {
                    if (ignore) return;
                    const data = snap.data() as any;
                    // Support both new Phixers field and legacy artisans field for backward compatibility
                    const loc = data?.Phixers?.[phixerId] || data?.artisans?.[phixerId];
                    const lat = loc?.lat;
                    const lng = loc?.lng;
                    if (typeof lat === 'number' && typeof lng === 'number' && map) {
                        if (!artisanMarker) {
                            artisanMarker = new googleObj.maps.Marker({ position: { lat, lng }, map, label: 'A' });
                        } else {
                            artisanMarker.setPosition({ lat, lng });
                        }
                        map.setCenter({ lat, lng });
                        setStatus('Tracking Phixer…');
                    } else {
                      setStatus('Waiting for Phixer updates…');
                    }
                });

				// Optionally show client location if permitted
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition((pos) => {
            if (!map) return;
						const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
						new googleObj.maps.Marker({ position: coords, map, label: 'C' });
					});
				}

                unsubscribe = unsub;
                return;
			} catch {
				setStatus('Failed to load map');
			}
		}

        init();
		return () => {
			ignore = true;
            if (unsubscribe) unsubscribe();
            artisanMarker?.setMap(null);
            map = null;
		};
	}, [jobId, phixerId]);

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="mx-auto max-w-4xl">
				<h1 className="text-2xl font-semibold">Live Tracking</h1>
				<p className="mt-1 text-sm text-gray-600">{status}</p>
				<div ref={mapRef} className="mt-4 h-[60vh] w-full rounded-xl border border-gray-200 bg-white" />
			</div>
		</div>
	);
}
