import { Clock } from 'lucide-react';
import { useWizardStore } from '@/stores/wizardStore';

const UNLIMITED_TIME = 999;
const TIME_PRESETS = [15, 30, 45, 60, 90, 120, UNLIMITED_TIME];

export default function TimeStep() {
  const { availableMinutes, setAvailableMinutes, nextStep } = useWizardStore();

  const isUnlimited = availableMinutes >= UNLIMITED_TIME;

  const formatTime = (minutes: number) => {
    if (minutes >= UNLIMITED_TIME) return '2h+';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatPreset = (minutes: number) => {
    if (minutes >= UNLIMITED_TIME) return '2h+';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
  };

  const sliderValue = isUnlimited ? 120 : availableMinutes;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-3">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-accent-soft)] mb-2">
            <Clock className="w-5 h-5 text-[var(--color-accent)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
            How much time do you have?
          </h3>
          <p className="text-sm text-[var(--color-text-muted)]">
            We'll find games that fit your schedule
          </p>
        </div>

        <div className="text-center py-1">
          <span className="text-3xl font-bold text-[var(--color-accent)]">
            {formatTime(availableMinutes)}
          </span>
        </div>

        <div className="px-2">
          <input
            type="range"
            min={5}
            max={120}
            step={5}
            value={sliderValue}
            onChange={(e) => setAvailableMinutes(Number(e.target.value))}
            className="slider"
          />
          <div className="flex justify-between mt-1 text-xs text-[var(--color-text-muted)]">
            <span>5 min</span>
            <span>2 hours</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {TIME_PRESETS.map((preset) => {
            const isSelected = preset === UNLIMITED_TIME ? isUnlimited : availableMinutes === preset;
            return (
              <button
                key={preset}
                onClick={() => setAvailableMinutes(preset)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                }`}
              >
                {formatPreset(preset)}
              </button>
            );
          })}
        </div>
      </div>

      <button onClick={nextStep} className="btn-primary w-full mt-3">
        Next
      </button>
    </div>
  );
}
