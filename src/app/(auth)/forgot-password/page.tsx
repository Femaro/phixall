'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { getFirebase } from '@/lib/firebaseClient';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const { auth } = getFirebase();
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: unknown) {
      console.error('Password reset error:', err);
      if (err && typeof err === 'object' && 'code' in err) {
        const errorCode = (err as { code?: string }).code;
        switch (errorCode) {
          case 'auth/user-not-found':
            setError('No account found with this email address.');
            break;
          case 'auth/invalid-email':
            setError('Please enter a valid email address.');
            break;
          case 'auth/too-many-requests':
            setError('Too many requests. Please try again later.');
            break;
          default:
            setError(`Failed to send reset email: ${errorCode}. Please try again.`);
        }
      } else {
        setError('Failed to send reset email. Please try again.');
      }
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
              Reset your password
            </h2>
            <p className="mt-2 text-neutral-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {success ? (
            <div className="mt-8 space-y-6">
              <div className="rounded-lg border border-green-200 bg-green-50 p-6">
                <div className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-900">Check your email</h3>
                    <p className="mt-2 text-sm text-green-700">
                      We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and click the link to reset your password.
                    </p>
                    <p className="mt-3 text-sm text-green-600">
                      The link will expire in 1 hour. If you don't see the email, check your spam folder.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 block w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-400 shadow-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-3 font-semibold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="mr-2 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending reset link...
                  </>
                ) : (
                  'Send reset link'
                )}
              </button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right Side - Hero Image/Pattern */}
      <div className="relative hidden lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-800">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="flex h-full flex-col items-center justify-center p-12 text-white">
            <div className="max-w-md">
              <h2 className="text-4xl font-bold">Reset Your Password</h2>
              <p className="mt-4 text-lg text-brand-100">
                Don't worry! Enter your email address and we'll send you instructions to reset your password.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

