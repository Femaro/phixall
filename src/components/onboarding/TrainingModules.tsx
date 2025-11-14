'use client';

import { useEffect, useMemo, useState } from 'react';
import { getFirebase } from '@/lib/firebaseClient';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ArtisanOnboarding, TrainingProgressState } from '@/types/onboarding';
import { trainingModules } from '@/data/trainingModules';
import Image from 'next/image';

interface Props {
  user: any;
  onboarding: ArtisanOnboarding;
  setOnboarding: (onboarding: ArtisanOnboarding) => void;
}

type TrainingSectionKeys = Exclude<keyof ArtisanOnboarding['training'], 'allCompleted' | 'allPassed'>;

const moduleKeyMap: Record<string, TrainingSectionKeys> = {
  'safety-training': 'safetyTraining',
  'residential-training': 'residentialTraining',
  'corporate-training': 'corporateTraining',
  'dashboard-training': 'dashboardTraining',
};

export default function TrainingModules({ user, onboarding, setOnboarding }: Props) {
  const defaultProgress = useMemo<TrainingProgressState>(() => {
    return onboarding.trainingProgress ?? {
      activeModuleId: null,
      currentPage: 0,
      takingAssessment: false,
    };
  }, [onboarding.trainingProgress]);

  const [progressState, setProgressState] = useState<TrainingProgressState>(defaultProgress);
  const [moduleViewOpen, setModuleViewOpen] = useState(Boolean(defaultProgress.activeModuleId));
  const [assessmentAnswers, setAssessmentAnswers] = useState<number[]>([]);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setProgressState(defaultProgress);
  }, [defaultProgress]);

  const persistProgress = async (updates: Partial<TrainingProgressState>) => {
    if (!user?.uid) return;
    const nextProgress = { ...progressState, ...updates };
    setProgressState(nextProgress);
    try {
      const { db } = getFirebase();
      await updateDoc(doc(db, 'artisan_onboarding', user.uid), {
        trainingProgress: nextProgress,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error saving training progress:', error);
    }
  };

  const activeModuleId = progressState.activeModuleId;
  const currentPage = progressState.currentPage;
  const takingAssessment = progressState.takingAssessment;

  const getModuleStatus = (moduleId: string) => {
    switch (moduleId) {
      case 'safety-training':
        return onboarding.training.safetyTraining;
      case 'residential-training':
        return onboarding.training.residentialTraining;
      case 'corporate-training':
        return onboarding.training.corporateTraining;
      case 'dashboard-training':
        return onboarding.training.dashboardTraining;
      default:
        return { completed: false, assessmentScore: 0, passedAssessment: false };
    }
  };

  const startModule = (moduleId: string, resume = false) => {
    setModuleViewOpen(true);
    setAssessmentComplete(false);
    setAssessmentAnswers([]);
    setAssessmentScore(0);
    if (resume) {
      persistProgress({
        activeModuleId: moduleId,
      });
    } else {
      persistProgress({
        activeModuleId: moduleId,
        currentPage: 0,
        takingAssessment: false,
      });
    }
  };

  const closeModule = () => {
    setModuleViewOpen(false);
    setAssessmentComplete(false);
    setAssessmentAnswers([]);
    persistProgress({
      takingAssessment: false,
    });
  };

  const startAssessment = () => {
    if (!activeModuleData) return;
    setAssessmentComplete(false);
    setAssessmentAnswers(new Array(activeModuleData.assessment.questions.length).fill(-1));
    persistProgress({ takingAssessment: true });
  };

  const goToPage = (page: number) => {
    persistProgress({ currentPage: page, takingAssessment: false });
  };

  const submitAssessment = async () => {
    if (!activeModuleData || !activeModuleId) return;

    // Calculate score
    const questions = activeModuleData.assessment.questions;
    let correct = 0;
    assessmentAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= activeModuleData.assessment.passingScore;

    setAssessmentScore(score);
    setAssessmentComplete(true);

    // Update database
    setSubmitting(true);
    try {
      const { db } = getFirebase();
      const onboardingRef = doc(db, 'artisan_onboarding', user.uid);

      const moduleKey = activeModuleId ? moduleKeyMap[activeModuleId] : undefined;
      if (!moduleKey) {
        throw new Error('Unknown training module');
      }
      const updatedTraining = {
        ...onboarding.training,
        [moduleKey]: {
          completed: true,
          assessmentScore: score,
          passedAssessment: passed,
          completedAt: new Date()
        }
      } as ArtisanOnboarding['training'];

      // Check if all modules are completed and passed
      const allCompleted = 
        updatedTraining.safetyTraining.completed &&
        updatedTraining.residentialTraining.completed &&
        updatedTraining.corporateTraining.completed &&
        updatedTraining.dashboardTraining.completed;

      const allPassed = 
        updatedTraining.safetyTraining.passedAssessment &&
        updatedTraining.residentialTraining.passedAssessment &&
        updatedTraining.corporateTraining.passedAssessment &&
        updatedTraining.dashboardTraining.passedAssessment;

      updatedTraining.allCompleted = allCompleted;
      updatedTraining.allPassed = allPassed;

      const updates: any = {
        training: updatedTraining,
        updatedAt: serverTimestamp()
      };

      // If all completed and passed, move to review stage
      if (allCompleted && allPassed) {
        updates.status = 'under-review';
        updates.currentStep = 3;
        updates.submittedAt = serverTimestamp();
      }

      await updateDoc(onboardingRef, updates);

      const updatedOnboarding: ArtisanOnboarding = {
        ...onboarding,
        training: updatedTraining,
        status: allCompleted && allPassed ? 'under-review' : onboarding.status,
        currentStep: allCompleted && allPassed ? 3 : onboarding.currentStep,
        submittedAt: allCompleted && allPassed ? new Date() : onboarding.submittedAt,
        updatedAt: new Date()
      };

      setOnboarding(updatedOnboarding);
      setModuleViewOpen(false);
      await persistProgress({
        activeModuleId: null,
        currentPage: 0,
        takingAssessment: false,
      });

      if (allCompleted && allPassed) {
        setTimeout(() => {
          alert('Congratulations! You have completed all training modules. Your application is now under review.');
        }, 1000);
      }
    } catch (error) {
      console.error('Error updating training:', error);
      alert('Failed to save assessment results. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const activeModuleData = activeModuleId ? trainingModules.find(m => m.id === activeModuleId) : null;
  const resumeModuleData = progressState.activeModuleId ? trainingModules.find(m => m.id === progressState.activeModuleId) : null;

  // Calculate overall progress
  const completedModules = [
    onboarding.training.safetyTraining,
    onboarding.training.residentialTraining,
    onboarding.training.corporateTraining,
    onboarding.training.dashboardTraining
  ].filter(m => m.completed && m.passedAssessment).length;

  return (
    <div className="mx-auto max-w-6xl">
      {!moduleViewOpen ? (
        <>
          {/* Overview */}
          <div className="mb-8 rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Training Modules</h2>
            <p className="text-neutral-600 mb-6">
              Complete all training modules and pass the assessments with a minimum score of 80% each.
            </p>

            {/* Progress */}
            <div className="mb-6 rounded-lg bg-neutral-50 p-6 animate-fade-in-up">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-700">Overall Progress</span>
                <span className="text-sm font-bold text-brand-600">{completedModules} / 4 Completed</span>
              </div>
              <div className="h-3 w-full rounded-full bg-neutral-200">
                <div
                  className="h-3 rounded-full bg-brand-600 transition-all duration-500"
                  style={{ width: `${(completedModules / 4) * 100}%` }}
                />
              </div>
            </div>

            {resumeModuleData && !onboarding.training.allPassed && (
              <div className="mb-6 rounded-xl border border-purple-200 bg-purple-50 p-5 animate-fade-in-up">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">Resume training</p>
                    <p className="text-lg font-bold text-neutral-900">{resumeModuleData.title}</p>
                    <p className="text-sm text-neutral-600">
                      Page {progressState.currentPage + 1} of{' '}
                      {resumeModuleData.content.length}
                    </p>
                  </div>
                  <button
                    onClick={() => startModule(resumeModuleData.id, true)}
                    className="rounded-lg bg-purple-600 px-6 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-purple-700"
                  >
                    Resume where I stopped
                  </button>
                </div>
              </div>
            )}

            {onboarding.training.allCompleted && onboarding.training.allPassed && (
              <div className="rounded-lg border-2 border-green-500 bg-green-50 p-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-semibold text-green-900">All Training Complete!</p>
                    <p className="text-sm text-green-700">
                      Your application has been submitted for admin review. You'll receive feedback within 5 business days.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Module Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {trainingModules.map((module, index) => {
              const status = getModuleStatus(module.id);
              const isLocked = false; // All modules are available
              const isResumeTarget = progressState.activeModuleId === module.id && !moduleViewOpen;

              return (
                <div
                  key={module.id}
                  className={`overflow-hidden rounded-xl border-2 ${
                    status.passedAssessment
                      ? 'border-green-500 bg-green-50'
                      : status.completed && !status.passedAssessment
                      ? 'border-red-500 bg-red-50'
                      : 'border-neutral-200 bg-white'
                  } p-6 shadow-sm transition-all hover:shadow-md animate-fade-in-up`}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {module.image && (
                    <div className="relative mb-4 h-40 w-full overflow-hidden rounded-lg">
                      <Image
                        src={module.image}
                        alt={module.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                        status.passedAssessment
                          ? 'bg-green-500 text-white'
                          : status.completed && !status.passedAssessment
                          ? 'bg-red-500 text-white'
                          : 'bg-brand-100 text-brand-600'
                      }`}>
                        {status.passedAssessment ? '✓' : module.id === 'safety-training' ? '🛡️' : module.id === 'residential-training' ? '🏠' : module.id === 'corporate-training' ? '🏢' : '📱'}
                      </div>
                      <div>
                        <h3 className="font-bold text-neutral-900">{module.title}</h3>
                        <p className="text-sm text-neutral-600">{module.duration}</p>
                      </div>
                    </div>
                    {status.passedAssessment && (
                      <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                        Passed
                      </span>
                    )}
                    {status.completed && !status.passedAssessment && (
                      <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                        {status.assessmentScore}%
                      </span>
                    )}
                  </div>

                  <p className="mb-4 text-sm text-neutral-600">{module.description}</p>
                  {isResumeTarget && (
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                      <span className="h-2 w-2 rounded-full bg-purple-600" />
                      In progress — Page {progressState.currentPage + 1} of {module.content.length}
                    </div>
                  )}

                  {status.completed && (
                    <div className="mb-4 rounded-lg bg-white p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600">Assessment Score:</span>
                        <span className={`font-bold ${status.passedAssessment ? 'text-green-600' : 'text-red-600'}`}>
                          {status.assessmentScore}%
                        </span>
                      </div>
                      {!status.passedAssessment && (
                        <p className="mt-2 text-xs text-red-600">
                          You need 80% to pass. Please retake the training and assessment.
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => startModule(module.id, isResumeTarget)}
                    disabled={isLocked}
                    className={`w-full rounded-lg px-4 py-2.5 font-semibold transition-colors ${
                      isLocked
                        ? 'cursor-not-allowed bg-neutral-300 text-neutral-500'
                        : status.passedAssessment
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : isResumeTarget
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-brand-600 text-white hover:bg-brand-700'
                    }`}
                  >
                    {isLocked
                      ? 'Complete Previous Module'
                      : status.passedAssessment
                      ? 'Review Module'
                      : isResumeTarget
                      ? 'Resume Module'
                      : status.completed
                      ? 'Retake Training'
                      : 'Start Training'}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* Module Content */}
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm animate-fade-in-up">
            {/* Header */}
            <div className="border-b border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">{activeModuleData?.title}</h2>
                  <p className="text-sm text-neutral-600">{activeModuleData?.description}</p>
                  <p className="mt-1 text-xs font-semibold text-brand-600">
                    Page {currentPage + 1} of {activeModuleData?.content.length ?? 0}
                  </p>
                </div>
                <button
                  onClick={closeModule}
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Close
                </button>
              </div>
            </div>

            {activeModuleData?.image && (
              <div className="relative h-48 w-full overflow-hidden border-b border-neutral-100">
                <Image
                  src={activeModuleData.image}
                  alt={activeModuleData.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {!takingAssessment && !assessmentComplete && (
              <>
                {/* Content Pages */}
                <div className="p-8">
                  <div className="prose prose-neutral max-w-none">
                    <div
                      className="space-y-4 text-neutral-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: activeModuleData?.content[currentPage]
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br/>')
                          || ''
                      }}
                    />
                  </div>
                </div>

                {/* Navigation */}
                <div className="border-t border-neutral-200 p-6">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 0}
                      className="rounded-lg border border-neutral-300 px-6 py-2.5 font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      ← Previous
                    </button>

                    <div className="text-sm text-neutral-600">
                      Page {currentPage + 1} of {activeModuleData?.content.length}
                    </div>

                    {currentPage < (activeModuleData?.content.length || 0) - 1 ? (
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        className="rounded-lg bg-brand-600 px-6 py-2.5 font-semibold text-white hover:bg-brand-700"
                      >
                        Next →
                      </button>
                    ) : (
                      <button
                        onClick={startAssessment}
                        className="rounded-lg bg-green-600 px-6 py-2.5 font-semibold text-white hover:bg-green-700"
                      >
                        Start Assessment
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {takingAssessment && !assessmentComplete && (
              <>
                {/* Assessment */}
                <div className="p-8">
                  <div className="mb-6 rounded-lg bg-amber-50 p-4 border border-amber-200">
                    <p className="text-sm font-medium text-amber-900">
                      ⚠️ You need to score at least {activeModuleData?.assessment.passingScore}% to pass this assessment.
                    </p>
                  </div>

                  <div className="space-y-8">
                    {activeModuleData?.assessment.questions.map((question, qIndex) => (
                      <div key={question.id} className="rounded-lg border border-neutral-200 p-6">
                        <p className="mb-4 font-semibold text-neutral-900">
                          {qIndex + 1}. {question.question}
                        </p>
                        <div className="space-y-3">
                          {question.options.map((option, oIndex) => (
                            <label
                              key={oIndex}
                              className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-all ${
                                assessmentAnswers[qIndex] === oIndex
                                  ? 'border-brand-500 bg-brand-50'
                                  : 'border-neutral-200 hover:border-neutral-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${qIndex}`}
                                checked={assessmentAnswers[qIndex] === oIndex}
                                onChange={() => {
                                  const updated = [...assessmentAnswers];
                                  updated[qIndex] = oIndex;
                                  setAssessmentAnswers(updated);
                                }}
                                className="mt-1"
                              />
                              <span className="text-neutral-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Assessment */}
                <div className="border-t border-neutral-200 p-6">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to go back? Your answers will be lost.')) {
                          persistProgress({ takingAssessment: false });
                          setAssessmentAnswers([]);
                        }
                      }}
                      className="rounded-lg border border-neutral-300 px-6 py-2.5 font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                      ← Back to Content
                    </button>

                    <button
                      onClick={submitAssessment}
                      disabled={assessmentAnswers.some(a => a === -1) || submitting}
                      className="rounded-lg bg-green-600 px-8 py-2.5 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Assessment'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {assessmentComplete && (
              <>
                {/* Results */}
                <div className="p-8">
                  <div className={`rounded-xl border-2 p-8 text-center ${
                    assessmentScore >= (activeModuleData?.assessment.passingScore || 80)
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                  }`}>
                    <div className="mb-4 text-6xl">
                      {assessmentScore >= (activeModuleData?.assessment.passingScore || 80) ? '🎉' : '😔'}
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-neutral-900">
                      {assessmentScore >= (activeModuleData?.assessment.passingScore || 80)
                        ? 'Congratulations! You Passed!'
                        : 'Assessment Not Passed'}
                    </h3>
                    <p className="mb-4 text-lg font-semibold text-neutral-700">
                      Your Score: <span className={assessmentScore >= (activeModuleData?.assessment.passingScore || 80) ? 'text-green-600' : 'text-red-600'}>
                        {assessmentScore}%
                      </span>
                    </p>
                    <p className="text-neutral-600">
                      {assessmentScore >= (activeModuleData?.assessment.passingScore || 80)
                        ? 'You have successfully completed this training module.'
                        : `You need ${activeModuleData?.assessment.passingScore}% to pass. Please review the material and try again.`}
                    </p>
                  </div>

                  {/* Correct Answers */}
                  <div className="mt-8 space-y-6">
                    <h4 className="text-lg font-bold text-neutral-900">Review Your Answers</h4>
                    {activeModuleData?.assessment.questions.map((question, qIndex) => {
                      const userAnswer = assessmentAnswers[qIndex];
                      const isCorrect = userAnswer === question.correctAnswer;

                      return (
                        <div key={question.id} className={`rounded-lg border-2 p-6 ${
                          isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                        }`}>
                          <div className="mb-3 flex items-start gap-3">
                            <span className="text-2xl">{isCorrect ? '✓' : '✗'}</span>
                            <div className="flex-1">
                              <p className="font-semibold text-neutral-900">
                                {qIndex + 1}. {question.question}
                              </p>
                            </div>
                          </div>

                          <div className="ml-10 space-y-2">
                            <p className="text-sm">
                              <span className="font-medium">Your answer:</span>{' '}
                              <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                                {question.options[userAnswer]}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="text-sm">
                                <span className="font-medium">Correct answer:</span>{' '}
                                <span className="text-green-700">
                                  {question.options[question.correctAnswer]}
                                </span>
                              </p>
                            )}
                            {question.explanation && (
                              <p className="text-sm text-neutral-600">
                                <span className="font-medium">Explanation:</span> {question.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Close Button */}
                <div className="border-t border-neutral-200 p-6">
                  <button
                    onClick={closeModule}
                    className="w-full rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
                  >
                    {assessmentScore >= (activeModuleData?.assessment.passingScore || 80)
                      ? 'Continue to Next Module'
                      : 'Close and Review Material'}
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

