'use client';

import { useState, FormEvent, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
  getMultiFactorResolver,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  type User,
  type AuthError,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirebase } from '@/lib/firebaseClient';

type MFAState = {
  showMFA: boolean;
  phoneNumber: string;
  verificationId: string | null;
  verificationCode: string;
  recaptchaVerifier: RecaptchaVerifier | null;
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [inactivityMessage, setInactivityMessage] = useState(false);
  const [mfaState, setMfaState] = useState<MFAState>({
    showMFA: false,
    phoneNumber: '',
    verificationId: null,
    verificationCode: '',
    recaptchaVerifier: null,
  });
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  // Check for inactivity redirect
  useEffect(() => {
    const reason = searchParams?.get('reason');
    if (reason === 'inactivity') {
      setInactivityMessage(true);
      // Clear the message after 5 seconds
      setTimeout(() => setInactivityMessage(false), 5000);
    }
  }, [searchParams]);

  // Cleanup recaptcha on unmount
  useEffect(() => {
    return () => {
      if (mfaState.recaptchaVerifier) {
        mfaState.recaptchaVerifier.clear();
      }
    };
  }, [mfaState.recaptchaVerifier]);

  const initializeRecaptcha = async (): Promise<RecaptchaVerifier> => {
    const { auth } = getFirebase();
    
    // Clear existing verifier if any
    if (mfaState.recaptchaVerifier) {
      mfaState.recaptchaVerifier.clear();
    }

    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'normal',
      callback: () => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        setError('reCAPTCHA expired. Please try again.');
      },
    });

    await verifier.render();
    return verifier;
  };

  const handleMFAFlow = async (error: any) => {
    try {
      const { auth } = getFirebase();
      const resolver = getMultiFactorResolver(auth, error);
      
      if (!resolver || !resolver.hints || resolver.hints.length === 0) {
        setError('Multi-factor authentication is required but no phone number is enrolled.');
        setLoading(false);
        return;
      }

      // Store resolver for later use
      setMfaResolver(resolver);

      // Get the phone number hint
      const phoneInfoOptions = {
        multiFactorHint: resolver.hints[0],
        session: resolver.session,
      };

      // Initialize reCAPTCHA
      const verifier = await initializeRecaptcha();
      setMfaState((prev) => ({ ...prev, recaptchaVerifier: verifier }));

      // Send SMS code using PhoneAuthProvider for MFA
      // Create PhoneAuthProvider instance and verify phone number
      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneAuthProvider.verifyPhoneNumber(
        phoneInfoOptions as any,
        verifier
      );

      setMfaState((prev) => ({
        ...prev,
        showMFA: true,
        verificationId,
      }));
    } catch (err: unknown) {
      console.error('MFA initialization error:', err);
      if (err && typeof err === 'object' && 'code' in err) {
        const errorCode = (err as { code?: string }).code;
        if (errorCode === 'auth/invalid-phone-number') {
          setError('Invalid phone number. Please check and try again.');
        } else {
          setError(`MFA setup failed: ${errorCode}`);
        }
      } else {
        setError('Failed to initialize multi-factor authentication. Please try again.');
      }
      setLoading(false);
    }
  };

  const [mfaResolver, setMfaResolver] = useState<any>(null);

  const handleMFAVerification = async () => {
    if (!mfaState.verificationId || !mfaState.verificationCode || !mfaResolver) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { auth, db } = getFirebase();
      
      // Create phone credential
      const phoneCredential = PhoneAuthProvider.credential(
        mfaState.verificationId,
        mfaState.verificationCode
      );

      // Resolve the sign-in with the phone credential
      const multiFactorCredential = PhoneMultiFactorGenerator.assertion(phoneCredential);
      const userCredential = await mfaResolver.resolveSignIn(multiFactorCredential);

      // Clear MFA state
      if (mfaState.recaptchaVerifier) {
        mfaState.recaptchaVerifier.clear();
      }
      setMfaState({
        showMFA: false,
        phoneNumber: '',
        verificationId: null,
        verificationCode: '',
        recaptchaVerifier: null,
      });
      setMfaResolver(null);

      // Check email verification
      if (!userCredential.user.emailVerified) {
        setShowEmailVerification(true);
        setError('Please verify your email address before signing in.');
        setLoading(false);
        return;
      }

      const profileRef = doc(db, 'profiles', userCredential.user.uid);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        const role = profileSnap.data().role;
        const normalizedRole = typeof role === 'string' ? role : String(role);
        // Check if user is any admin role
        if (normalizedRole === 'admin' || normalizedRole === 'full_admin' || normalizedRole === 'manager' || normalizedRole === 'billing_finance') {
          router.push('/admin/dashboard');
        } else if (normalizedRole === 'Phixer' || normalizedRole === 'phixer' || normalizedRole === 'artisan') {
          router.push('/phixer/dashboard');
        } else {
          router.push('/client/dashboard');
        }
      } else {
        router.push('/client/dashboard');
      }
    } catch (err: unknown) {
      console.error('MFA verification error:', err);
      if (err && typeof err === 'object' && 'code' in err) {
        const errorCode = (err as { code?: string }).code;
        if (errorCode === 'auth/invalid-verification-code') {
          setError('Invalid verification code. Please try again.');
        } else {
          setError(`Verification failed: ${errorCode}`);
        }
      } else {
        setError('Failed to verify code. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    try {
      const { auth } = getFirebase();
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        setError('');
        alert('Verification email sent! Please check your inbox.');
      }
    } catch (err) {
      console.error('Error resending verification email:', err);
      setError('Failed to resend verification email. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const { auth, db } = getFirebase();
      
      // Set persistence based on remember me
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if profile exists, create if not
      const profileRef = doc(db, 'profiles', userCredential.user.uid);
      const profileSnap = await getDoc(profileRef);
      
      if (!profileSnap.exists()) {
        await setDoc(profileRef, {
          name: userCredential.user.displayName || '',
          email: userCredential.user.email || '',
          role: 'client',
          emailVerified: userCredential.user.emailVerified,
          createdAt: new Date().toISOString(),
        });
      }
      
      // Redirect based on role
      const role = profileSnap.exists() ? profileSnap.data().role : 'client';
      const normalizedRole = typeof role === 'string' ? role : String(role);
      if (normalizedRole === 'admin') {
        router.push('/admin/dashboard');
      } else if (normalizedRole === 'Phixer' || normalizedRole === 'phixer' || normalizedRole === 'artisan') {
        router.push('/phixer/dashboard');
      } else {
        router.push('/client/dashboard');
      }
    } catch (err: unknown) {
      console.error('Google sign-in error:', err);
      if (err && typeof err === 'object' && 'code' in err) {
        const errorCode = (err as { code?: string }).code;
        if (errorCode === 'auth/popup-closed-by-user') {
          setError('Sign-in was cancelled.');
        } else {
          setError(`Google sign-in failed: ${errorCode}`);
        }
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const { auth, db } = getFirebase();
      
      // Set persistence based on remember me
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      const provider = new FacebookAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if profile exists, create if not
      const profileRef = doc(db, 'profiles', userCredential.user.uid);
      const profileSnap = await getDoc(profileRef);
      
      if (!profileSnap.exists()) {
        await setDoc(profileRef, {
          name: userCredential.user.displayName || '',
          email: userCredential.user.email || '',
          role: 'client',
          emailVerified: userCredential.user.emailVerified,
          createdAt: new Date().toISOString(),
        });
      }
      
      // Redirect based on role
      const role = profileSnap.exists() ? profileSnap.data().role : 'client';
      const normalizedRole = typeof role === 'string' ? role : String(role);
      if (normalizedRole === 'admin') {
        router.push('/admin/dashboard');
      } else if (normalizedRole === 'Phixer' || normalizedRole === 'phixer' || normalizedRole === 'artisan') {
        router.push('/phixer/dashboard');
      } else {
        router.push('/client/dashboard');
      }
    } catch (err: unknown) {
      console.error('Facebook sign-in error:', err);
      if (err && typeof err === 'object' && 'code' in err) {
        const errorCode = (err as { code?: string }).code;
        if (errorCode === 'auth/popup-closed-by-user') {
          setError('Sign-in was cancelled.');
        } else {
          setError(`Facebook sign-in failed: ${errorCode}`);
        }
      } else {
        setError('Failed to sign in with Facebook. Please try again.');
      }
      setLoading(false);
    }
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setShowEmailVerification(false);
    setLoading(true);

    try {
      const { auth, db } = getFirebase();
      
      // Set persistence based on remember me
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check email verification
      if (!userCredential.user.emailVerified) {
        setShowEmailVerification(true);
        setError('Please verify your email address before signing in. Check your inbox for the verification link.');
        setLoading(false);
        return;
      }

      // Check if user has MFA enrolled
      const enrolledFactors = multiFactor(userCredential.user).enrolledFactors;
      if (enrolledFactors.length > 0) {
        // User has MFA - this should be handled by the error handler
        // But if we reach here, MFA was already completed
      }

      const profileRef = doc(db, 'profiles', userCredential.user.uid);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        const role = profileSnap.data().role;
        const normalizedRole = typeof role === 'string' ? role : String(role);
        // Check if user is any admin role
        if (normalizedRole === 'admin' || normalizedRole === 'full_admin' || normalizedRole === 'manager' || normalizedRole === 'billing_finance') {
          router.push('/admin/dashboard');
        } else if (normalizedRole === 'Phixer' || normalizedRole === 'phixer' || normalizedRole === 'artisan') {
          router.push('/phixer/dashboard');
        } else {
          router.push('/client/dashboard');
        }
      } else {
        router.push('/client/dashboard');
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      
      // Check for MFA required error
      if (err && typeof err === 'object' && 'code' in err) {
        const errorCode = (err as { code?: string }).code;
        
        if (errorCode === 'auth/multi-factor-auth-required') {
          // Handle MFA flow
          await handleMFAFlow(err);
          return;
        }
        
        switch (errorCode) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            setError('Invalid email or password. Please try again.');
            break;
          case 'auth/invalid-email':
            setError('Please enter a valid email address.');
            break;
          case 'auth/user-disabled':
            setError('This account has been disabled. Please contact support.');
            break;
          case 'auth/too-many-requests':
            setError('Too many failed attempts. Please try again later.');
            break;
          default:
            setError(`Sign in failed: ${errorCode}. Please try again.`);
        }
      } else {
        setError('Invalid email or password. Please try again.');
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
              Welcome back
            </h2>
            <p className="mt-2 text-neutral-600">
              Sign in to access your dashboard and manage your facility maintenance.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {inactivityMessage && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800">
                      Your session expired due to inactivity. Please sign in again to continue.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            {showEmailVerification && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-yellow-800">Email Verification Required</h3>
                    <p className="mt-1 text-sm text-yellow-700">
                      Please verify your email address before signing in. Check your inbox for the verification link.
                    </p>
                    <button
                      type="button"
                      onClick={handleResendVerificationEmail}
                      className="mt-2 text-sm font-medium text-yellow-800 underline hover:text-yellow-900"
                    >
                      Resend verification email
                    </button>
                  </div>
                </div>
              </div>
            )}

            {mfaState.showMFA && (
              <div className="rounded-lg border border-brand-200 bg-brand-50 p-4 space-y-4">
                <h3 className="text-sm font-semibold text-brand-900">Multi-Factor Authentication</h3>
                <p className="text-sm text-brand-700">
                  A verification code has been sent to your phone. Please enter it below.
                </p>
                
                <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
                
                <div>
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-neutral-700">
                    Verification Code
                  </label>
                  <input
                    id="verificationCode"
                    name="verificationCode"
                    type="text"
                    inputMode="numeric"
                    required
                    value={mfaState.verificationCode}
                    onChange={(e) => setMfaState({ ...mfaState, verificationCode: e.target.value })}
                    className="mt-2 block w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-400 shadow-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                </div>
                
                <button
                  type="button"
                  onClick={handleMFAVerification}
                  disabled={loading || !mfaState.verificationCode}
                  className="flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-3 font-semibold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    if (mfaState.recaptchaVerifier) {
                      mfaState.recaptchaVerifier.clear();
                    }
                    setMfaState({
                      showMFA: false,
                      phoneNumber: '',
                      verificationId: null,
                      verificationCode: '',
                      recaptchaVerifier: null,
                    });
                    setError('');
                  }}
                  className="w-full text-sm text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 pr-10 text-neutral-900 placeholder-neutral-400 shadow-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.97 9.97 0 015.12 5.12m3.29 3.29L12 12m0 0l3.29-3.29m-3.29 3.29L12 12m0 0v.01" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-brand-600 hover:text-brand-700">
                  Forgot password?
                </Link>
              </div>
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
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-neutral-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-neutral-600">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-brand-600 hover:text-brand-700">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Hero Image/Pattern */}
      <div className="relative hidden lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-800">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="flex h-full flex-col items-center justify-center p-12 text-white">
            <div className="max-w-md">
              <h2 className="text-4xl font-bold">Manage Your Facilities with Confidence</h2>
              <p className="mt-4 text-lg text-brand-100">
                Access vetted artisans, track jobs in real-time, and streamline your facility operations—all from one powerful platform.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: '⚡', text: 'Same-day service available' },
                  { icon: '🔒', text: 'Secure payment processing' },
                  { icon: '📍', text: 'Real-time tracking' },
                  { icon: '⭐', text: 'Verified professionals' },
                ].map((feature) => (
                  <div key={feature.text} className="flex items-center gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <span className="text-brand-100">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand-600 border-t-transparent"></div>
          <p className="mt-4 text-neutral-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
