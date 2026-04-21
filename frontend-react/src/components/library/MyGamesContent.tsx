import { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';
import { GameGridSkeleton } from '@/components/skeletons/GameCardSkeleton';
import { useSteamStore } from '@/stores/steamStore';
import { useAuthStore } from '@/stores/authStore';
import { EmptyLibrarySvg } from '@/components/illustrations';
import { SteamConnect } from '@/components/SteamConnect';
import { AiGameImport } from '@/components/AiGameImport';
import { LoginPrompt } from '@/components/LoginPrompt';
import { BenefitCard } from '@/components/library/BenefitCard';
import { formatPlaytime, type UserLibraryGame } from '@/types/steam';

type SortOption = 'name' | 'playtime' | 'recent';
type FilterOption = 'all' | 'tagged' | 'untagged' | 'steam';
type ViewMode = 'grid' | 'list';

const PAGE_SIZE = 40;

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'playtime', label: 'playtime' },
  { value: 'name',     label: 'name'     },
  { value: 'recent',   label: 'recent'   },
];

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: 'all',      label: 'all'      },
  { value: 'tagged',   label: 'ready'    },
  { value: 'untagged', label: 'pending'  },
];

export function MyGamesContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('playtime');
  const [sortDesc, setSortDesc] = useState(true);
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  const { user, isAuthenticated } = useAuthStore();
  const {
    isConnected,
    isLoading,
    error,
    fetchLibrary,
    fetchPendingGames,
    pendingGames,
    library,
    checkStatus,
    lastImport,
    aiImportGames,
    tagPendingGames,
    isTagging,
    fetchGameStats,
    gameStats,
    importLibrary,
  } = useSteamStore();

  useEffect(() => {
    if (isAuthenticated) {
      checkStatus();
      fetchGameStats();
      fetchPendingGames();
      if (isConnected) {
        fetchLibrary();
      }
    }
  }, [isAuthenticated, isConnected, checkStatus, fetchLibrary, fetchGameStats, fetchPendingGames]);

  const untaggedCount = useMemo(() => {
    if (!library?.games) return 0;
    return library.games.filter(g => !g.isTagged).length;
  }, [library?.games]);

  const filteredGames = useMemo(() => {
    if (!library?.games) return [];

    let games = [...library.games];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      games = games.filter(g => g.gameName.toLowerCase().includes(query));
    }

    switch (filterBy) {
      case 'tagged':
        games = games.filter(g => g.isTagged);
        break;
      case 'untagged':
        games = games.filter(g => !g.isTagged);
        break;
      case 'steam':
        games = games.filter(g => g.source === 'STEAM');
        break;
    }

    games.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.gameName.localeCompare(b.gameName);
          break;
        case 'playtime':
          comparison = (a.playtimeForever || 0) - (b.playtimeForever || 0);
          break;
        case 'recent':
          comparison = new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
          break;
      }
      return sortDesc ? -comparison : comparison;
    });

    return games;
  }, [library?.games, searchQuery, filterBy, sortBy, sortDesc]);

  // Reset pagination when filters change
  useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [searchQuery, filterBy, sortBy, sortDesc]);

  const displayedGames = useMemo(
    () => filteredGames.slice(0, displayCount),
    [filteredGames, displayCount],
  );
  const hasMore = displayCount < filteredGames.length;

  const handleRefresh = () => {
    if (isConnected) {
      importLibrary();
    } else {
      fetchLibrary();
    }
  };

  // Not logged in - show preview
  if (!isAuthenticated) {
    return (
      <>
        <div className="mb-10">
          <div
            className="flex items-center gap-3 mb-5 font-mono text-[0.7rem] tracking-[0.28em] uppercase"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span
              className="inline-block w-6 h-px"
              style={{ background: 'var(--color-accent)' }}
            />
            A private shelf
          </div>
          <h2
            className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] leading-[1.08] tracking-[-0.01em] m-0 mb-3"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Your own collection, at hand.
          </h2>
          <p
            className="font-serif italic text-[1.05rem] leading-snug max-w-[44ch]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Connect your Steam account so Lutem can recommend titles you already own.
          </p>
        </div>

        <BenefitsGrid />

        <LoginPrompt feature="your game library" />
      </>
    );
  }

  return (
    <>
      {/* section header: counts + refresh */}
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <div
          className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.28em] uppercase"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <span
            className="inline-block w-6 h-px"
            style={{ background: 'var(--color-accent)' }}
          />
          Your collection
        </div>
        <div className="flex items-baseline gap-4">
          {library?.summary && (
            <span
              className="font-mono text-[0.72rem] tracking-[0.08em]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {library.summary.totalGames} entries · {library.summary.taggedGames} ready
            </span>
          )}
          {isConnected && (
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              aria-label="Refresh library"
              className="bg-transparent border-0 p-0 cursor-pointer transition-colors duration-300 disabled:opacity-50"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* AI Game Import */}
      {((lastImport?.unmatched && lastImport.unmatched.length > 0) || pendingGames.length > 0) && (
        <div className="mb-8">
          <AiGameImport
            unmatchedGames={lastImport?.unmatched?.length ? lastImport.unmatched : pendingGames}
            onImport={aiImportGames}
          />
        </div>
      )}

      {/* Pending games notice — editorial prose banner */}
      {untaggedCount > 0 && (
        <div
          className="my-8 py-6 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-8 items-baseline"
          style={{
            borderTop: '1px solid var(--color-border-strong)',
            borderBottom: '1px solid var(--color-border-strong)',
          }}
        >
          <div>
            <div
              className="font-mono text-[0.66rem] tracking-[0.22em] uppercase mb-2"
              style={{ color: 'var(--color-accent)' }}
            >
              Catalogue pending
            </div>
            <p
              className="font-serif italic text-[1.05rem] leading-snug max-w-[52ch] m-0"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {untaggedCount} {untaggedCount === 1 ? 'entry awaits' : 'entries await'} catalogue.
              Once tagged by the AI, they become available for recommendations.
            </p>
          </div>
          <button
            onClick={() => tagPendingGames()}
            disabled={isTagging || !gameStats?.aiConfigured}
            title={!gameStats?.aiConfigured ? 'AI tagging requires Anthropic API key on server' : ''}
            className="game-begin-link relative font-serif italic font-medium text-[1.15rem] leading-none inline-flex items-baseline gap-2 bg-transparent border-0 p-0 pb-1.5 cursor-pointer transition-[letter-spacing] duration-500 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            style={{ color: 'var(--color-accent)' }}
          >
            {isTagging ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Cataloguing…
              </>
            ) : (
              <>
                Tag all entries
                <span aria-hidden="true" className="game-begin-arrow font-sans not-italic transition-transform duration-500">→</span>
              </>
            )}
            <span
              aria-hidden="true"
              className="game-begin-underline absolute left-0 bottom-0 h-px transition-[right] duration-[600ms]"
              style={{ background: 'var(--color-accent)', right: '25%' }}
            />
          </button>
        </div>
      )}

      {/* Steam users — auto-connected, offer import */}
      {user?.authProvider === 'steam' && !isConnected && (
        <div
          className="my-8 py-6 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-8 items-baseline"
          style={{
            borderTop: '1px solid var(--color-border-strong)',
            borderBottom: '1px solid var(--color-border-strong)',
          }}
        >
          <div>
            <div
              className="font-mono text-[0.66rem] tracking-[0.22em] uppercase mb-2"
              style={{ color: 'var(--color-accent)' }}
            >
              Signed in via Steam
            </div>
            <p
              className="font-serif italic text-[1.05rem] leading-snug max-w-[52ch] m-0"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Your account is ready. Import your library to begin cataloguing.
            </p>
          </div>
          <button
            onClick={() => { useSteamStore.getState().importLibrary(); }}
            disabled={isLoading}
            className="game-begin-link relative font-serif italic font-medium text-[1.15rem] leading-none inline-flex items-baseline gap-2 bg-transparent border-0 p-0 pb-1.5 cursor-pointer transition-[letter-spacing] duration-500 disabled:opacity-40"
            style={{ color: 'var(--color-accent)' }}
          >
            {isLoading ? 'Importing…' : 'Import library'}
            <span aria-hidden="true" className="game-begin-arrow font-sans not-italic transition-transform duration-500">→</span>
            <span
              aria-hidden="true"
              className="game-begin-underline absolute left-0 bottom-0 h-px transition-[right] duration-[600ms]"
              style={{ background: 'var(--color-accent)', right: '25%' }}
            />
          </button>
        </div>
      )}

      {/* Google users — show connect */}
      {user?.authProvider === 'google' && !isConnected && (
        <div className="space-y-8">
          <SteamConnect />
          <BenefitsGrid />
        </div>
      )}

      {/* Connected — library */}
      {isConnected && (
        <>
          {/* search as hairline input */}
          <div
            className="mb-6 flex items-baseline gap-3"
            style={{ borderBottom: '1px solid var(--color-border-strong)' }}
          >
            <label
              htmlFor="game-search"
              className="font-mono text-[0.66rem] tracking-[0.22em] uppercase pb-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Search
            </label>
            <input
              id="game-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="title..."
              className="flex-1 bg-transparent border-0 outline-none font-serif text-[1.05rem] py-2 px-0 placeholder:italic"
              style={{ color: 'var(--color-text-primary)' }}
            />
          </div>

          {/* filter + sort + view toggles */}
          <div
            className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 pb-3 mb-8"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            {/* filter */}
            <div className="flex items-baseline gap-5 flex-wrap">
              <span
                className="font-mono text-[0.64rem] tracking-[0.22em] uppercase"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Filter
              </span>
              <div className="flex items-baseline gap-4" role="tablist" aria-label="Filter games">
                {FILTER_OPTIONS.map((opt) => {
                  const active = filterBy === opt.value;
                  return (
                    <button
                      key={opt.value}
                      role="tab"
                      aria-selected={active}
                      onClick={() => setFilterBy(opt.value)}
                      className="font-mono text-[0.72rem] tracking-[0.12em] uppercase bg-transparent border-0 p-0 pb-1 cursor-pointer transition-colors duration-300"
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
            </div>

            {/* sort */}
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
                      className="font-mono text-[0.72rem] tracking-[0.12em] uppercase bg-transparent border-0 p-0 pb-1 cursor-pointer transition-colors duration-300"
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

            {/* view */}
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
                  aria-pressed={viewMode === 'grid'}
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
                  aria-pressed={viewMode === 'list'}
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

          {/* Loading state */}
          {isLoading && <GameGridSkeleton />}

          {/* Error state */}
          {error && !isLoading && (
            <div
              role="alert"
              className="p-4 flex items-start gap-3"
              style={{
                borderTop: '1px solid var(--color-error)',
                borderBottom: '1px solid var(--color-error)',
              }}
            >
              <span
                className="font-serif italic text-[0.78rem] tracking-[0.18em] uppercase shrink-0 mt-0.5"
                style={{ color: 'var(--color-error)' }}
              >
                Notice
              </span>
              <p className="font-serif text-[1rem]" style={{ color: 'var(--color-text-primary)' }}>
                {error}
              </p>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && filteredGames.length === 0 && (
            <div className="py-16 text-center">
              <EmptyLibrarySvg className="w-40 h-28 mx-auto mb-6 opacity-60" />
              <div
                className="font-mono text-[0.68rem] tracking-[0.28em] uppercase mb-3"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Empty shelf
              </div>
              <h3
                className="font-serif text-[1.8rem] leading-[1.1] tracking-[-0.01em] mb-3"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {searchQuery ? 'No entries found.' : 'Nothing here yet.'}
              </h3>
              <p
                className="font-serif italic text-[1rem] leading-snug max-w-[32ch] mx-auto"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {searchQuery
                  ? 'Try another search term, or clear the query.'
                  : 'Import your Steam library to begin.'}
              </p>
            </div>
          )}

          {/* Games grid/list */}
          {!isLoading && filteredGames.length > 0 && (
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
                    ? <LibraryGameCard key={game.libraryEntryId} game={game} index={i} />
                    : <LibraryGameRow key={game.libraryEntryId} game={game} index={i} />
                ))}
              </div>

              {/* Load more */}
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
                {filteredGames.length !== (library?.games.length || 0) && ` · ${library?.games.length || 0} total`}
              </p>
            </>
          )}
        </>
      )}

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

function BenefitsGrid() {
  return (
    <div
      className="grid gap-0 sm:grid-cols-2 mb-10"
      style={{ borderBottom: '1px solid var(--color-border)' }}
    >
      <BenefitCard
        numeral="i."
        title="Import your games"
        description="Sync your Steam library automatically with playtime history intact."
      />
      <BenefitCard
        numeral="ii."
        title="Smart tagging"
        description="AI categorises each title by mood, energy, and session length."
      />
      <BenefitCard
        numeral="iii."
        title="Personal recommendations"
        description="Suggestions drawn from your own collection, attuned to how you feel."
      />
      <BenefitCard
        numeral="iv."
        title="Track satisfaction"
        description="Learn, over time, which games genuinely serve you."
      />
    </div>
  );
}

function LibraryGameCard({ game, index }: { game: UserLibraryGame; index: number }) {
  const getSteamImageUrl = (steamAppId?: number) => {
    if (!steamAppId) return null;
    return `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamAppId}/header.jpg`;
  };

  return (
    <div className="library-grid-card group block">
      <div
        className="relative overflow-hidden aspect-[460/215]"
        style={{
          background: 'var(--color-text-primary)',
          border: '1px solid var(--color-border-strong)',
        }}
      >
        {game.steamAppId && (
          <img
            src={getSteamImageUrl(game.steamAppId)!}
            alt={game.gameName}
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
            title={game.gameName}
          >
            {game.gameName}
          </div>
          <div
            className="font-mono text-[0.68rem] tracking-wide mt-0.5"
            style={{
              color: game.isTagged ? 'var(--color-text-muted)' : 'var(--color-accent)',
              fontStyle: game.isTagged ? 'normal' : 'italic',
            }}
          >
            {game.isTagged ? formatPlaytime(game.playtimeForever).toLowerCase() : 'pending'}
          </div>
        </div>
        <div className="text-right" style={{ color: 'var(--color-text-muted)' }}>
          <div>{game.isTagged ? 'ready' : formatPlaytime(game.playtimeForever).toLowerCase()}</div>
          <div className="opacity-60">no. {String(index + 1).padStart(3, '0')}</div>
        </div>
      </div>
    </div>
  );
}

function LibraryGameRow({ game, index }: { game: UserLibraryGame; index: number }) {
  const getSteamImageUrl = (steamAppId?: number) => {
    if (!steamAppId) return null;
    return `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamAppId}/header.jpg`;
  };

  return (
    <div
      className="library-list-row grid items-center text-left py-4 px-2 transition-colors duration-300"
      style={{
        borderBottom: '1px solid var(--color-border)',
        gridTemplateColumns: '2.25rem 5rem 1fr auto auto',
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
        {game.steamAppId && (
          <img
            src={getSteamImageUrl(game.steamAppId)!}
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
          title={game.gameName}
        >
          {game.gameName}
        </span>
        <span
          className="font-mono text-[0.72rem] tracking-wide block mt-0.5"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {formatPlaytime(game.playtimeForever).toLowerCase()}
          {game.playtime2Weeks && game.playtime2Weeks > 0 && (
            <>
              {' · '}
              <span style={{ color: 'var(--color-accent)' }}>
                {formatPlaytime(game.playtime2Weeks).toLowerCase()} last fortnight
              </span>
            </>
          )}
        </span>
      </span>

      <span
        className="font-mono text-[0.7rem] tracking-[0.14em] uppercase whitespace-nowrap"
        style={{
          color: game.isTagged ? 'var(--color-text-muted)' : 'var(--color-accent)',
          fontStyle: game.isTagged ? 'normal' : 'italic',
        }}
      >
        {game.isTagged ? 'ready' : 'pending'}
      </span>

      <span />
    </div>
  );
}
