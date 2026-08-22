import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: ReactNode;
  variant?: 'fade' | 'slide-up' | 'slide-left' | 'scale' | 'blur';
}

const variantStyles: Record<string, { enter: string; exit: string }> = {
  fade: {
    enter: 'animate-fade-in',
    exit: 'animate-fade-out',
  },
  'slide-up': {
    enter: 'animate-page-slide-up',
    exit: 'animate-page-slide-up-out',
  },
  'slide-left': {
    enter: 'animate-page-slide-left',
    exit: 'animate-page-slide-left-out',
  },
  scale: {
    enter: 'animate-page-scale',
    exit: 'animate-page-scale-out',
  },
  blur: {
    enter: 'animate-page-blur',
    exit: 'animate-page-blur-out',
  },
};

export default function PageTransition({ children, variant = 'fade' }: PageTransitionProps) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<'enter' | 'idle' | 'exit'>('enter');
  const [prevPath, setPrevPath] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPath) {
      // Start exit animation
      setTransitionStage('exit');

      const exitTimer = setTimeout(() => {
        setPrevPath(location.pathname);
        setDisplayChildren(children);
        setTransitionStage('enter');
      }, 200); // match exit animation duration

      return () => clearTimeout(exitTimer);
    } else {
      setDisplayChildren(children);
    }
  }, [children, location.pathname, prevPath]);

  const styles = variantStyles[variant];

  return (
    <div
      className={`${transitionStage === 'enter' ? styles.enter : styles.exit}`}
      key={location.pathname}
    >
      {displayChildren}
    </div>
  );
}
