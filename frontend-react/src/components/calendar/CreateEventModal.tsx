import { useState, useEffect } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import { useCreateCalendarEvent, useGames } from '@/api/hooks';
import type { CreateEventRequest, EventVisibility, EventType } from '@/types';

function getDefaultDateTime(): string {
  const now = new Date();
  now.setHours(now.getHours() + 1, 0, 0, 0);
  return now.toISOString().slice(0, 16);
}

export function CreateEventModal({ onClose }: { onClose: () => void }) {
  const createEvent = useCreateCalendarEvent();
  const { data: games } = useGames();

  const [form, setForm] = useState<CreateEventRequest>({
    title: '',
    startTime: getDefaultDateTime(),
    type: 'GAME',
    visibility: 'FRIENDS_ONLY',
    maxParticipants: undefined,
  });

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Create new event">
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
