import { useState, useMemo } from 'react';
import { Calendar, Clock, Star, Loader2, AlertCircle, Gamepad2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useSessionHistory, useSubmitFeedback } from '@/api/hooks';
import { LoginPrompt } from '@/components/LoginPrompt';
import { StarRating } from '@/components/feedback';
import type { SessionHistory } from '@/types';

export function Sessions() {
  const { isAuthenticated } = useAuthStore();
  const { data: sessions, isLoading, error } = useSessionHistory(50);

  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    if (!sessions?.length) return null;

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const thisWeek = sessions.filter(s => {
      const date = new Date(s.startedAt || s.recommendedAt);
      return date >= weekAgo;
    });

    const rated = thisWeek.filter(s => s.satisfactionScore != null);
    const avgRating = rated.length > 0
      ? rated.reduce((sum, s) => sum + (s.satisfactionScore || 0), 0) / rated.length
      : 0;

    return {
      sessionsCount: thisWeek.length,
      ratedCount: rated.length,
      avgRating,
    };
  }, [sessions]);

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] px-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-accent)]/10 mb-4">
            <Calendar className="w-8 h-8 text-[var(--color-accent)]" />
          </div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
            Session History
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Track and reflect on your gaming sessions
          </p>
        </div>

        {/* Weekly Stats Card */}
        {weeklyStats && weeklyStats.sessionsCount > 0 && (
          <div className="
            mb-6 p-5 rounded-xl
            bg-[var(--color-bg-secondary)]
            border border-[var(--color-border)]
          ">
            <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-4">
              This Week
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {weeklyStats.sessionsCount}
                </div>
                <div className="text-xs text-[var(--color-text-muted)]">Sessions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {weeklyStats.avgRating > 0 ? weeklyStats.avgRating.toFixed(1) : '—'}
                </div>
                <div className="text-xs text-[var(--color-text-muted)]">Avg Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {weeklyStats.ratedCount}/{weeklyStats.sessionsCount}
                </div>
                <div className="text-xs text-[var(--color-text-muted)]">Rated</div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[var(--color-accent)] animate-spin mb-4" />
            <p className="text-[var(--color-text-muted)]">Loading sessions...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-700 dark:text-red-300">
                Failed to load session history
              </p>
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                Please try again later
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && sessions?.length === 0 && (
          <EmptyState isAuthenticated={isAuthenticated} />
        )}

        {/* Session List */}
        {sessions && sessions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-[var(--color-text-muted)] px-1">
              Recent Sessions
            </h3>
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}

        {/* Login prompt for non-authenticated users */}
        {!isAuthenticated && (
          <div className="mt-8">
            <LoginPrompt feature="personalized session tracking" />
          </div>
        )}
      </div>
    </main>
  );
}

function EmptyState({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <div className="
      p-8 rounded-xl text-center
      bg-[var(--color-bg-secondary)]
      border border-[var(--color-border)]
    ">
      <div className="mb-4">
        <Gamepad2 className="w-12 h-12 mx-auto text-[var(--color-text-muted)]" />
      </div>
      <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
        No sessions yet
      </h3>
      <p className="text-[var(--color-text-muted)] text-sm">
        {isAuthenticated
          ? "Get a recommendation and launch a game to start tracking your sessions."
          : "Sign in and start using Lutem to track your gaming sessions."}
      </p>
    </div>
  );
}

function SessionCard({ session }: { session: SessionHistory }) {
  const [isRating, setIsRating] = useState(false);
  const [pendingRating, setPendingRating] = useState(0);
  const submitFeedback = useSubmitFeedback();

  const sessionDate = new Date(session.startedAt || session.recommendedAt);
  const isToday = isDateToday(sessionDate);
  const isYesterday = isDateYesterday(sessionDate);

  const dateLabel = isToday
    ? 'Today'
    : isYesterday
    ? 'Yesterday'
    : sessionDate.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

  const timeLabel = sessionDate.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  const handleRate = async (rating: number) => {
    setPendingRating(rating);
    try {
      await submitFeedback.mutateAsync({
        sessionId: session.id,
        satisfactionScore: rating,
      });
      setIsRating(false);
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

  const displayRating = pendingRating || session.satisfactionScore;

  return (
    <div className="
      p-4 rounded-xl
      bg-[var(--color-bg-secondary)]
      border border-[var(--color-border)]
      hover:border-[var(--color-border-hover)]
      transition-colors
    ">
      <div className="flex items-start gap-3">
        {/* Game Image */}
        {session.gameImageUrl ? (
          <img
            src={session.gameImageUrl}
            alt={session.gameName}
            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-[var(--color-bg-tertiary)] flex items-center justify-center flex-shrink-0">
            <Gamepad2 className="w-6 h-6 text-[var(--color-text-muted)]" />
          </div>
        )}

        {/* Session Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-[var(--color-text-primary)] truncate">
            {session.gameName}
          </h4>

          <div className="flex items-center gap-3 mt-1 text-xs text-[var(--color-text-muted)]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {dateLabel}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeLabel}
            </span>
          </div>

          {/* Rating Section */}
          <div className="mt-2">
            {displayRating ? (
              <div className="flex items-center gap-2">
                <StarRating value={displayRating} size="sm" readonly />
                <span className="text-xs text-[var(--color-text-muted)]">
                  {getRatingText(displayRating)}
                </span>
              </div>
            ) : isRating ? (
              <div className="flex items-center gap-2">
                <StarRating value={0} onChange={handleRate} size="sm" />
                <button
                  onClick={() => setIsRating(false)}
                  className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsRating(true)}
                className="
                  flex items-center gap-1
                  text-xs text-[var(--color-accent)]
                  hover:text-[var(--color-accent-hover)]
                  transition-colors
                "
              >
                <Star className="w-3 h-3" />
                Rate this session
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function isDateToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function isDateYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

function getRatingText(rating: number): string {
  switch (rating) {
    case 1: return 'Not great';
    case 2: return 'Meh';
    case 3: return 'Okay';
    case 4: return 'Good';
    case 5: return 'Excellent';
    default: return '';
  }
}

export default Sessions;
