import {
  Calendar as CalendarIcon,
  Users,
  Globe,
  Lock,
  UserPlus,
  LogOut,
  Clock,
  Gamepad2,
} from 'lucide-react';
import {
  useJoinCalendarEvent,
  useLeaveCalendarEvent,
  useDeleteCalendarEvent,
} from '@/api/hooks';
import type { CalendarEvent } from '@/types';

export function EventCard({ event, compact = false }: { event: CalendarEvent; compact?: boolean }) {
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
                  aria-label={`Delete event: ${event.title}`}
                >
                  Delete
                </button>
              ) : event.hasJoined ? (
                <button
                  onClick={() => leaveEvent.mutate(event.id)}
                  disabled={leaveEvent.isPending}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-tertiary)]"
                  aria-label={`Leave event: ${event.title}`}
                >
                  <LogOut className="w-3 h-3" />
                  Leave
                </button>
              ) : event.canJoin ? (
                <button
                  onClick={() => joinEvent.mutate(event.id)}
                  disabled={joinEvent.isPending}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-[var(--color-accent)] text-white hover:opacity-90"
                  aria-label={`Join event: ${event.title}`}
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
