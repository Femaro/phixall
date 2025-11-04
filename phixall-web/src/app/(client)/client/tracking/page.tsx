'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export default function ClientTrackingPage(): JSX.Element {
	const mapRef = useRef<HTMLDivElement | null>(null);
	const [status, setStatus] = useState('Loading map…');

	useEffect(() => {
		let map: google.maps.Map | null = null;
		let artisanMarker: google.maps.Marker | null = null;
		let clientMarker: google.maps.Marker | null = null;
		let ignore = false;

		async function init() {
			try {
				const loader = new Loader({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '', version: 'weekly' });
				const googleObj = await loader.load();
				if (!mapRef.current) return;
				map = new googleObj.maps.Map(mapRef.current, { center: { lat: 6.5244, lng: 3.3792 }, zoom: 11 });
				setStatus('Listening for artisan location…');

                // TODO: Replace with Firebase-based realtime channel (e.g., Firestore onSnapshot)

				// Optionally show client location if permitted
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition((pos) => {
						const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
						clientMarker = new googleObj.maps.Marker({ position: coords, map, label: 'C' });
					});
				}

                return () => {};
			} catch (_e) {
				setStatus('Failed to load map');
			}
		}

		const cleanup = init();
		return () => {
			ignore = true;
			if (typeof cleanup === 'function') cleanup();
		};
	}, []);

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
