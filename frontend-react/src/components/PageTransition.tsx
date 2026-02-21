import { useRef, useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Re-trigger animation on route change
    el.classList.remove('animate-pageIn');
    // Force reflow so the browser re-starts the animation
    void el.offsetWidth;
    el.classList.add('animate-pageIn');
  }, [location.pathname]);

  return (
    <div ref={ref} className="animate-pageIn">
      {children}
    </div>
  );
}
