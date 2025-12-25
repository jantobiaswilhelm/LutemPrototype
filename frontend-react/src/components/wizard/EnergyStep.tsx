import { useWizardStore } from '@/stores/wizardStore';
import { ENERGY_LEVELS, type EnergyLevel } from '@/types';

const ENERGY_ORDER: EnergyLevel[] = ['LOW', 'MEDIUM', 'HIGH'];

export default function EnergyStep() {
  const { energyLevel, setEnergyLevel, nextStep } = useWizardStore();

  const handleSelect = (level: EnergyLevel) => {
    setEnergyLevel(level);
    setTimeout(() => nextStep(), 300);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-accent-soft)] mb-2">
          <div className="w-5 h-6 border-2 border-[var(--color-accent)] rounded-sm relative">
            <div className="absolute bottom-0.5 left-0.5 right-0.5 h-2/3 bg-[var(--color-accent)] rounded-sm" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
          How's your energy level?
        </h3>
        <p className="text-sm text-[var(--color-text-muted)]">
          Tap to select
        </p>
      </div>

      <div className="flex gap-3 justify-center">
        {ENERGY_ORDER.map((level) => {
          const data = ENERGY_LEVELS[level];
          const isSelected = energyLevel === level;
          return (
            <button
              key={level}
              onClick={() => handleSelect(level)}
              data-value={level}
              className={`energy-card ${isSelected ? 'selected' : ''}`}
            >
              <div className="battery-icon">
                <div className="battery-fill" />
              </div>
              <span className="energy-card-label">{data.displayName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
