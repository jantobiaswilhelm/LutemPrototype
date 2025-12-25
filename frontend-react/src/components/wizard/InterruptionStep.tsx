import { Pause } from 'lucide-react';
import { useWizardStore } from '@/stores/wizardStore';
import { INTERRUPTIBILITY, type Interruptibility } from '@/types';

const INTERRUPT_ORDER: Interruptibility[] = ['HIGH', 'MEDIUM', 'LOW'];

export default function InterruptionStep() {
  const { interruptibility, setInterruptibility, nextStep } = useWizardStore();

  const handleSelect = (level: Interruptibility) => {
    setInterruptibility(level);
    setTimeout(() => nextStep(), 300);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-accent-soft)] mb-2">
          <Pause className="w-5 h-5 text-[var(--color-accent)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
          Can you be interrupted?
        </h3>
        <p className="text-sm text-[var(--color-text-muted)]">
          Tap to select
        </p>
      </div>

      <div className="space-y-2">
        {INTERRUPT_ORDER.map((level) => {
          const data = INTERRUPTIBILITY[level];
          const isSelected = interruptibility === level;
          return (
            <button
              key={level}
              onClick={() => handleSelect(level)}
              className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] scale-[0.98]'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-tertiary)] hover:border-[var(--color-border-strong)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{data.emoji}</span>
                <div>
                  <div className="font-medium text-sm text-[var(--color-text-primary)]">
                    {data.displayName}
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)]">
                    {data.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
