'use client';

import { ArtisanOnboarding } from '@/types/onboarding';
import { useRouter } from 'next/navigation';

interface Props {
  onboarding: ArtisanOnboarding;
}

export default function PendingApproval({ onboarding }: Props) {
  const router = useRouter();

  if (onboarding.status === 'approved') {
    router.push('/phixer/dashboard');
    return null;
  }

  if (onboarding.status === 'rejected') {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border-2 border-red-500 bg-red-50 p-8 text-center shadow-sm">
          <div className="mb-4 text-6xl">😔</div>
          <h2 className="mb-4 text-2xl font-bold text-neutral-900">Application Not Approved</h2>
          <p className="mb-6 text-neutral-700">
            Unfortunately, your application was not approved at this time.
          </p>

          {onboarding.reviewNotes && (
            <div className="mb-6 rounded-lg bg-white p-4 text-left">
              <p className="mb-2 font-semibold text-neutral-900">Feedback from Admin:</p>
              <p className="text-neutral-700">{onboarding.reviewNotes}</p>
            </div>
          )}

          <p className="text-sm text-neutral-600">
            Please contact support at <a href="mailto:support@phixall.com" className="font-semibold text-brand-600 hover:underline">support@phixall.com</a> for more information.
          </p>
        </div>
      </div>
    );
  }

  // Under review
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
              <svg className="h-10 w-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <h2 className="mb-4 text-2xl font-bold text-neutral-900">Application Under Review</h2>
          <p className="mb-6 text-neutral-600">
            Thank you for completing your Phixer onboarding! Your application is currently being reviewed by our admin team.
          </p>

          <div className="mb-8 rounded-lg bg-brand-50 p-6 text-left">
            <h3 className="mb-3 font-semibold text-neutral-900">What Happens Next?</h3>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li className="flex items-start gap-2">
                <span className="text-brand-600">✓</span>
                <span>Our admin team will review your documents and training results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-600">✓</span>
                <span>We'll verify your references and credentials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-600">✓</span>
                <span>You'll receive feedback within <strong>5 business days</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-600">✓</span>
                <span>Once approved, you'll gain full access to the Phixer dashboard</span>
              </li>
            </ul>
          </div>

          {onboarding.submittedAt && (
            <p className="mb-6 text-sm text-neutral-600">
              Submitted on: <span className="font-semibold">{new Date(onboarding.submittedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </p>
          )}

          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
            <p className="mb-2 text-sm font-semibold text-neutral-900">Application Summary</p>
            <div className="space-y-2 text-left text-sm text-neutral-600">
              <div className="flex justify-between">
                <span>Personal Information:</span>
                <span className="font-semibold text-green-600">✓ Complete</span>
              </div>
              <div className="flex justify-between">
                <span>Professional Details:</span>
                <span className="font-semibold text-green-600">✓ Complete</span>
              </div>
              <div className="flex justify-between">
                <span>Safety Training:</span>
                <span className="font-semibold text-green-600">✓ Passed ({onboarding.training.safetyTraining.assessmentScore}%)</span>
              </div>
              <div className="flex justify-between">
                <span>Residential Training:</span>
                <span className="font-semibold text-green-600">✓ Passed ({onboarding.training.residentialTraining.assessmentScore}%)</span>
              </div>
              <div className="flex justify-between">
                <span>Corporate Training:</span>
                <span className="font-semibold text-green-600">✓ Passed ({onboarding.training.corporateTraining.assessmentScore}%)</span>
              </div>
              <div className="flex justify-between">
                <span>Dashboard Training:</span>
                <span className="font-semibold text-green-600">✓ Passed ({onboarding.training.dashboardTraining.assessmentScore}%)</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm text-neutral-600">
              Questions? Contact us at{' '}
              <a href="mailto:support@phixall.com" className="font-semibold text-brand-600 hover:underline">
                support@phixall.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



