import { useState, useMemo } from 'react';
import { SessionListSkeleton } from '@/components/skeletons/SessionCardSkeleton';
import { EmptySessionsSvg } from '@/components/illustrations';
import { WeeklyBarChart } from '@/components/charts/WeeklyBarChart';
import { useAuthStore } from '@/stores/authStore';
import { useSessionHistory, useSubmitFeedback } from '@/api/hooks';
import { LoginPrompt } from '@/components/LoginPrompt';
import { StarRating } from '@/components/feedback';
import type { SessionHistory } from '@/types';

// Typographic dot ratings — mirrors the pattern in GameCard.tsx.
function RatingDots({ value, total = 5 }: { value: number; total?: number }) {
  const filled = Math.max(0, Math.min(total, Math.round(value)));
  return (
    <span className="font-serif tracking-[0.32em] text-[0.85rem] leading-none">
      <span style={{ color: 'var(--color-accent)' }}>{'●'.repeat(filled)}</span>
      <span style={{ color: 'var(--color-text-muted)', opacity: 0.45 }}>{'●'.repeat(total - filled)}</span>
    </span>
  );
}

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
    <main
      id="main-content"
      className="min-h-screen px-5 md:px-10 pt-8 pb-24"
      style={{ background: 'var(--color-bg-primary)' }}
    >
      <div className="max-w-[1040px] mx-auto">
        {/* ─── masthead ─── */}
        <header
          className="pb-6 mb-10 md:mb-14"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div
            className="flex items-center gap-3 mb-5 font-mono text-[0.7rem] tracking-[0.28em] uppercase"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span className="inline-block w-6 h-px" style={{ background: 'var(--color-accent)' }} />
            § The record
          </div>

          <h1
            className="font-serif text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] tracking-[-0.016em] mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Your recent hours.
          </h1>

          <p
            className="font-serif italic text-[clamp(1.05rem,1.4vw,1.2rem)] leading-[1.48] max-w-[44ch]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            A ledger of sessions past &mdash; a quiet way to notice what satisfies you.
          </p>
        </header>

        {/* ─── weekly stats ─── */}
        {weeklyStats && weeklyStats.sessionsCount > 0 && (
          <section
            className="mb-14"
            aria-labelledby="weekly-stats-heading"
          >
            <div className="flex items-baseline justify-between mb-5">
              <div
                id="weekly-stats-heading"
                className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.28em] uppercase"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <span className="inline-block w-6 h-px" style={{ background: 'var(--color-accent)' }} />
                This week
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-left">
              <div className="py-2" style={{ borderTop: '1px solid var(--color-border)' }}>
                <div
                  className="font-mono text-[0.64rem] tracking-[0.22em] uppercase mb-2"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Sessions
                </div>
                <div
                  className="font-serif text-[2rem] leading-none"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {weeklyStats.sessionsCount}
                </div>
              </div>

              <div className="py-2" style={{ borderTop: '1px solid var(--color-border)' }}>
                <div
                  className="font-mono text-[0.64rem] tracking-[0.22em] uppercase mb-2"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Avg. rating
                </div>
                <div
                  className="font-serif text-[2rem] leading-none"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {weeklyStats.avgRating > 0 ? weeklyStats.avgRating.toFixed(1) : '—'}
                </div>
              </div>

              <div className="py-2" style={{ borderTop: '1px solid var(--color-border)' }}>
                <div
                  className="font-mono text-[0.64rem] tracking-[0.22em] uppercase mb-2"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Rated
                </div>
                <div
                  className="font-serif text-[2rem] leading-none"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {weeklyStats.ratedCount}
                  <span
                    className="font-mono text-[0.95rem] tracking-wider ml-1"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    /{weeklyStats.sessionsCount}
                  </span>
                </div>
              </div>
            </div>

            {sessions && sessions.length > 0 && (
              <div
                className="mt-6 pt-6"
                style={{ borderTop: '1px solid var(--color-border)' }}
              >
                <WeeklyBarChart sessions={sessions} />
              </div>
            )}
          </section>
        )}

        {/* ─── loading ─── */}
        {isLoading && <SessionListSkeleton />}

        {/* ─── error ─── */}
        {error && (
          <div
            role="alert"
            className="mb-10 p-4 flex items-start gap-4"
            style={{
              borderTop: '1px solid var(--color-error)',
              borderBottom: '1px solid var(--color-error)',
            }}
          >
            <span
              className="font-serif italic text-[0.8rem] tracking-[0.18em] uppercase shrink-0 mt-0.5"
              style={{ color: 'var(--color-error)' }}
            >
              Notice
            </span>
            <div className="flex-1">
              <p className="font-serif text-[1rem]" style={{ color: 'var(--color-text-primary)' }}>
                Failed to load session history.
              </p>
              <p className="font-serif italic text-[0.9rem] mt-1" style={{ color: 'var(--color-text-muted)' }}>
                Please try again later.
              </p>
            </div>
          </div>
        )}

        {/* ─── empty ─── */}
        {!isLoading && !error && sessions?.length === 0 && (
          <EmptyState isAuthenticated={isAuthenticated} />
        )}

        {/* ─── session list ─── */}
        {sessions && sessions.length > 0 && (
          <section aria-labelledby="session-list-heading">
            <div
              className="flex items-center gap-3 mb-4 font-mono text-[0.7rem] tracking-[0.28em] uppercase"
              id="session-list-heading"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <span className="inline-block w-6 h-px" style={{ background: 'var(--color-accent)' }} />
              Recent sessions
            </div>

            <ul
              className="list-none p-0 m-0"
              style={{ borderTop: '1px solid var(--color-border-strong)' }}
            >
              {sessions.map((session) => (
                <SessionRow key={session.id} session={session} />
              ))}
            </ul>
          </section>
        )}

        {/* ─── login invitation ─── */}
        {!isAuthenticated && (
          <LoginPrompt feature="personalised session tracking" />
        )}
      </div>
    </main>
  );
}

function EmptyState({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <div
      className="py-12 md:py-16 text-center max-w-[44ch] mx-auto"
      style={{
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <EmptySessionsSvg className="w-40 h-32 mx-auto mb-6 opacity-80" />
      <p
        className="font-serif italic text-[clamp(1.1rem,1.6vw,1.35rem)] leading-[1.42]"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {isAuthenticated
          ? 'Nothing is written yet. Begin a session tonight and the page will fill in.'
          : 'Sign in and each session will be quietly recorded here.'}
      </p>
    </div>
  );
}

function SessionRow({ session }: { session: SessionHistory }) {
  const [isRating, setIsRating] = useState(false);
  const [pendingRating, setPendingRating] = useState(0);
  const submitFeedback = useSubmitFeedback();

  const sessionDate = new Date(session.startedAt || session.recommendedAt);
  const isToday = isDateToday(sessionDate);
  const isYesterday = isDateYesterday(sessionDate);

  const dateLabel = (isToday
    ? 'today'
    : isYesterday
    ? 'yesterday'
    : sessionDate.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
  ).toLowerCase();

  const timeLabel = sessionDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const handleRate = async (rating: number) => {
    setPendingRating(rating);
    try {
      await submitFeedback.mutateAsync({
        sessionId: session.id,
        satisfactionScore: rating,
      });
      setIsRating(false);
      const { useToastStore } = await import('@/stores/toastStore');
      useToastStore.getState().addToast('Rating saved', 'success');
    } catch (err) {
      console.error('Failed to submit rating:', err);
      const { useToastStore } = await import('@/stores/toastStore');
      useToastStore.getState().addToast('Failed to save rating', 'error');
    }
  };

  const displayRating = pendingRating || session.satisfactionScore;

  return (
    <li
      className="session-row grid grid-cols-[auto_1fr] gap-x-5 md:gap-x-8 gap-y-2 items-baseline py-5 px-1"
      style={{ borderBottom: '1px solid var(--color-border)' }}
    >
      {/* date column (mono) */}
      <div className="font-mono text-[0.7rem] tracking-[0.08em] leading-snug min-w-[5.5rem]">
        <div style={{ color: 'var(--color-text-secondary)' }}>{dateLabel}</div>
        <div style={{ color: 'var(--color-text-muted)' }}>{timeLabel}</div>
      </div>

      {/* title + optional cover */}
      <div className="flex items-start gap-3 min-w-0">
        {session.gameImageUrl ? (
          <div
            className="shrink-0 overflow-hidden aspect-[600/900] w-9 mt-0.5"
            style={{
              background: 'var(--color-text-primary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <img
              src={session.gameImageUrl}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              style={{ filter: 'contrast(1.05) saturate(0.9)' }}
            />
          </div>
        ) : null}
        <div className="min-w-0">
          <h4
            className="font-serif text-[1.05rem] md:text-[1.15rem] leading-tight truncate"
            style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}
          >
            {session.gameName}
          </h4>
          {/* Rating / rate button */}
          <div className="mt-1.5">
            {displayRating ? (
              <span className="inline-flex items-baseline gap-3 flex-wrap">
                <RatingDots value={displayRating} />
                <span
                  className="font-serif italic text-[0.82rem]"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {getRatingText(displayRating)}
                </span>
              </span>
            ) : isRating ? (
              <span className="inline-flex items-baseline gap-4 flex-wrap">
                <StarRating value={0} onChange={handleRate} size="sm" />
                <button
                  onClick={() => setIsRating(false)}
                  className="font-mono text-[0.62rem] tracking-[0.18em] uppercase bg-transparent border-0 p-0 pb-0.5 cursor-pointer"
                  style={{
                    color: 'var(--color-text-muted)',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  Cancel
                </button>
              </span>
            ) : (
              <button
                onClick={() => setIsRating(true)}
                className="session-rate-link font-serif italic text-[0.88rem] bg-transparent border-0 p-0 pb-0.5 cursor-pointer transition-colors duration-300"
                style={{
                  color: 'var(--color-accent)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                Rate this session
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .session-row:hover {
          background: var(--color-bg-secondary);
        }
        .session-rate-link:hover {
          border-bottom-color: var(--color-accent);
        }
      `}</style>
    </li>
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
    case 1: return 'not great';
    case 2: return 'meh';
    case 3: return 'okay';
    case 4: return 'good';
    case 5: return 'excellent';
    default: return '';
  }
}

export default Sessions;
