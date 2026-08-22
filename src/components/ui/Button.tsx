import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
}

const variantClasses = {
  primary: 'bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 focus-visible:outline-teal-500',
  secondary: 'bg-navy-100 text-navy-800 hover:bg-navy-200 active:bg-navy-300 focus-visible:outline-navy-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:outline-red-500',
  outline: 'border-2 border-navy-300 text-navy-700 hover:bg-navy-50 active:bg-navy-100 focus-visible:outline-navy-500',
  ghost: 'text-navy-600 hover:bg-navy-100 active:bg-navy-200 focus-visible:outline-navy-500',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, children, className = '', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
