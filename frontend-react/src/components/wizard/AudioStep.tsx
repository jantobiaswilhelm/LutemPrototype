import { Volume2 } from 'lucide-react';
import { useWizardStore } from '@/stores/wizardStore';
import { AUDIO_AVAILABILITY, type AudioAvailability } from '@/types';

const AUDIO_ORDER: AudioAvailability[] = ['full', 'low', 'muted'];

export default function AudioStep() {
  const { audioAvailability, setAudioAvailability, nextStep } = useWizardStore();

  const handleSelect = (level: AudioAvailability) => {
    setAudioAvailability(level);
    setTimeout(() => nextStep(), 300);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-accent-soft)] mb-2">
          <Volume2 className="w-5 h-5 text-[var(--color-accent)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
          Can you use sound?
        </h3>
        <p className="text-sm text-[var(--color-text-muted)]">
          Some games need audio cues
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {AUDIO_ORDER.map((level) => {
          const data = AUDIO_AVAILABILITY[level];
          const isSelected = audioAvailability === level;
          return (
            <button
              key={level}
              onClick={() => handleSelect(level)}
              className={`flex items-center gap-3 py-4 px-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] scale-[0.98]'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-tertiary)] hover:border-[var(--color-border-strong)]'
              }`}
            >
              <span className="text-2xl">{data.emoji}</span>
              <div className="text-left">
                <span className="block text-sm font-medium text-[var(--color-text-primary)]">
                  {data.displayName}
                </span>
                <span className="block text-xs text-[var(--color-text-muted)]">
                  {data.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
