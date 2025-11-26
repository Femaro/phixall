'use client';

import React, { useState, useEffect } from 'react';
import { getFirebase } from '@/lib/firebaseClient';
import { collection, query, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import type { MaterialCatalogItem } from '@/types/materialCatalog';

export default function MaterialCatalogManager() {
  const [materials, setMaterials] = useState<MaterialCatalogItem[]>([]);
  const [editingMaterial, setEditingMaterial] = useState<MaterialCatalogItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    defaultUnit: 'pcs',
    minCost: '',
    maxCost: '',
    photoUrl: '',
  });

  useEffect(() => {
    const { db } = getFirebase();
    const materialsQuery = query(collection(db, 'materialCatalog'), query(collection(db, 'materialCatalog')));

    const unsubscribe = onSnapshot(collection(db, 'materialCatalog'), (snapshot) => {
      const materialsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as MaterialCatalogItem[];
      setMaterials(materialsData.sort((a, b) => a.name.localeCompare(b.name)));
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { auth, db } = getFirebase();
    const user = auth.currentUser;

    if (!user) {
      alert('You must be logged in');
      return;
    }

    try {
      const materialData: any = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        category: formData.category,
        defaultUnit: formData.defaultUnit,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user.uid,
      };

      if (formData.minCost && formData.maxCost) {
        materialData.estimatedCostRange = {
          min: parseFloat(formData.minCost),
          max: parseFloat(formData.maxCost),
        };
      }

      if (formData.photoUrl) {
        materialData.photoUrl = formData.photoUrl;
      }

      if (editingMaterial) {
        await updateDoc(doc(db, 'materialCatalog', editingMaterial.id), materialData);
        alert('Material updated successfully!');
      } else {
        await addDoc(collection(db, 'materialCatalog'), materialData);
        alert('Material added successfully!');
      }

      setFormData({
        name: '',
        description: '',
        category: 'general',
        defaultUnit: 'pcs',
        minCost: '',
        maxCost: '',
        photoUrl: '',
      });
      setEditingMaterial(null);
      setShowAddModal(false);
    } catch (error: any) {
      console.error('Error saving material:', error);
      alert(error.message || 'Failed to save material');
    }
  };

  const handleDelete = async (materialId: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      const { db } = getFirebase();
      await deleteDoc(doc(db, 'materialCatalog', materialId));
      alert('Material deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting material:', error);
      alert(error.message || 'Failed to delete material');
    }
  };

  const handleToggleActive = async (material: MaterialCatalogItem) => {
    try {
      const { db } = getFirebase();
      await updateDoc(doc(db, 'materialCatalog', material.id), {
        isActive: !material.isActive,
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error('Error toggling material status:', error);
      alert(error.message || 'Failed to update material');
    }
  };

  const categories = ['general', 'plumbing', 'electrical', 'hvac', 'carpentry', 'painting', 'appliance', 'other'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900">Material Catalog</h3>
        <button
          onClick={() => {
            setEditingMaterial(null);
            setFormData({
              name: '',
              description: '',
              category: 'general',
              defaultUnit: 'pcs',
              minCost: '',
              maxCost: '',
              photoUrl: '',
            });
            setShowAddModal(true);
          }}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          + Add Material
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {materials.map((material) => (
          <div
            key={material.id}
            className={`rounded-lg border p-4 ${
              material.isActive ? 'border-green-200 bg-green-50' : 'border-neutral-200 bg-neutral-50 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-neutral-900">{material.name}</h4>
                {material.description && (
                  <p className="mt-1 text-sm text-neutral-600">{material.description}</p>
                )}
                <div className="mt-2 space-y-1 text-xs text-neutral-600">
                  <p><strong>Category:</strong> {material.category}</p>
                  <p><strong>Unit:</strong> {material.defaultUnit || 'pcs'}</p>
                  {material.estimatedCostRange && (
                    <p>
                      <strong>Cost Range:</strong> ₦{material.estimatedCostRange.min.toLocaleString()} - ₦{material.estimatedCostRange.max.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  setEditingMaterial(material);
                  setFormData({
                    name: material.name,
                    description: material.description || '',
                    category: material.category,
                    defaultUnit: material.defaultUnit || 'pcs',
                    minCost: material.estimatedCostRange?.min.toString() || '',
                    maxCost: material.estimatedCostRange?.max.toString() || '',
                    photoUrl: material.photoUrl || '',
                  });
                  setShowAddModal(true);
                }}
                className="flex-1 rounded border border-brand-300 bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-100"
              >
                Edit
              </button>
              <button
                onClick={() => handleToggleActive(material)}
                className={`flex-1 rounded px-3 py-1.5 text-xs font-medium ${
                  material.isActive
                    ? 'border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
                    : 'border border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                {material.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => handleDelete(material.id)}
                className="rounded border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-md w-full rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-neutral-900">
              {editingMaterial ? 'Edit Material' : 'Add Material to Catalog'}
            </h3>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Material Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Default Unit</label>
                  <select
                    value={formData.defaultUnit}
                    onChange={(e) => setFormData({ ...formData, defaultUnit: e.target.value })}
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2"
                  >
                    <option value="pcs">Pieces</option>
                    <option value="kg">Kilograms</option>
                    <option value="m">Meters</option>
                    <option value="bags">Bags</option>
                    <option value="liters">Liters</option>
                    <option value="rolls">Rolls</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Min Cost (₦)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.minCost}
                    onChange={(e) => setFormData({ ...formData, minCost: e.target.value })}
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Max Cost (₦)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.maxCost}
                    onChange={(e) => setFormData({ ...formData, maxCost: e.target.value })}
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Photo URL (optional)</label>
                <input
                  type="url"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2"
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
                >
                  {editingMaterial ? 'Update' : 'Add'} Material
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingMaterial(null);
                  }}
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

