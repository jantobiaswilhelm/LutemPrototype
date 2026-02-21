import { useState } from 'react';
import { CalendarPlus, Loader2, X } from 'lucide-react';
import { useCreateCalendarEvent, useGames } from '@/api/hooks';
import type { CreateEventRequest, EventVisibility, EventType } from '@/types';

function getDefaultDateTime(): string {
  const now = new Date();
  now.setHours(now.getHours() + 1, 0, 0, 0);
  return now.toISOString().slice(0, 16);
}

interface CreateEventFormProps {
  /** Called after successful creation */
  onSuccess?: () => void;
  /** Called when user cancels */
  onCancel?: () => void;
  /** Pre-fill with a specific game */
  defaultGameId?: number;
  /** Pre-fill the title */
  defaultGameName?: string;
  /** Compact mode: fewer fields, used from Home page */
  compact?: boolean;
}

export function CreateEventForm({
  onSuccess,
  onCancel,
  defaultGameId,
  defaultGameName,
  compact = false,
}: CreateEventFormProps) {
  const createEvent = useCreateCalendarEvent();
  const { data: games } = useGames();

  const [form, setForm] = useState<CreateEventRequest>({
    title: defaultGameName ? `Playing ${defaultGameName}` : '',
    startTime: getDefaultDateTime(),
    type: defaultGameId ? 'GAME' : 'GAME',
    gameId: defaultGameId,
    visibility: 'FRIENDS_ONLY',
    maxParticipants: undefined,
    description: undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEvent.mutateAsync(form);
      const { useToastStore } = await import('@/stores/toastStore');
      useToastStore.getState().addToast('Event added to calendar', 'success');
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create event:', error);
      const { useToastStore } = await import('@/stores/toastStore');
      useToastStore.getState().addToast('Failed to create event', 'error');
    }
  };

  const visibilityOptions: { value: EventVisibility; label: string }[] = [
    { value: 'PRIVATE', label: 'Private' },
    { value: 'FRIENDS_ONLY', label: 'Friends' },
    { value: 'PUBLIC', label: 'Public' },
  ];

  return (
    <div className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
          <CalendarPlus className="w-4 h-4 text-[var(--color-accent)]" />
          {compact ? 'Schedule for Later' : 'New Event'}
        </h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-tertiary)]"
            aria-label="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
            Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder={compact ? 'Session name...' : 'Gaming session...'}
            required
            className="
              w-full px-3 py-2 rounded-lg text-sm
              bg-[var(--color-bg-primary)] border border-[var(--color-border)]
              text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]
              focus:outline-none focus:border-[var(--color-accent)]
            "
          />
        </div>

        {/* Full mode: Type & Visibility side by side */}
        {!compact && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as EventType })}
                className="
                  w-full px-3 py-2 rounded-lg text-sm
                  bg-[var(--color-bg-primary)] border border-[var(--color-border)]
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
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
                Visibility
              </label>
              <select
                value={form.visibility}
                onChange={(e) => setForm({ ...form, visibility: e.target.value as EventVisibility })}
                className="
                  w-full px-3 py-2 rounded-lg text-sm
                  bg-[var(--color-bg-primary)] border border-[var(--color-border)]
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
        )}

        {/* Full mode: Game selection (when type is GAME and no default) */}
        {!compact && !defaultGameId && form.type === 'GAME' && games && games.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
              Game (optional)
            </label>
            <select
              value={form.gameId || ''}
              onChange={(e) => setForm({ ...form, gameId: e.target.value ? Number(e.target.value) : undefined })}
              className="
                w-full px-3 py-2 rounded-lg text-sm
                bg-[var(--color-bg-primary)] border border-[var(--color-border)]
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

        {/* Date/Time + Visibility (compact: side by side) */}
        {compact ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
                When
              </label>
              <input
                type="datetime-local"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                required
                className="
                  w-full px-3 py-2 rounded-lg text-sm
                  bg-[var(--color-bg-primary)] border border-[var(--color-border)]
                  text-[var(--color-text-primary)]
                  focus:outline-none focus:border-[var(--color-accent)]
                "
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
                Visibility
              </label>
              <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden">
                {visibilityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, visibility: opt.value })}
                    className={`
                      flex-1 py-2 text-xs font-medium transition-colors
                      ${form.visibility === opt.value
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'bg-[var(--color-bg-primary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                      }
                    `}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
              When
            </label>
            <input
              type="datetime-local"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              required
              className="
                w-full px-3 py-2 rounded-lg text-sm
                bg-[var(--color-bg-primary)] border border-[var(--color-border)]
                text-[var(--color-text-primary)]
                focus:outline-none focus:border-[var(--color-accent)]
              "
            />
          </div>
        )}

        {/* Full mode: Max Participants */}
        {!compact && form.visibility !== 'PRIVATE' && form.type === 'GAME' && (
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
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
                w-full px-3 py-2 rounded-lg text-sm
                bg-[var(--color-bg-primary)] border border-[var(--color-border)]
                text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]
                focus:outline-none focus:border-[var(--color-accent)]
              "
            />
          </div>
        )}

        {/* Full mode: Description */}
        {!compact && (
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
              Description (optional)
            </label>
            <textarea
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What's the plan?"
              rows={2}
              className="
                w-full px-3 py-2 rounded-lg text-sm
                bg-[var(--color-bg-primary)] border border-[var(--color-border)]
                text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]
                focus:outline-none focus:border-[var(--color-accent)]
                resize-none
              "
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={createEvent.isPending || !form.title}
          className="
            w-full py-2.5 rounded-lg text-sm
            bg-[var(--color-accent)] text-white font-medium
            hover:bg-[var(--color-accent-hover)] transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          "
        >
          {createEvent.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <CalendarPlus className="w-4 h-4" />
              {compact ? 'Add to Calendar' : 'Create Event'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
