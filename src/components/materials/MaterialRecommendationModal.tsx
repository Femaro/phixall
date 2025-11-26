'use client';

import React, { useState, useEffect } from 'react';
import { getFirebase } from '@/lib/firebaseClient';
import { collection, addDoc, serverTimestamp, doc, getDoc, query, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { MaterialCatalogItem } from '@/types/materialCatalog';

interface MaterialRecommendationModalProps {
  jobId: string;
  jobTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MaterialRecommendationModal({
  jobId,
  jobTitle,
  isOpen,
  onClose,
  onSuccess,
}: MaterialRecommendationModalProps) {
  const [formData, setFormData] = useState({
    materialName: '',
    quantity: 1,
    unitCost: 0,
    note: '',
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [catalogMaterials, setCatalogMaterials] = useState<MaterialCatalogItem[]>([]);
  const [selectedCatalogMaterial, setSelectedCatalogMaterial] = useState<string | null>(null);
  const [useCatalog, setUseCatalog] = useState(true);

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        console.error('Error getting location:', err);
        setError('Unable to get your location. You can still submit without location.');
      }
    );
  };

  // Load material catalog
  useEffect(() => {
    if (!isOpen) return;

    const { db } = getFirebase();
    const unsubscribe = onSnapshot(collection(db, 'materialCatalog'), (snapshot) => {
      const materials = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as MaterialCatalogItem))
        .filter(m => m.isActive)
        .sort((a, b) => a.name.localeCompare(b.name));
      setCatalogMaterials(materials);
    });

    return () => unsubscribe();
  }, [isOpen]);

  // Auto-get location when modal opens
  React.useEffect(() => {
    if (isOpen && !location) {
      getCurrentLocation();
    }
  }, [isOpen]);

  // When catalog material is selected, populate form
  useEffect(() => {
    if (selectedCatalogMaterial && useCatalog && catalogMaterials.length > 0) {
      const material = catalogMaterials.find(m => m.id === selectedCatalogMaterial);
      if (material) {
        setFormData(prev => ({
          ...prev,
          materialName: material.name,
          unitCost: material.estimatedCostRange?.min || 0,
        }));
      }
    }
  }, [selectedCatalogMaterial, useCatalog, catalogMaterials]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo size must be less than 5MB');
        return;
      }
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateTotal = () => {
    return formData.quantity * formData.unitCost;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const { auth, db, storage } = getFirebase();
      const user = auth.currentUser;

      if (!user) {
        setError('You must be logged in to recommend materials');
        setSubmitting(false);
        return;
      }

      // Validate form
      if (!formData.materialName.trim()) {
        setError('Material name is required');
        setSubmitting(false);
        return;
      }

      if (formData.quantity <= 0) {
        setError('Quantity must be greater than 0');
        setSubmitting(false);
        return;
      }

      if (formData.unitCost <= 0) {
        setError('Unit cost must be greater than 0');
        setSubmitting(false);
        return;
      }

      // Upload photo if provided
      let photoUrl: string | undefined;
      if (photo) {
        const photoRef = ref(storage, `materials/${jobId}/${Date.now()}-${photo.name}`);
        await uploadBytes(photoRef, photo);
        photoUrl = await getDownloadURL(photoRef);
      }

      // Get user profile for name
      const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
      const profileData = profileDoc.data();
      const phixerName = profileData?.name || user.displayName || user.email || 'Unknown';

      // Create material recommendation
      const materialData: any = {
        jobId,
        phixerId: user.uid,
        phixerName,
        materialName: formData.materialName.trim(),
        quantity: formData.quantity,
        unitCost: formData.unitCost,
        totalCost: calculateTotal(),
        note: formData.note.trim() || null,
        location: location || null,
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      // Only add photoUrl if it exists (Firestore doesn't allow undefined)
      if (photoUrl) {
        materialData.photoUrl = photoUrl;
      }

      await addDoc(collection(db, 'materialRecommendations'), materialData);

      // Add timeline event
      await addDoc(collection(db, 'jobTimeline'), {
        jobId,
        type: 'material-recommended',
        description: `Material "${formData.materialName}" recommended by ${phixerName}`,
        userId: user.uid,
        userName: phixerName,
        metadata: {
          materialName: formData.materialName,
          quantity: formData.quantity,
          unitCost: formData.unitCost,
        },
        createdAt: serverTimestamp(),
      });

      // Reset form
      setFormData({
        materialName: '',
        quantity: 1,
        unitCost: 0,
        note: '',
      });
      setPhoto(null);
      setPhotoPreview(null);
      setLocation(null);

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error submitting material recommendation:', err);
      setError(err.message || 'Failed to submit material recommendation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-2xl">
        <div className="border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900">Recommend Material</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="mt-1 text-sm text-neutral-600">Job: {jobTitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Catalog Selection Toggle */}
            <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
              <input
                type="checkbox"
                id="useCatalog"
                checked={useCatalog}
                onChange={(e) => {
                  setUseCatalog(e.target.checked);
                  if (!e.target.checked) {
                    setSelectedCatalogMaterial(null);
                  }
                }}
                className="h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
              />
              <label htmlFor="useCatalog" className="text-sm font-medium text-neutral-700">
                Select from Material Catalog
              </label>
            </div>

            {useCatalog && catalogMaterials.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Select Material from Catalog
                </label>
                <select
                  value={selectedCatalogMaterial || ''}
                  onChange={(e) => setSelectedCatalogMaterial(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="">Choose a material...</option>
                  {catalogMaterials.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.name} {material.estimatedCostRange ? `(₦${material.estimatedCostRange.min.toLocaleString()} - ₦${material.estimatedCostRange.max.toLocaleString()})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Material Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.materialName}
                onChange={(e) => setFormData({ ...formData, materialName: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                placeholder="e.g., PVC Pipe 2 inches"
                required
                disabled={useCatalog && selectedCatalogMaterial !== null}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Estimated Unit Cost (₦) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.unitCost}
                  onChange={(e) => setFormData({ ...formData, unitCost: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  required
                />
              </div>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-700">Estimated Total Cost:</span>
                <span className="text-lg font-bold text-neutral-900">₦{calculateTotal().toLocaleString()}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Photo (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <p className="mt-1 text-xs text-neutral-500">Max 5MB (JPG, PNG)</p>
              {photoPreview && (
                <div className="mt-2">
                  <img src={photoPreview} alt="Preview" className="h-32 w-32 rounded-lg object-cover border border-neutral-300" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Note (Optional)
              </label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                placeholder="Additional information about this material..."
              />
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">Location & Timestamp</p>
                <p className="text-xs text-neutral-600">
                  {location
                    ? `Location captured: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
                    : 'Location will be captured automatically'}
                </p>
              </div>
              {!location && (
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  Get Location
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Recommendation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

