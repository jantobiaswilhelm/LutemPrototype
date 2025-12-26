import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SteamImportResponse, UserLibraryResponse, LibrarySummary, TaggingResult, GameStats } from '@/types/steam';
import { steamApi, gamesApi } from '@/api/steam';

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
  
  // AI Tagging state
  isTagging: boolean;
  taggingProgress: TaggingResult | null;
  gameStats: GameStats | null;
  
  // Actions
  checkStatus: () => Promise<boolean>;
  importLibrary: (steamId?: string) => Promise<SteamImportResponse>;
  fetchLibrary: () => Promise<void>;
  fetchGameStats: () => Promise<GameStats>;
  tagPendingGames: (gameIds?: number[]) => Promise<TaggingResult>;
  disconnect: () => void;
  clearError: () => void;
  clearTaggingProgress: () => void;
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
      isTagging: false,
      taggingProgress: null,
      gameStats: null,

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

      /**
       * Import Steam library
       * @param steamId - Optional for Google-auth users; Steam-auth users don't need this
       */
      importLibrary: async (steamId?: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await steamApi.importLibrary(steamId);
          set({ 
            lastImport: result,
            steamId: steamId || null,
            isConnected: true,
            isLoading: false,
          });
          // Fetch updated library and stats after import
          await get().fetchLibrary();
          await get().fetchGameStats();
          return result;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to import Steam library';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      fetchLibrary: async () => {
        set({ isLoading: true, error: null });
        try {
          const library = await steamApi.getLibrary();
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

      fetchGameStats: async () => {
        try {
          const stats = await gamesApi.getStats();
          set({ gameStats: stats });
          return stats;
        } catch (error) {
          console.error('Failed to fetch game stats:', error);
          throw error;
        }
      },

      tagPendingGames: async (gameIds?: number[]) => {
        set({ isTagging: true, error: null, taggingProgress: null });
        try {
          const result = await gamesApi.tagPending(gameIds);
          set({ 
            taggingProgress: result,
            isTagging: false,
          });
          // Refresh stats after tagging
          await get().fetchGameStats();
          return result;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to tag games';
          set({ error: message, isTagging: false });
          throw error;
        }
      },

      disconnect: () => {
        set({
          steamId: null,
          isConnected: false,
          library: null,
          lastImport: null,
          taggingProgress: null,
        });
      },

      clearError: () => set({ error: null }),
      
      clearTaggingProgress: () => set({ taggingProgress: null }),
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

export const useGameStats = () => useSteamStore((s) => s.gameStats);

export const useTaggingState = () => useSteamStore((s) => ({
  isTagging: s.isTagging,
  taggingProgress: s.taggingProgress,
  gameStats: s.gameStats,
}));
