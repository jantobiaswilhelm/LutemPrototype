import { ArrowLeft } from 'lucide-react';
import { useWizardStore } from '@/stores/wizardStore';
import TimeStep from './TimeStep';
import MoodStep from './MoodStep';
import EnergyStep from './EnergyStep';
import InterruptionStep from './InterruptionStep';
import SocialStep from './SocialStep';
import ResultStep from './ResultStep';

const STEP_ORDER = ['time', 'mood', 'energy', 'interruption', 'social', 'result'] as const;
type Step = typeof STEP_ORDER[number];

export default function InlineWizard() {
  const { 
    currentStep, 
    prevStep, 
    closeWizard,
    resetWizard,
  } = useWizardStore();

  const currentIndex = STEP_ORDER.indexOf(currentStep as Step);
  const isFirstStep = currentIndex === 0;
  const isResultStep = currentStep === 'result';
  const progressSteps = STEP_ORDER.length - 1; 

  const handleBack = () => {
    if (isFirstStep) {
      resetWizard();
      closeWizard();
    } else {
      prevStep();
    }
  };

  // Result step has its own layout
  if (isResultStep) {
    return (
      <div className="bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border)] shadow-md p-5 h-[460px] flex items-center justify-center">
        <ResultStep />
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border)] shadow-md h-[460px] flex flex-col">
      {/* Progress header */}
      <div className="px-4 py-2.5 border-b border-[var(--color-border)] flex items-center gap-3 flex-shrink-0">
        <button
          onClick={handleBack}
          className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        {/* Step indicators */}
        <div className="flex-1 flex items-center justify-center gap-1.5">
          {STEP_ORDER.slice(0, progressSteps).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-6 bg-[var(--color-accent)]'
                  : index < currentIndex
                  ? 'w-1.5 bg-[var(--color-accent)]'
                  : 'w-1.5 bg-[var(--color-border)]'
              }`}
            />
          ))}
        </div>

        {/* Step counter */}
        <span className="text-xs text-[var(--color-text-muted)] min-w-[3rem] text-right">
          {currentIndex + 1} / {progressSteps}
        </span>
      </div>

      {/* Step content */}
      <div className="p-5 flex-1 overflow-hidden">
        {currentStep === 'time' && <TimeStep />}
        {currentStep === 'mood' && <MoodStep />}
        {currentStep === 'energy' && <EnergyStep />}
        {currentStep === 'interruption' && <InterruptionStep />}
        {currentStep === 'social' && <SocialStep />}
      </div>
    </div>
  );
}
