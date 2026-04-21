import { useEffect, useRef, useState } from 'react';
import { useWizardStore } from '@/stores/wizardStore';
import { useRecommendationStore } from '@/stores/recommendationStore';
import { recommendationsApi } from '@/api/client';
import { enrichRequest } from '@/lib/recommendationDefaults';

function LoadingState() {
  return (
    <div className="text-center py-14" role="status" aria-live="polite">
      <div
        className="font-mono text-[0.7rem] tracking-[0.28em] uppercase mb-5"
        style={{ color: 'var(--color-text-muted)' }}
      >
        Presently
      </div>
      <h3
        className="font-serif italic text-[clamp(1.6rem,3vw,2.2rem)] leading-snug mb-5"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Listening&hellip;
      </h3>
      <p
        className="font-serif italic text-[0.95rem] mb-7 max-w-[32ch] mx-auto"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Considering your answers against tonight&rsquo;s catalog.
      </p>
      <div className="inline-flex gap-2" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="result-dot inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--color-accent)', animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
      <style>{`
        .result-dot { animation: dot-pulse 1.2s ease-in-out infinite; }
        @keyframes dot-pulse {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function ErrorState({ error, onRetry, onBack }: { error: string; onRetry: () => void; onBack: () => void }) {
  return (
    <div className="py-14 text-center" role="alert">
      <div
        className="font-mono text-[0.7rem] tracking-[0.28em] uppercase mb-5"
        style={{ color: 'var(--color-error)' }}
      >
        Something interrupted
      </div>
      <h3
        className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] leading-snug mb-3"
        style={{ color: 'var(--color-text-primary)' }}
      >
        No recommendation this time.
      </h3>
      <p
        className="font-serif italic text-[0.95rem] mb-10 max-w-[40ch] mx-auto"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {error}
      </p>
      <div className="flex gap-8 justify-center items-baseline">
        <button
          onClick={onBack}
          className="font-mono text-[0.78rem] tracking-[0.14em] uppercase bg-transparent border-0 p-0 pb-1 cursor-pointer transition-colors"
          style={{
            color: 'var(--color-text-secondary)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          ← Go back
        </button>
        <button
          onClick={onRetry}
          className="result-retry relative font-serif italic font-medium text-[1.25rem] inline-flex items-baseline gap-2 bg-transparent border-0 p-0 pb-1.5 cursor-pointer transition-[letter-spacing] duration-500"
          style={{ color: 'var(--color-accent)' }}
        >
          Try again
          <span aria-hidden="true" className="result-retry-arrow font-sans not-italic transition-transform duration-500">→</span>
          <span
            aria-hidden="true"
            className="result-retry-underline absolute left-0 bottom-0 h-px transition-[right] duration-[600ms]"
            style={{ background: 'var(--color-accent)', right: '30%' }}
          />
        </button>
      </div>
      <style>{`
        .result-retry:hover { letter-spacing: 0.04em; }
        .result-retry:hover .result-retry-underline { right: 0 !important; }
        .result-retry:hover .result-retry-arrow { transform: translateX(0.4rem); }
      `}</style>
    </div>
  );
}

export default function ResultStep() {
  const {
    availableMinutes,
    selectedMoods,
    energyLevel,
    interruptibility,
    socialPreference,
    audioAvailability,
    resetWizard,
    closeWizard,
    prevStep,
  } = useWizardStore();

  const { setRecommendation: saveToStore } = useRecommendationStore();

  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchRecommendation = async () => {
    if (!energyLevel || !interruptibility || !socialPreference) return;
    setError(null);
    try {
      const data = await recommendationsApi.getRecommendation(enrichRequest({
        availableMinutes,
        desiredEmotionalGoals: selectedMoods,
        currentEnergyLevel: energyLevel,
        requiredInterruptibility: interruptibility,
        socialPreference,
        audioAvailability: audioAvailability ?? undefined,
      }));
      saveToStore(data);
      setTimeout(() => {
        closeWizard();
        setTimeout(resetWizard, 200);
      }, 300);
    } catch (err) {
      console.error('Recommendation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get recommendation');
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchRecommendation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = () => {
    hasFetched.current = false;
    fetchRecommendation();
  };

  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} onBack={prevStep} />;
  }
  return <LoadingState />;
}
