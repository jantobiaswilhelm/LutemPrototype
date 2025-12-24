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
  const { selectedMoods, toggleMood, nextStep, prevStep } = useWizardStore();

  const canProceed = selectedMoods.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-accent-soft)] mb-4">
          <Heart className="w-6 h-6 text-[var(--color-accent)]" />
        </div>
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
          What mood are you in?
        </h3>
        <p className="text-[var(--color-text-muted)]">
          Select one or more emotional goals
        </p>
      </div>

      {/* Mood options */}
      <div className="grid grid-cols-2 gap-3">
        {MOOD_ORDER.map((mood) => {
          const data = EMOTIONAL_GOALS[mood];
          const isSelected = selectedMoods.includes(mood);
          return (
            <button
              key={mood}
              onClick={() => toggleMood(mood)}
              className={`chip ${isSelected ? 'selected' : ''}`}
            >
              <span className="text-2xl mb-1">{data.emoji}</span>
              <span className="text-sm font-medium">{data.displayName}</span>
            </button>
          );
        })}
      </div>

      {/* Selected hint */}
      {selectedMoods.length > 0 && (
        <p className="text-center text-sm text-[var(--color-text-muted)]">
          {selectedMoods.length} mood{selectedMoods.length > 1 ? 's' : ''} selected
        </p>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-4">
        <button onClick={prevStep} className="btn-secondary flex-1">
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={!canProceed}
          className={`btn-primary flex-1 ${!canProceed ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
