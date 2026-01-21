import { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Users,
  User,
  Globe,
  Lock,
  UserPlus,
  LogOut,
  Loader2,
  Clock,
  Gamepad2,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { LoginPrompt } from '@/components/LoginPrompt';
import { useAuthStore } from '@/stores/authStore';
import {
  useCalendarEvents,
  useCalendarInvitations,
  useCreateCalendarEvent,
  useJoinCalendarEvent,
  useLeaveCalendarEvent,
  useRespondToCalendarInvitation,
  useDeleteCalendarEvent,
  useGames,
} from '@/api/hooks';
import type { CalendarEvent, CreateEventRequest, EventVisibility, EventType, CalendarInvitation } from '@/types';

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
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-medium text-[var(--color-text-primary)]">
            {selectedDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]"
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
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={() => respondToInvitation.mutate({ id: inv.invitationId, accept: false })}
                  disabled={respondToInvitation.isPending}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-500/10"
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

function EventCard({ event, compact = false }: { event: CalendarEvent; compact?: boolean }) {
  const joinEvent = useJoinCalendarEvent();
  const leaveEvent = useLeaveCalendarEvent();
  const deleteEvent = useDeleteCalendarEvent();

  const eventDate = new Date(event.startTime);
  const timeStr = eventDate.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  const VisibilityIcon = event.visibility === 'PUBLIC'
    ? Globe
    : event.visibility === 'FRIENDS_ONLY'
    ? Users
    : Lock;

  return (
    <div className={`
      rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]
      ${compact ? 'p-3' : 'p-4'}
    `}>
      <div className="flex items-start gap-3">
        {/* Type Icon */}
        <div className={`
          rounded-lg flex items-center justify-center flex-shrink-0
          ${event.type === 'GAME' ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]'}
          ${compact ? 'w-10 h-10' : 'w-12 h-12'}
        `}>
          {event.type === 'GAME' ? (
            <Gamepad2 className={compact ? 'w-5 h-5' : 'w-6 h-6'} />
          ) : (
            <CalendarIcon className={compact ? 'w-5 h-5' : 'w-6 h-6'} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className={`font-medium text-[var(--color-text-primary)] truncate ${compact ? 'text-sm' : ''}`}>
                {event.title}
              </h4>
              {event.gameName && (
                <p className="text-xs text-[var(--color-accent)]">{event.gameName}</p>
              )}
            </div>
            <VisibilityIcon className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0" />
          </div>

          <div className="flex items-center gap-3 mt-1 text-xs text-[var(--color-text-muted)]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeStr}
            </span>
            {event.owner && !event.isOwner && (
              <span className="truncate">by {event.owner.displayName}</span>
            )}
            {event.participantCount > 0 && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {event.participantCount}
                {event.maxParticipants && `/${event.maxParticipants}`}
              </span>
            )}
          </div>

          {/* Actions */}
          {!compact && (
            <div className="flex items-center gap-2 mt-3">
              {event.isOwner ? (
                <button
                  onClick={() => {
                    if (confirm('Delete this event?')) {
                      deleteEvent.mutate(event.id);
                    }
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-500/10"
                >
                  Delete
                </button>
              ) : event.hasJoined ? (
                <button
                  onClick={() => leaveEvent.mutate(event.id)}
                  disabled={leaveEvent.isPending}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-tertiary)]"
                >
                  <LogOut className="w-3 h-3" />
                  Leave
                </button>
              ) : event.canJoin ? (
                <button
                  onClick={() => joinEvent.mutate(event.id)}
                  disabled={joinEvent.isPending}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-[var(--color-accent)] text-white hover:opacity-90"
                >
                  <UserPlus className="w-3 h-3" />
                  Join
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
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

function CreateEventModal({ onClose }: { onClose: () => void }) {
  const createEvent = useCreateCalendarEvent();
  const { data: games } = useGames();

  const [form, setForm] = useState<CreateEventRequest>({
    title: '',
    startTime: getDefaultDateTime(),
    type: 'GAME',
    visibility: 'FRIENDS_ONLY',
    maxParticipants: undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEvent.mutateAsync(form);
      onClose();
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[var(--color-bg-primary)] rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            New Event
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Gaming session..."
              required
              className="
                w-full px-4 py-2.5 rounded-xl
                bg-[var(--color-bg-secondary)] border border-[var(--color-border)]
                text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]
                focus:outline-none focus:border-[var(--color-accent)]
              "
            />
          </div>

          {/* Type & Game */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as EventType })}
                className="
                  w-full px-4 py-2.5 rounded-xl
                  bg-[var(--color-bg-secondary)] border border-[var(--color-border)]
                  text-[var(--color-text-primary)]
                  focus:outline-none focus:border-[var(--color-accent)]
                "
              >
                <option value="GAME">Game</option>
                <option value="REMINDER">Reminder</option>
                <option value="TASK">Task</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Visibility
              </label>
              <select
                value={form.visibility}
                onChange={(e) => setForm({ ...form, visibility: e.target.value as EventVisibility })}
                className="
                  w-full px-4 py-2.5 rounded-xl
                  bg-[var(--color-bg-secondary)] border border-[var(--color-border)]
                  text-[var(--color-text-primary)]
                  focus:outline-none focus:border-[var(--color-accent)]
                "
              >
                <option value="PRIVATE">Private</option>
                <option value="FRIENDS_ONLY">Friends Only</option>
                <option value="PUBLIC">Public</option>
              </select>
            </div>
          </div>

          {/* Game Selection (if type is GAME) */}
          {form.type === 'GAME' && games && games.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Game (optional)
              </label>
              <select
                value={form.gameId || ''}
                onChange={(e) => setForm({ ...form, gameId: e.target.value ? Number(e.target.value) : undefined })}
                className="
                  w-full px-4 py-2.5 rounded-xl
                  bg-[var(--color-bg-secondary)] border border-[var(--color-border)]
                  text-[var(--color-text-primary)]
                  focus:outline-none focus:border-[var(--color-accent)]
                "
              >
                <option value="">Select a game</option>
                {games.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date/Time */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              When
            </label>
            <input
              type="datetime-local"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              required
              className="
                w-full px-4 py-2.5 rounded-xl
                bg-[var(--color-bg-secondary)] border border-[var(--color-border)]
                text-[var(--color-text-primary)]
                focus:outline-none focus:border-[var(--color-accent)]
              "
            />
          </div>

          {/* Max Participants */}
          {form.visibility !== 'PRIVATE' && form.type === 'GAME' && (
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Max Participants (optional)
              </label>
              <input
                type="number"
                min="2"
                max="100"
                value={form.maxParticipants || ''}
                onChange={(e) => setForm({ ...form, maxParticipants: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="No limit"
                className="
                  w-full px-4 py-2.5 rounded-xl
                  bg-[var(--color-bg-secondary)] border border-[var(--color-border)]
                  text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]
                  focus:outline-none focus:border-[var(--color-accent)]
                "
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Description (optional)
            </label>
            <textarea
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What's the plan?"
              rows={3}
              className="
                w-full px-4 py-2.5 rounded-xl
                bg-[var(--color-bg-secondary)] border border-[var(--color-border)]
                text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]
                focus:outline-none focus:border-[var(--color-accent)]
                resize-none
              "
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={createEvent.isPending || !form.title}
            className="
              w-full py-3 rounded-xl
              bg-[var(--color-accent)] text-white font-medium
              hover:opacity-90 transition-opacity
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2
            "
          >
            {createEvent.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Create Event
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function getDefaultDateTime(): string {
  const now = new Date();
  now.setHours(now.getHours() + 1, 0, 0, 0);
  return now.toISOString().slice(0, 16);
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
