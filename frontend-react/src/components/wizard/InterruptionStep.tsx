import { Pause } from 'lucide-react';
import { useWizardStore } from '@/stores/wizardStore';
import { INTERRUPTIBILITY, type Interruptibility } from '@/types';

const INTERRUPT_ORDER: Interruptibility[] = ['HIGH', 'MEDIUM', 'LOW'];

export default function InterruptionStep() {
  const { interruptibility, setInterruptibility, nextStep, prevStep } = useWizardStore();

  const canProceed = interruptibility !== null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-accent-soft)] mb-4">
          <Pause className="w-6 h-6 text-[var(--color-accent)]" />
        </div>
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
          Can you be interrupted?
        </h3>
        <p className="text-[var(--color-text-muted)]">
          We'll avoid games that can't be paused if needed
        </p>
      </div>

      {/* Interruptibility options */}
      <div className="space-y-3">
        {INTERRUPT_ORDER.map((level) => {
          const data = INTERRUPTIBILITY[level];
          const isSelected = interruptibility === level;
          return (
            <button
              key={level}
              onClick={() => setInterruptibility(level)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${
                isSelected
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-tertiary)] hover:border-[var(--color-border-strong)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{data.emoji}</span>
                <div>
                  <div className="font-medium text-[var(--color-text-primary)]">
                    {data.displayName}
                  </div>
                  <div className="text-sm text-[var(--color-text-muted)]">
                    {data.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

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
