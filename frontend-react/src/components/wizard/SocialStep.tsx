import { useWizardStore } from '@/stores/wizardStore';
import { SOCIAL_PREFERENCES, type SocialPreference } from '@/types';

const SOCIAL_ORDER: SocialPreference[] = ['SOLO', 'COOP', 'COMPETITIVE', 'BOTH'];
const NUMERALS = ['i', 'ii', 'iii', 'iv'];

export default function SocialStep() {
  const { socialPreference, setSocialPreference, nextStep } = useWizardStore();

  const handleSelect = (pref: SocialPreference) => {
    setSocialPreference(pref);
    nextStep();
  };

  return (
    <div>
      <h2
        className="font-serif text-[clamp(1.6rem,3.2vw,2.4rem)] leading-[1.04] tracking-[-0.015em] mb-3"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Alone, or with company?
      </h2>
      <p
        className="font-serif italic text-[1rem] leading-snug mb-8 max-w-[40ch]"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Solitude and play have their own proportions.
      </p>

      <div
        className="grid grid-cols-2"
        style={{ borderTop: '1px solid var(--color-border-strong)' }}
      >
        {SOCIAL_ORDER.map((pref, i) => {
          const data = SOCIAL_PREFERENCES[pref];
          const isSelected = socialPreference === pref;
          return (
            <button
              key={pref}
              onClick={() => handleSelect(pref)}
              className="social-cell text-left py-7 px-5 bg-transparent cursor-pointer transition-colors duration-500"
              style={{
                borderRight: i % 2 === 0 ? '1px solid var(--color-border)' : 'none',
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
                className="font-serif text-[1.25rem] leading-tight block tracking-[-0.005em]"
                style={{
                  color: isSelected ? 'var(--color-accent)' : 'var(--color-text-primary)',
                  fontStyle: isSelected ? 'italic' : 'normal',
                  fontWeight: isSelected ? 500 : 400,
                }}
              >
                {data.displayName}
              </span>
            </button>
          );
        })}
      </div>

      <style>{`
        .social-cell:hover {
          background: var(--color-bg-secondary);
        }
      `}</style>
    </div>
  );
}
