import { useEffect, useState } from 'react';
import { useWizardStore } from '@/stores/wizardStore';
import SourceStep from './SourceStep';
import TimeStep from './TimeStep';
import MoodStep from './MoodStep';
import EnergyStep from './EnergyStep';
import InterruptionStep from './InterruptionStep';
import SocialStep from './SocialStep';
import AudioStep from './AudioStep';
import ResultStep from './ResultStep';

const STEP_ORDER = ['source', 'time', 'mood', 'energy', 'interruption', 'social', 'audio', 'result'] as const;
type Step = typeof STEP_ORDER[number];

const ROMAN = ['', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'];

const EXIT_MS = 220;

export default function InlineWizard() {
  const { currentStep, prevStep, closeWizard, resetWizard } = useWizardStore();
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

  const currentIndex = STEP_ORDER.indexOf(currentStep as Step);
  const displayIndex = STEP_ORDER.indexOf(displayStep as Step);
  const isFirstStep = currentIndex === 0;
  const isDisplayingResult = displayStep === 'result';
  const totalQuestions = STEP_ORDER.length - 1;

  const handleBack = () => {
    if (isFirstStep) {
      resetWizard();
      closeWizard();
    } else {
      prevStep();
    }
  };

  const handleDiscard = () => {
    resetWizard();
    closeWizard();
  };

  return (
    <article className="relative">
      {/* ─── questionnaire header ─── */}
      <header
        className="flex flex-wrap items-baseline justify-between gap-4 pb-4 mb-8"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <div
          className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.28em] uppercase"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <span className="inline-block w-6 h-px" style={{ background: 'var(--color-accent)' }} />
          <span>The questionnaire</span>
          {!isDisplayingResult && (
            <>
              <span style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}>·</span>
              <span>
                Question <span style={{ color: 'var(--color-accent)' }}>{ROMAN[displayIndex + 1]}</span>
                <span style={{ opacity: 0.55 }}> of {ROMAN[totalQuestions]}</span>
              </span>
            </>
          )}
        </div>

        <div className="flex items-baseline gap-5">
          {!isFirstStep && !isDisplayingResult && (
            <button
              onClick={handleBack}
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
            onClick={handleDiscard}
            className="font-mono text-[0.7rem] tracking-[0.14em] uppercase bg-transparent border-0 p-0 pb-1 cursor-pointer transition-colors"
            style={{
              color: 'var(--color-text-muted)',
              borderBottom: '1px solid transparent',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-error)'; e.currentTarget.style.borderBottomColor = 'var(--color-error)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderBottomColor = 'transparent'; }}
          >
            Discard
          </button>
        </div>
      </header>

      {/* ─── step content ─── */}
      <div
        key={displayStep}
        className={`step-wrap ${isExiting ? 'step-exit' : 'step-enter'}`}
      >
        {displayStep === 'source'       && <SourceStep />}
        {displayStep === 'time'         && <TimeStep />}
        {displayStep === 'mood'         && <MoodStep />}
        {displayStep === 'energy'       && <EnergyStep />}
        {displayStep === 'interruption' && <InterruptionStep />}
        {displayStep === 'social'       && <SocialStep />}
        {displayStep === 'audio'        && <AudioStep />}
        {displayStep === 'result'       && <ResultStep />}
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

      {/* ─── progress hairlines at the foot ─── */}
      <div
        className="mt-10 pt-4 flex gap-1"
        style={{ borderTop: '1px solid var(--color-border)' }}
        aria-hidden="true"
      >
        {STEP_ORDER.slice(0, totalQuestions).map((_, i) => (
          <span
            key={i}
            className="flex-1 h-px transition-colors duration-300"
            style={{
              background: i <= currentIndex ? 'var(--color-accent)' : 'var(--color-border)',
            }}
          />
        ))}
      </div>
    </article>
  );
}
