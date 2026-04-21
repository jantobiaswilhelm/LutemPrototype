import { useState, useRef, useCallback, type ReactNode } from 'react';

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
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        setPosition(rect.top > 220 ? 'top' : 'bottom');
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
          className={`absolute left-1/2 -translate-x-1/2 z-30 w-72 p-4 pointer-events-none ${
            position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
          style={{
            background: 'var(--color-bg-primary)',
            border: '1px solid var(--color-border-strong)',
            borderRadius: 0,
          }}
        >
          <div
            className="font-mono text-[0.64rem] tracking-[0.22em] uppercase mb-2"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span
              className="inline-block w-4 h-px mr-2 align-middle"
              style={{ background: 'var(--color-accent)' }}
            />
            Entry
          </div>

          {game.description && (
            <p
              className="font-serif italic text-[0.88rem] leading-snug line-clamp-3 mb-3"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {game.description}
            </p>
          )}

          <div
            className="grid gap-y-1 font-mono text-[0.7rem] tracking-wide"
            style={{
              gridTemplateColumns: '5rem 1fr',
              color: 'var(--color-text-secondary)',
            }}
          >
            {game.minMinutes != null && game.maxMinutes != null && (
              <>
                <span
                  className="uppercase tracking-[0.18em]"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Session
                </span>
                <span style={{ color: 'var(--color-text-primary)' }}>
                  {game.minMinutes}&ndash;{game.maxMinutes} min
                </span>
              </>
            )}
            {game.energyRequired && (
              <>
                <span
                  className="uppercase tracking-[0.18em]"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Energy
                </span>
                <span style={{ color: 'var(--color-text-primary)' }}>
                  {game.energyRequired.toLowerCase()}
                </span>
              </>
            )}
          </div>

          {game.genres && game.genres.length > 0 && (
            <div
              className="mt-3 pt-3 font-serif italic text-[0.82rem]"
              style={{
                borderTop: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {game.genres.slice(0, 3).map((g) => g.toLowerCase()).join(' · ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
