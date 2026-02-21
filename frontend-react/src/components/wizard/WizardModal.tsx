import { useEffect, useRef, useCallback } from 'react';
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
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'Escape') {
      closeWizard();
      return;
    }
    if (e.key === 'Tab' && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [isOpen, closeWizard]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Save and restore focus
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Focus the modal after render
      requestAnimationFrame(() => modalRef.current?.focus());
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

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
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wizard-title"
        tabIndex={-1}
        className="relative w-full max-w-lg mx-4 bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl animate-scaleIn max-h-[90vh] overflow-hidden flex flex-col outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h2 id="wizard-title" className="text-lg font-semibold text-[var(--color-text-primary)]">
            {currentStep === 'result' ? 'Your Recommendation' : 'Find Your Game'}
          </h2>
          <button
            onClick={handleClose}
            className="btn-icon"
            aria-label="Close recommendation wizard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress dots (hidden on result step) */}
        {currentStep !== 'result' && (
          <div className="flex justify-center gap-2 py-3 border-b border-[var(--color-border)]" role="progressbar" aria-valuenow={currentStepIndex + 1} aria-valuemin={1} aria-valuemax={STEPS.length - 1} aria-label={`Step ${currentStepIndex + 1} of ${STEPS.length - 1}`}>
            {STEPS.slice(0, -1).map((step, index) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStepIndex
                    ? 'bg-[var(--color-accent)]'
                    : 'bg-[var(--color-border-strong)]'
                }`}
                aria-hidden="true"
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
