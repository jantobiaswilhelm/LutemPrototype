import { useState, useRef, useCallback, type ReactNode } from 'react';
import { Clock, Zap } from 'lucide-react';

interface GamePreviewData {
  name: string;
  description?: string;
  minMinutes?: number;
  maxMinutes?: number;
  energyRequired?: string;
  genres?: string[];
}

interface GamePreviewTooltipProps {
  game: GamePreviewData;
  children: ReactNode;
}

export function GamePreviewTooltip({ game, children }: GamePreviewTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => {
      // Determine position: show above or below depending on viewport space
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        setPosition(rect.top > 200 ? 'top' : 'bottom');
      }
      setVisible(true);
    }, 300);
  }, []);

  const hide = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisible(false);
  }, []);

  const hasDetails = game.description || game.minMinutes || game.genres?.length;

  // Don't wrap if no extra info to show
  if (!hasDetails) return <>{children}</>;

  return (
    <div
      ref={wrapperRef}
      className="relative hover-preview-wrapper"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}

      {visible && (
        <div
          className={`
            absolute left-1/2 -translate-x-1/2 z-30
            w-64 p-3 rounded-xl
            bg-[var(--color-bg-secondary)] border border-[var(--color-border)]
            shadow-xl backdrop-blur-md
            animate-fadeIn
            pointer-events-none
            ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
          `}
        >
          {game.description && (
            <p className="text-xs text-[var(--color-text-secondary)] line-clamp-3 mb-2">
              {game.description}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
            {game.minMinutes != null && game.maxMinutes != null && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {game.minMinutes}-{game.maxMinutes} min
              </span>
            )}
            {game.energyRequired && (
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {game.energyRequired}
              </span>
            )}
          </div>

          {game.genres && game.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {game.genres.slice(0, 3).map((g) => (
                <span
                  key={g}
                  className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]"
                >
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
