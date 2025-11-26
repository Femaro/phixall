'use client';

import React, { useMemo } from 'react';

interface PhixerWithDistance {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  state?: string;
  coordinates?: { lat: number; lng: number };
  distance?: number; // in km
  status?: string;
  available?: boolean;
}

interface JobLocationViewProps {
  job: {
    id: string;
    title: string;
    serviceCoordinates?: { lat: number; lng: number } | null;
    serviceAddress?: {
      description?: string;
      lat?: number;
      lng?: number;
    };
    serviceState?: string;
  };
  phixers: PhixerWithDistance[];
  onSelectPhixer?: (phixerId: string) => void;
}

const EARTH_RADIUS_KM = 6371;

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function calculateDistanceKm(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): number {
  const dLat = toRadians(destination.lat - origin.lat);
  const dLon = toRadians(destination.lng - origin.lng);
  const lat1 = toRadians(origin.lat);
  const lat2 = toRadians(destination.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export default function JobLocationView({ job, phixers, onSelectPhixer }: JobLocationViewProps) {
  const jobLocation = job.serviceCoordinates || (job.serviceAddress?.lat && job.serviceAddress?.lng 
    ? { lat: job.serviceAddress.lat, lng: job.serviceAddress.lng } 
    : null);

  const phixersWithDistance = useMemo(() => {
    // Filter to only available Phixers
    const availablePhixers = phixers.filter(p => p.available === true && p.status === 'active');
    
    if (!jobLocation) return availablePhixers.map(p => ({ ...p, distance: undefined }));

    return availablePhixers
      .map((phixer) => {
        if (!phixer.coordinates?.lat || !phixer.coordinates?.lng) {
          return { ...phixer, distance: undefined };
        }

        const distance = calculateDistanceKm(
          { lat: jobLocation.lat, lng: jobLocation.lng },
          { lat: phixer.coordinates.lat, lng: phixer.coordinates.lng }
        );

        return { ...phixer, distance };
      })
      .sort((a, b) => {
        // Sort by distance (undefined distances go to end)
        if (a.distance === undefined && b.distance === undefined) return 0;
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      });
  }, [phixers, jobLocation]);

  const phixersWithLocation = phixersWithDistance.filter(p => p.distance !== undefined);
  const phixersWithoutLocation = phixersWithDistance.filter(p => p.distance === undefined);

  return (
    <div className="space-y-4">
      {/* Job Location */}
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <h4 className="text-sm font-semibold text-neutral-900 mb-2">Job Location</h4>
        {jobLocation ? (
          <div className="space-y-1 text-sm">
            <p className="text-neutral-700">
              <strong>Coordinates:</strong> {jobLocation.lat.toFixed(6)}, {jobLocation.lng.toFixed(6)}
            </p>
            {job.serviceAddress?.description && (
              <p className="text-neutral-700">
                <strong>Address:</strong> {job.serviceAddress.description}
              </p>
            )}
            {job.serviceState && (
              <p className="text-neutral-700">
                <strong>State:</strong> {job.serviceState}
              </p>
            )}
            <a
              href={`https://www.google.com/maps?q=${jobLocation.lat},${jobLocation.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 text-sm font-medium mt-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View on Google Maps
            </a>
          </div>
        ) : (
          <p className="text-sm text-neutral-600">No location data available for this job.</p>
        )}
      </div>

      {/* Nearby Phixers */}
      <div>
        <h4 className="text-sm font-semibold text-neutral-900 mb-3">
          Available Nearby Phixers ({phixersWithLocation.length})
        </h4>
        
        {phixersWithLocation.length === 0 ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <p>No Phixers found with location data near this job.</p>
            {phixersWithoutLocation.length > 0 && (
              <p className="mt-2 text-xs">
                {phixersWithoutLocation.length} Phixer(s) without location data available.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {phixersWithLocation.map((phixer) => (
              <div
                key={phixer.id}
                className={`rounded-lg border p-3 ${
                  phixer.distance && phixer.distance <= 10
                    ? 'border-green-200 bg-green-50'
                    : phixer.distance && phixer.distance <= 25
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-neutral-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-semibold text-neutral-900">{phixer.name || phixer.email}</h5>
                      {phixer.available && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          Available
                        </span>
                      )}
                      {phixer.status === 'active' && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="mt-1 space-y-0.5 text-xs text-neutral-600">
                      {phixer.email && <p>{phixer.email}</p>}
                      {phixer.phone && <p>{phixer.phone}</p>}
                      {phixer.address && <p>{phixer.address}</p>}
                      {phixer.state && <p>State: {phixer.state}</p>}
                      {phixer.coordinates && (
                        <p className="text-neutral-500">
                          Location: {phixer.coordinates.lat.toFixed(4)}, {phixer.coordinates.lng.toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    {phixer.distance !== undefined && (
                      <div className="mb-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            phixer.distance <= 10
                              ? 'bg-green-100 text-green-700'
                              : phixer.distance <= 25
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          {phixer.distance.toFixed(1)} km
                        </span>
                      </div>
                    )}
                    {onSelectPhixer && (
                      <button
                        onClick={() => onSelectPhixer(phixer.id)}
                        className="rounded bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
                      >
                        Assign
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Phixers without location */}
        {phixersWithoutLocation.length > 0 && (
          <div className="mt-4">
            <h5 className="text-xs font-semibold text-neutral-600 mb-2">
              Phixers Without Location ({phixersWithoutLocation.length})
            </h5>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {phixersWithoutLocation.map((phixer) => (
                <div
                  key={phixer.id}
                  className="rounded border border-neutral-200 bg-neutral-50 p-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-neutral-700">
                      {phixer.name || phixer.email}
                    </span>
                    {onSelectPhixer && (
                      <button
                        onClick={() => onSelectPhixer(phixer.id)}
                        className="rounded bg-neutral-600 px-2 py-1 text-xs font-medium text-white hover:bg-neutral-700"
                      >
                        Assign
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

