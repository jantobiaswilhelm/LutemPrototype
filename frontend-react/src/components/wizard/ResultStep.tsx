import { useEffect, useRef } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { useWizardStore } from '@/stores/wizardStore';
import { useRecommendationStore } from '@/stores/recommendationStore';
import { recommendationsApi } from '@/api/client';

function LoadingState() {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-accent-soft)] mb-4 animate-pulse">
        <Sparkles className="w-8 h-8 text-[var(--color-accent)]" />
      </div>
      <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
        Finding your perfect game...
      </h3>
      <p className="text-[var(--color-text-muted)]">
        Analyzing your mood and preferences
      </p>
      <div className="mt-6 flex justify-center gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-[var(--color-accent)]"
            style={{ animation: `pulse 1s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry, onBack }: { error: string; onRetry: () => void; onBack: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
        <span className="text-3xl">😕</span>
      </div>
      <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
        Something went wrong
      </h3>
      <p className="text-[var(--color-text-muted)] mb-6">{error}</p>
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 btn-secondary">
          Back
        </button>
        <button onClick={onRetry} className="flex-1 btn-primary inline-flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          Retry
        </button>
      </div>
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
    resetWizard,
    closeWizard,
    prevStep,
  } = useWizardStore();

  const { setRecommendation: saveToStore } = useRecommendationStore();

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchRecommendation = async () => {
    if (!energyLevel || !interruptibility || !socialPreference) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await recommendationsApi.getRecommendation({
        availableMinutes,
        desiredEmotionalGoals: selectedMoods,
        currentEnergyLevel: energyLevel,
        requiredInterruptibility: interruptibility,
        socialPreference,
      });
      console.log('Got recommendation:', data);
      
      // Save to store
      saveToStore(data);
      
      // Auto-close wizard after short delay
      setTimeout(() => {
        closeWizard();
        setTimeout(resetWizard, 200);
      }, 300);
      
    } catch (err) {
      console.error('Recommendation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get recommendation');
      setLoading(false);
    }
  };

  // Fetch recommendation on mount
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

  // Show error state
  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} onBack={prevStep} />;
  }

  // Show loading (also shown briefly before auto-close on success)
  return <LoadingState />;
}

// Need React import for useState
import React from 'react';
