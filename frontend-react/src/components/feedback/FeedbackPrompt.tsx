import { useState } from 'react';
import { StarRating } from './StarRating';
import { useFeedbackStore } from '@/stores/feedbackStore';
import { useSubmitFeedback } from '@/api/hooks';

interface FeedbackPromptProps {
  onSubmitted?: () => void;
}

export function FeedbackPrompt({ onSubmitted }: FeedbackPromptProps) {
  const { pendingFeedback, clearPendingFeedback, dismissFeedback } = useFeedbackStore();
  const submitFeedback = useSubmitFeedback();

  const [rating, setRating] = useState(0);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!pendingFeedback) return null;

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await submitFeedback.mutateAsync({
        sessionId: pendingFeedback.sessionId,
        satisfactionScore: rating,
        comment: comment.trim() || undefined,
      });

      clearPendingFeedback();
      onSubmitted?.();
      const { useToastStore } = await import('@/stores/toastStore');
      useToastStore.getState().addToast('Feedback submitted — thanks!', 'success');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      const { useToastStore } = await import('@/stores/toastStore');
      useToastStore.getState().addToast('Failed to submit feedback', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    dismissFeedback();
  };

  const canSubmit = rating > 0 && !isSubmitting;

  return (
    <section
      className="feedback-prompt py-6"
      style={{
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
      aria-labelledby="feedback-prompt-heading"
    >
      {/* eyebrow */}
      <div
        className="flex items-center gap-3 mb-4 font-mono text-[0.68rem] tracking-[0.28em] uppercase"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <span className="inline-block w-6 h-px" style={{ background: 'var(--color-accent)' }} />
        § Afterwards
      </div>

      {/* heading row with cover thumb */}
      <div className="flex items-start gap-4 mb-5">
        {pendingFeedback.gameImageUrl && (
          <div
            className="shrink-0 overflow-hidden aspect-[600/900] w-12"
            style={{
              background: 'var(--color-text-primary)',
              border: '1px solid var(--color-border-strong)',
            }}
          >
            <img
              src={pendingFeedback.gameImageUrl}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              style={{ filter: 'contrast(1.05) saturate(0.9)' }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0 pt-0.5">
          <h3
            id="feedback-prompt-heading"
            className="font-serif italic text-[clamp(1.25rem,2vw,1.7rem)] leading-[1.15] tracking-[-0.008em]"
            style={{ color: 'var(--color-text-primary)' }}
          >
            How was{' '}
            <span className="not-italic" style={{ color: 'var(--color-text-primary)' }}>
              {pendingFeedback.gameName}
            </span>
            ?
          </h3>
          <p
            className="font-serif italic text-[0.9rem] mt-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            A brief note for the record.
          </p>
        </div>
      </div>

      {/* Rating row */}
      <div className="mb-5 flex items-baseline gap-5 flex-wrap">
        <StarRating value={rating} onChange={setRating} size="lg" />
        {rating > 0 && (
          <span
            className="font-serif italic text-[0.95rem]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {getRatingLabel(rating)}
          </span>
        )}
      </div>

      {/* Optional comment */}
      <div className="mb-5">
        <button
          onClick={() => setShowComment(!showComment)}
          className="font-mono text-[0.65rem] tracking-[0.2em] uppercase bg-transparent border-0 p-0 pb-1 cursor-pointer transition-colors duration-300"
          style={{
            color: 'var(--color-text-muted)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          {showComment ? '− Close the note' : '+ Add a note (optional)'}
        </button>

        {showComment && (
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What made this session satisfying, or not?"
            aria-label="Session feedback note"
            className="feedback-note w-full mt-4 p-0 pb-2 bg-transparent font-serif italic text-[1rem] leading-snug resize-none focus:outline-none"
            style={{
              color: 'var(--color-text-primary)',
              borderBottom: '1px solid var(--color-border-strong)',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              borderRadius: 0,
            }}
            rows={2}
          />
        )}
      </div>

      {/* Submit / skip as editorial links */}
      <div className="flex items-baseline gap-8 flex-wrap">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`feedback-submit-link relative font-serif italic font-medium text-[1.2rem] leading-none inline-flex items-baseline gap-2 bg-transparent border-0 p-0 pb-1.5 cursor-pointer transition-[letter-spacing,color] duration-500 ${canSubmit ? '' : 'opacity-40 cursor-not-allowed'}`}
          style={{ color: 'var(--color-accent)' }}
        >
          {isSubmitting ? 'Submitting' : 'Submit the note'}
          <span aria-hidden="true" className="feedback-submit-arrow font-sans not-italic transition-transform duration-500">&rarr;</span>
          <span
            aria-hidden="true"
            className="feedback-submit-underline absolute left-0 bottom-0 h-px transition-[right] duration-[600ms]"
            style={{ background: 'var(--color-accent)', right: '35%' }}
          />
        </button>

        <button
          onClick={handleSkip}
          className="font-mono text-[0.7rem] tracking-[0.18em] uppercase bg-transparent border-0 p-0 pb-1 cursor-pointer transition-colors duration-300"
          style={{
            color: 'var(--color-text-muted)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          Skip
        </button>
      </div>

      <style>{`
        .feedback-submit-link:hover:not(:disabled) {
          letter-spacing: 0.04em;
        }
        .feedback-submit-link:hover:not(:disabled) .feedback-submit-underline {
          right: 0 !important;
        }
        .feedback-submit-link:hover:not(:disabled) .feedback-submit-arrow {
          transform: translateX(0.4rem);
        }
        .feedback-note:focus {
          border-bottom-color: var(--color-accent) !important;
        }
      `}</style>
    </section>
  );
}

function getRatingLabel(rating: number): string {
  switch (rating) {
    case 1: return 'Not great — will avoid next time.';
    case 2: return 'Meh — not what I needed.';
    case 3: return 'Okay — served its purpose.';
    case 4: return 'A good session.';
    case 5: return 'Exactly what I needed.';
    default: return '';
  }
}
