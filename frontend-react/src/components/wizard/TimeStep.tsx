import { useWizardStore } from '@/stores/wizardStore';

const UNLIMITED_TIME = 999;
const TIME_PRESETS = [15, 30, 45, 60, 90, 120, UNLIMITED_TIME];

export default function TimeStep() {
  const { availableMinutes, setAvailableMinutes, nextStep } = useWizardStore();
  const isUnlimited = availableMinutes >= UNLIMITED_TIME;

  const formatTime = (minutes: number) => {
    if (minutes >= UNLIMITED_TIME) return 'more than two hours';
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ${mins} min` : `${hours} hour${hours > 1 ? 's' : ''}`;
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
    <div>
      <h2
        className="font-serif text-[clamp(1.6rem,3.2vw,2.4rem)] leading-[1.04] tracking-[-0.015em] mb-3"
        style={{ color: 'var(--color-text-primary)' }}
      >
        How much time do you have?
      </h2>
      <p
        className="font-serif italic text-[1rem] leading-snug mb-10 max-w-[40ch]"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        We&rsquo;ll find games that fit the shape of the evening.
      </p>

      {/* display reading */}
      <div className="mb-6">
        <div
          className="font-mono text-[0.6rem] tracking-[0.28em] uppercase mb-2"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Your answer
        </div>
        <div
          className="font-serif text-[clamp(1.8rem,3vw,2.4rem)] leading-none"
          style={{ color: 'var(--color-accent)' }}
        >
          <em>{formatTime(availableMinutes)}</em>
        </div>
      </div>

      {/* slider */}
      <div
        className="mb-6 pt-5"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <input
          type="range"
          min={5}
          max={120}
          step={5}
          value={sliderValue}
          onChange={(e) => setAvailableMinutes(Number(e.target.value))}
          className="editorial-slider w-full"
          aria-label="Available minutes"
        />
        <div
          className="flex justify-between mt-2 font-mono text-[0.6rem] tracking-[0.15em] uppercase"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <span>5 min</span>
          <span>2 hours</span>
        </div>
      </div>

      {/* presets */}
      <div className="mb-10">
        <div
          className="font-mono text-[0.6rem] tracking-[0.28em] uppercase mb-3"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Or a common interval
        </div>
        <div className="flex flex-wrap gap-0" style={{ borderTop: '1px solid var(--color-border-strong)', borderBottom: '1px solid var(--color-border-strong)' }}>
          {TIME_PRESETS.map((preset, i) => {
            const isSelected = preset === UNLIMITED_TIME ? isUnlimited : availableMinutes === preset;
            return (
              <button
                key={preset}
                onClick={() => {
                  setAvailableMinutes(preset);
                  nextStep();
                }}
                className="flex-1 py-3 px-2 font-serif text-[1.05rem] bg-transparent cursor-pointer transition-colors"
                style={{
                  borderRight: i < TIME_PRESETS.length - 1 ? '1px solid var(--color-border)' : 'none',
                  color: isSelected ? 'var(--color-accent)' : 'var(--color-text-primary)',
                  fontStyle: isSelected ? 'italic' : 'normal',
                  fontWeight: isSelected ? 500 : 400,
                  background: isSelected ? 'var(--color-bg-secondary)' : 'transparent',
                }}
              >
                {formatPreset(preset)}
              </button>
            );
          })}
        </div>
      </div>

      {/* next */}
      <button
        onClick={nextStep}
        className="time-next-btn relative font-serif italic font-medium text-[1.35rem] inline-flex items-baseline gap-2 bg-transparent border-0 p-0 pb-1.5 cursor-pointer transition-[letter-spacing] duration-500"
        style={{ color: 'var(--color-accent)' }}
      >
        Next
        <span aria-hidden="true" className="time-next-arrow font-sans not-italic transition-transform duration-500">→</span>
        <span
          aria-hidden="true"
          className="time-next-underline absolute left-0 bottom-0 h-px transition-[right] duration-[600ms]"
          style={{ background: 'var(--color-accent)', right: '30%' }}
        />
      </button>

      <style>{`
        .time-next-btn:hover {
          letter-spacing: 0.04em;
        }
        .time-next-btn:hover .time-next-underline {
          right: 0 !important;
        }
        .time-next-btn:hover .time-next-arrow {
          transform: translateX(0.4rem);
        }
        .editorial-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 1px;
          background: var(--color-border-strong);
          outline: none;
        }
        .editorial-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          background: var(--color-accent);
          border: 2px solid var(--color-bg-primary);
          box-shadow: 0 0 0 1px var(--color-accent);
          cursor: pointer;
          border-radius: 50%;
        }
        .editorial-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: var(--color-accent);
          border: 2px solid var(--color-bg-primary);
          box-shadow: 0 0 0 1px var(--color-accent);
          cursor: pointer;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}
