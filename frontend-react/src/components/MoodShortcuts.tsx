import { useState } from 'react';
import { useRecommendation } from '@/api/hooks';
import { useRecommendationStore } from '@/stores/recommendationStore';
import { enrichRequest } from '@/lib/recommendationDefaults';
import type { EmotionalGoal, EnergyLevel, RecommendationRequest } from '@/types';

interface MoodShortcut {
  id: string;
  label: string;
  glyph: string;
  numeral: string;
  emotionalGoal: EmotionalGoal;
  energyLevel: EnergyLevel;
  description: string;
}

const MOOD_SHORTCUTS: MoodShortcut[] = [
  { id: 'relax',       label: 'Unwind',      glyph: '❧', numeral: 'i.',   emotionalGoal: 'UNWIND',         energyLevel: 'LOW',    description: 'Low energy. Drifting time.' },
  { id: 'challenge',   label: 'Challenge',   glyph: '¶', numeral: 'ii.',  emotionalGoal: 'CHALLENGE',      energyLevel: 'HIGH',   description: 'Focused, present, awake.' },
  { id: 'quick-break', label: 'A quick one', glyph: '§', numeral: 'iii.', emotionalGoal: 'RECHARGE',       energyLevel: 'MEDIUM', description: 'Thirty minutes, contained.' },
  { id: 'explore',     label: 'Wander',      glyph: '◉', numeral: 'iv.',  emotionalGoal: 'ADVENTURE_TIME', energyLevel: 'MEDIUM', description: 'Something you haven’t played.' },
];

const DEFAULT_MINUTES = 30;

interface MoodShortcutsProps {
  orientation?: 'horizontal' | 'vertical';
}

export function MoodShortcuts({ orientation = 'horizontal' }: MoodShortcutsProps = {}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { mutateAsync: getRecommendation } = useRecommendation();
  const { setRecommendation, setLoading, setError } = useRecommendationStore();

  const vertical = orientation === 'vertical';

  const handleShortcutClick = async (shortcut: MoodShortcut) => {
    setLoadingId(shortcut.id);
    setLoading(true);
    setError(null);

    const request: RecommendationRequest = enrichRequest({
      availableMinutes: DEFAULT_MINUTES,
      desiredEmotionalGoals: [shortcut.emotionalGoal],
      currentEnergyLevel: shortcut.energyLevel,
      requiredInterruptibility: 'MEDIUM',
      socialPreference: 'BOTH',
    });

    try {
      const result = await getRecommendation(request);
      setRecommendation(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get recommendation';
      setError(message);
      console.error('Shortcut recommendation failed:', err);
    } finally {
      setLoadingId(null);
      setLoading(false);
    }
  };

  return (
    <section role="group" aria-label="Quick mood shortcuts">
      <div
        className="flex items-center gap-3 mb-4 font-mono text-[0.62rem] tracking-[0.28em] uppercase"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <span className="inline-block w-5 h-px" style={{ background: 'var(--color-accent)' }} />
        {vertical ? 'Shortcuts' : 'Or, if you’d rather choose'}
      </div>

      <div
        className={vertical ? 'flex flex-col' : 'grid grid-cols-2 md:grid-cols-4'}
        style={{ borderTop: '1px solid var(--color-border-strong)' }}
      >
        {MOOD_SHORTCUTS.map((s, i) => {
          const isLoading = loadingId === s.id;
          const disabled = loadingId !== null;

          return (
            <button
              key={s.id}
              onClick={() => handleShortcutClick(s)}
              disabled={disabled}
              aria-busy={isLoading}
              aria-label={`${s.label}: ${s.description}`}
              className={`mood-sc relative block text-left bg-transparent transition-colors duration-500 disabled:cursor-wait ${
                vertical ? 'py-4 px-4 md:px-5' : 'p-7 pt-8 pb-6'
              }`}
              style={{
                borderRight: !vertical && i < MOOD_SHORTCUTS.length - 1 ? '1px solid var(--color-border)' : 'none',
                borderBottom: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            >
              {vertical ? (
                <>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span
                      className="font-mono text-[0.62rem] tracking-[0.12em]"
                      style={{ color: isLoading ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                    >
                      {s.numeral}
                    </span>
                    <span
                      className={`mood-glyph font-serif italic text-[1.35rem] leading-none transition-[color] duration-500 ${isLoading ? 'mood-glyph-loading' : ''}`}
                      style={{ color: isLoading ? 'var(--color-accent)' : 'var(--color-text-primary)' }}
                      aria-hidden="true"
                    >
                      {s.glyph}
                    </span>
                    <span
                      className="font-serif text-[1.1rem] leading-tight"
                      style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}
                    >
                      {s.label}
                    </span>
                  </div>
                  <div
                    className="font-sans text-[0.76rem] leading-[1.45] pl-[2.2rem]"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {s.description}
                  </div>
                </>
              ) : (
                <>
                  <span
                    className="absolute top-4 right-5 font-mono text-[0.64rem] tracking-[0.15em]"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {s.numeral}
                  </span>
                  <span
                    className={`mood-glyph font-serif italic block text-[2.75rem] leading-none mb-4 transition-[color,transform] duration-500 ${isLoading ? 'mood-glyph-loading' : ''}`}
                    style={{ color: isLoading ? 'var(--color-accent)' : 'var(--color-text-primary)' }}
                    aria-hidden="true"
                  >
                    {s.glyph}
                  </span>
                  <span
                    className="font-serif font-medium text-[1.25rem] leading-tight block mb-2 tracking-[-0.005em]"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {s.label}
                  </span>
                  <span
                    className="font-sans text-[0.82rem] leading-[1.5] block"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {s.description}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        .mood-sc:hover:not(:disabled) {
          background: var(--color-bg-secondary);
        }
        .mood-sc:hover:not(:disabled) .mood-glyph {
          color: var(--color-accent);
          transform: translateY(-2px);
        }
        .mood-glyph-loading {
          animation: mood-pulse 1.4s ease-in-out infinite;
        }
        @keyframes mood-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </section>
  );
}
