import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SteamImportResponse, UserLibraryResponse, LibrarySummary } from '@/types/steam';
import { steamApi } from '@/api/steam';

interface SteamState {
  // Status
  isConfigured: boolean | null;
  isLoading: boolean;
  error: string | null;
  
  // User's Steam connection
  steamId: string | null;
  isConnected: boolean;
  
  // Library data
  library: UserLibraryResponse | null;
  lastImport: SteamImportResponse | null;
  
  // Actions
  checkStatus: () => Promise<boolean>;
  importLibrary: (steamId: string, firebaseUid: string) => Promise<SteamImportResponse>;
  fetchLibrary: (firebaseUid: string) => Promise<void>;
  disconnect: () => void;
  clearError: () => void;
}

export const useSteamStore = create<SteamState>()(
  persist(
    (set, get) => ({
      // Initial state
      isConfigured: null,
      isLoading: false,
      error: null,
      steamId: null,
      isConnected: false,
      library: null,
      lastImport: null,

      checkStatus: async () => {
        try {
          const status = await steamApi.getStatus();
          set({ isConfigured: status.configured });
          return status.configured;
        } catch (error) {
          console.error('Failed to check Steam status:', error);
          set({ isConfigured: false });
          return false;
        }
      },

      importLibrary: async (steamId: string, firebaseUid: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await steamApi.importLibrary(steamId, firebaseUid);
          set({ 
            lastImport: result,
            steamId: steamId,
            isConnected: true,
            isLoading: false,
          });
          // Fetch updated library after import
          await get().fetchLibrary(firebaseUid);
          return result;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to import Steam library';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      fetchLibrary: async (firebaseUid: string) => {
        set({ isLoading: true, error: null });
        try {
          const library = await steamApi.getLibrary(firebaseUid);
          set({ 
            library,
            isConnected: library.summary.steamGames > 0,
            isLoading: false,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch library';
          set({ error: message, isLoading: false });
        }
      },

      disconnect: () => {
        set({
          steamId: null,
          isConnected: false,
          library: null,
          lastImport: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'lutem-steam',
      partialize: (state) => ({
        steamId: state.steamId,
        isConnected: state.isConnected,
      }),
    }
  )
);

// Selector hooks for convenience
export const useSteamStatus = () => useSteamStore((s) => ({
  isConfigured: s.isConfigured,
  isConnected: s.isConnected,
  isLoading: s.isLoading,
}));

export const useSteamLibrary = () => useSteamStore((s) => s.library);

export const useLibrarySummary = (): LibrarySummary | null => 
  useSteamStore((s) => s.library?.summary ?? null);
