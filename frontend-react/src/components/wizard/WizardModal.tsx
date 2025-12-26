import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useWizardStore } from '@/stores/wizardStore';
import SourceStep from './SourceStep';
import TimeStep from './TimeStep';
import MoodStep from './MoodStep';
import EnergyStep from './EnergyStep';
import InterruptionStep from './InterruptionStep';
import SocialStep from './SocialStep';
import AudioStep from './AudioStep';
import ResultStep from './ResultStep';

const STEPS = ['source', 'time', 'mood', 'energy', 'interruption', 'social', 'audio', 'result'] as const;

export default function WizardModal() {
  const { isOpen, closeWizard, resetWizard, currentStep } = useWizardStore();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeWizard();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeWizard]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    closeWizard();
    // Reset after animation completes
    setTimeout(resetWizard, 200);
  };

  if (!isOpen) return null;

  const currentStepIndex = STEPS.indexOf(currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case 'source':
        return <SourceStep />;
      case 'time':
        return <TimeStep />;
      case 'mood':
        return <MoodStep />;
      case 'energy':
        return <EnergyStep />;
      case 'interruption':
        return <InterruptionStep />;
      case 'social':
        return <SocialStep />;
      case 'audio':
        return <AudioStep />;
      case 'result':
        return <ResultStep />;
      default:
        return <SourceStep />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 animate-fadeIn"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl animate-scaleIn max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            {currentStep === 'result' ? 'Your Recommendation' : 'Find Your Game'}
          </h2>
          <button
            onClick={handleClose}
            className="btn-icon"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress dots (hidden on result step) */}
        {currentStep !== 'result' && (
          <div className="flex justify-center gap-2 py-3 border-b border-[var(--color-border)]">
            {STEPS.slice(0, -1).map((step, index) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStepIndex
                    ? 'bg-[var(--color-accent)]'
                    : 'bg-[var(--color-border-strong)]'
                }`}
              />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
