import { Users } from 'lucide-react';
import { useWizardStore } from '@/stores/wizardStore';
import { SOCIAL_PREFERENCES, type SocialPreference } from '@/types';

const SOCIAL_ORDER: SocialPreference[] = ['SOLO', 'COOP', 'COMPETITIVE', 'BOTH'];

export default function SocialStep() {
  const { socialPreference, setSocialPreference, nextStep, prevStep } = useWizardStore();

  const canProceed = socialPreference !== null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-accent-soft)] mb-4">
          <Users className="w-6 h-6 text-[var(--color-accent)]" />
        </div>
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
          Solo or social?
        </h3>
        <p className="text-[var(--color-text-muted)]">
          Are you in the mood for company?
        </p>
      </div>

      {/* Social preference options */}
      <div className="space-y-3">
        {SOCIAL_ORDER.map((pref) => {
          const data = SOCIAL_PREFERENCES[pref];
          const isSelected = socialPreference === pref;
          return (
            <button
              key={pref}
              onClick={() => setSocialPreference(pref)}
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
          Get Recommendation
        </button>
      </div>
    </div>
  );
}
