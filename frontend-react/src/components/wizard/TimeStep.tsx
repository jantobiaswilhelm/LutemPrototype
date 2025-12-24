import { Clock } from 'lucide-react';
import { useWizardStore } from '@/stores/wizardStore';

const TIME_PRESETS = [15, 30, 45, 60, 90, 120];

export default function TimeStep() {
  const { availableMinutes, setAvailableMinutes, nextStep } = useWizardStore();

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-accent-soft)] mb-4">
          <Clock className="w-6 h-6 text-[var(--color-accent)]" />
        </div>
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
          How much time do you have?
        </h3>
        <p className="text-[var(--color-text-muted)]">
          We'll find games that fit your schedule
        </p>
      </div>

      {/* Current time display */}
      <div className="text-center py-4">
        <span className="text-4xl font-bold text-[var(--color-accent)]">
          {formatTime(availableMinutes)}
        </span>
      </div>

      {/* Slider */}
      <div className="px-2">
        <input
          type="range"
          min={5}
          max={180}
          step={5}
          value={availableMinutes}
          onChange={(e) => setAvailableMinutes(Number(e.target.value))}
          className="slider"
        />
        <div className="flex justify-between mt-2 text-sm text-[var(--color-text-muted)]">
          <span>5 min</span>
          <span>3 hours</span>
        </div>
      </div>

      {/* Quick presets */}
      <div className="flex flex-wrap justify-center gap-2">
        {TIME_PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => setAvailableMinutes(preset)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              availableMinutes === preset
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
            }`}
          >
            {formatTime(preset)}
          </button>
        ))}
      </div>

      {/* Next button */}
      <button onClick={nextStep} className="btn-primary w-full mt-4">
        Next
      </button>
    </div>
  );
}
