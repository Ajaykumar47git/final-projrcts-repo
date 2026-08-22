import { type ReactNode } from 'react';
import { useInView } from '../../hooks/useInView';

type AnimationType =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'scale-up'
  | 'scale-down'
  | 'blur-in'
  | 'rotate-in'
  | 'flip-in'
  | 'slide-up-big';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

const animationStyles: Record<AnimationType, { hidden: React.CSSProperties; visible: React.CSSProperties }> = {
  'fade-up': {
    hidden: { opacity: 0, transform: 'translateY(40px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-down': {
    hidden: { opacity: 0, transform: 'translateY(-40px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-left': {
    hidden: { opacity: 0, transform: 'translateX(50px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  'fade-right': {
    hidden: { opacity: 0, transform: 'translateX(-50px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  'scale-up': {
    hidden: { opacity: 0, transform: 'scale(0.85)' },
    visible: { opacity: 1, transform: 'scale(1)' },
  },
  'scale-down': {
    hidden: { opacity: 0, transform: 'scale(1.1)' },
    visible: { opacity: 1, transform: 'scale(1)' },
  },
  'blur-in': {
    hidden: { opacity: 0, filter: 'blur(8px)', transform: 'translateY(10px)' },
    visible: { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0)' },
  },
  'rotate-in': {
    hidden: { opacity: 0, transform: 'rotate(-8deg) scale(0.9)' },
    visible: { opacity: 1, transform: 'rotate(0deg) scale(1)' },
  },
  'flip-in': {
    hidden: { opacity: 0, transform: 'perspective(600px) rotateX(12deg)' },
    visible: { opacity: 1, transform: 'perspective(600px) rotateX(0deg)' },
  },
  'slide-up-big': {
    hidden: { opacity: 0, transform: 'translateY(80px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
};

export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  className = '',
  threshold = 0.15,
}: ScrollRevealProps) {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold, triggerOnce: true });

  const styles = animationStyles[animation];
  const currentStyle = isInView ? styles.visible : styles.hidden;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...currentStyle,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform, filter',
      }}
    >
      {children}
    </div>
  );
}
