'use client';

import { useState } from 'react';
import { getFirebase } from '@/lib/firebaseClient';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ArtisanOnboarding, ARTISAN_CATEGORIES, SKILL_LEVELS, ID_TYPES, NIGERIAN_STATES } from '@/types/onboarding';

interface Props {
  user: any;
  onboarding: ArtisanOnboarding;
  setOnboarding: (onboarding: ArtisanOnboarding) => void;
}

export default function AdditionalInfoForm({ user, onboarding, setOnboarding }: Props) {
  const [formData, setFormData] = useState(onboarding.additionalInfo);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleFileUpload = async (file: File, type: 'id' | 'certification') => {
    if (!file) return '';

    // Validate file size (5MB max for documents)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      alert(`File size must be less than 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`);
      return '';
    }

    setUploading(true);
    try {
      const { storage } = getFirebase();
      const fileRef = ref(storage, `phixer-documents/${user.uid}/${type}-${Date.now()}-${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      setUploading(false);
      return url;
    } catch (error) {
      console.error('File upload error:', error);
      alert('Failed to upload file. Please try again.');
      setUploading(false);
      return '';
    }
  };

  const addCertification = () => {
    const MAX_CERTIFICATIONS = 5;
    if (formData.certifications.length >= MAX_CERTIFICATIONS) {
      alert(`Maximum ${MAX_CERTIFICATIONS} certifications allowed.`);
      return;
    }
    setFormData({
      ...formData,
      certifications: [
        ...formData.certifications,
        { name: '', issuer: '', dateIssued: '', fileUrl: '' }
      ]
    });
  };

  const removeCertification = (index: number) => {
    const updated = [...formData.certifications];
    updated.splice(index, 1);
    setFormData({ ...formData, certifications: updated });
  };

  const updateCertification = (index: number, field: string, value: string) => {
    const updated = [...formData.certifications];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, certifications: updated });
  };

  const addReference = () => {
    setFormData({
      ...formData,
      references: [
        ...formData.references,
        { name: '', phoneNumber: '', relationship: '', companyName: '' }
      ]
    });
  };

  const removeReference = (index: number) => {
    const updated = [...formData.references];
    updated.splice(index, 1);
    setFormData({ ...formData, references: updated });
  };

  const updateReference = (index: number, field: string, value: string) => {
    const updated = [...formData.references];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, references: updated });
  };

  const validate = () => {
    const newErrors: any = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.sex) newErrors.sex = 'Please select your gender';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.specificSkill.trim()) newErrors.specificSkill = 'Specific skill is required';
    if (!formData.skillLevel) newErrors.skillLevel = 'Please select your skill level';
    if (formData.yearsOfExperience < 0) newErrors.yearsOfExperience = 'Invalid years of experience';
    if (formData.references.length < 2) newErrors.references = 'Please provide at least 2 references';
    if (!formData.idType) newErrors.idType = 'Please select ID type';
    if (!formData.idNumber.trim()) newErrors.idNumber = 'ID number is required';
    if (!formData.idFileUrl) newErrors.idFileUrl = 'Please upload your ID document';
    if (!formData.bvn.trim() || formData.bvn.length !== 11) newErrors.bvn = 'Valid 11-digit BVN is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'Please select your state';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      alert('Please fill in all required fields correctly');
      return;
    }

    setSaving(true);
    try {
      const { db } = getFirebase();
      const onboardingRef = doc(db, 'phixer_onboarding', user.uid);

      const updatedOnboarding = {
        ...onboarding,
        additionalInfo: { ...formData, completed: true },
        currentStep: 2,
        status: 'training',
        updatedAt: serverTimestamp()
      };

      await updateDoc(onboardingRef, updatedOnboarding);

      setOnboarding({
        ...updatedOnboarding,
        updatedAt: new Date()
      } as ArtisanOnboarding);

      alert('Information saved successfully! Proceeding to training...');
    } catch (error: any) {
      console.error('Save error:', error);
      console.error('Error details:', {
        code: error?.code,
        message: error?.message,
        stack: error?.stack
      });
      
      let errorMessage = 'Failed to submit application. Please try again later.';
      
      if (error?.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please ensure you are logged in and your account is properly set up. If the issue persists, please contact support.';
      } else if (error?.code === 'unavailable') {
        errorMessage = 'Service temporarily unavailable. Please check your internet connection and try again.';
      } else if (error?.message) {
        errorMessage = `Error: ${error.message}. Please try again or contact support if the issue persists.`;
      }
      
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
      <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Additional Information</h2>
        <p className="text-neutral-600 mb-8">Please provide the following information to complete your artisan profile.</p>

        {/* Personal Information */}
        <div className="space-y-6 mb-8">
          <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2">Personal Information</h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={`w-full rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-neutral-300'} px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20`}
                placeholder="Enter your full legal name"
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className={`w-full rounded-lg border ${errors.phoneNumber ? 'border-red-500' : 'border-neutral-300'} px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20`}
                placeholder="+234 800 000 0000"
              />
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.sex}
                onChange={(e) => handleInputChange('sex', e.target.value)}
                className={`w-full rounded-lg border ${errors.sex ? 'border-red-500' : 'border-neutral-300'} px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20`}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.sex && <p className="mt-1 text-sm text-red-500">{errors.sex}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className={`w-full rounded-lg border ${errors.state ? 'border-red-500' : 'border-neutral-300'} px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20`}
              >
                <option value="">Select state</option>
                {NIGERIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={`w-full rounded-lg border ${errors.city ? 'border-red-500' : 'border-neutral-300'} px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20`}
                placeholder="Enter your city"
              />
              {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={2}
                className={`w-full rounded-lg border ${errors.address ? 'border-red-500' : 'border-neutral-300'} px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20`}
                placeholder="Enter your full address"
              />
              {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-6 mb-8">
          <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2">Professional Information</h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full rounded-lg border ${errors.category ? 'border-red-500' : 'border-neutral-300'} px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20`}
              >
                <option value="">Select category</option>
                {ARTISAN_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Specific Skill <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.specificSkill}
                onChange={(e) => handleInputChange('specificSkill', e.target.value)}
                className={`w-full rounded-lg border ${errors.specificSkill ? 'border-red-500' : 'border-neutral-300'} px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20`}
                placeholder="e.g., Pipe Installation, House Wiring"
              />
              {errors.specificSkill && <p className="mt-1 text-sm text-red-500">{errors.specificSkill}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Skill Level <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.skillLevel}
                onChange={(e) => handleInputChange('skillLevel', e.target.value)}
                className={`w-full rounded-lg border ${errors.skillLevel ? 'border-red-500' : 'border-neutral-300'} px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20`}
              >
                <option value="">Select skill level</option>
                {SKILL_LEVELS.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
              {errors.skillLevel && <p className="mt-1 text-sm text-red-500">{errors.skillLevel}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.yearsOfExperience}
                onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value) || 0)}
                className={`w-full rounded-lg border ${errors.yearsOfExperience ? 'border-red-500' : 'border-neutral-300'} px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20`}
                placeholder="0"
              />
              {errors.yearsOfExperience && <p className="mt-1 text-sm text-red-500">{errors.yearsOfExperience}</p>}
            </div>
          </div>
        </div>

        {/* Certifications (Optional) */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <h3 className="text-lg font-semibold text-neutral-900">Certifications (Optional)</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500">
                {formData.certifications.length}/5
              </span>
              <button
                type="button"
                onClick={addCertification}
                disabled={formData.certifications.length >= 5}
                className="text-sm font-medium text-brand-600 hover:text-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Add Certification
              </button>
            </div>
          </div>

          {formData.certifications.map((cert, index) => (
            <div key={index} className="rounded-lg border border-neutral-200 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-neutral-900">Certification #{index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeCertification(index)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => updateCertification(index, 'name', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  placeholder="Certification name"
                />
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  placeholder="Issuing organization"
                />
                <input
                  type="date"
                  value={cert.dateIssued}
                  onChange={(e) => updateCertification(index, 'dateIssued', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await handleFileUpload(file, 'certification');
                        if (url) updateCertification(index, 'fileUrl', url);
                      }
                    }}
                    className="w-full text-sm"
                  />
                  <p className="mt-1 text-xs text-neutral-500">Max 5MB (PDF, JPG, PNG)</p>
                  {cert.fileUrl && <p className="mt-1 text-xs text-green-600">✓ Uploaded</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* References */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">References <span className="text-red-500">*</span></h3>
              <p className="text-sm text-neutral-600">Provide at least 2 professional references</p>
            </div>
            <button
              type="button"
              onClick={addReference}
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              + Add Reference
            </button>
          </div>
          {errors.references && <p className="text-sm text-red-500">{errors.references}</p>}

          {formData.references.map((ref, index) => (
            <div key={index} className="rounded-lg border border-neutral-200 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-neutral-900">Reference #{index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeReference(index)}
                  className="text-sm text-red-600 hover:text-red-700"
                  disabled={formData.references.length <= 2}
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  value={ref.name}
                  onChange={(e) => updateReference(index, 'name', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  placeholder="Reference name *"
                  required
                />
                <input
                  type="tel"
                  value={ref.phoneNumber}
                  onChange={(e) => updateReference(index, 'phoneNumber', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  placeholder="Phone number *"
                  required
                />
                <input
                  type="text"
                  value={ref.relationship}
                  onChange={(e) => updateReference(index, 'relationship', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  placeholder="Relationship (e.g., Former Employer) *"
                  required
                />
                <input
                  type="text"
                  value={ref.companyName || ''}
                  onChange={(e) => updateReference(index, 'companyName', e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  placeholder="Company name (optional)"
                />
              </div>
            </div>
          ))}
        </div>

        {/* ID & Verification */}
        <div className="space-y-6 mb-8">
          <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2">ID & Verification</h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                ID Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.idType}
                onChange={(e) => handleInputChange('idType', e.target.value)}
                className={`w-full rounded-lg border ${errors.idType ? 'border-red-500' : 'border-neutral-300'} px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20`}
              >
                <option value="">Select ID type</option>
                {ID_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              {errors.idType && <p className="mt-1 text-sm text-red-500">{errors.idType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                ID Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.idNumber}
                onChange={(e) => handleInputChange('idNumber', e.target.value)}
                className={`w-full rounded-lg border ${errors.idNumber ? 'border-red-500' : 'border-neutral-300'} px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20`}
                placeholder="Enter ID number"
              />
              {errors.idNumber && <p className="mt-1 text-sm text-red-500">{errors.idNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Upload ID Document <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await handleFileUpload(file, 'id');
                    if (url) handleInputChange('idFileUrl', url);
                  }
                }}
                className="w-full text-sm"
              />
              <p className="mt-1 text-xs text-neutral-500">Max 5MB (PDF, JPG, PNG)</p>
              {formData.idFileUrl && <p className="mt-1 text-sm text-green-600">✓ ID uploaded successfully</p>}
              {errors.idFileUrl && <p className="mt-1 text-sm text-red-500">{errors.idFileUrl}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                BVN (Bank Verification Number) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={11}
                value={formData.bvn}
                onChange={(e) => handleInputChange('bvn', e.target.value.replace(/\D/g, ''))}
                className={`w-full rounded-lg border ${errors.bvn ? 'border-red-500' : 'border-neutral-300'} px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20`}
                placeholder="Enter 11-digit BVN"
              />
              {errors.bvn && <p className="mt-1 text-sm text-red-500">{errors.bvn}</p>}
              <p className="mt-1 text-xs text-neutral-500">Your BVN is kept secure and only used for verification</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
          <p className="text-sm text-neutral-600">
            <span className="text-red-500">*</span> Required fields
          </p>
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-lg bg-brand-600 px-8 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : uploading ? 'Uploading...' : 'Save & Continue to Training'}
          </button>
        </div>
      </div>
    </form>
  );
}

