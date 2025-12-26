import type { SteamStatus, SteamImportResponse, UserLibraryResponse, TaggingResult, GameStats } from '@/types/steam';
import { useAuthStore } from '@/stores/authStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Get JWT token from auth store
 */
function getAuthToken(): string | null {
  return useAuthStore.getState().token;
}

/**
 * Steam API fetch wrapper
 * 
 * Dev: Vite proxy forwards /api/steam/* to localhost:8080 without rewriting
 * Prod: Prepend the full backend URL
 */
async function fetchSteamApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // In dev, use endpoint directly (Vite proxy handles /api/steam/*)
  // In prod, prepend the backend URL
  const url = API_BASE.startsWith('http') ? `${API_BASE}${endpoint}` : endpoint;
  
  const token = getAuthToken();
  
  console.log(`[Steam API] Calling ${url}`, token ? '(with auth)' : '(no auth)');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

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
};
