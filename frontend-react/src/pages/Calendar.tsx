import { useState, useMemo } from 'react';
import { LoginPrompt } from '@/components/LoginPrompt';
import { useAuthStore } from '@/stores/authStore';
import {
  useCalendarEvents,
  useCalendarInvitations,
  useRespondToCalendarInvitation,
} from '@/api/hooks';
import { CreateEventForm } from '@/components/calendar/CreateEventForm';
import { EventCard } from '@/components/calendar/EventCard';
import type { CalendarEvent, CalendarInvitation } from '@/types';

type ViewFilter = 'all' | 'friends' | 'mine';

export function Calendar() {
  const { isAuthenticated } = useAuthStore();
  const [viewFilter, setViewFilter] = useState<ViewFilter>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Calculate date range for current view (month view)
  const { start, end } = useMemo(() => {
    const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    // Add buffer for events
    startOfMonth.setDate(startOfMonth.getDate() - 7);
    endOfMonth.setDate(endOfMonth.getDate() + 7);
    return {
      start: startOfMonth.toISOString(),
      end: endOfMonth.toISOString(),
    };
  }, [selectedDate]);

  const {
    data: events,
    isLoading,
  } = useCalendarEvents(start, end, viewFilter === 'friends');

  const { data: invitations } = useCalendarInvitations();

  // Filter events based on view
  const filteredEvents = useMemo(() => {
    if (!events) return [];
    if (viewFilter === 'mine') {
      return events.filter((e) => e.isOwner);
    }
    return events;
  }, [events, viewFilter]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, CalendarEvent[]> = {};
    filteredEvents.forEach((event) => {
      const dateKey = new Date(event.startTime).toISOString().split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  }, [filteredEvents]);

  // Get upcoming events (next 7 days)
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return filteredEvents
      .filter((e) => {
        const eventDate = new Date(e.startTime);
        return eventDate >= now && eventDate <= weekFromNow;
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [filteredEvents]);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen">
        <div className="max-w-[1080px] mx-auto px-5 md:px-10 pt-8 pb-20">
          <header
            className="pb-5 mb-10 md:mb-14"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            <div
              className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.28em] uppercase mb-5"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <span
                className="inline-block w-6 h-px"
                style={{ background: 'var(--color-accent)' }}
                aria-hidden="true"
              />
              § The schedule
            </div>
            <h1
              className="font-serif text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] tracking-[-0.016em] mb-3"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Calendar.
            </h1>
            <p
              className="font-serif italic text-[clamp(1rem,1.4vw,1.2rem)] leading-[1.48] max-w-[44ch]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Plan and join gaming sessions.
            </p>
          </header>
          <LoginPrompt feature="the gaming calendar" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-[1080px] mx-auto px-5 md:px-10 pt-8 pb-20">
        {/* ─── masthead ─────────────────────────────────── */}
        <header
          className="pb-5 mb-10 md:mb-14"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div
            className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.28em] uppercase mb-5"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span
              className="inline-block w-6 h-px"
              style={{ background: 'var(--color-accent)' }}
              aria-hidden="true"
            />
            § The schedule
          </div>

          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h1
                className="font-serif text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] tracking-[-0.016em] mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Calendar.
              </h1>
              <p
                className="font-serif italic text-[clamp(1rem,1.4vw,1.2rem)] leading-[1.48] max-w-[44ch]"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Planned sessions, invitations.
              </p>
            </div>

            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="cal-cta relative font-serif italic font-medium text-[1.2rem] inline-flex items-baseline gap-2 bg-transparent border-0 p-0 pb-1.5 cursor-pointer transition-[letter-spacing] duration-500"
              style={{ color: 'var(--color-accent)' }}
              aria-expanded={showCreateForm}
            >
              {showCreateForm ? 'Close the draft' : '+ Propose a session'}
              <span aria-hidden="true" className="cal-arrow font-sans not-italic transition-transform duration-500">&rarr;</span>
              <span
                aria-hidden="true"
                className="cal-underline absolute left-0 bottom-0 h-px transition-[right] duration-[600ms]"
                style={{ background: 'var(--color-accent)', right: '30%' }}
              />
            </button>
          </div>
        </header>

        {/* ─── create form ──────────────────────────────── */}
        {showCreateForm && (
          <div className="mb-10">
            <CreateEventForm
              onSuccess={() => setShowCreateForm(false)}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}

        {/* ─── invitations ──────────────────────────────── */}
        {invitations && invitations.length > 0 && (
          <InvitationsBanner invitations={invitations} />
        )}

        {/* ─── filters ──────────────────────────────────── */}
        <div
          className="flex items-baseline gap-8 mb-8"
          style={{ borderBottom: '1px solid var(--color-border)' }}
          role="tablist"
          aria-label="Calendar filter"
        >
          {([
            { id: 'all', label: 'All' },
            { id: 'friends', label: 'Friends' },
            { id: 'mine', label: 'Mine' },
          ] as { id: ViewFilter; label: string }[]).map((tab) => {
            const active = viewFilter === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                onClick={() => setViewFilter(tab.id)}
                className="relative font-serif text-[1.05rem] leading-none bg-transparent border-0 p-0 pb-3 cursor-pointer transition-colors duration-300"
                style={{
                  color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  fontStyle: active ? 'italic' : 'normal',
                  fontWeight: active ? 500 : 400,
                }}
              >
                {tab.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 h-px"
                    style={{ background: 'var(--color-accent)', bottom: '-1px' }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ─── month navigation ─────────────────────────── */}
        <div className="flex items-center justify-center gap-8 mb-10">
          <button
            onClick={() =>
              setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))
            }
            className="cal-month-nav font-mono text-[0.72rem] tracking-[0.2em] uppercase bg-transparent border-0 p-0 pb-0.5 cursor-pointer transition-colors duration-300"
            style={{
              color: 'var(--color-text-secondary)',
              borderBottom: '1px solid var(--color-border)',
            }}
            aria-label="Previous month"
          >
            &larr; Previous
          </button>
          <h2
            className="font-mono text-[0.88rem] tracking-[0.18em] uppercase tabular-nums"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {selectedDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={() =>
              setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))
            }
            className="cal-month-nav font-mono text-[0.72rem] tracking-[0.2em] uppercase bg-transparent border-0 p-0 pb-0.5 cursor-pointer transition-colors duration-300"
            style={{
              color: 'var(--color-text-secondary)',
              borderBottom: '1px solid var(--color-border)',
            }}
            aria-label="Next month"
          >
            Next &rarr;
          </button>
        </div>

        {/* ─── loading ──────────────────────────────────── */}
        {isLoading && (
          <div
            className="flex items-center justify-center gap-3 py-12"
            role="status"
            aria-live="polite"
          >
            <span
              className="inline-block w-2 h-2 rounded-full cal-pulse"
              style={{ background: 'var(--color-accent)' }}
              aria-hidden="true"
            />
            <span
              className="font-mono text-[0.62rem] tracking-[0.28em] uppercase"
              style={{ color: 'var(--color-text-muted)' }}
            >
              loading
            </span>
          </div>
        )}

        {/* ─── events ───────────────────────────────────── */}
        {!isLoading && (
          <>
            {upcomingEvents.length > 0 && (
              <section className="mb-12">
                <div
                  className="flex items-center gap-3 font-mono text-[0.68rem] tracking-[0.28em] uppercase mb-4"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <span
                    className="inline-block w-5 h-px"
                    style={{ background: 'var(--color-accent)' }}
                    aria-hidden="true"
                  />
                  Upcoming this week
                  <span
                    className="flex-1 h-px"
                    style={{ background: 'var(--color-border)' }}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>
            )}

            <section>
              <div
                className="flex items-center gap-3 font-mono text-[0.68rem] tracking-[0.28em] uppercase mb-4"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <span
                  className="inline-block w-5 h-px"
                  style={{ background: 'var(--color-accent)' }}
                  aria-hidden="true"
                />
                All events
                <span
                  className="flex-1 h-px"
                  style={{ background: 'var(--color-border)' }}
                  aria-hidden="true"
                />
              </div>

              {Object.keys(eventsByDate).length === 0 ? (
                <EmptyState viewFilter={viewFilter} onCreateClick={() => setShowCreateForm(true)} />
              ) : (
                <div className="space-y-8">
                  {Object.entries(eventsByDate)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([dateKey, dayEvents]) => (
                      <div key={dateKey}>
                        <div
                          className="flex items-center gap-3 font-mono text-[0.62rem] tracking-[0.28em] uppercase mb-1"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          <span>{formatDateHeader(dateKey)}</span>
                          <span
                            className="flex-1 h-px"
                            style={{ background: 'var(--color-border)' }}
                            aria-hidden="true"
                          />
                        </div>
                        <div>
                          {dayEvents.map((event) => (
                            <EventCard key={event.id} event={event} compact />
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      <style>{`
        .cal-cta:hover { letter-spacing: 0.03em; }
        .cal-cta:hover .cal-underline { right: 0 !important; }
        .cal-cta:hover .cal-arrow { transform: translateX(0.35rem); }
        .cal-month-nav:hover {
          color: var(--color-accent);
          border-bottom-color: var(--color-accent);
        }
        @keyframes cal-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .cal-pulse { animation: cal-pulse 1.4s ease-in-out infinite; }
      `}</style>
    </main>
  );
}

function InvitationsBanner({ invitations }: { invitations: CalendarInvitation[] }) {
  const [expanded, setExpanded] = useState(false);
  const respondToInvitation = useRespondToCalendarInvitation();

  return (
    <div
      className="mb-10 py-5 px-0"
      style={{
        borderTop: '1px solid var(--color-border-strong)',
        borderBottom: '1px solid var(--color-border-strong)',
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-baseline justify-between gap-4 bg-transparent border-0 p-0 cursor-pointer text-left"
        aria-expanded={expanded}
      >
        <div>
          <div
            className="flex items-center gap-3 font-mono text-[0.68rem] tracking-[0.28em] uppercase mb-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span
              className="inline-block w-5 h-px"
              style={{ background: 'var(--color-accent)' }}
              aria-hidden="true"
            />
            § Pending invitations
          </div>
          <p
            className="font-serif italic text-[1.05rem] leading-snug"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {invitations.length} pending invitation{invitations.length > 1 ? 's' : ''} awaiting you.
          </p>
        </div>
        <span
          className="font-mono text-[0.72rem] tracking-[0.2em] uppercase transition-colors duration-300"
          style={{
            color: 'var(--color-accent)',
            borderBottom: '1px solid var(--color-accent)',
          }}
        >
          {expanded ? 'Collapse' : 'View'}
        </span>
      </button>

      {expanded && (
        <div className="mt-6 space-y-4">
          {invitations.map((inv) => (
            <div
              key={inv.invitationId}
              className="flex items-baseline justify-between gap-4 py-3"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              <div className="min-w-0 flex-1">
                <p
                  className="font-serif text-[1rem] leading-snug truncate"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {inv.event.title}
                </p>
                <p
                  className="font-mono text-[0.62rem] tracking-[0.14em] uppercase mt-1"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {inv.invitedBy?.displayName && <>from {inv.invitedBy.displayName} &middot; </>}
                  {new Date(inv.event.startTime).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-baseline gap-5 shrink-0">
                <button
                  onClick={() => respondToInvitation.mutate({ id: inv.invitationId, accept: true })}
                  disabled={respondToInvitation.isPending}
                  className="invite-accept font-serif italic text-[0.95rem] leading-none bg-transparent border-0 p-0 pb-0.5 cursor-pointer transition-colors duration-300"
                  style={{
                    color: 'var(--color-accent)',
                    borderBottom: '1px solid var(--color-accent)',
                  }}
                  aria-label={`Accept invitation to ${inv.event.title}`}
                >
                  Accept
                </button>
                <button
                  onClick={() => respondToInvitation.mutate({ id: inv.invitationId, accept: false })}
                  disabled={respondToInvitation.isPending}
                  className="invite-decline font-mono text-[0.62rem] tracking-[0.22em] uppercase bg-transparent border-0 p-0 pb-0.5 cursor-pointer transition-colors duration-300"
                  style={{
                    color: 'var(--color-text-muted)',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                  aria-label={`Decline invitation to ${inv.event.title}`}
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .invite-decline:hover {
          color: var(--color-error);
          border-bottom-color: var(--color-error);
        }
      `}</style>
    </div>
  );
}

function EmptyState({ viewFilter, onCreateClick }: { viewFilter: ViewFilter; onCreateClick: () => void }) {
  const messages: Record<ViewFilter, string> = {
    all: 'No events scheduled yet.',
    friends: 'No events from friends.',
    mine: 'You have not created any events.',
  };

  return (
    <div className="py-10">
      <p
        className="font-serif italic text-[1.1rem] leading-snug mb-6 max-w-[40ch]"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {messages[viewFilter]}
      </p>
      <button
        onClick={onCreateClick}
        className="empty-cta relative font-serif italic font-medium text-[1.1rem] inline-flex items-baseline gap-2 bg-transparent border-0 p-0 pb-1.5 cursor-pointer transition-[letter-spacing] duration-500"
        style={{ color: 'var(--color-accent)' }}
      >
        + Propose the first
        <span aria-hidden="true" className="empty-arrow font-sans not-italic transition-transform duration-500">&rarr;</span>
        <span
          aria-hidden="true"
          className="empty-underline absolute left-0 bottom-0 h-px transition-[right] duration-[600ms]"
          style={{ background: 'var(--color-accent)', right: '30%' }}
        />
      </button>

      <style>{`
        .empty-cta:hover { letter-spacing: 0.03em; }
        .empty-cta:hover .empty-underline { right: 0 !important; }
        .empty-cta:hover .empty-arrow { transform: translateX(0.35rem); }
      `}</style>
    </div>
  );
}

function formatDateHeader(dateKey: string): string {
  const date = new Date(dateKey + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';

  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export default Calendar;
