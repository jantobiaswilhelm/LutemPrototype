import { memo } from 'react';
import { Clock, Zap, ChevronDown, Play, ExternalLink } from 'lucide-react';
import { EMOTIONAL_GOALS, ENERGY_LEVELS } from '@/types';
import type { Game } from '@/types';

// Determine if we can launch the game directly
function canLaunchGame(game: Game): boolean {
  return !!game.steamAppId || !!game.storeUrl;
}

// Get appropriate button text
function getButtonText(game: Game): string {
  if (game.steamAppId) return 'Launch in Steam';
  if (game.storeUrl) return 'Open Store Page';
  return 'Start Session';
}

interface GameCardProps {
  game: Game;
  reason?: string;
  showDetails?: boolean;
  onStart?: () => void;
}

export const GameCard = memo(function GameCard({ game, reason, showDetails = true, onStart }: GameCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shadow-lg">
      {/* Game image */}
      <div className="h-48 bg-gradient-to-br from-[var(--color-accent-soft)] to-[var(--color-bg-tertiary)] flex items-center justify-center relative overflow-hidden">
        {game.imageUrl ? (
          <img
            src={game.imageUrl}
            alt={game.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // Fallback to emoji if image fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <span className={`text-6xl ${game.imageUrl ? 'hidden' : ''}`}>🎮</span>
        {/* Genre badge */}
        <span className="absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-full bg-black/20 text-white backdrop-blur-sm">
          {game.genres?.[0] || 'Game'}
        </span>
      </div>
      
      <div className="p-5">
        {/* Game name */}
        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
          {game.name}
        </h3>
        
        {showDetails && (
          <>
            {/* Description */}
            <p className="text-sm text-[var(--color-text-muted)] mb-4 line-clamp-2">
              {game.description || 'A great game for your current mood.'}
            </p>

            {/* Quick stats row */}
            <div className="flex items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                <Clock className="w-4 h-4" />
                <span>{game.minMinutes}-{game.maxMinutes} min</span>
              </div>
              <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                <Zap className="w-4 h-4" />
                <span>{ENERGY_LEVELS[game.energyRequired]?.displayName || game.energyRequired}</span>
              </div>
            </div>

            {/* Emotional goals */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {game.emotionalGoals.slice(0, 3).map((goal) => (
                <span 
                  key={goal} 
                  className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] font-medium"
                >
                  {EMOTIONAL_GOALS[goal]?.emoji} {EMOTIONAL_GOALS[goal]?.displayName || goal}
                </span>
              ))}
            </div>
          </>
        )}

        {/* Start button */}
        <button 
          onClick={onStart}
          disabled={!canLaunchGame(game)}
          className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
            canLaunchGame(game)
              ? 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] active:scale-[0.98]'
              : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] cursor-not-allowed'
          }`}
        >
          {game.steamAppId ? (
            <Play className="w-5 h-5" fill="currentColor" />
          ) : game.storeUrl ? (
            <ExternalLink className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" fill="currentColor" />
          )}
          {getButtonText(game)}
        </button>
      </div>

      {/* Match reason */}
      {reason && (
        <div className="px-5 pb-5">
          <div className="p-3 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-muted)]">
              <span className="font-medium text-[var(--color-text-secondary)]">Why this? </span>
              {reason}
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

// Compact card for alternatives
interface AlternativeCardProps {
  game: Game;
  onSelect?: () => void;
}

export const AlternativeCard = memo(function AlternativeCard({ game, onSelect }: AlternativeCardProps) {
  return (
    <button
      onClick={onSelect}
      className="w-full flex items-center gap-4 p-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all text-left"
    >
      {/* Small image */}
      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[var(--color-accent-soft)] to-[var(--color-bg-tertiary)] flex items-center justify-center flex-shrink-0 overflow-hidden">
        {game.imageUrl ? (
          <img
            src={game.imageUrl}
            alt={game.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <span className={`text-2xl ${game.imageUrl ? 'hidden' : ''}`}>🕹️</span>
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-[var(--color-text-primary)] truncate">
          {game.name}
        </h4>
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {game.minMinutes}-{game.maxMinutes} min
          </span>
          <span>•</span>
          <span>{game.genres?.[0] || 'Game'}</span>
        </div>
      </div>
      
      <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)] rotate-[-90deg]" />
    </button>
  );
});
