import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PendingFeedback {
  sessionId: number;
  gameName: string;
  gameImageUrl?: string;
  startedAt: number; // timestamp in milliseconds
}

interface FeedbackState {
  // Pending feedback to show on next visit
  pendingFeedback: PendingFeedback | null;

  // Whether feedback prompt was dismissed (to avoid showing again)
  dismissedSessionId: number | null;

  // Actions
  setPendingFeedback: (feedback: PendingFeedback) => void;
  clearPendingFeedback: () => void;
  dismissFeedback: () => void;

  // Helper to check if we should show the prompt
  shouldShowPrompt: (minElapsedMinutes?: number) => boolean;
}

// Default: 30 minutes before showing feedback prompt
const DEFAULT_MIN_ELAPSED_MINUTES = 30;

// For testing: can be overridden
const TEST_MIN_ELAPSED_SECONDS = 30;

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set, get) => ({
      pendingFeedback: null,
      dismissedSessionId: null,

      setPendingFeedback: (feedback) => {
        set({
          pendingFeedback: feedback,
          dismissedSessionId: null // Reset dismissed state for new session
        });
      },

      clearPendingFeedback: () => {
        set({
          pendingFeedback: null,
          dismissedSessionId: null
        });
      },

      dismissFeedback: () => {
        const { pendingFeedback } = get();
        set({
          pendingFeedback: null,
          dismissedSessionId: pendingFeedback?.sessionId ?? null
        });
      },

      shouldShowPrompt: (minElapsedMinutes = DEFAULT_MIN_ELAPSED_MINUTES) => {
        const { pendingFeedback, dismissedSessionId } = get();

        // No pending feedback
        if (!pendingFeedback) return false;

        // Already dismissed this session
        if (dismissedSessionId === pendingFeedback.sessionId) return false;

        // Check elapsed time
        const elapsedMs = Date.now() - pendingFeedback.startedAt;
        const elapsedMinutes = elapsedMs / (1000 * 60);

        // Use shorter time in development for testing
        const isDev = import.meta.env.DEV;
        const threshold = isDev
          ? TEST_MIN_ELAPSED_SECONDS / 60 // 30 seconds in dev
          : minElapsedMinutes;

        return elapsedMinutes >= threshold;
      },
    }),
    {
      name: 'lutem-feedback',
    }
  )
);
