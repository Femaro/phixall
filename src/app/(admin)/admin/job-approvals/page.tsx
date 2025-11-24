'use client';
export const dynamic = 'force-dynamic';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFirebase } from '@/lib/firebaseClient';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp, getDoc, setDoc } from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';

type TimestampLike = Date | { seconds: number; nanoseconds: number } | { toDate: () => Date } | null | undefined;

const formatTimestamp = (value: TimestampLike) => {
  if (!value) return '—';
  if (value instanceof Date) return value.toLocaleString();
  if ('toDate' in value && typeof value.toDate === 'function') {
    return value.toDate().toLocaleString();
  }
  if ('seconds' in value && typeof value.seconds === 'number') {
    return new Date(value.seconds * 1000).toLocaleString();
  }
  return '—';
};

// Helper function to get Phixer ID from completion (supports both new and legacy field names)
const getPhixerId = (completion: JobCompletion): string => {
  return completion.phixerId || completion.artisanId || '';
};

interface JobCompletion {
  id: string;
  jobId: string;
  artisanId?: string; // Legacy field for backward compatibility
  artisanName?: string; // Legacy field for backward compatibility
  phixerId?: string; // New field name
  phixerName?: string; // New field name
  clientId: string;
  clientName: string;
  status: 'pending' | 'approved' | 'rejected';
  whatWasDone: string;
  images: string[];
  additionalTasks?: Array<{
    id: string;
    description: string;
    details: string;
  }>;
  materialsUsed?: string;
  hoursWorked?: string;
  notes?: string;
  submittedAt: TimestampLike;
  createdAt: TimestampLike;
}

interface Job {
  id: string;
  title: string;
  description: string;
  amount?: number;
  status: string;
}

export default function JobApprovalsPage() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [completions, setCompletions] = useState<JobCompletion[]>([]);
  const [jobs, setJobs] = useState<Record<string, Job>>({});
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedCompletion, setSelectedCompletion] = useState<JobCompletion | null>(null);

  useEffect(() => {
    const { auth } = getFirebase();
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (!currentUser) {
          router.push('/login');
          return;
        }

        // Check if user is admin
        const { db } = getFirebase();
        const profileDoc = await getDoc(doc(db, 'profiles', currentUser.uid));
        const profile = profileDoc.data();
        
        if (profile?.role !== 'admin') {
          router.push('/admin/dashboard');
          return;
        }

        setUser(currentUser);
        setLoading(false);
      });
    });
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const { db } = getFirebase();

    // Listen for pending completion forms
    const completionsQuery = query(
      collection(db, 'jobCompletions'),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(completionsQuery, async (snapshot) => {
      const completionsData: JobCompletion[] = [];
      const jobsData: Record<string, Job> = {};

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data() as JobCompletion;
        const { id, ...restData } = data;
        completionsData.push({ id: docSnap.id, ...restData });

        // Fetch job details
        if (data.jobId && !jobsData[data.jobId]) {
          const jobDoc = await getDoc(doc(db, 'jobs', data.jobId));
          if (jobDoc.exists()) {
            jobsData[data.jobId] = { id: jobDoc.id, ...jobDoc.data() } as Job;
          }
        }
      }

      // Sort by submitted date (newest first)
      completionsData.sort((a, b) => {
        const aTime = a.submittedAt ? (typeof a.submittedAt === 'object' && 'seconds' in a.submittedAt ? a.submittedAt.seconds : 0) : 0;
        const bTime = b.submittedAt ? (typeof b.submittedAt === 'object' && 'seconds' in b.submittedAt ? b.submittedAt.seconds : 0) : 0;
        return bTime - aTime;
      });

      setCompletions(completionsData);
      setJobs(jobsData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleApprove = async (completion: JobCompletion) => {
    if (!user || processing) return;

    setProcessing(completion.id);

    try {
      const { db } = getFirebase();

      // Get job details
      const jobDoc = await getDoc(doc(db, 'jobs', completion.jobId));
      const jobData = jobDoc.data();

      // Prompt admin for final amount
      const finalAmountStr = prompt(
        `Enter final amount for this job:\n\nJob: ${jobData?.title}\nDeposit held: ₦1,000\n\nEnter total amount (₦):`,
        jobData?.amount?.toString() || '5000'
      );

      if (!finalAmountStr) {
        setProcessing(null);
        return;
      }

      const finalAmount = parseFloat(finalAmountStr);
      if (isNaN(finalAmount) || finalAmount < 1000) {
        alert('Invalid amount. Must be at least ₦1,000');
        setProcessing(null);
        return;
      }

      // Process payment through job completion API
      const paymentResponse = await fetch('/api/jobs/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: completion.jobId,
          finalAmount,
        }),
      });

      const paymentResult = await paymentResponse.json();

      if (!paymentResult.success) {
        alert(`Payment failed: ${paymentResult.error}`);
        setProcessing(null);
        return;
      }

      // Update completion form status
      await updateDoc(doc(db, 'jobCompletions', completion.id), {
        status: 'approved',
        approvedAt: serverTimestamp(),
        approvedBy: user.uid,
        finalAmount,
      });

      // Notify Phixer
      if (phixerId) {
        await setDoc(doc(db, 'notifications', `notif-${Date.now()}-${phixerId}`), {
          userId: phixerId,
          type: 'completion-approved',
          title: 'Job Completion Approved',
          message: `Your completion form for "${jobData?.title || 'job'}" has been approved by admin.`,
          jobId: completion.jobId,
          completionFormId: completion.id,
          read: false,
          createdAt: serverTimestamp(),
        });
      }

      // Notify client
      await setDoc(doc(db, 'notifications', `notif-${Date.now()}-${completion.clientId}`), {
        userId: completion.clientId,
        type: 'job-completed',
        title: 'Job Completed',
        message: `Your job "${jobData?.title || 'job'}" has been completed and approved.`,
        jobId: completion.jobId,
        read: false,
        createdAt: serverTimestamp(),
      });

      alert('Job completion approved successfully!');
      setSelectedCompletion(null);
    } catch (error) {
      console.error('Error approving completion:', error);
      alert('Failed to approve completion. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (completion: JobCompletion) => {
    if (!user || processing) return;

    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    setProcessing(completion.id);

    try {
      const { db } = getFirebase();

      // Update completion form status
      await updateDoc(doc(db, 'jobCompletions', completion.id), {
        status: 'rejected',
        rejectedAt: serverTimestamp(),
        rejectedBy: user.uid,
        rejectionReason: reason,
      });

      // Update job status back to in-progress
      await updateDoc(doc(db, 'jobs', completion.jobId), {
        status: 'in-progress',
        updatedAt: serverTimestamp(),
      });

      // Get job details
      const jobDoc = await getDoc(doc(db, 'jobs', completion.jobId));
      const jobData = jobDoc.data();

      // Notify Phixer
      const phixerId = getPhixerId(completion);
      if (phixerId) {
        await setDoc(doc(db, 'notifications', `notif-${Date.now()}-${phixerId}`), {
          userId: phixerId,
          type: 'completion-rejected',
          title: 'Job Completion Rejected',
          message: `Your completion form for "${jobData?.title || 'job'}" was rejected. Reason: ${reason}`,
          jobId: completion.jobId,
          completionFormId: completion.id,
          read: false,
          createdAt: serverTimestamp(),
        });
      }

      alert('Job completion rejected. The artisan has been notified.');
      setSelectedCompletion(null);
    } catch (error) {
      console.error('Error rejecting completion:', error);
      alert('Failed to reject completion. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admin/dashboard">
                <Image src="/logo.png" alt="Phixall" width={48} height={48} className="h-12 w-12" priority />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Job Completion Approvals</h1>
                <p className="text-sm text-gray-600">Review and approve job completion forms</p>
              </div>
            </div>
            <Link
              href="/admin/dashboard"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {completions.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-lg font-semibold text-gray-900">No Pending Approvals</h3>
            <p className="mt-2 text-gray-600">All job completions have been reviewed</p>
          </div>
        ) : (
          <div className="space-y-6">
            {completions.map((completion) => {
              const job = jobs[completion.jobId];
              return (
                <div key={completion.id} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {job?.title || 'Job Title'}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Submitted by <span className="font-medium">{completion.artisanName}</span> for{' '}
                          <span className="font-medium">{completion.clientName}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Submitted: {formatTimestamp(completion.submittedAt)}
                        </p>
                      </div>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                        Pending Approval
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* What Was Done */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">What Was Done</h4>
                        <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3">
                          {completion.whatWasDone}
                        </p>
                      </div>

                      {/* Job Details */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Job Details</h4>
                        <div className="space-y-2 text-sm">
                          {job?.amount && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Amount:</span>
                              <span className="font-medium text-gray-900">₦{job.amount.toLocaleString()}</span>
                            </div>
                          )}
                          {completion.hoursWorked && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Hours Worked:</span>
                              <span className="font-medium text-gray-900">{completion.hoursWorked}</span>
                            </div>
                          )}
                          {completion.materialsUsed && (
                            <div>
                              <span className="text-gray-600">Materials Used:</span>
                              <p className="font-medium text-gray-900 mt-1">{completion.materialsUsed}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Additional Tasks */}
                    {completion.additionalTasks && completion.additionalTasks.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Tasks</h4>
                        <div className="space-y-2">
                          {completion.additionalTasks.map((task) => (
                            <div key={task.id} className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
                              <p className="font-medium text-gray-900 text-sm">{task.description}</p>
                              {task.details && (
                                <p className="text-sm text-gray-600 mt-1">{task.details}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {completion.notes && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Notes</h4>
                        <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3">
                          {completion.notes}
                        </p>
                      </div>
                    )}

                    {/* Images */}
                    {completion.images && completion.images.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Completion Photos</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {completion.images.map((imageUrl, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                              <img
                                src={imageUrl}
                                alt={`Completion photo ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => handleApprove(completion)}
                        disabled={processing === completion.id}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processing === completion.id ? 'Processing...' : '✓ Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(completion)}
                        disabled={processing === completion.id}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processing === completion.id ? 'Processing...' : '✗ Reject'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

