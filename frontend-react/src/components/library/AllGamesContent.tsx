import { useState, useEffect, useMemo } from 'react';
import { GameGridSkeleton } from '@/components/skeletons/GameCardSkeleton';
import { gamesApi } from '@/api/client';
import type { Game } from '@/types';
import { EmptyLibrarySvg } from '@/components/illustrations';
import { GamePreviewTooltip } from '@/components/library/GamePreviewTooltip';

type AllGamesSortOption = 'name' | 'minTime' | 'maxTime';
type ViewMode = 'grid' | 'list';

const PAGE_SIZE = 40;

const SORT_OPTIONS: { value: AllGamesSortOption; label: string }[] = [
  { value: 'name',    label: 'name'     },
  { value: 'minTime', label: 'min time' },
  { value: 'maxTime', label: 'max time' },
];

export function AllGamesContent() {
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<AllGamesSortOption>('name');
  const [sortDesc, setSortDesc] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        const games = await gamesApi.getAll();
        setAllGames(games);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load games');
      } finally {
        setIsLoading(false);
      }
    };
    fetchGames();
  }, []);

  const filteredGames = useMemo(() => {
    let games = [...allGames];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      games = games.filter(g => g.name.toLowerCase().includes(query));
    }

    games.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'minTime':
          comparison = (a.minMinutes || 0) - (b.minMinutes || 0);
          break;
        case 'maxTime':
          comparison = (a.maxMinutes || 0) - (b.maxMinutes || 0);
          break;
      }
      return sortDesc ? -comparison : comparison;
    });

    return games;
  }, [allGames, searchQuery, sortBy, sortDesc]);

  // Reset pagination when filters change
  useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [searchQuery, sortBy, sortDesc]);

  const displayedGames = useMemo(
    () => filteredGames.slice(0, displayCount),
    [filteredGames, displayCount],
  );
  const hasMore = displayCount < filteredGames.length;

  if (isLoading) {
    return <GameGridSkeleton count={12} />;
  }

  if (error) {
    return (
      <div
        role="alert"
        className="p-4 flex items-start gap-3"
        style={{
          borderTop: '1px solid var(--color-error)',
          borderBottom: '1px solid var(--color-error)',
          color: 'var(--color-error)',
        }}
      >
        <span className="font-serif italic text-[0.78rem] tracking-[0.18em] uppercase shrink-0 mt-0.5">
          Notice
        </span>
        <p className="font-serif text-[1rem]" style={{ color: 'var(--color-text-primary)' }}>
          {error}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* section eyebrow + total */}
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <div
          className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.28em] uppercase"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <span
            className="inline-block w-6 h-px"
            style={{ background: 'var(--color-accent)' }}
          />
          The register
        </div>
        <span
          className="font-mono text-[0.72rem] tracking-[0.08em]"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {allGames.length} entries
        </span>
      </div>

      {/* search as hairline input */}
      <div
        className="mb-6 flex items-baseline gap-3"
        style={{ borderBottom: '1px solid var(--color-border-strong)' }}
      >
        <label
          htmlFor="all-games-search"
          className="font-mono text-[0.66rem] tracking-[0.22em] uppercase pb-2"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Search
        </label>
        <input
          id="all-games-search"
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="title..."
          className="flex-1 bg-transparent border-0 outline-none font-serif text-[1.05rem] py-2 px-0 placeholder:italic"
          style={{
            color: 'var(--color-text-primary)',
          }}
        />
      </div>

      {/* sort + view toggles as editorial mono toggles */}
      <div
        className="flex flex-wrap items-baseline justify-between gap-4 pb-3 mb-8"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <div className="flex items-baseline gap-5 flex-wrap">
          <span
            className="font-mono text-[0.64rem] tracking-[0.22em] uppercase"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Sort
          </span>
          <div className="flex items-baseline gap-4">
            {SORT_OPTIONS.map((opt) => {
              const active = sortBy === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className="relative font-mono text-[0.72rem] tracking-[0.12em] uppercase bg-transparent border-0 p-0 pb-1 cursor-pointer transition-colors duration-300"
                  style={{
                    color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    fontStyle: active ? 'italic' : 'normal',
                    borderBottom: active
                      ? '1px solid var(--color-accent)'
                      : '1px solid transparent',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setSortDesc(!sortDesc)}
            aria-label={sortDesc ? 'Sort ascending' : 'Sort descending'}
            className="font-mono text-[0.72rem] tracking-[0.12em] uppercase bg-transparent border-0 p-0 pb-1 cursor-pointer transition-colors duration-300"
            style={{
              color: 'var(--color-text-secondary)',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            {sortDesc ? 'desc ↓' : 'asc ↑'}
          </button>
        </div>

        <div className="flex items-baseline gap-3">
          <span
            className="font-mono text-[0.64rem] tracking-[0.22em] uppercase"
            style={{ color: 'var(--color-text-muted)' }}
          >
            View
          </span>
          <div className="flex items-baseline gap-2 font-mono text-[0.72rem] tracking-[0.12em] uppercase">
            <button
              onClick={() => setViewMode('grid')}
              className="bg-transparent border-0 p-0 pb-1 cursor-pointer transition-colors duration-300"
              style={{
                color: viewMode === 'grid' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontStyle: viewMode === 'grid' ? 'italic' : 'normal',
                borderBottom:
                  viewMode === 'grid'
                    ? '1px solid var(--color-accent)'
                    : '1px solid transparent',
              }}
            >
              grid
            </button>
            <span style={{ color: 'var(--color-text-muted)' }}>·</span>
            <button
              onClick={() => setViewMode('list')}
              className="bg-transparent border-0 p-0 pb-1 cursor-pointer transition-colors duration-300"
              style={{
                color: viewMode === 'list' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontStyle: viewMode === 'list' ? 'italic' : 'normal',
                borderBottom:
                  viewMode === 'list'
                    ? '1px solid var(--color-accent)'
                    : '1px solid transparent',
              }}
            >
              list
            </button>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {filteredGames.length === 0 && (
        <div className="py-16 text-center">
          <EmptyLibrarySvg className="w-40 h-28 mx-auto mb-6 opacity-60" />
          <div
            className="font-mono text-[0.68rem] tracking-[0.28em] uppercase mb-3"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Nothing in the register
          </div>
          <h3
            className="font-serif text-[1.8rem] leading-[1.1] tracking-[-0.01em] mb-3"
            style={{ color: 'var(--color-text-primary)' }}
          >
            No entries found.
          </h3>
          <p
            className="font-serif italic text-[1rem] leading-snug max-w-[32ch] mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Try another search term, or clear the query to see the whole collection.
          </p>
        </div>
      )}

      {/* Games grid/list */}
      {filteredGames.length > 0 && (
        <>
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10'
                : ''
            }
            style={viewMode === 'list' ? { borderTop: '1px solid var(--color-border)' } : undefined}
          >
            {displayedGames.map((game, i) => (
              viewMode === 'grid'
                ? (
                  <GamePreviewTooltip key={game.id} game={game}>
                    <AllGameCard game={game} index={i} />
                  </GamePreviewTooltip>
                )
                : <AllGameRow key={game.id} game={game} index={i} />
            ))}
          </div>

          {/* Load more as editorial link */}
          {hasMore && (
            <div
              className="flex justify-center pt-10 mt-10"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              <button
                onClick={() => setDisplayCount((c) => c + PAGE_SIZE)}
                className="game-begin-link relative font-serif italic font-medium text-[1.25rem] leading-none inline-flex items-baseline gap-2 bg-transparent border-0 p-0 pb-1.5 cursor-pointer transition-[letter-spacing] duration-500"
                style={{ color: 'var(--color-accent)' }}
              >
                Load the next {Math.min(PAGE_SIZE, filteredGames.length - displayCount)}
                <span aria-hidden="true" className="game-begin-arrow font-sans not-italic transition-transform duration-500">→</span>
                <span
                  aria-hidden="true"
                  className="game-begin-underline absolute left-0 bottom-0 h-px transition-[right] duration-[600ms]"
                  style={{ background: 'var(--color-accent)', right: '30%' }}
                />
              </button>
            </div>
          )}

          {/* Results count */}
          <p
            className="text-center font-mono text-[0.68rem] tracking-[0.2em] uppercase mt-8"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Showing {displayedGames.length} of {filteredGames.length}
            {filteredGames.length !== allGames.length && ` · ${allGames.length} total`}
          </p>
        </>
      )}

      <style>{`
        .game-begin-link:hover {
          letter-spacing: 0.04em;
        }
        .game-begin-link:hover .game-begin-underline {
          right: 0 !important;
        }
        .game-begin-link:hover .game-begin-arrow {
          transform: translateX(0.4rem);
        }
        .library-grid-card:hover .library-grid-title {
          color: var(--color-accent);
        }
        .library-list-row:hover {
          background: var(--color-bg-secondary);
        }
        .library-list-row:hover .library-list-title {
          color: var(--color-accent);
        }
      `}</style>
    </>
  );
}

function AllGameCard({ game, index }: { game: Game; index: number }) {
  const imageUrl = game.steamAppId
    ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steamAppId}/header.jpg`
    : null;

  return (
    <div className="library-grid-card group block">
      <div
        className="relative overflow-hidden aspect-[460/215]"
        style={{
          background: 'var(--color-text-primary)',
          border: '1px solid var(--color-border-strong)',
        }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={game.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            style={{ filter: 'contrast(1.05) saturate(0.9)' }}
          />
        )}
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

      <div
        className="mt-3 pt-3 grid grid-cols-[1fr_auto] gap-x-4 font-mono text-[0.68rem] tracking-wide"
        style={{
          borderTop: '1px solid var(--color-border)',
          color: 'var(--color-text-secondary)',
        }}
      >
        <div className="min-w-0">
          <div
            className="library-grid-title font-serif font-medium text-[0.95rem] leading-tight truncate transition-colors duration-300"
            style={{ color: 'var(--color-text-primary)' }}
            title={game.name}
          >
            {game.name}
          </div>
          {game.genres?.[0] && (
            <div
              className="font-serif italic text-[0.8rem] mt-0.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {game.genres[0].toLowerCase()}
            </div>
          )}
        </div>
        <div className="text-right" style={{ color: 'var(--color-text-muted)' }}>
          <div>{game.minMinutes}&ndash;{game.maxMinutes}m</div>
          <div className="opacity-60">no. {String(index + 1).padStart(3, '0')}</div>
        </div>
      </div>
    </div>
  );
}

function AllGameRow({ game, index }: { game: Game; index: number }) {
  const imageUrl = game.steamAppId
    ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steamAppId}/header.jpg`
    : null;
  const primaryGenre = game.genres?.[0];

  return (
    <div
      className="library-list-row grid items-center text-left py-4 px-2 transition-colors duration-300"
      style={{
        borderBottom: '1px solid var(--color-border)',
        gridTemplateColumns: '2.25rem 5rem 1fr auto',
        columnGap: 'clamp(0.75rem, 2vw, 1.5rem)',
      }}
    >
      <span
        className="font-mono text-[0.72rem] tracking-wider"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {String(index + 1).padStart(3, '0')}
      </span>

      <span
        className="overflow-hidden aspect-[460/215] block"
        style={{
          background: 'var(--color-text-primary)',
          border: '1px solid var(--color-border)',
        }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
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
          className="library-list-title font-serif font-medium block text-[1rem] leading-tight truncate transition-colors duration-300"
          style={{ color: 'var(--color-text-primary)' }}
          title={game.name}
        >
          {game.name}
        </span>
        {primaryGenre && (
          <span
            className="font-serif italic block text-[0.85rem] mt-0.5"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {primaryGenre.toLowerCase()}
          </span>
        )}
      </span>

      <span
        className="font-mono text-[0.72rem] tracking-wider whitespace-nowrap text-right"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {game.minMinutes}&ndash;{game.maxMinutes}m
      </span>
    </div>
  );
}
