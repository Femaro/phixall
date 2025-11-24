/**
 * Password validation utility functions
 */

export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

/**
 * Validates password strength
 * Requirements:
 * - Minimum 10 characters
 * - At least one uppercase letter
 * - At least one number
 * - At least one special character (!@#$%^&*)
 */
export function validatePassword(password: string): PasswordValidation {
  const requirements = {
    minLength: password.length >= 10,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password),
  };

  const errors: string[] = [];
  if (!requirements.minLength) {
    errors.push('Password must be at least 10 characters long');
  }
  if (!requirements.hasUppercase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!requirements.hasNumber) {
    errors.push('Password must contain at least one number');
  }
  if (!requirements.hasSpecialChar) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    requirements,
  };
}

/**
 * Gets password strength indicator with score
 */
export function getPasswordStrength(password: string): {
  level: 'weak' | 'medium' | 'strong' | 'very-strong';
  score: number; // 0-100
  label: string;
  color: string;
} {
  if (!password) {
    return { level: 'weak', score: 0, label: '', color: 'bg-neutral-200' };
  }

  const validation = validatePassword(password);
  let score = 0;
  
  // Base score from requirements (25 points each)
  if (validation.requirements.minLength) score += 25;
  if (validation.requirements.hasUppercase) score += 25;
  if (validation.requirements.hasNumber) score += 25;
  if (validation.requirements.hasSpecialChar) score += 25;
  
  // Bonus for length (up to 10 extra points)
  if (password.length >= 12) score += 5;
  if (password.length >= 16) score += 5;
  
  // Bonus for complexity (up to 10 extra points)
  const hasLowercase = /[a-z]/.test(password);
  const hasMultipleNumbers = (password.match(/\d/g) || []).length >= 2;
  const hasMultipleSpecial = (password.match(/[!@#$%^&*]/g) || []).length >= 2;
  
  if (hasLowercase && validation.requirements.hasUppercase) score += 3;
  if (hasMultipleNumbers) score += 3;
  if (hasMultipleSpecial) score += 4;
  
  // Cap at 100
  score = Math.min(100, score);
  
  let level: 'weak' | 'medium' | 'strong' | 'very-strong';
  let label: string;
  let color: string;
  
  if (score < 40) {
    level = 'weak';
    label = 'Weak';
    color = 'bg-red-500';
  } else if (score < 70) {
    level = 'medium';
    label = 'Medium';
    color = 'bg-yellow-500';
  } else if (score < 90) {
    level = 'strong';
    label = 'Strong';
    color = 'bg-green-500';
  } else {
    level = 'very-strong';
    label = 'Very Strong';
    color = 'bg-green-600';
  }
  
  return { level, score, label, color };
}

