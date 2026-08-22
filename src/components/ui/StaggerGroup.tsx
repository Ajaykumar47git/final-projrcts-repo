import { type ReactNode } from 'react';
import { useInView } from '../../hooks/useInView';

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  animation?: 'fade-up' | 'scale-up' | 'blur-in' | 'fade-left';
  duration?: number;
}

const baseStyles = {
  'fade-up': {
    hidden: { opacity: 0, transform: 'translateY(30px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  'scale-up': {
    hidden: { opacity: 0, transform: 'scale(0.9)' },
    visible: { opacity: 1, transform: 'scale(1)' },
  },
  'blur-in': {
    hidden: { opacity: 0, filter: 'blur(6px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
  },
  'fade-left': {
    hidden: { opacity: 0, transform: 'translateX(30px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
};

export function StaggerGroup({
  children,
  className = '',
  staggerDelay = 100,
  animation = 'fade-up',
  duration = 500,
}: StaggerGroupProps) {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.1, triggerOnce: true });
  const styles = baseStyles[animation];

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div
              key={i}
              style={{
                ...(isInView ? styles.visible : styles.hidden),
                transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${i * staggerDelay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${i * staggerDelay}ms, filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${i * staggerDelay}ms`,
                willChange: 'opacity, transform, filter',
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}
