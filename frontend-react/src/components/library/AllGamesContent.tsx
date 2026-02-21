import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Clock,
  AlertCircle,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Globe,
} from 'lucide-react';
import { GameGridSkeleton } from '@/components/skeletons/GameCardSkeleton';
import { gamesApi } from '@/api/client';
import type { Game } from '@/types';
import { EmptyLibrarySvg } from '@/components/illustrations';
import { GamePreviewTooltip } from '@/components/library/GamePreviewTooltip';

type AllGamesSortOption = 'name' | 'minTime' | 'maxTime';
type ViewMode = 'grid' | 'list';

const PAGE_SIZE = 40;

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
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-[var(--color-accent)]/10">
          <Globe className="w-6 h-6 text-[var(--color-accent)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            All Games
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            {allGames.length} games available for recommendations
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search games..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex-1" />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as AllGamesSortOption)}
            className="px-3 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm focus:outline-none focus:border-[var(--color-accent)]"
          >
            <option value="name">Name</option>
            <option value="minTime">Min Time</option>
            <option value="maxTime">Max Time</option>
          </select>

          <button
            onClick={() => setSortDesc(!sortDesc)}
            className="p-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] transition-colors"
          >
            {sortDesc ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
          </button>

          <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {filteredGames.length === 0 && (
        <div className="text-center py-16">
          <EmptyLibrarySvg className="w-48 h-36 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
            No games found
          </h3>
          <p className="text-[var(--color-text-muted)]">
            Try a different search term
          </p>
        </div>
      )}

      {/* Games grid/list */}
      {filteredGames.length > 0 && (
        <>
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'
              : 'space-y-2'
          }>
            {displayedGames.map((game) => (
              viewMode === 'grid'
                ? <GamePreviewTooltip key={game.id} game={game}><AllGameCard game={game} /></GamePreviewTooltip>
                : <AllGameRow key={game.id} game={game} />
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
            {filteredGames.length !== allGames.length && ` (${allGames.length} total)`}
          </p>
        </>
      )}
    </>
  );
}

function AllGameCard({ game }: { game: Game }) {
  const imageUrl = game.steamAppId
    ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steamAppId}/header.jpg`
    : null;

  return (
    <div className="group rounded-xl overflow-hidden bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all hover:shadow-lg">
      <div className="aspect-[460/215] bg-gradient-to-br from-[var(--color-accent-soft)] to-[var(--color-bg-tertiary)] relative overflow-hidden">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={game.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
      </div>

      <div className="p-3">
        <h3 className="font-medium text-[var(--color-text-primary)] text-sm truncate mb-1" title={game.name}>
          {game.name}
        </h3>
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <Clock className="w-3.5 h-3.5" />
          <span>{game.minMinutes}-{game.maxMinutes} min</span>
        </div>
      </div>
    </div>
  );
}

function AllGameRow({ game }: { game: Game }) {
  const imageUrl = game.steamAppId
    ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steamAppId}/header.jpg`
    : null;

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all">
      <div className="w-20 h-10 rounded-lg bg-gradient-to-br from-[var(--color-accent-soft)] to-[var(--color-bg-tertiary)] overflow-hidden flex-shrink-0">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={game.name}
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
          {game.name}
        </h3>
        <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {game.minMinutes}-{game.maxMinutes} min
          </span>
        </div>
      </div>
    </div>
  );
}
