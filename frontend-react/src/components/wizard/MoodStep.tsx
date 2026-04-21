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

const NUMERALS = ['i', 'ii', 'iii', 'iv', 'v', 'vi'];

export default function MoodStep() {
  const { selectedMoods, toggleMood, nextStep } = useWizardStore();

  const handleMoodSelect = (mood: EmotionalGoal) => {
    if (!selectedMoods.includes(mood)) {
      toggleMood(mood);
      nextStep();
    }
  };

  return (
    <div>
      <h2
        className="font-serif text-[clamp(1.6rem,3.2vw,2.4rem)] leading-[1.04] tracking-[-0.015em] mb-3"
        style={{ color: 'var(--color-text-primary)' }}
      >
        What shape is your mood?
      </h2>
      <p
        className="font-serif italic text-[1rem] leading-snug mb-8 max-w-[40ch]"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        One that fits the weight of the evening.
      </p>

      <div
        className="grid grid-cols-2"
        style={{ borderTop: '1px solid var(--color-border-strong)' }}
      >
        {MOOD_ORDER.map((mood, i) => {
          const data = EMOTIONAL_GOALS[mood];
          const isSelected = selectedMoods.includes(mood);
          return (
            <button
              key={mood}
              onClick={() => handleMoodSelect(mood)}
              className="mood-cell text-left py-6 px-5 bg-transparent cursor-pointer transition-colors duration-500"
              style={{
                borderRight: i % 2 === 0 ? '1px solid var(--color-border)' : 'none',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <span
                className="font-mono text-[0.6rem] tracking-[0.15em] uppercase block mb-3"
                style={{ color: isSelected ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
              >
                {NUMERALS[i]}.
              </span>
              <span
                className="font-serif text-[1.2rem] leading-tight block tracking-[-0.005em] mb-1.5"
                style={{
                  color: isSelected ? 'var(--color-accent)' : 'var(--color-text-primary)',
                  fontStyle: isSelected ? 'italic' : 'normal',
                  fontWeight: isSelected ? 500 : 400,
                }}
              >
                {data.displayName}
              </span>
              <span
                className="font-serif italic text-[0.82rem] leading-snug block"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {data.description}
              </span>
            </button>
          );
        })}
      </div>

      <style>{`
        .mood-cell:hover {
          background: var(--color-bg-secondary);
        }
      `}</style>
    </div>
  );
}
