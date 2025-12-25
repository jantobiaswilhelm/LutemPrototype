import { Users } from 'lucide-react';
import { useWizardStore } from '@/stores/wizardStore';
import { SOCIAL_PREFERENCES, type SocialPreference } from '@/types';

const SOCIAL_ORDER: SocialPreference[] = ['SOLO', 'COOP', 'COMPETITIVE', 'BOTH'];

export default function SocialStep() {
  const { socialPreference, setSocialPreference, nextStep } = useWizardStore();

  const handleSelect = (pref: SocialPreference) => {
    setSocialPreference(pref);
    setTimeout(() => nextStep(), 300);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-accent-soft)] mb-2">
          <Users className="w-5 h-5 text-[var(--color-accent)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
          Solo or social?
        </h3>
        <p className="text-sm text-[var(--color-text-muted)]">
          Tap to select
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {SOCIAL_ORDER.map((pref) => {
          const data = SOCIAL_PREFERENCES[pref];
          const isSelected = socialPreference === pref;
          return (
            <button
              key={pref}
              onClick={() => handleSelect(pref)}
              className={`flex flex-col items-center justify-center py-4 px-2 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] scale-[0.98]'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-tertiary)] hover:border-[var(--color-border-strong)]'
              }`}
            >
              <span className="text-2xl mb-1">{data.emoji}</span>
              <span className="text-sm font-medium text-[var(--color-text-primary)]">{data.displayName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
