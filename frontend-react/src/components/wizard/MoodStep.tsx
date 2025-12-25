import { Heart } from 'lucide-react';
import { useWizardStore } from '@/stores/wizardStore';
import { EMOTIONAL_GOALS, type EmotionalGoal } from '@/types';

const MOOD_ORDER: EmotionalGoal[] = [
  'UNWIND',
  'RECHARGE',
  'LOCKING_IN',
  'CHALLENGE',
  'ADVENTURE_TIME',
  'PROGRESS_ORIENTED',
];

export default function MoodStep() {
  const { selectedMoods, toggleMood, nextStep } = useWizardStore();

  const handleMoodSelect = (mood: EmotionalGoal) => {
    if (!selectedMoods.includes(mood)) {
      toggleMood(mood);
      setTimeout(() => nextStep(), 300);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-center mb-3">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-accent-soft)] mb-2">
          <Heart className="w-5 h-5 text-[var(--color-accent)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
          What mood are you in?
        </h3>
        <p className="text-sm text-[var(--color-text-muted)]">
          Tap to select
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {MOOD_ORDER.map((mood) => {
          const data = EMOTIONAL_GOALS[mood];
          const isSelected = selectedMoods.includes(mood);
          return (
            <button
              key={mood}
              onClick={() => handleMoodSelect(mood)}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] scale-[0.98]'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-tertiary)] hover:border-[var(--color-border-strong)]'
              }`}
            >
              <span className="text-xl mb-0.5">{data.emoji}</span>
              <span className="text-xs font-medium text-[var(--color-text-primary)]">{data.displayName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
