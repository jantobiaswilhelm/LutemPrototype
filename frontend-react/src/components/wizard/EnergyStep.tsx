import { useWizardStore } from '@/stores/wizardStore';
import { ENERGY_LEVELS, type EnergyLevel } from '@/types';

const ENERGY_ORDER: EnergyLevel[] = ['LOW', 'MEDIUM', 'HIGH'];

export default function EnergyStep() {
  const { energyLevel, setEnergyLevel, nextStep, prevStep } = useWizardStore();

  const canProceed = energyLevel !== null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        {/* Header battery icon (CSS-only) */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-accent-soft)] mb-4">
          <div className="battery-icon" style={{ width: '20px', height: '28px', border: '2px solid var(--color-accent)' }}>
            <div className="battery-fill" style={{ background: 'var(--color-accent)', height: '66%' }} />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
          How's your energy level?
        </h3>
        <p className="text-[var(--color-text-muted)]">
          We'll match game complexity to your state
        </p>
      </div>

      {/* Energy options with battery icons */}
      <div className="flex gap-3 justify-center">
        {ENERGY_ORDER.map((level) => {
          const data = ENERGY_LEVELS[level];
          const isSelected = energyLevel === level;
          return (
            <button
              key={level}
              onClick={() => setEnergyLevel(level)}
              data-value={level}
              className={`energy-card ${isSelected ? 'selected' : ''}`}
            >
              {/* CSS Battery Icon */}
              <div className="battery-icon">
                <div className="battery-fill" />
              </div>
              <span className="energy-card-label">{data.displayName}</span>
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
