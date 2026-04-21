import { useEffect, useRef, useCallback, useState } from 'react';
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
const ROMAN = ['', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'];

const EXIT_MS = 220;

export default function WizardModal() {
  const { isOpen, closeWizard, resetWizard, currentStep, prevStep } = useWizardStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const [displayStep, setDisplayStep] = useState(currentStep);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (currentStep === displayStep) return;
    setIsExiting(true);
    const t = setTimeout(() => {
      setDisplayStep(currentStep);
      setIsExiting(false);
    }, EXIT_MS);
    return () => clearTimeout(t);
  }, [currentStep, displayStep]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'Escape') { closeWizard(); return; }
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

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      requestAnimationFrame(() => modalRef.current?.focus());
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleClose = () => {
    closeWizard();
    setTimeout(resetWizard, 200);
  };

  if (!isOpen) return null;

  const currentStepIndex = STEPS.indexOf(currentStep);
  const isResult = currentStep === 'result';
  const totalQuestions = STEPS.length - 1;
  const isFirst = currentStepIndex === 0;

  const renderStep = () => {
    switch (displayStep) {
      case 'source':       return <SourceStep />;
      case 'time':         return <TimeStep />;
      case 'mood':         return <MoodStep />;
      case 'energy':       return <EnergyStep />;
      case 'interruption': return <InterruptionStep />;
      case 'social':       return <SocialStep />;
      case 'audio':        return <AudioStep />;
      case 'result':       return <ResultStep />;
      default:             return <SourceStep />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 animate-fadeIn"
        style={{ background: 'rgba(20, 17, 14, 0.35)' }}
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wizard-title"
        tabIndex={-1}
        className="relative w-full max-w-2xl mx-4 animate-scaleIn max-h-[90vh] overflow-y-auto outline-none"
        style={{
          background: 'var(--color-bg-primary)',
          border: '1px solid var(--color-border-strong)',
          borderRadius: 0,
        }}
      >
        {/* header */}
        <header
          className="flex flex-wrap items-baseline justify-between gap-4 px-8 py-5"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div
            id="wizard-title"
            className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.28em] uppercase"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span className="inline-block w-6 h-px" style={{ background: 'var(--color-accent)' }} />
            <span>The questionnaire</span>
            {!isResult && (
              <>
                <span style={{ opacity: 0.5 }}>·</span>
                <span>
                  Question <span style={{ color: 'var(--color-accent)' }}>{ROMAN[currentStepIndex + 1]}</span>
                  <span style={{ opacity: 0.55 }}> of {ROMAN[totalQuestions]}</span>
                </span>
              </>
            )}
          </div>

          <div className="flex items-baseline gap-5">
            {!isResult && !isFirst && (
              <button
                onClick={prevStep}
                className="font-mono text-[0.7rem] tracking-[0.14em] uppercase bg-transparent border-0 p-0 pb-1 cursor-pointer transition-colors"
                style={{
                  color: 'var(--color-text-secondary)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                ← Previous
              </button>
            )}
            <button
              onClick={handleClose}
              aria-label="Close wizard"
              className="font-mono text-[0.7rem] tracking-[0.14em] uppercase bg-transparent border-0 p-0 pb-1 cursor-pointer transition-colors"
              style={{
                color: 'var(--color-text-muted)',
                borderBottom: '1px solid transparent',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-error)'; e.currentTarget.style.borderBottomColor = 'var(--color-error)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderBottomColor = 'transparent'; }}
            >
              Close
            </button>
          </div>
        </header>

        {/* body */}
        <div
          key={displayStep}
          className={`step-wrap px-8 py-8 ${isExiting ? 'step-exit' : 'step-enter'}`}
        >
          {renderStep()}
        </div>

        <style>{`
          .step-wrap {
            transition: opacity 220ms cubic-bezier(.22,.61,.36,1), transform 220ms cubic-bezier(.22,.61,.36,1);
            will-change: opacity, transform;
          }
          .step-exit {
            opacity: 0;
            transform: translateY(-0.35rem);
            pointer-events: none;
          }
          .step-enter {
            opacity: 1;
            transform: translateY(0);
            animation: step-enter 440ms cubic-bezier(.22,.61,.36,1) both;
          }
          @keyframes step-enter {
            from { opacity: 0; transform: translateY(0.75rem); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @media (prefers-reduced-motion: reduce) {
            .step-wrap, .step-enter { animation: none; transition: none; transform: none; }
            .step-exit { transform: none; }
          }
        `}</style>

        {/* progress hairlines at the foot */}
        {!isResult && (
          <div
            className="flex gap-1 px-8 pb-5 pt-4"
            style={{ borderTop: '1px solid var(--color-border)' }}
            aria-hidden="true"
          >
            {STEPS.slice(0, totalQuestions).map((_, i) => (
              <span
                key={i}
                className="flex-1 h-px transition-colors duration-300"
                style={{
                  background: i <= currentStepIndex ? 'var(--color-accent)' : 'var(--color-border)',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
