import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

export default function Button({ className, variant = 'primary', children, ...rest }: Props) {
  const base = 'inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm transition-colors';
  const styles =
    variant === 'primary'
      ? 'bg-brand-600 text-white hover:bg-brand-700'
      : variant === 'secondary'
      ? 'border border-gray-300 text-gray-900 hover:bg-gray-50'
      : 'text-gray-900 hover:bg-gray-100';
  return (
    <button className={`${base} ${styles} ${className ?? ''}`} {...rest}>
      {children}
    </button>
  );
}



