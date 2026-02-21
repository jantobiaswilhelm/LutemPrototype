import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SteamImportResponse, UserLibraryResponse, LibrarySummary, TaggingResult, GameStats, UnmatchedGame, AiImportResult } from '@/types/steam';
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
  pendingGames: UnmatchedGame[];  // Games in library that need AI tagging
  
  // AI Tagging state
  isTagging: boolean;
  taggingProgress: TaggingResult | null;
  gameStats: GameStats | null;
  
  // AI Import state (for unmatched games)
  isAiImporting: boolean;
  aiImportResult: AiImportResult | null;
  
  // Actions
  checkStatus: () => Promise<boolean>;
  importLibrary: (steamId?: string) => Promise<SteamImportResponse>;
  fetchLibrary: () => Promise<void>;
  fetchPendingGames: () => Promise<void>;
  fetchGameStats: () => Promise<GameStats>;
  tagPendingGames: (gameIds?: number[]) => Promise<TaggingResult>;
  aiImportGames: (games: UnmatchedGame[], unlockCode?: string) => Promise<AiImportResult>;
  disconnect: () => void;
  clearError: () => void;
  clearTaggingProgress: () => void;
  clearAiImportResult: () => void;
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
      pendingGames: [],
      isTagging: false,
      taggingProgress: null,
      gameStats: null,
      isAiImporting: false,
      aiImportResult: null,

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

      fetchPendingGames: async () => {
        try {
          const result = await steamApi.getPendingGames();
          set({ pendingGames: result.pending });
        } catch (error) {
          console.error('Failed to fetch pending games:', error);
          // Don't set error - this is a background fetch
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
          // Refresh library and stats after tagging so badges update
          await get().fetchLibrary();
          await get().fetchGameStats();
          return result;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to tag games';
          set({ error: message, isTagging: false });
          throw error;
        }
      },

      aiImportGames: async (games: UnmatchedGame[], unlockCode?: string) => {
        set({ isAiImporting: true, error: null, aiImportResult: null });
        try {
          const result = await gamesApi.aiImportGames(games, unlockCode);
          set({ 
            aiImportResult: result,
            isAiImporting: false,
            pendingGames: [],  // Clear pending games after successful import
          });
          // Clear unmatched from lastImport after successful import
          const currentLastImport = get().lastImport;
          if (currentLastImport) {
            set({
              lastImport: {
                ...currentLastImport,
                unmatched: [],
                stats: {
                  ...currentLastImport.stats,
                  unmatched: 0,
                },
              },
            });
          }
          // Refresh library and stats
          await get().fetchLibrary();
          await get().fetchGameStats();
          return result;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to import games with AI';
          set({ error: message, isAiImporting: false });
          throw error;
        }
      },

      disconnect: () => {
        set({
          steamId: null,
          isConnected: false,
          library: null,
          lastImport: null,
          pendingGames: [],
          taggingProgress: null,
          aiImportResult: null,
        });
      },

      clearError: () => set({ error: null }),
      
      clearTaggingProgress: () => set({ taggingProgress: null }),
      
      clearAiImportResult: () => set({ aiImportResult: null }),
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

export const usePendingGames = () => useSteamStore((s) => s.pendingGames);
