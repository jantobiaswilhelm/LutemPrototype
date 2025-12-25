import type { SteamStatus, SteamImportResponse, UserLibraryResponse } from '@/types/steam';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function fetchSteamApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
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
   * @param steamId - 17-digit Steam ID (64-bit format)
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
