import { useState, useEffect, useCallback, useRef } from 'react';
import { Settings2, ChevronDown } from 'lucide-react';
import { useContentPreferences } from '@/hooks/useContentPreferences';
import { useGamingPreferences } from '@/hooks/useGamingPreferences';
import { getDiscoveryMode, type DiscoveryMode } from '@/lib/recommendationDefaults';
import type { ContentRating } from '@/types';
import { CONTENT_RATING } from '@/types';

// --- Constants ---

const DISCOVERY_STORAGE_KEY = 'lutem_discovery_mode';

const DISCOVERY_OPTIONS: { value: DiscoveryMode; label: string }[] = [
  { value: 'popular', label: 'Popular picks' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'hidden_gems', label: 'Hidden gems' },
];

const GENRE_LIST = [
  'Action',
  'Adventure',
  'RPG',
  'Strategy',
  'Puzzle',
  'Simulation',
  'Platformer',
  'Racing',
  'Sports',
  'Horror',
  'Card Game',
  'Roguelike',
  'Party Game',
  'Sandbox',
  'Survival',
];

const CONTENT_RATING_OPTIONS: ContentRating[] = ['EVERYONE', 'TEEN', 'MATURE', 'ADULT'];

// --- Helpers ---

function saveDiscoveryMode(mode: DiscoveryMode) {
  localStorage.setItem(DISCOVERY_STORAGE_KEY, mode);
}

/** Returns true if any filter is non-default */
function hasNonDefaultFilters(
  maxContentRating: ContentRating,
  allowNsfw: boolean,
  preferredGenres: string[],
  discoveryMode: DiscoveryMode,
): boolean {
  return (
    maxContentRating !== 'MATURE' ||
    allowNsfw !== false ||
    preferredGenres.length > 0 ||
    discoveryMode !== 'balanced'
  );
}

// --- Component ---

export function RecommendationFilters() {
  const [isOpen, setIsOpen] = useState(false);
  const [discoveryMode, setDiscoveryModeState] = useState<DiscoveryMode>(getDiscoveryMode);

  const {
    maxContentRating,
    allowNsfw,
    setMaxContentRating,
    setAllowNsfw,
  } = useContentPreferences();

  const {
    preferredGenres,
    toggleGenre,
  } = useGamingPreferences();

  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  // Persist discovery mode
  useEffect(() => {
    saveDiscoveryMode(discoveryMode);
  }, [discoveryMode]);

  const setDiscoveryMode = useCallback((mode: DiscoveryMode) => {
    setDiscoveryModeState(mode);
  }, []);

  const showDot = !isOpen && hasNonDefaultFilters(maxContentRating, allowNsfw, preferredGenres, discoveryMode);

  return (
    <div className="relative" ref={containerRef}>
      {/* Cogwheel toggle button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="Advanced recommendation filters"
        className={`
          relative p-2 rounded-xl transition-all duration-200
          ${isOpen
            ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
          }
        `}
      >
        <Settings2 className="w-4.5 h-4.5" />

        {/* Non-default indicator dot */}
        {showDot && (
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--color-accent)]"
            aria-hidden="true"
          />
        )}
      </button>

      {/* Filter panel — bottom sheet on mobile, dropdown on desktop */}
      {isOpen && (
        <>
          {/* Backdrop (mobile only) */}
          <div
            className="fixed inset-0 z-40 bg-black/30 sm:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="
            fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl
            sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 sm:rounded-xl sm:max-h-none
          ">
            <div className="p-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shadow-lg space-y-5 sm:rounded-xl rounded-t-2xl">

          {/* --- Content Rating --- */}
          <FilterSection label="Content Rating">
            <div className="relative">
              <select
                value={maxContentRating}
                onChange={(e) => setMaxContentRating(e.target.value as ContentRating)}
                className="
                  w-full appearance-none pl-3 pr-8 py-2 rounded-lg text-sm
                  bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]
                  text-[var(--color-text-primary)]
                  focus:outline-none focus:border-[var(--color-accent)]
                  transition-colors cursor-pointer
                "
              >
                {CONTENT_RATING_OPTIONS.map((rating) => (
                  <option key={rating} value={rating}>
                    {CONTENT_RATING[rating].displayName}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none"
              />
            </div>
          </FilterSection>

          {/* --- NSFW Toggle --- */}
          <FilterSection label="NSFW Content">
            <button
              role="switch"
              aria-checked={allowNsfw}
              onClick={() => setAllowNsfw(!allowNsfw)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
                ${allowNsfw ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200
                  ${allowNsfw ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </FilterSection>

          {/* --- Preferred Genres --- */}
          <FilterSection label="Preferred Genres">
            <div className="flex flex-wrap gap-1.5">
              {GENRE_LIST.map((genre) => {
                const isSelected = preferredGenres.includes(genre.toLowerCase());
                return (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`
                      px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150
                      ${isSelected
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]'
                      }
                    `}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </FilterSection>

          {/* --- Discovery Mode --- */}
          <FilterSection label="Discovery Mode">
            <div className="flex rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] p-0.5">
              {DISCOVERY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDiscoveryMode(option.value)}
                  className={`
                    flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-200
                    ${discoveryMode === option.value
                      ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)] shadow-sm'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </FilterSection>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// --- Sub-components ---

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}
