import { useWizardStore } from '@/stores/wizardStore';
import { ENERGY_LEVELS, type EnergyLevel } from '@/types';

const ENERGY_ORDER: EnergyLevel[] = ['LOW', 'MEDIUM', 'HIGH'];
const NUMERALS = ['i', 'ii', 'iii'];

// a 5-bar ASCII energy meter mapped to level
const METERS: Record<EnergyLevel, string> = {
  LOW:    '● ○ ○ ○ ○',
  MEDIUM: '● ● ● ○ ○',
  HIGH:   '● ● ● ● ●',
};

export default function EnergyStep() {
  const { energyLevel, setEnergyLevel, nextStep } = useWizardStore();

  const handleSelect = (level: EnergyLevel) => {
    setEnergyLevel(level);
    nextStep();
  };

  return (
    <div>
      <h2
        className="font-serif text-[clamp(1.6rem,3.2vw,2.4rem)] leading-[1.04] tracking-[-0.015em] mb-3"
        style={{ color: 'var(--color-text-primary)' }}
      >
        How is your energy?
      </h2>
      <p
        className="font-serif italic text-[1rem] leading-snug mb-8 max-w-[40ch]"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Quiet hours need different games than wide-awake ones.
      </p>

      <div
        className="grid grid-cols-3"
        style={{ borderTop: '1px solid var(--color-border-strong)' }}
      >
        {ENERGY_ORDER.map((level, i) => {
          const data = ENERGY_LEVELS[level];
          const isSelected = energyLevel === level;
          return (
            <button
              key={level}
              onClick={() => handleSelect(level)}
              className="energy-cell text-left py-8 px-5 bg-transparent cursor-pointer transition-colors duration-500"
              style={{
                borderRight: i < ENERGY_ORDER.length - 1 ? '1px solid var(--color-border)' : 'none',
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
                className="font-serif text-[1.3rem] leading-tight block mb-3 tracking-[-0.005em]"
                style={{
                  color: isSelected ? 'var(--color-accent)' : 'var(--color-text-primary)',
                  fontStyle: isSelected ? 'italic' : 'normal',
                  fontWeight: isSelected ? 500 : 400,
                }}
              >
                {data.displayName}
              </span>
              <span
                className="font-mono text-[0.78rem] tracking-[0.08em] block"
                style={{ color: isSelected ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
              >
                {METERS[level]}
              </span>
            </button>
          );
        })}
      </div>

      <style>{`
        .energy-cell:hover {
          background: var(--color-bg-secondary);
        }
      `}</style>
    </div>
  );
}
