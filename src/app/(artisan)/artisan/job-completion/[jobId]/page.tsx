'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getFirebase } from '@/lib/firebaseClient';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { User as FirebaseUser } from 'firebase/auth';

interface AdditionalTask {
  id: string;
  description: string;
  details: string;
}

export default function JobCompletionPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;
  
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [job, setJob] = useState<any>(null);
  
  const [whatWasDone, setWhatWasDone] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [additionalTasks, setAdditionalTasks] = useState<AdditionalTask[]>([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDetails, setNewTaskDetails] = useState('');
  const [materialsUsed, setMaterialsUsed] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const { auth } = getFirebase();
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (!currentUser) {
          router.push('/login');
          return;
        }
        setUser(currentUser);
        
        // Load job details
        try {
          const { db } = getFirebase();
          const jobDoc = await getDoc(doc(db, 'jobs', jobId));
          if (jobDoc.exists()) {
            const jobData = jobDoc.data();
            if (jobData.artisanId !== currentUser.uid) {
              alert('You are not authorized to complete this job.');
              router.push('/artisan/dashboard');
              return;
            }
            if (jobData.status !== 'in-progress') {
              alert('This job is not in progress.');
              router.push('/artisan/dashboard');
              return;
            }
            setJob(jobData);
          } else {
            alert('Job not found.');
            router.push('/artisan/dashboard');
          }
        } catch (error) {
          console.error('Error loading job:', error);
          alert('Failed to load job details.');
          router.push('/artisan/dashboard');
        } finally {
          setLoading(false);
        }
      });
    });
  }, [jobId, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImages([...images, ...files]);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const addAdditionalTask = () => {
    if (!newTaskDescription.trim()) {
      alert('Please enter a task description');
      return;
    }

    const task: AdditionalTask = {
      id: Date.now().toString(),
      description: newTaskDescription,
      details: newTaskDetails,
    };

    setAdditionalTasks([...additionalTasks, task]);
    setNewTaskDescription('');
    setNewTaskDetails('');
  };

  const removeAdditionalTask = (id: string) => {
    setAdditionalTasks(additionalTasks.filter((task) => task.id !== id));
  };

  const uploadImage = async (file: File, jobId: string, index: number): Promise<string> => {
    const { storage } = getFirebase();
    const filename = `completion-${Date.now()}-${index}.jpg`;
    const storageRef = ref(storage, `job-completions/${jobId}/${filename}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!whatWasDone.trim()) {
      alert('Please describe what was done');
      return;
    }

    if (!user || !jobId) {
      alert('Missing user or job information');
      return;
    }

    setSubmitting(true);

    try {
      const { db, storage } = getFirebase();

      // Get job details
      const jobDoc = await getDoc(doc(db, 'jobs', jobId));
      if (!jobDoc.exists()) {
        alert('Job not found');
        setSubmitting(false);
        return;
      }

      const jobData = jobDoc.data();

      // Upload images
      const uploadedImageUrls: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const url = await uploadImage(images[i], jobId, i);
        uploadedImageUrls.push(url);
      }

      // Create completion form document
      const completionFormId = `completion-${jobId}-${Date.now()}`;
      const completionFormData = {
        id: completionFormId,
        jobId: jobId,
        artisanId: user.uid,
        artisanName: jobData.artisanName || 'Unknown Artisan',
        clientId: jobData.clientId,
        clientName: jobData.clientName || 'Unknown Client',
        status: 'pending', // pending, approved, rejected
        whatWasDone: whatWasDone.trim(),
        images: uploadedImageUrls,
        additionalTasks: additionalTasks,
        materialsUsed: materialsUsed.trim() || null,
        hoursWorked: hoursWorked.trim() || null,
        notes: notes.trim() || null,
        submittedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      };

      // Save completion form
      await setDoc(doc(db, 'jobCompletions', completionFormId), completionFormData);

      // Update job status to 'pending-completion'
      await updateDoc(doc(db, 'jobs', jobId), {
        status: 'pending-completion',
        completionFormId: completionFormId,
        updatedAt: serverTimestamp(),
      });

      // Create notification for artisan
      await setDoc(doc(db, 'notifications', `notif-${Date.now()}-${user.uid}`), {
        userId: user.uid,
        type: 'completion-submitted',
        title: 'Completion Form Submitted',
        message: 'Your job completion form has been submitted and is pending admin approval.',
        jobId: jobId,
        completionFormId: completionFormId,
        read: false,
        createdAt: serverTimestamp(),
      });

      // Create notification for admin
      const adminProfiles = await import('firebase/firestore').then(m => 
        m.getDocs(m.query(m.collection(db, 'profiles'), m.where('role', '==', 'admin')))
      );
      adminProfiles.forEach(async (adminDoc) => {
        await setDoc(doc(db, 'notifications', `notif-${Date.now()}-${adminDoc.id}`), {
          userId: adminDoc.id,
          type: 'completion-pending',
          title: 'Job Completion Pending Approval',
          message: `Job "${jobData.title}" completion form submitted by ${jobData.artisanName || 'Artisan'}.`,
          jobId: jobId,
          completionFormId: completionFormId,
          read: false,
          createdAt: serverTimestamp(),
        });
      });

      alert('Completion form submitted successfully! You will be notified when admin approves it.');
      router.push('/artisan/dashboard');
    } catch (error) {
      console.error('Error submitting completion form:', error);
      alert('Failed to submit completion form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Job Completion Form</h1>
          <p className="mt-2 text-gray-600">Fill out all required information</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* What Was Done - Required */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What Was Done <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the work that was completed..."
              value={whatWasDone}
              onChange={(e) => setWhatWasDone(e.target.value)}
              rows={6}
              required
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos
            </label>
            <p className="text-sm text-gray-500 mb-4">Add photos of the completed work</p>
            <div className="flex gap-4 mb-4">
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-500 transition-colors">
                  <span className="text-gray-600">📷 Choose from Gallery</span>
                </div>
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Tasks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Tasks
            </label>
            <p className="text-sm text-gray-500 mb-4">Add any additional work that was done</p>

            {additionalTasks.map((task) => (
              <div key={task.id} className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded mb-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{task.description}</h4>
                  <button
                    type="button"
                    onClick={() => removeAdditionalTask(task.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
                {task.details && (
                  <p className="text-sm text-gray-600">{task.details}</p>
                )}
              </div>
            ))}

            <div className="space-y-3 mt-4">
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Task description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
              />
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Task details (optional)"
                value={newTaskDetails}
                onChange={(e) => setNewTaskDetails(e.target.value)}
                rows={3}
              />
              <button
                type="button"
                onClick={addAdditionalTask}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Add Task
              </button>
            </div>
          </div>

          {/* Materials Used */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Materials Used
            </label>
            <p className="text-sm text-gray-500 mb-2">List any materials or parts used</p>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 2x4 lumber, screws, paint..."
              value={materialsUsed}
              onChange={(e) => setMaterialsUsed(e.target.value)}
              rows={4}
            />
          </div>

          {/* Hours Worked */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hours Worked
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 4.5 hours"
              value={hoursWorked}
              onChange={(e) => setHoursWorked(e.target.value)}
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <p className="text-sm text-gray-500 mb-2">Any other relevant information</p>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any additional notes or comments..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Completion Form'}
            </button>
            <p className="mt-4 text-sm text-gray-500 text-center italic">
              This form will be sent to admin for approval. You will be notified once it's reviewed.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

