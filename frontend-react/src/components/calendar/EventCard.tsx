import {
  useJoinCalendarEvent,
  useLeaveCalendarEvent,
  useDeleteCalendarEvent,
} from '@/api/hooks';
import type { CalendarEvent } from '@/types';

function formatDatePieces(d: Date) {
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleDateString(undefined, { month: 'short' }).toLowerCase();
  const weekday = d.toLocaleDateString(undefined, { weekday: 'short' }).toLowerCase();
  return { day, month, weekday };
}

export function EventCard({ event, compact = false }: { event: CalendarEvent; compact?: boolean }) {
  const joinEvent = useJoinCalendarEvent();
  const leaveEvent = useLeaveCalendarEvent();
  const deleteEvent = useDeleteCalendarEvent();

  const eventDate = new Date(event.startTime);
  const { day, month, weekday } = formatDatePieces(eventDate);
  const timeStr = eventDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const visibilityLabel =
    event.visibility === 'PUBLIC' ? 'public' :
    event.visibility === 'FRIENDS_ONLY' ? 'friends' :
    'private';

  const typeGlyph = event.type === 'GAME' ? '◉' : '§';

  return (
    <div
      className="event-card grid grid-cols-[auto_1fr_auto] gap-5 items-baseline py-4 px-3 -mx-3 transition-colors duration-300"
      style={{ borderTop: '1px solid var(--color-border)' }}
    >
      {/* Date pillar */}
      <div className="min-w-[3.25rem] text-left">
        <div
          className="font-serif text-[1.6rem] leading-none tabular-nums"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {day}
        </div>
        <div
          className="font-mono text-[0.6rem] tracking-[0.22em] uppercase mt-1"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {month} &middot; {weekday}
        </div>
      </div>

      {/* Title + note + game */}
      <div className="min-w-0">
        <div className="flex items-baseline gap-2.5">
          <span
            className="font-mono text-[0.72rem] leading-none shrink-0"
            style={{ color: 'var(--color-accent)' }}
            aria-hidden="true"
          >
            {typeGlyph}
          </span>
          <h4
            className={`font-serif ${compact ? 'text-[1rem]' : 'text-[1.15rem]'} leading-tight truncate`}
            style={{ color: 'var(--color-text-primary)' }}
          >
            {event.title}
          </h4>
        </div>

        {event.gameName && (
          <div
            className="font-serif italic text-[0.85rem] leading-snug mt-1 pl-[1.1rem]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {event.gameName}
          </div>
        )}

        {event.owner && !event.isOwner && (
          <div
            className="font-mono text-[0.62rem] tracking-[0.14em] uppercase mt-1.5 pl-[1.1rem]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            by {event.owner.displayName}
          </div>
        )}

        {/* Actions */}
        {!compact && (
          <div className="flex items-center gap-5 mt-3 pl-[1.1rem]">
            {event.isOwner ? (
              <button
                onClick={() => {
                  if (confirm('Delete this event?')) {
                    deleteEvent.mutate(event.id);
                  }
                }}
                className="event-action-delete font-mono text-[0.62rem] tracking-[0.22em] uppercase bg-transparent border-0 p-0 pb-0.5 cursor-pointer transition-colors duration-300"
                style={{
                  color: 'var(--color-text-muted)',
                  borderBottom: '1px solid var(--color-border)',
                }}
                aria-label={`Delete event: ${event.title}`}
              >
                Delete
              </button>
            ) : event.hasJoined ? (
              <button
                onClick={() => leaveEvent.mutate(event.id)}
                disabled={leaveEvent.isPending}
                className="event-action-leave font-mono text-[0.62rem] tracking-[0.22em] uppercase bg-transparent border-0 p-0 pb-0.5 cursor-pointer transition-colors duration-300"
                style={{
                  color: 'var(--color-text-muted)',
                  borderBottom: '1px solid var(--color-border)',
                }}
                aria-label={`Leave event: ${event.title}`}
              >
                Leave
              </button>
            ) : event.canJoin ? (
              <button
                onClick={() => joinEvent.mutate(event.id)}
                disabled={joinEvent.isPending}
                className="event-action-join relative font-serif italic font-medium text-[0.95rem] inline-flex items-baseline gap-1.5 bg-transparent border-0 p-0 pb-0.5 cursor-pointer transition-[letter-spacing] duration-300"
                style={{ color: 'var(--color-accent)' }}
                aria-label={`Join event: ${event.title}`}
              >
                Join
                <span aria-hidden="true">&rarr;</span>
                <span
                  aria-hidden="true"
                  className="event-join-underline absolute left-0 bottom-0 h-px transition-[right] duration-[500ms]"
                  style={{ background: 'var(--color-accent)', right: '30%' }}
                />
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* Time + participants */}
      <div className="text-right shrink-0">
        <div
          className="font-mono text-[0.82rem] tracking-[0.06em] tabular-nums"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {timeStr}
        </div>
        <div
          className="font-mono text-[0.6rem] tracking-[0.18em] uppercase mt-1"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {event.participantCount > 0 ? (
            <>
              {event.participantCount}
              {event.maxParticipants ? `/${event.maxParticipants}` : ''} &middot; {visibilityLabel}
            </>
          ) : (
            visibilityLabel
          )}
        </div>
      </div>

      <style>{`
        .event-card:hover {
          background: var(--color-bg-secondary);
        }
        .event-action-delete:hover,
        .event-action-leave:hover {
          color: var(--color-error);
          border-bottom-color: var(--color-error);
        }
        .event-action-join:hover {
          letter-spacing: 0.03em;
        }
        .event-action-join:hover .event-join-underline {
          right: 0 !important;
        }
      `}</style>
    </div>
  );
}
