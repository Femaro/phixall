import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebase } from '@/lib/firebaseClient';
import { validatePassword, getPasswordStrength, type PasswordValidation } from '@/lib/authUtils';

interface RegisterFormProps {
  heading: string;
  subheading: string;
  allowRoleToggle?: boolean;
  defaultRole?: 'client' | 'Phixer';
  className?: string;
}

export default function RegisterForm({
  heading,
  subheading,
  allowRoleToggle = true,
  defaultRole = 'client',
  className = '',
}: RegisterFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: defaultRole,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation | null>(null);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password });
    if (password.length > 0) {
      setPasswordValidation(validatePassword(password));
    } else {
      setPasswordValidation(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setShowVerificationMessage(false);

    // Validate password strength
    const validation = validatePassword(formData.password);
    if (!validation.isValid) {
      setError('Please fix the password requirements below');
      setPasswordValidation(validation);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { auth, db } = getFirebase();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Send email verification immediately after sign-up
      await sendEmailVerification(userCredential.user);

      await updateProfile(userCredential.user, { displayName: formData.name });

      await setDoc(doc(db, 'profiles', userCredential.user.uid), {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        emailVerified: false,
        createdAt: serverTimestamp(),
      });

      // Show verification message instead of redirecting
      setShowVerificationMessage(true);
      setLoading(false);
    } catch (err: unknown) {
      console.error('Registration error:', err);
      if (err && typeof err === 'object' && 'code' in err) {
        const errorCode = (err as { code?: string }).code;
        switch (errorCode) {
          case 'auth/email-already-in-use':
            setError('This email is already registered. Please sign in instead.');
            break;
          case 'auth/invalid-email':
            setError('Please enter a valid email address.');
            break;
          case 'auth/operation-not-allowed':
            setError('Email/Password authentication is not enabled. Please contact support or enable it in Firebase Console.');
            break;
          case 'auth/weak-password':
            setError('Password is too weak. Please meet all password requirements.');
            break;
          case 'permission-denied':
            setError('Permission denied. Please check Firestore security rules.');
            break;
          default:
            setError(`Failed to create account: ${errorCode}. Please try again or check browser console for details.`);
        }
      } else if (err && typeof err === 'object' && 'message' in err) {
        setError(`Error: ${(err as { message?: string }).message}`);
      } else {
        setError('Failed to create account. Please check browser console for details.');
      }
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <div>
        <h2 className="mt-8 text-3xl font-bold tracking-tight text-neutral-900">
          {heading}
        </h2>
        <p className="mt-2 text-neutral-600">
          {subheading}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {allowRoleToggle ? (
          <div>
            <label className="block text-sm font-medium text-neutral-700">I am a</label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'client' })}
                className={`rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-all ${
                  formData.role === 'client'
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400'
                }`}
              >
                🏢 Facility Owner
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'Phixer' })}
                className={`rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-all ${
                  formData.role === 'Phixer'
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400'
                }`}
              >
                🔧 Skilled Phixer
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700">
            Registering as: {formData.role === 'Phixer' ? 'Skilled Phixer' : 'Client'}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-2 block w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-400 shadow-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            placeholder="John Doe"
          />
        </div>

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
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className={`block w-full rounded-lg border px-4 py-3 pr-10 text-neutral-900 placeholder-neutral-400 shadow-sm transition-colors focus:outline-none focus:ring-2 ${
                passwordValidation && !passwordValidation.isValid
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                  : passwordValidation && passwordValidation.isValid
                  ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20'
                  : 'border-neutral-300 focus:border-brand-500 focus:ring-brand-500/20'
              }`}
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
          {formData.password && (
            <div className="mt-2 space-y-2">
              {/* Password Strength Meter */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-neutral-700">Password Strength</span>
                  {(() => {
                    const strength = getPasswordStrength(formData.password);
                    return (
                      <span className={`text-xs font-semibold ${
                        strength.level === 'weak' ? 'text-red-600' :
                        strength.level === 'medium' ? 'text-yellow-600' :
                        strength.level === 'strong' ? 'text-green-600' :
                        'text-green-700'
                      }`}>
                        {strength.label}
                      </span>
                    );
                  })()}
                </div>
                <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
                  {(() => {
                    const strength = getPasswordStrength(formData.password);
                    return (
                      <div
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${strength.score}%` }}
                      />
                    );
                  })()}
                </div>
              </div>
              
              {/* Password Requirements */}
              {passwordValidation && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-neutral-700">Requirements:</p>
                  <ul className="space-y-1 text-xs">
                    <li className={`flex items-center gap-2 ${passwordValidation.requirements.minLength ? 'text-green-600' : 'text-red-600'}`}>
                      <span>{passwordValidation.requirements.minLength ? '✓' : '✗'}</span>
                      <span>At least 10 characters</span>
                    </li>
                    <li className={`flex items-center gap-2 ${passwordValidation.requirements.hasUppercase ? 'text-green-600' : 'text-red-600'}`}>
                      <span>{passwordValidation.requirements.hasUppercase ? '✓' : '✗'}</span>
                      <span>One uppercase letter</span>
                    </li>
                    <li className={`flex items-center gap-2 ${passwordValidation.requirements.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                      <span>{passwordValidation.requirements.hasNumber ? '✓' : '✗'}</span>
                      <span>One number</span>
                    </li>
                    <li className={`flex items-center gap-2 ${passwordValidation.requirements.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
                      <span>{passwordValidation.requirements.hasSpecialChar ? '✓' : '✗'}</span>
                      <span>One special character (!@#$%^&*)</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700">
            Confirm password
          </label>
          <div className="relative mt-2">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="block w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 pr-10 text-neutral-900 placeholder-neutral-400 shadow-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? (
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

        <div className="flex items-start">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="mt-1 h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-neutral-700">
            I agree to the{' '}
            <Link href="/terms" className="font-medium text-brand-600 hover:text-brand-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="font-medium text-brand-600 hover:text-brand-700">
              Privacy Policy
            </Link>
          </label>
        </div>

        {showVerificationMessage ? (
          <div className="rounded-lg border border-brand-200 bg-brand-50 p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-brand-900">Verify your email</h3>
                <p className="mt-2 text-sm text-brand-700">
                  We've sent a verification link to <strong>{formData.email}</strong>. Please check your inbox and click the link to verify your email address.
                </p>
                <p className="mt-3 text-sm text-brand-600">
                  Once verified, you can sign in and access your {formData.role === 'Phixer' ? 'onboarding' : 'client'} dashboard.
                </p>
                <div className="mt-4">
                  <Link
                    href="/login"
                    className="inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
                  >
                    Go to Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="submit"
            disabled={loading || (passwordValidation !== null && !passwordValidation.isValid)}
            className="flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-3 font-semibold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg className="mr-2 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-neutral-500">Or sign up with</span>
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
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}

