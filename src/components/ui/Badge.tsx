import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export function Badge({ children, className = '', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      } ${className}`}
    >
      {children}
    </span>
  );
}
