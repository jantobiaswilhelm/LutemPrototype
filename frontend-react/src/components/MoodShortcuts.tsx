import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRecommendation } from '@/api/hooks';
import { useRecommendationStore } from '@/stores/recommendationStore';
import { enrichRequest } from '@/lib/recommendationDefaults';
import type { EmotionalGoal, EnergyLevel, RecommendationRequest } from '@/types';

interface MoodShortcut {
  id: string;
  label: string;
  emoji: string;
  emotionalGoal: EmotionalGoal;
  energyLevel: EnergyLevel;
  description: string;
}

const MOOD_SHORTCUTS: MoodShortcut[] = [
  {
    id: 'relax',
    label: 'Relax',
    emoji: '😌',
    emotionalGoal: 'UNWIND',
    energyLevel: 'LOW',
    description: 'Calm & peaceful',
  },
  {
    id: 'challenge',
    label: 'Challenge',
    emoji: '⚡',
    emotionalGoal: 'CHALLENGE',
    energyLevel: 'HIGH',
    description: 'Test your skills',
  },
  {
    id: 'quick-break',
    label: 'Quick Break',
    emoji: '🔋',
    emotionalGoal: 'RECHARGE',
    energyLevel: 'MEDIUM',
    description: 'Mental refresh',
  },
  {
    id: 'explore',
    label: 'Explore',
    emoji: '🗺️',
    emotionalGoal: 'ADVENTURE_TIME',
    energyLevel: 'MEDIUM',
    description: 'Discover something new',
  },
];

// Default time range: 30-45 min (use 30 as the base value)
const DEFAULT_MINUTES = 30;

export function MoodShortcuts() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { mutateAsync: getRecommendation } = useRecommendation();
  const { setRecommendation, setLoading, setError } = useRecommendationStore();

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

  const buttons = MOOD_SHORTCUTS.map((shortcut) => {
    const isLoading = loadingId === shortcut.id;
    return (
      <button
        key={shortcut.id}
        onClick={() => handleShortcutClick(shortcut)}
        disabled={loadingId !== null}
        aria-busy={isLoading}
        aria-label={`${shortcut.label}: ${shortcut.description}`}
        className={`
          flex items-center justify-center gap-2 px-3 py-2.5 rounded-full
          bg-[var(--color-bg-secondary)] border border-[var(--color-border)]
          text-[var(--color-text-secondary)]
          hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          ${isLoading ? 'border-[var(--color-accent)]' : ''}
        `}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        ) : (
          <span className="text-base" aria-hidden="true">{shortcut.emoji}</span>
        )}
        <span className="text-sm font-medium whitespace-nowrap">{shortcut.label}</span>
      </button>
    );
  });

  return (
    <div className="mb-6" role="group" aria-label="Quick mood shortcuts">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {buttons}
      </div>
    </div>
  );
}
