'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFirebase } from '@/lib/firebaseClient';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ArtisanOnboarding } from '@/types/onboarding';
import AdditionalInfoForm from '@/components/onboarding/AdditionalInfoForm';
import TrainingModules from '@/components/onboarding/TrainingModules';
import PendingApproval from '@/components/onboarding/PendingApproval';

export default function OnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [onboarding, setOnboarding] = useState<ArtisanOnboarding | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { auth, db } = getFirebase();
    
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        console.log('Auth state changed:', currentUser ? 'User logged in' : 'No user');
        
        if (!currentUser) {
          console.log('No user, redirecting to login');
          router.push('/login');
          return;
        }

        setUser(currentUser);

        try {
          console.log('Checking profile for user:', currentUser.uid);
          // Check if user is an artisan
          const profileRef = doc(db, 'profiles', currentUser.uid);
          const profileDoc = await getDoc(profileRef);

          console.log('Profile exists:', profileDoc.exists());
          console.log('Profile role:', profileDoc.data()?.role);

          if (!profileDoc.exists() || profileDoc.data()?.role !== 'artisan') {
            console.log('Not an artisan, redirecting to home');
            router.push('/');
            return;
          }

          console.log('Checking onboarding status...');
          // Check onboarding status
          const onboardingRef = doc(db, 'artisan_onboarding', currentUser.uid);
          const onboardingDoc = await getDoc(onboardingRef);
          console.log('Onboarding doc exists:', onboardingDoc.exists());

          if (onboardingDoc.exists()) {
            const data = onboardingDoc.data() as ArtisanOnboarding;
            console.log('Onboarding status:', data.status);
            
            // If already approved, redirect to dashboard
            if (data.status === 'approved') {
              console.log('Already approved, redirecting to dashboard');
              router.push('/artisan/dashboard');
              return;
            }

            console.log('Setting onboarding data');
            setOnboarding(data);
            setLoading(false);
          } else {
            console.log('Creating new onboarding record...');
            // Create new onboarding record
            const newOnboarding: ArtisanOnboarding = {
              userId: currentUser.uid,
              email: currentUser.email || '',
              status: 'in-progress',
              currentStep: 1,
              trainingProgress: {
                activeModuleId: null,
                currentPage: 0,
                takingAssessment: false,
              },
              additionalInfo: {
                fullName: '',
                phoneNumber: '',
                sex: '',
                category: '',
                specificSkill: '',
                skillLevel: '',
                yearsOfExperience: 0,
                certifications: [],
                references: [],
                idType: '',
                idNumber: '',
                idFileUrl: '',
                bvn: '',
                address: '',
                city: '',
                state: '',
                completed: false
              },
              training: {
                safetyTraining: {
                  completed: false,
                  assessmentScore: 0,
                  passedAssessment: false
                },
                residentialTraining: {
                  completed: false,
                  assessmentScore: 0,
                  passedAssessment: false
                },
                corporateTraining: {
                  completed: false,
                  assessmentScore: 0,
                  passedAssessment: false
                },
                dashboardTraining: {
                  completed: false,
                  assessmentScore: 0,
                  passedAssessment: false
                },
                allCompleted: false,
                allPassed: false
              },
              createdAt: new Date(),
              updatedAt: new Date()
            };

            console.log('Saving new onboarding record to Firestore...');
            await setDoc(onboardingRef, {
              ...newOnboarding,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });

            console.log('Onboarding record created successfully');
            setOnboarding(newOnboarding);
            setLoading(false);
          }
        } catch (error) {
          console.error('Onboarding load error:', error);
          console.error('Error details:', error);
          alert('Error loading onboarding: ' + (error as any)?.message || 'Unknown error');
          setLoading(false);
        }
      });

      return () => unsubscribe();
    });
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand-600 border-t-transparent mx-auto"></div>
          <p className="text-neutral-600">Loading your onboarding...</p>
        </div>
      </div>
    );
  }

  if (!onboarding) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-4 text-6xl">⚠️</div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Loading Error</h2>
          <p className="text-neutral-600 mb-4">
            Unable to load your onboarding data. Please check the console for errors.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-brand-600 px-6 py-2.5 font-semibold text-white hover:bg-brand-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-xl font-bold text-white">
                P
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900">Phixall</h1>
                <p className="text-sm text-neutral-600">Artisan Onboarding</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-900">{user?.email}</p>
              <p className="text-xs text-neutral-600">
                Status: <span className="font-semibold capitalize text-brand-600">{onboarding.status}</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Step 1 */}
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                onboarding.currentStep >= 1 
                  ? 'bg-brand-600 text-white' 
                  : 'bg-neutral-200 text-neutral-500'
              }`}>
                {onboarding.additionalInfo.completed ? '✓' : '1'}
              </div>
              <div>
                <p className={`text-sm font-semibold ${onboarding.currentStep >= 1 ? 'text-neutral-900' : 'text-neutral-500'}`}>
                  Additional Info
                </p>
                <p className="text-xs text-neutral-600">Personal & Professional Details</p>
              </div>
            </div>

            {/* Connector */}
            <div className={`h-0.5 flex-1 mx-4 ${
              onboarding.currentStep >= 2 ? 'bg-brand-600' : 'bg-neutral-200'
            }`} />

            {/* Step 2 */}
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                onboarding.currentStep >= 2 
                  ? 'bg-brand-600 text-white' 
                  : 'bg-neutral-200 text-neutral-500'
              }`}>
                {onboarding.training.allCompleted && onboarding.training.allPassed ? '✓' : '2'}
              </div>
              <div>
                <p className={`text-sm font-semibold ${onboarding.currentStep >= 2 ? 'text-neutral-900' : 'text-neutral-500'}`}>
                  Training
                </p>
                <p className="text-xs text-neutral-600">Complete Required Courses</p>
              </div>
            </div>

            {/* Connector */}
            <div className={`h-0.5 flex-1 mx-4 ${
              onboarding.currentStep >= 3 ? 'bg-brand-600' : 'bg-neutral-200'
            }`} />

            {/* Step 3 */}
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                onboarding.currentStep >= 3 
                  ? 'bg-brand-600 text-white' 
                  : 'bg-neutral-200 text-neutral-500'
              }`}>
                {onboarding.status === 'approved' ? '✓' : '3'}
              </div>
              <div>
                <p className={`text-sm font-semibold ${onboarding.currentStep >= 3 ? 'text-neutral-900' : 'text-neutral-500'}`}>
                  Review
                </p>
                <p className="text-xs text-neutral-600">Application Review</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {onboarding.status === 'under-review' && (
          <PendingApproval onboarding={onboarding} />
        )}

        {onboarding.status === 'in-progress' && onboarding.currentStep === 1 && (
          <AdditionalInfoForm 
            user={user} 
            onboarding={onboarding} 
            setOnboarding={setOnboarding} 
          />
        )}

        {onboarding.status === 'training' && onboarding.currentStep === 2 && (
          <TrainingModules 
            user={user} 
            onboarding={onboarding} 
            setOnboarding={setOnboarding} 
          />
        )}
      </div>
    </div>
  );
}

