import type { SteamStatus, SteamImportResponse, UserLibraryResponse } from '@/types/steam';

// Note: Steam endpoints are at /api/steam/* on backend
// Vite proxy forwards /api/* to backend without rewriting

async function fetchSteamApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
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
   * @param steamId - 17-digit Steam ID (64-bit format) or vanity URL
   * @param firebaseUid - User's Firebase UID for authentication
   */
  importLibrary: (steamId: string, firebaseUid: string) =>
    fetchSteamApi<SteamImportResponse>('/api/steam/import', {
      method: 'POST',
      headers: {
        'X-Firebase-UID': firebaseUid,
      },
      body: JSON.stringify({ steamId }),
    }),

  /**
   * Get user's library summary and games
   * @param firebaseUid - User's Firebase UID
   */
  getLibrary: (firebaseUid: string) =>
    fetchSteamApi<UserLibraryResponse>('/api/steam/library', {
      headers: {
        'X-Firebase-UID': firebaseUid,
      },
    }),
};
