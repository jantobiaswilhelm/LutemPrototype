import { useState } from 'react';
import { ChevronDown, ChevronUp, X, Send } from 'lucide-react';
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
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    dismissFeedback();
  };

  return (
    <div className="
      mb-6 p-5 rounded-xl
      bg-[var(--color-bg-secondary)]
      border border-[var(--color-accent)]/30
      shadow-md
      animate-in fade-in slide-in-from-top-2 duration-300
    ">
      {/* Header with dismiss button */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          {pendingFeedback.gameImageUrl && (
            <img
              src={pendingFeedback.gameImageUrl}
              alt={pendingFeedback.gameName}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
          )}
          <div className="min-w-0">
            <p className="text-sm text-[var(--color-text-muted)]">
              How was your session?
            </p>
            <p className="font-medium text-[var(--color-text-primary)] truncate">
              {pendingFeedback.gameName}
            </p>
          </div>
        </div>
        <button
          onClick={handleSkip}
          className="
            p-1 rounded-lg
            text-[var(--color-text-muted)]
            hover:text-[var(--color-text-primary)]
            hover:bg-[var(--color-bg-tertiary)]
            transition-colors
          "
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Star Rating */}
      <div className="mb-4">
        <StarRating value={rating} onChange={setRating} size="lg" />
        {rating > 0 && (
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            {getRatingLabel(rating)}
          </p>
        )}
      </div>

      {/* Optional Comment Section */}
      <div className="mb-4">
        <button
          onClick={() => setShowComment(!showComment)}
          className="
            flex items-center gap-1
            text-sm text-[var(--color-text-muted)]
            hover:text-[var(--color-text-secondary)]
            transition-colors
          "
        >
          {showComment ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
          Add a note (optional)
        </button>

        {showComment && (
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What made this session satisfying or not?"
            className="
              w-full mt-2 p-3 rounded-lg
              bg-[var(--color-bg-tertiary)]
              border border-[var(--color-border)]
              text-[var(--color-text-primary)]
              placeholder:text-[var(--color-text-muted)]
              resize-none
              focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50
            "
            rows={2}
          />
        )}
      </div>

      {/* Action Buttons - touch-friendly sizing */}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={rating === 0 || isSubmitting}
          className="
            flex-1 flex items-center justify-center gap-2
            py-3 px-4 rounded-lg
            bg-[var(--color-accent)]
            text-white font-medium
            hover:bg-[var(--color-accent-hover)]
            active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all
          "
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        <button
          onClick={handleSkip}
          className="
            py-3 px-5 rounded-lg
            text-[var(--color-text-secondary)]
            hover:bg-[var(--color-bg-tertiary)]
            active:scale-[0.98]
            transition-all
          "
        >
          Skip
        </button>
      </div>
    </div>
  );
}

function getRatingLabel(rating: number): string {
  switch (rating) {
    case 1: return 'Not great - will avoid next time';
    case 2: return 'Meh - not what I needed';
    case 3: return 'Okay - served its purpose';
    case 4: return 'Good session!';
    case 5: return 'Exactly what I needed!';
    default: return '';
  }
}
