import { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Users,
  User,
  Globe,
  UserPlus,
  Loader2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { LoginPrompt } from '@/components/LoginPrompt';
import { useAuthStore } from '@/stores/authStore';
import {
  useCalendarEvents,
  useCalendarInvitations,
  useRespondToCalendarInvitation,
} from '@/api/hooks';
import { CreateEventModal } from '@/components/calendar/CreateEventModal';
import { EventCard } from '@/components/calendar/EventCard';
import type { CalendarEvent, CalendarInvitation } from '@/types';

type ViewFilter = 'all' | 'friends' | 'mine';

export function Calendar() {
  const { isAuthenticated } = useAuthStore();
  const [viewFilter, setViewFilter] = useState<ViewFilter>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
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
      <main className="min-h-screen bg-[var(--color-bg-primary)] px-4 py-8 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-accent)]/10 mb-4">
              <CalendarIcon className="w-8 h-8 text-[var(--color-accent)]" />
            </div>
            <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
              Gaming Calendar
            </h1>
            <p className="text-[var(--color-text-muted)]">
              Schedule and join gaming sessions with friends
            </p>
          </div>
          <LoginPrompt feature="the gaming calendar" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] px-4 py-8 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
              Calendar
            </h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              Plan and join gaming sessions
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-accent)] text-white font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Event</span>
          </button>
        </div>

        {/* Invitations Banner */}
        {invitations && invitations.length > 0 && (
          <InvitationsBanner invitations={invitations} />
        )}

        {/* View Filter */}
        <div className="flex gap-2 mb-6 p-1 bg-[var(--color-bg-secondary)] rounded-xl">
          <FilterButton
            active={viewFilter === 'all'}
            onClick={() => setViewFilter('all')}
            icon={<Globe className="w-4 h-4" />}
            label="All"
          />
          <FilterButton
            active={viewFilter === 'friends'}
            onClick={() => setViewFilter('friends')}
            icon={<Users className="w-4 h-4" />}
            label="Friends"
          />
          <FilterButton
            active={viewFilter === 'mine'}
            onClick={() => setViewFilter('mine')}
            icon={<User className="w-4 h-4" />}
            label="Mine"
          />
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-medium text-[var(--color-text-primary)]">
            {selectedDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[var(--color-accent)] animate-spin" />
          </div>
        )}

        {/* Events List */}
        {!isLoading && (
          <div className="space-y-6">
            {/* Upcoming Section */}
            {upcomingEvents.length > 0 && (
              <section>
                <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-3">
                  Upcoming This Week
                </h3>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>
            )}

            {/* Mini Calendar / Date Groups */}
            <section>
              <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-3">
                All Events
              </h3>
              {Object.keys(eventsByDate).length === 0 ? (
                <EmptyState viewFilter={viewFilter} onCreateClick={() => setShowCreateModal(true)} />
              ) : (
                <div className="space-y-4">
                  {Object.entries(eventsByDate)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([dateKey, dayEvents]) => (
                      <div key={dateKey}>
                        <h4 className="text-xs font-medium text-[var(--color-text-muted)] mb-2 uppercase">
                          {formatDateHeader(dateKey)}
                        </h4>
                        <div className="space-y-2">
                          {dayEvents.map((event) => (
                            <EventCard key={event.id} event={event} compact />
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Create Event Modal */}
        {showCreateModal && (
          <CreateEventModal onClose={() => setShowCreateModal(false)} />
        )}
      </div>
    </main>
  );
}

function FilterButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg
        font-medium text-sm transition-colors
        ${active
          ? 'bg-[var(--color-accent)] text-white'
          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

function InvitationsBanner({ invitations }: { invitations: CalendarInvitation[] }) {
  const [expanded, setExpanded] = useState(false);
  const respondToInvitation = useRespondToCalendarInvitation();

  return (
    <div className="mb-6 p-4 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-[var(--color-accent)]" />
          <span className="font-medium text-[var(--color-text-primary)]">
            {invitations.length} pending invitation{invitations.length > 1 ? 's' : ''}
          </span>
        </div>
        <ChevronRight className={`w-5 h-5 text-[var(--color-text-muted)] transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>

      {expanded && (
        <div className="mt-4 space-y-3">
          {invitations.map((inv) => (
            <div
              key={inv.invitationId}
              className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-bg-secondary)]"
            >
              <div className="min-w-0">
                <p className="font-medium text-[var(--color-text-primary)] truncate">
                  {inv.event.title}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {inv.invitedBy?.displayName && `From ${inv.invitedBy.displayName} • `}
                  {new Date(inv.event.startTime).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => respondToInvitation.mutate({ id: inv.invitationId, accept: true })}
                  disabled={respondToInvitation.isPending}
                  className="p-2 rounded-lg text-green-500 hover:bg-green-500/10"
                  aria-label={`Accept invitation to ${inv.event.title}`}
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={() => respondToInvitation.mutate({ id: inv.invitationId, accept: false })}
                  disabled={respondToInvitation.isPending}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-500/10"
                  aria-label={`Decline invitation to ${inv.event.title}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ viewFilter, onCreateClick }: { viewFilter: ViewFilter; onCreateClick: () => void }) {
  const messages = {
    all: 'No events scheduled yet',
    friends: 'No events from friends',
    mine: 'You haven\'t created any events',
  };

  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] mb-4">
        <CalendarIcon className="w-8 h-8" />
      </div>
      <h3 className="font-medium text-[var(--color-text-primary)] mb-1">
        {messages[viewFilter]}
      </h3>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">
        Create an event to start planning gaming sessions
      </p>
      <button
        onClick={onCreateClick}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-accent)] text-white font-medium hover:opacity-90"
      >
        <Plus className="w-4 h-4" />
        Create Event
      </button>
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
