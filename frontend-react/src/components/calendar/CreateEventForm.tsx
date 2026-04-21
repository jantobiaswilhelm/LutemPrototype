import { useState } from 'react';
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

const FIELD_INPUT_CLASS =
  'w-full py-2 px-0 bg-transparent font-serif text-[1rem] leading-snug focus:outline-none';

function fieldInputStyle(error = false): React.CSSProperties {
  return {
    border: 'none',
    borderBottom: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border-strong)'}`,
    color: 'var(--color-text-primary)',
    borderRadius: 0,
  };
}

// Native select with editorial closed-state: strip default chrome, add a small mono chevron.
const SELECT_CLASS =
  'w-full py-2 pr-8 pl-0 bg-transparent focus:outline-none appearance-none';

function selectStyle(error = false): React.CSSProperties {
  return {
    ...fieldInputStyle(error),
    backgroundImage:
      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' stroke='currentColor' stroke-width='1' fill='none' stroke-linecap='square'/></svg>\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 2px center',
    backgroundSize: '10px 6px',
  };
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
      // Compute endTime (1 hour after startTime) if not set
      const payload = { ...form };
      if (!payload.endTime && payload.startTime) {
        const start = new Date(payload.startTime);
        start.setHours(start.getHours() + 1);
        payload.endTime = start.toISOString().slice(0, 16);
      }
      await createEvent.mutateAsync(payload);
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
    <div
      className="py-6 px-0"
      style={{
        borderTop: '1px solid var(--color-border-strong)',
        borderBottom: '1px solid var(--color-border-strong)',
      }}
    >
      {/* ─── header ─── */}
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <div
          className="flex items-center gap-3 font-mono text-[0.68rem] tracking-[0.28em] uppercase"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <span
            className="inline-block w-5 h-px"
            style={{ background: 'var(--color-accent)' }}
            aria-hidden="true"
          />
          § {compact ? 'Schedule for later' : 'Propose a session'}
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="cef-cancel font-mono text-[0.62rem] tracking-[0.22em] uppercase bg-transparent border-0 p-0 pb-0.5 cursor-pointer transition-colors duration-300"
            style={{
              color: 'var(--color-text-muted)',
              borderBottom: '1px solid var(--color-border)',
            }}
            aria-label="Cancel"
          >
            Dismiss
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            className="block font-mono text-[0.62rem] tracking-[0.22em] uppercase mb-2"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder={compact ? 'Session name…' : 'Gaming session…'}
            required
            className={FIELD_INPUT_CLASS}
            style={fieldInputStyle()}
          />
        </div>

        {/* Full mode: Type & Visibility side by side */}
        {!compact && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                className="block font-mono text-[0.62rem] tracking-[0.22em] uppercase mb-2"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as EventType })}
                className={SELECT_CLASS + ' font-mono text-[0.85rem] tracking-[0.06em]'}
                style={selectStyle()}
              >
                <option value="GAME">Game</option>
                <option value="REMINDER">Reminder</option>
                <option value="TASK">Task</option>
              </select>
            </div>

            <div>
              <label
                className="block font-mono text-[0.62rem] tracking-[0.22em] uppercase mb-2"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Visibility
              </label>
              <select
                value={form.visibility}
                onChange={(e) => setForm({ ...form, visibility: e.target.value as EventVisibility })}
                className={SELECT_CLASS + ' font-mono text-[0.85rem] tracking-[0.06em]'}
                style={selectStyle()}
              >
                <option value="PRIVATE">Private</option>
                <option value="FRIENDS_ONLY">Friends Only</option>
                <option value="PUBLIC">Public</option>
              </select>
            </div>
          </div>
        )}

        {/* Full mode: Game selection */}
        {!compact && !defaultGameId && form.type === 'GAME' && games && games.length > 0 && (
          <div>
            <label
              className="block font-mono text-[0.62rem] tracking-[0.22em] uppercase mb-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Game <span className="opacity-60">— optional</span>
            </label>
            <select
              value={form.gameId || ''}
              onChange={(e) => setForm({ ...form, gameId: e.target.value ? Number(e.target.value) : undefined })}
              className={SELECT_CLASS + ' font-serif italic text-[0.95rem]'}
              style={selectStyle()}
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

        {/* Date/Time + Visibility */}
        {compact ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                className="block font-mono text-[0.62rem] tracking-[0.22em] uppercase mb-2"
                style={{ color: 'var(--color-text-muted)' }}
              >
                When
              </label>
              <input
                type="datetime-local"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                required
                className={FIELD_INPUT_CLASS + ' font-mono text-[0.9rem] tracking-[0.04em]'}
                style={fieldInputStyle()}
              />
            </div>
            <div>
              <label
                className="block font-mono text-[0.62rem] tracking-[0.22em] uppercase mb-2"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Visibility
              </label>
              <div className="flex items-center gap-5 pb-1" style={{ borderBottom: '1px solid var(--color-border-strong)' }}>
                {visibilityOptions.map((opt) => {
                  const active = form.visibility === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm({ ...form, visibility: opt.value })}
                      className="font-serif text-[0.95rem] leading-none bg-transparent border-0 p-0 cursor-pointer transition-colors duration-300"
                      style={{
                        color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                        fontStyle: active ? 'italic' : 'normal',
                        fontWeight: active ? 500 : 400,
                      }}
                      aria-pressed={active}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label
              className="block font-mono text-[0.62rem] tracking-[0.22em] uppercase mb-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              When
            </label>
            <input
              type="datetime-local"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              required
              className={FIELD_INPUT_CLASS + ' font-mono text-[0.9rem] tracking-[0.04em]'}
              style={fieldInputStyle()}
            />
          </div>
        )}

        {/* Full mode: Max Participants */}
        {!compact && form.visibility !== 'PRIVATE' && form.type === 'GAME' && (
          <div>
            <label
              className="block font-mono text-[0.62rem] tracking-[0.22em] uppercase mb-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Max participants <span className="opacity-60">— optional</span>
            </label>
            <input
              type="number"
              min="2"
              max="100"
              value={form.maxParticipants || ''}
              onChange={(e) =>
                setForm({ ...form, maxParticipants: e.target.value ? Number(e.target.value) : undefined })
              }
              placeholder="No limit"
              className={FIELD_INPUT_CLASS + ' font-mono text-[0.9rem]'}
              style={fieldInputStyle()}
            />
          </div>
        )}

        {/* Full mode: Description */}
        {!compact && (
          <div>
            <label
              className="block font-mono text-[0.62rem] tracking-[0.22em] uppercase mb-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              A note <span className="opacity-60">— optional</span>
            </label>
            <textarea
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What's the plan?"
              rows={2}
              className={FIELD_INPUT_CLASS + ' font-serif italic text-[0.98rem] resize-none'}
              style={fieldInputStyle()}
            />
          </div>
        )}

        {/* ─── actions ─── */}
        <div
          className="flex items-baseline gap-6 flex-wrap pt-2"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <button
            type="submit"
            disabled={createEvent.isPending || !form.title}
            className="cef-submit relative font-serif italic font-medium text-[1.2rem] inline-flex items-baseline gap-2 bg-transparent border-0 p-0 pt-4 pb-1.5 cursor-pointer transition-[letter-spacing] duration-500 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ color: 'var(--color-accent)' }}
          >
            {createEvent.isPending ? 'Proposing…' : (compact ? 'Add to calendar' : 'Propose')}
            <span aria-hidden="true" className="cef-arrow font-sans not-italic transition-transform duration-500">&rarr;</span>
            <span
              aria-hidden="true"
              className="cef-underline absolute left-0 bottom-0 h-px transition-[right] duration-[600ms]"
              style={{ background: 'var(--color-accent)', right: '30%' }}
            />
          </button>
        </div>
      </form>

      <style>{`
        .cef-submit:hover:not(:disabled) { letter-spacing: 0.03em; }
        .cef-submit:hover:not(:disabled) .cef-underline { right: 0 !important; }
        .cef-submit:hover:not(:disabled) .cef-arrow { transform: translateX(0.35rem); }
        .cef-cancel:hover {
          color: var(--color-error);
          border-bottom-color: var(--color-error);
        }
      `}</style>
    </div>
  );
}
