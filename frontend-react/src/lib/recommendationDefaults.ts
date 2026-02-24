import type { TimeOfDay, RecommendationRequest } from '@/types';
import { getContentPreferences } from '@/hooks/useContentPreferences';
import { getGamingPreferences } from '@/hooks/useGamingPreferences';

const DISCOVERY_STORAGE_KEY = 'lutem_discovery_mode';

/**
 * Infer time of day from the current hour.
 */
export function inferTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 11) return 'MORNING';
  if (hour >= 11 && hour < 14) return 'MIDDAY';
  if (hour >= 14 && hour < 17) return 'AFTERNOON';
  if (hour >= 17 && hour < 21) return 'EVENING';
  return 'LATE_NIGHT';
}

export type DiscoveryMode = 'popular' | 'hidden_gems' | 'balanced';

export function saveDiscoveryMode(mode: DiscoveryMode) {
  localStorage.setItem(DISCOVERY_STORAGE_KEY, mode);
}

export function getDiscoveryMode(): DiscoveryMode {
  try {
    const stored = localStorage.getItem(DISCOVERY_STORAGE_KEY);
    if (stored === 'popular' || stored === 'hidden_gems' || stored === 'balanced') {
      return stored;
    }
  } catch {}
  return 'balanced';
}

/**
 * Enrich a partial recommendation request with stored preferences
 * and auto-inferred values. Works for both wizard and mood shortcuts.
 */
export function enrichRequest(partial: RecommendationRequest): RecommendationRequest {
  const content = getContentPreferences();
  const gaming = getGamingPreferences();

  return {
    ...partial,
    // Auto-infer time of day if not already set
    timeOfDay: partial.timeOfDay ?? inferTimeOfDay(),
    timeOfDayInferred: partial.timeOfDay == null,
    // Apply stored content preferences (can be overridden by explicit values)
    maxContentRating: partial.maxContentRating ?? content.maxContentRating,
    allowNsfw: partial.allowNsfw ?? content.allowNsfw,
    // Apply genre preferences if user has set any
    preferredGenres: partial.preferredGenres ?? (gaming.preferredGenres.length > 0 ? gaming.preferredGenres : undefined),
  };
}
