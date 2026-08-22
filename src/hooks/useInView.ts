import { useEffect, useRef, useState, type RefObject } from 'react';

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseInViewResult<T extends HTMLElement = HTMLElement> {
  ref: RefObject<T>;
  isInView: boolean;
}

export function useInView<T extends HTMLElement = HTMLElement>(
  options: UseInViewOptions = {}
): UseInViewResult<T> {
  const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref: ref as RefObject<T>, isInView };
}
