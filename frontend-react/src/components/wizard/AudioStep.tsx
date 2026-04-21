import { useWizardStore } from '@/stores/wizardStore';
import { AUDIO_AVAILABILITY, type AudioAvailability } from '@/types';

const AUDIO_ORDER: AudioAvailability[] = ['full', 'low', 'muted'];
const NUMERALS = ['i', 'ii', 'iii'];

export default function AudioStep() {
  const { audioAvailability, setAudioAvailability, nextStep } = useWizardStore();

  const handleSelect = (level: AudioAvailability) => {
    setAudioAvailability(level);
    nextStep();
  };

  return (
    <div>
      <h2
        className="font-serif text-[clamp(1.6rem,3.2vw,2.4rem)] leading-[1.04] tracking-[-0.015em] mb-3"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Can you use sound?
      </h2>
      <p
        className="font-serif italic text-[1rem] leading-snug mb-8 max-w-[40ch]"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        A game&rsquo;s score is half the room; some nights the room is quiet.
      </p>

      <div style={{ borderTop: '1px solid var(--color-border-strong)' }}>
        {AUDIO_ORDER.map((level, i) => {
          const data = AUDIO_AVAILABILITY[level];
          const isSelected = audioAvailability === level;
          return (
            <button
              key={level}
              onClick={() => handleSelect(level)}
              className="audio-row w-full grid grid-cols-[2rem_1fr_2fr] gap-5 items-baseline text-left py-5 px-0 bg-transparent cursor-pointer transition-[padding,background] duration-500"
              style={{ borderBottom: '1px solid var(--color-border)' }}
            >
              <span
                className="font-mono text-[0.7rem] tracking-[0.15em] uppercase"
                style={{ color: isSelected ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
              >
                {NUMERALS[i]}.
              </span>
              <span
                className="font-serif text-[1.25rem] leading-tight tracking-[-0.005em]"
                style={{
                  color: isSelected ? 'var(--color-accent)' : 'var(--color-text-primary)',
                  fontStyle: isSelected ? 'italic' : 'normal',
                  fontWeight: isSelected ? 500 : 400,
                }}
              >
                {data.displayName}
              </span>
              <span
                className="font-serif italic text-[0.92rem] leading-snug"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {data.description}
              </span>
            </button>
          );
        })}
      </div>

      <style>{`
        .audio-row:hover {
          padding-left: 0.85rem;
          background: var(--color-bg-secondary);
        }
      `}</style>
    </div>
  );
}
