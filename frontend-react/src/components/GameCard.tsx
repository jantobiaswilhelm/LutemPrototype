import { memo } from 'react';
import { EMOTIONAL_GOALS, ENERGY_LEVELS } from '@/types';
import type { Game } from '@/types';

function canLaunchGame(game: Game): boolean {
  return !!game.steamAppId || !!game.storeUrl;
}

function getButtonText(game: Game): string {
  if (game.steamAppId) return 'Begin the session';
  if (game.storeUrl) return 'Open the store page';
  return 'Begin the session';
}

// Render a 1-5 rating as typographic dots (●●●○○)
function RatingDots({ value, total = 5 }: { value: number; total?: number }) {
  const filled = Math.max(0, Math.min(total, Math.round(value)));
  return (
    <span className="rating-dots font-serif tracking-[0.38em] text-[0.85rem]">
      <span style={{ color: 'var(--color-accent)' }}>{'●'.repeat(filled)}</span>
      <span style={{ color: 'var(--color-text-muted)', opacity: 0.45 }}>{'●'.repeat(total - filled)}</span>
    </span>
  );
}

interface GameCardProps {
  game: Game;
  reason?: string;
  showDetails?: boolean;
  onStart?: () => void;
  onSchedule?: () => void;
}

export const GameCard = memo(function GameCard({ game, reason, showDetails = true, onStart, onSchedule }: GameCardProps) {
  const canLaunch = canLaunchGame(game);
  const energyLabel = ENERGY_LEVELS[game.energyRequired]?.displayName || game.energyRequired;
  const goals = (game.emotionalGoals || []).slice(0, 3).map(
    (g) => EMOTIONAL_GOALS[g]?.displayName || g
  );
  const primaryGenre = game.genres?.[0];

  return (
    <article className="grid grid-cols-1 md:grid-cols-[1fr_1.15fr] gap-8 md:gap-12 items-start pb-4">

      {/* ── cover block ────────────────────────────────────── */}
      <div className="relative">
        {/* SELECTED seal */}
        <div
          className="absolute -top-3 -right-3 w-[4.75rem] h-[4.75rem] grid place-items-center z-10 -rotate-[4deg] pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: '2px solid var(--color-accent)',
              background: 'var(--color-bg-primary)',
            }}
          />
          <div className="relative text-center leading-none" style={{ color: 'var(--color-accent)' }}>
            <div className="font-serif italic text-[0.56rem] tracking-[0.18em] uppercase mb-1">Lutem</div>
            <div className="font-serif font-medium text-[0.95rem] tracking-[0.08em] uppercase">selected</div>
            <div className="font-mono text-[0.5rem] tracking-[0.15em] uppercase mt-1 opacity-80">no. tonight</div>
          </div>
        </div>

        <div
          className="relative overflow-hidden aspect-[600/900]"
          style={{
            background: 'var(--color-text-primary)',
            border: '1px solid var(--color-border-strong)',
          }}
        >
          {game.imageUrl && (
            <img
              src={game.imageUrl}
              alt={`${game.name} cover art`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              style={{ filter: 'contrast(1.05) saturate(0.9)' }}
            />
          )}
          {/* noise overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='1.3' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .14 0'/></filter><rect width='100%' height='100%' filter='url(%23g)'/></svg>\")",
              mixBlendMode: 'soft-light',
            }}
          />
        </div>

        {/* gallery-label caption */}
        <div
          className="mt-3 pt-3 grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 font-mono text-[0.72rem] tracking-wide"
          style={{
            borderTop: '1px solid var(--color-border)',
            color: 'var(--color-text-secondary)',
          }}
        >
          <div>
            <div className="font-serif font-medium text-[0.95rem]" style={{ color: 'var(--color-text-primary)' }}>
              {game.name}
            </div>
            {primaryGenre && (
              <div className="font-serif italic text-[0.82rem]" style={{ color: 'var(--color-text-secondary)' }}>
                {primaryGenre}
              </div>
            )}
          </div>
          <div className="text-right" style={{ color: 'var(--color-text-muted)' }}>
            <div>{game.minMinutes}&ndash;{game.maxMinutes} min</div>
            <div>{energyLabel.toLowerCase()}</div>
          </div>
        </div>
      </div>

      {/* ── editorial column ───────────────────────────────── */}
      <div className="pt-1 max-w-[38rem]">
        <div
          className="flex items-center gap-3 mb-6 font-mono text-[0.68rem] tracking-[0.28em] uppercase"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <span className="inline-block w-7 h-px" style={{ background: 'var(--color-accent)' }} />
          For tonight
        </div>

        <h1
          className="font-serif text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] tracking-[-0.016em] mb-5"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {game.name}
        </h1>

        {(reason || game.description) && (
          <p
            className="font-serif italic text-[clamp(1.05rem,1.4vw,1.2rem)] leading-[1.48] mb-8 max-w-[34ch]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {reason || game.description}
          </p>
        )}

        {showDetails && (
          <ul className="list-none p-0 mb-10 m-0" style={{ borderTop: '1px solid var(--color-border)' }}>
            <li
              className="grid grid-cols-[7.5rem_1fr] gap-6 py-3 items-baseline"
              style={{ borderBottom: '1px solid var(--color-border)' }}
            >
              <span
                className="font-mono text-[0.68rem] uppercase tracking-[0.2em]"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Session
              </span>
              <span className="font-serif text-[1.05rem]" style={{ color: 'var(--color-text-primary)' }}>
                {game.minMinutes}&ndash;{game.maxMinutes}&thinsp;min
              </span>
            </li>

            <li
              className="grid grid-cols-[7.5rem_1fr] gap-6 py-3 items-baseline"
              style={{ borderBottom: '1px solid var(--color-border)' }}
            >
              <span
                className="font-mono text-[0.68rem] uppercase tracking-[0.2em]"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Energy
              </span>
              <span className="font-serif text-[1.05rem]" style={{ color: 'var(--color-text-primary)' }}>
                {energyLabel.toLowerCase()}
              </span>
            </li>

            {goals.length > 0 && (
              <li
                className="grid grid-cols-[7.5rem_1fr] gap-6 py-3 items-baseline"
                style={{ borderBottom: '1px solid var(--color-border)' }}
              >
                <span
                  className="font-mono text-[0.68rem] uppercase tracking-[0.2em]"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Register
                </span>
                <span className="font-serif text-[1.05rem]" style={{ color: 'var(--color-text-primary)' }}>
                  {goals.map((g) => g.toLowerCase()).join(' · ')}
                </span>
              </li>
            )}

            {typeof game.averageSatisfaction === 'number' && (
              <li
                className="grid grid-cols-[7.5rem_1fr] gap-6 py-3 items-baseline"
                style={{ borderBottom: '1px solid var(--color-border)' }}
              >
                <span
                  className="font-mono text-[0.68rem] uppercase tracking-[0.2em]"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Fit
                </span>
                <span className="font-serif text-[1.05rem]" style={{ color: 'var(--color-text-primary)' }}>
                  <span className="mr-2">{game.averageSatisfaction.toFixed(1)}</span>
                  <RatingDots value={game.averageSatisfaction} />
                </span>
              </li>
            )}
          </ul>
        )}

        <div className="flex items-baseline gap-8 flex-wrap">
          <button
            onClick={onStart}
            disabled={!canLaunch}
            className={`game-begin-link relative font-serif italic font-medium text-[1.5rem] leading-none inline-flex items-baseline gap-2 bg-transparent border-0 p-0 pb-1.5 cursor-pointer transition-[letter-spacing,color] duration-500 ease-[cubic-bezier(.22,.61,.36,1)] ${canLaunch ? '' : 'opacity-40 cursor-not-allowed'}`}
            style={{ color: 'var(--color-accent)' }}
            aria-label={`${getButtonText(game)} for ${game.name}`}
          >
            {getButtonText(game)}
            <span aria-hidden="true" className="game-begin-arrow font-sans not-italic font-normal transition-transform duration-500">→</span>
            <span
              aria-hidden="true"
              className="game-begin-underline absolute left-0 bottom-0 h-px transition-[right] duration-[600ms]"
              style={{ background: 'var(--color-accent)', right: '35%' }}
            />
          </button>

          {onSchedule && (
            <button
              onClick={onSchedule}
              className="font-sans font-normal text-[0.85rem] tracking-[0.12em] uppercase bg-transparent border-0 p-0 pb-1.5 cursor-pointer transition-colors duration-300"
              style={{
                color: 'var(--color-text-secondary)',
                borderBottom: '1px solid var(--color-border)',
              }}
              aria-label={`Schedule ${game.name} for later`}
            >
              Schedule for later
            </button>
          )}
        </div>
      </div>

      <style>{`
        .game-begin-link:hover:not(:disabled) {
          letter-spacing: 0.04em;
        }
        .game-begin-link:hover:not(:disabled) .game-begin-underline {
          right: 0 !important;
        }
        .game-begin-link:hover:not(:disabled) .game-begin-arrow {
          transform: translateX(0.4rem);
        }
      `}</style>
    </article>
  );
});

// ─── AlternativeCard — editorial row style ──────────────
interface AlternativeCardProps {
  game: Game;
  index?: number;
  onSelect?: () => void;
}

export const AlternativeCard = memo(function AlternativeCard({ game, index, onSelect }: AlternativeCardProps) {
  const primaryGenre = game.genres?.[0];

  return (
    <button
      onClick={onSelect}
      aria-label={`Play ${game.name}`}
      className="alt-row w-full grid items-center text-left bg-transparent border-0 cursor-pointer p-0 py-4 transition-[padding,background] duration-500 ease-[cubic-bezier(.22,.61,.36,1)]"
      style={{
        borderTop: '1px solid var(--color-border)',
        gridTemplateColumns: '2.25rem 3.75rem 1fr auto',
        columnGap: 'clamp(0.75rem, 2vw, 1.5rem)',
      }}
    >
      <span
        className="font-mono text-[0.74rem] tracking-wider"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {typeof index === 'number' ? String(index + 1).padStart(2, '0') : '—'}
      </span>

      <span
        className="overflow-hidden aspect-[600/900]"
        style={{
          background: 'var(--color-text-primary)',
          border: '1px solid var(--color-border)',
        }}
      >
        {game.imageUrl && (
          <img
            src={game.imageUrl}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            style={{ filter: 'contrast(1.05) saturate(0.9)' }}
          />
        )}
      </span>

      <span className="block min-w-0">
        <span
          className="font-serif font-medium block text-[clamp(1rem,1.6vw,1.25rem)] leading-tight transition-colors duration-300"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {game.name}
        </span>
        {game.description && (
          <span
            className="alt-sub font-serif italic block text-[0.88rem] mt-1 leading-snug max-w-[52ch]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {game.description}
          </span>
        )}
      </span>

      <span
        className="font-mono text-[0.72rem] tracking-wider whitespace-nowrap text-right"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        <span className="hidden sm:inline">{primaryGenre || 'game'} · </span>
        {game.minMinutes}&ndash;{game.maxMinutes}m
      </span>

      <style>{`
        .alt-row:hover {
          padding-left: 0.85rem;
          background: var(--color-bg-secondary);
        }
        .alt-row:hover .alt-sub {
          color: var(--color-text-primary);
        }
        .alt-row:last-child {
          border-bottom: 1px solid var(--color-border);
        }
      `}</style>
    </button>
  );
});
