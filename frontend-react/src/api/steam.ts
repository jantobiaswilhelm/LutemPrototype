import type { SteamStatus, SteamImportResponse, UserLibraryResponse, TaggingResult, GameStats, UnmatchedGame, AiImportResult } from '@/types/steam';

import { API_BASE } from '@/lib/config';
import { getCsrfToken, captureCsrfToken } from './csrf';

async function fetchSteamApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // In dev, use endpoint directly (Vite proxy handles /api/steam/*)
  // In prod, prepend the backend URL
  const url = API_BASE.startsWith('http') ? `${API_BASE}${endpoint}` : endpoint;

  // Attach CSRF token on mutating requests
  const method = (options?.method || 'GET').toUpperCase();
  const csrfHeaders: Record<string, string> = {};
  if (method !== 'GET' && method !== 'HEAD') {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      csrfHeaders['X-XSRF-TOKEN'] = csrfToken;
    }
  }

  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...csrfHeaders,
      ...options?.headers,
    },
  });

  // Capture CSRF token from response header (cross-origin support)
  captureCsrfToken(response);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Steam API Error: ${response.status}`);
  }

  return response.json();
}

export const steamApi = {
  /**
   * Check if Steam integration is configured on the server
   */
  getStatus: () => fetchSteamApi<SteamStatus>('/api/steam/status'),

  /**
   * Import user's Steam library
   * Requires JWT authentication - uses token from auth store automatically
   * @param steamId - Optional Steam ID (only needed for Google-auth users)
   */
  importLibrary: (steamId?: string) =>
    fetchSteamApi<SteamImportResponse>('/api/steam/import', {
      method: 'POST',
      body: JSON.stringify(steamId ? { steamId } : {}),
    }),

  /**
   * Get user's library summary and games
   * Requires JWT authentication
   */
  getLibrary: () => fetchSteamApi<UserLibraryResponse>('/api/steam/library'),

  /**
   * Get pending (untagged) games in user's library
   * Returns games imported from Steam that haven't been AI-tagged yet
   */
  getPendingGames: () => fetchSteamApi<{ pending: UnmatchedGame[]; count: number }>('/api/steam/library/pending'),
};

export const gamesApi = {
  /**
   * Get game statistics (pending, tagged, etc.)
   */
  getStats: () => fetchSteamApi<GameStats>('/admin/games/stats'),

  /**
   * Trigger AI tagging for pending games
   */
  tagPending: (gameIds?: number[]) =>
    fetchSteamApi<TaggingResult>('/admin/games/tag', {
      method: 'POST',
      body: JSON.stringify(gameIds ? { gameIds } : { all: true }),
    }),

  /**
   * Tag a single game
   */
  tagGame: (gameId: number) =>
    fetchSteamApi<TaggingResult>(`/admin/games/${gameId}/tag`, {
      method: 'POST',
    }),

  /**
   * Import unmatched games using AI
   * Takes games that weren't found in Lutem's database and creates them with AI-generated tags
   */
  aiImportGames: (games: UnmatchedGame[], unlockCode?: string) =>
    fetchSteamApi<AiImportResult>('/api/steam/ai-import', {
      method: 'POST',
      body: JSON.stringify({ games, unlockCode }),
    }),
};
