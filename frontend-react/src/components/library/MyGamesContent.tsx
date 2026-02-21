import { useState, useEffect, useMemo } from 'react';
import {
  Library as LibraryIcon,
  Search,
  Filter,
  Clock,
  Gamepad2,
  CheckCircle,
  AlertCircle,
  Tag,
  SortAsc,
  SortDesc,
  Grid,
  List,
  RefreshCw,
  Loader2,
} from 'lucide-react';
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

export function MyGamesContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('playtime');
  const [sortDesc, setSortDesc] = useState(true);
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-accent)]/10 mb-4">
            <LibraryIcon className="w-8 h-8 text-[var(--color-accent)]" />
          </div>
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
            Your Game Library
          </h2>
          <p className="text-[var(--color-text-muted)]">
            Connect your Steam account to import and manage your games
          </p>
        </div>

        <BenefitsGrid />

        {/* Login prompt */}
        <LoginPrompt feature="your game library" />
      </>
    );
  }

  // Logged in - show full library UI
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[var(--color-accent)]/10">
            <LibraryIcon className="w-6 h-6 text-[var(--color-accent)]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              Your Library
            </h2>
            {library?.summary && (
              <p className="text-sm text-[var(--color-text-muted)]">
                {library.summary.totalGames} games • {library.summary.taggedGames} ready for recommendations
              </p>
            )}
          </div>
        </div>

        {isConnected && (
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors disabled:opacity-50"
            title="Refresh library"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* AI Game Import - show when there are unmatched/pending games */}
      {((lastImport?.unmatched && lastImport.unmatched.length > 0) || pendingGames.length > 0) && (
        <div className="mb-6">
          <AiGameImport
            unmatchedGames={lastImport?.unmatched?.length ? lastImport.unmatched : pendingGames}
            onImport={aiImportGames}
          />
        </div>
      )}

      {/* Pending Games Card - show when user has untagged games in library */}
      {untaggedCount > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Tag className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-[var(--color-text-primary)]">
                  {untaggedCount} games need tagging
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  AI tagging makes games available for recommendations
                </p>
              </div>
            </div>
            <button
              onClick={() => tagPendingGames()}
              disabled={isTagging || !gameStats?.aiConfigured}
              className="px-4 py-2 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 whitespace-nowrap"
              title={!gameStats?.aiConfigured ? 'AI tagging requires Anthropic API key on server' : ''}
            >
              {isTagging ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Tagging...
                </>
              ) : (
                'Tag All'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Steam users - auto-connected, show import option */}
      {user?.authProvider === 'steam' && !isConnected && (
        <div className="mb-6 p-4 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[var(--color-text-primary)]">
                You're signed in with Steam!
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Click to import your game library automatically
              </p>
            </div>
            <button
              onClick={() => {
                useSteamStore.getState().importLibrary();
              }}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white font-medium hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-all"
            >
              {isLoading ? 'Importing...' : 'Import Library'}
            </button>
          </div>
        </div>
      )}

      {/* Google users - show Steam connect form */}
      {user?.authProvider === 'google' && !isConnected && (
        <div className="space-y-6">
          <SteamConnect />
          <BenefitsGrid />
        </div>
      )}

      {/* Connected - show library */}
      {isConnected && (
        <>
          {/* Search and filters */}
          <div className="mb-6 space-y-3">
            <div className="relative">
              <label htmlFor="game-search" className="sr-only">Search your games</label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" aria-hidden="true" />
              <input
                id="game-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your games..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowFilters(!showFilters)}
                aria-expanded={showFilters}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  showFilters
                    ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-accent)]'
                }`}
              >
                <Filter className="w-4 h-4" aria-hidden="true" />
                Filters
              </button>

              <div className="flex gap-1.5 flex-wrap" role="tablist" aria-label="Filter games">
                {(['all', 'tagged', 'untagged'] as FilterOption[]).map((filter) => (
                  <button
                    key={filter}
                    role="tab"
                    aria-selected={filterBy === filter}
                    onClick={() => setFilterBy(filter)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      filterBy === filter
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
                    }`}
                  >
                    {filter === 'all' ? 'All' : filter === 'tagged' ? 'Ready' : 'Pending'}
                  </button>
                ))}
              </div>

              <div className="flex-1" />

              <label htmlFor="sort-select" className="sr-only">Sort by</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm focus:outline-none focus:border-[var(--color-accent)]"
              >
                <option value="playtime">Playtime</option>
                <option value="name">Name</option>
                <option value="recent">Recently Added</option>
              </select>

              <button
                onClick={() => setSortDesc(!sortDesc)}
                aria-label={sortDesc ? 'Sort ascending' : 'Sort descending'}
                className="p-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] transition-colors"
              >
                {sortDesc ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
              </button>

              <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden" role="group" aria-label="View mode">
                <button
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                  className={`p-2 ${viewMode === 'list' ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && <GameGridSkeleton />}

          {/* Error state */}
          {error && !isLoading && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && filteredGames.length === 0 && (
            <div className="text-center py-16">
              <EmptyLibrarySvg className="w-48 h-36 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
                {searchQuery ? 'No games found' : 'Your library is empty'}
              </h3>
              <p className="text-[var(--color-text-muted)]">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Import your Steam library to get started'}
              </p>
            </div>
          )}

          {/* Games grid/list */}
          {!isLoading && filteredGames.length > 0 && (
            <>
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'
                  : 'space-y-2'
              }>
                {displayedGames.map((game) => (
                  viewMode === 'grid'
                    ? <LibraryGameCard key={game.libraryEntryId} game={game} />
                    : <LibraryGameRow key={game.libraryEntryId} game={game} />
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setDisplayCount((c) => c + PAGE_SIZE)}
                    className="px-6 py-2.5 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)] transition-colors font-medium text-sm"
                  >
                    Load More ({filteredGames.length - displayCount} remaining)
                  </button>
                </div>
              )}

              {/* Results count */}
              <p className="text-center text-sm text-[var(--color-text-muted)] mt-4">
                Showing {displayedGames.length} of {filteredGames.length} games
                {filteredGames.length !== (library?.games.length || 0) && ` (${library?.games.length || 0} total)`}
              </p>
            </>
          )}
        </>
      )}
    </>
  );
}

function BenefitsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 mb-8">
      <BenefitCard
        icon={<Gamepad2 className="w-5 h-5" />}
        title="Import Your Games"
        description="Automatically sync your Steam library with playtime stats"
      />
      <BenefitCard
        icon={<Tag className="w-5 h-5" />}
        title="Smart Tagging"
        description="AI helps categorize games by mood, energy, and session length"
      />
      <BenefitCard
        icon={<CheckCircle className="w-5 h-5" />}
        title="Personal Recommendations"
        description="Get suggestions from your own collection based on how you feel"
      />
      <BenefitCard
        icon={<Clock className="w-5 h-5" />}
        title="Track Satisfaction"
        description="Learn which games actually make you happy"
      />
    </div>
  );
}

function LibraryGameCard({ game }: { game: UserLibraryGame }) {
  const getSteamImageUrl = (steamAppId?: number) => {
    if (!steamAppId) return null;
    return `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamAppId}/header.jpg`;
  };

  return (
    <div className="group rounded-xl overflow-hidden bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all hover:shadow-lg">
      <div className="aspect-[460/215] bg-gradient-to-br from-[var(--color-accent-soft)] to-[var(--color-bg-tertiary)] relative overflow-hidden">
        {game.steamAppId && (
          <img
            src={getSteamImageUrl(game.steamAppId)!}
            alt={game.gameName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}

        <div className="absolute top-2 right-2">
          {game.isTagged ? (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/90 text-white text-xs font-medium backdrop-blur-sm">
              <CheckCircle className="w-3 h-3" />
              Ready
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--color-bg-tertiary)]/90 text-[var(--color-text-muted)] text-xs font-medium backdrop-blur-sm">
              <Tag className="w-3 h-3" />
              Pending
            </span>
          )}
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-medium text-[var(--color-text-primary)] text-sm truncate mb-1" title={game.gameName}>
          {game.gameName}
        </h3>
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatPlaytime(game.playtimeForever)}</span>
        </div>
      </div>
    </div>
  );
}

function LibraryGameRow({ game }: { game: UserLibraryGame }) {
  const getSteamImageUrl = (steamAppId?: number) => {
    if (!steamAppId) return null;
    return `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamAppId}/header.jpg`;
  };

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all">
      <div className="w-20 h-10 rounded-lg bg-gradient-to-br from-[var(--color-accent-soft)] to-[var(--color-bg-tertiary)] overflow-hidden flex-shrink-0">
        {game.steamAppId && (
          <img
            src={getSteamImageUrl(game.steamAppId)!}
            alt={game.gameName}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-[var(--color-text-primary)] text-sm truncate">
          {game.gameName}
        </h3>
        <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatPlaytime(game.playtimeForever)}
          </span>
          {game.playtime2Weeks && game.playtime2Weeks > 0 && (
            <span className="text-[var(--color-accent)]">
              {formatPlaytime(game.playtime2Weeks)} last 2 weeks
            </span>
          )}
        </div>
      </div>

      <div className="flex-shrink-0">
        {game.isTagged ? (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            Ready
          </span>
        ) : (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] text-xs font-medium">
            <Tag className="w-3.5 h-3.5" />
            Pending
          </span>
        )}
      </div>
    </div>
  );
}
