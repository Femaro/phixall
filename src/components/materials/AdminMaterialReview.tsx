'use client';

import React, { useState, useEffect } from 'react';
import { getFirebase } from '@/lib/firebaseClient';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import type { MaterialRecommendation } from '@/types/materials';

interface AdminMaterialReviewProps {
  jobId: string;
  jobTitle: string;
  clientId: string;
  clientName: string;
}

export default function AdminMaterialReview({
  jobId,
  jobTitle,
  clientId,
  clientName,
}: AdminMaterialReviewProps) {
  const [materials, setMaterials] = useState<MaterialRecommendation[]>([]);
  const [editingMaterial, setEditingMaterial] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    materialName: '',
    quantity: 1,
    unitCost: 0,
    markup: 0,
    procurementMethod: 'phixer' as 'phixer' | 'phixall',
    adminNotes: '',
  });
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    let isMounted = true;
    const { db } = getFirebase();
    const materialsQuery = query(
      collection(db, 'materialRecommendations'),
      where('jobId', '==', jobId)
    );

    const unsubscribe = onSnapshot(
      materialsQuery,
      (snapshot) => {
        if (!isMounted) return;
        try {
          const materialsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as MaterialRecommendation[];
          setMaterials(materialsData);
        } catch (error) {
          console.error('Error processing material recommendations:', error);
        }
      },
      (error) => {
        if (!isMounted) return;
        console.error('Error loading material recommendations:', error);
        // Silently handle permission errors - they're expected in some cases
        if (error.code === 'permission-denied') {
          console.warn('Permission denied for material recommendations query');
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [jobId]);

  const handleEdit = (material: MaterialRecommendation) => {
    setEditingMaterial(material.id);
    setEditForm({
      materialName: material.materialName,
      quantity: material.quantity,
      unitCost: material.unitCost,
      markup: material.adminMarkup || 0,
      procurementMethod: material.procurementMethod || 'phixer',
      adminNotes: material.adminNotes || '',
    });
  };

  const handleApprove = async (materialId: string) => {
    setProcessing(materialId);
    try {
      const { auth, db } = getFirebase();
      const user = auth.currentUser;
      if (!user) {
        alert('You must be logged in');
        return;
      }

      const material = materials.find(m => m.id === materialId);
      if (!material) return;

      const finalName = editingMaterial === materialId ? editForm.materialName : material.materialName;
      const finalQuantity = editingMaterial === materialId ? editForm.quantity : material.quantity;
      const finalUnitCost = editingMaterial === materialId ? editForm.unitCost : material.unitCost;
      const finalCost = finalQuantity * finalUnitCost;
      const markupAmount = (finalCost * editForm.markup) / 100;
      const finalCostWithMarkup = finalCost + markupAmount;

      const response = await fetch('/api/materials/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialId,
          action: 'approve',
          adminId: user.uid,
          markup: editForm.markup,
          procurementMethod: editForm.procurementMethod,
          adminNotes: editForm.adminNotes,
          materialName: finalName,
          quantity: finalQuantity,
          unitCost: finalUnitCost,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to approve material');
      }

      setEditingMaterial(null);
      alert('Material approved successfully!');
    } catch (error: any) {
      console.error('Error approving material:', error);
      alert(error.message || 'Failed to approve material');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (materialId: string) => {
    if (!confirm('Are you sure you want to reject this material recommendation?')) return;

    setProcessing(materialId);
    try {
      const { auth } = getFirebase();
      const user = auth.currentUser;
      if (!user) {
        alert('You must be logged in');
        return;
      }

      const response = await fetch('/api/materials/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialId,
          action: 'reject',
          adminId: user.uid,
          adminNotes: editForm.adminNotes,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reject material');
      }

      alert('Material rejected');
    } catch (error: any) {
      console.error('Error rejecting material:', error);
      alert(error.message || 'Failed to reject material');
    } finally {
      setProcessing(null);
    }
  };

  const pendingMaterials = materials.filter(m => m.status === 'pending');
  const approvedMaterials = materials.filter(m => m.status === 'approved');
  const rejectedMaterials = materials.filter(m => m.status === 'rejected');

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">Material Recommendations</h3>
        <p className="mt-1 text-sm text-neutral-600">Job: {jobTitle}</p>
      </div>

      {pendingMaterials.length === 0 && approvedMaterials.length === 0 && rejectedMaterials.length === 0 ? (
        <div className="py-8 text-center">
          <div className="text-4xl mb-2">📦</div>
          <p className="text-sm text-neutral-600">No material recommendations yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Materials */}
          {pendingMaterials.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-semibold text-neutral-700">Pending Review ({pendingMaterials.length})</h4>
              <div className="space-y-4">
                {pendingMaterials.map((material) => (
                  <div key={material.id} className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    {editingMaterial === material.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">Material Name</label>
                          <input
                            type="text"
                            value={editForm.materialName}
                            onChange={(e) => setEditForm({ ...editForm, materialName: e.target.value })}
                            className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1">Quantity</label>
                            <input
                              type="number"
                              min="1"
                              value={editForm.quantity}
                              onChange={(e) => setEditForm({ ...editForm, quantity: parseInt(e.target.value) || 1 })}
                              className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1">Unit Cost (₦)</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={editForm.unitCost}
                              onChange={(e) => setEditForm({ ...editForm, unitCost: parseFloat(e.target.value) || 0 })}
                              className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1">Markup (%)</label>
                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              value={editForm.markup}
                              onChange={(e) => setEditForm({ ...editForm, markup: parseFloat(e.target.value) || 0 })}
                              className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">Procurement Method</label>
                          <select
                            value={editForm.procurementMethod}
                            onChange={(e) => setEditForm({ ...editForm, procurementMethod: e.target.value as 'phixer' | 'phixall' })}
                            className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
                          >
                            <option value="phixer">Phixer will buy</option>
                            <option value="phixall">Phixall will procure</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">Admin Notes</label>
                          <textarea
                            value={editForm.adminNotes}
                            onChange={(e) => setEditForm({ ...editForm, adminNotes: e.target.value })}
                            rows={2}
                            className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
                            placeholder="Optional notes..."
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(material.id)}
                            disabled={processing === material.id}
                            className="flex-1 rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            {processing === material.id ? 'Processing...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => setEditingMaterial(null)}
                            className="rounded border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-semibold text-neutral-900">{material.materialName}</h5>
                            <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-neutral-600">Quantity:</span>
                                <span className="ml-2 font-medium">{material.quantity}</span>
                              </div>
                              <div>
                                <span className="text-neutral-600">Unit Cost:</span>
                                <span className="ml-2 font-medium">₦{material.unitCost.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-neutral-600">Total Cost:</span>
                                <span className="ml-2 font-medium">₦{material.totalCost.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-neutral-600">Recommended by:</span>
                                <span className="ml-2 font-medium">{material.phixerName}</span>
                              </div>
                            </div>
                            {material.note && (
                              <p className="mt-2 text-sm text-neutral-600">Note: {material.note}</p>
                            )}
                            {material.photoUrl && (
                              <div className="mt-2">
                                <img src={material.photoUrl} alt={material.materialName} className="h-20 w-20 rounded object-cover" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => handleEdit(material)}
                            className="rounded border border-brand-300 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100"
                          >
                            Edit & Approve
                          </button>
                          <button
                            onClick={() => handleApprove(material.id)}
                            disabled={processing === material.id}
                            className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            {processing === material.id ? 'Processing...' : 'Approve As-Is'}
                          </button>
                          <button
                            onClick={() => handleReject(material.id)}
                            disabled={processing === material.id}
                            className="rounded border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approved Materials */}
          {approvedMaterials.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-semibold text-green-700">Approved ({approvedMaterials.length})</h4>
              <div className="space-y-2">
                {approvedMaterials.map((material) => (
                  <div key={material.id} className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{material.materialName}</span>
                      <span className="text-green-700">₦{(material.finalCost || material.totalCost).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rejected Materials */}
          {rejectedMaterials.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-semibold text-red-700">Rejected ({rejectedMaterials.length})</h4>
              <div className="space-y-2">
                {rejectedMaterials.map((material) => (
                  <div key={material.id} className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm">
                    <span className="font-medium">{material.materialName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

