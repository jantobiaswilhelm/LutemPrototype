// Steam Integration Types

export interface SteamImportResponse {
  matched: MatchedGame[];
  unmatched: UnmatchedGame[];
  stats: ImportStats;
  steamId: string;
  message: string;
}

export interface MatchedGame {
  steamAppId: number;
  name: string;
  lutemGameId: number;
  imageUrl?: string;
  playtimeForever?: number;
  playtime2Weeks?: number;
}

export interface UnmatchedGame {
  steamAppId: number;
  name: string;
  playtimeForever?: number;
  playtime2Weeks?: number;
  iconUrl?: string;
}

export interface ImportStats {
  total: number;
  matched: number;
  unmatched: number;
  alreadyInLibrary: number;
}

export interface SteamStatus {
  configured: boolean;
  message: string;
}

export interface UserLibraryResponse {
  summary: LibrarySummary;
  games: UserLibraryGame[];
}

export interface LibrarySummary {
  totalGames: number;
  steamGames: number;
  taggedGames: number;
  untaggedGames: number;
}

export interface UserLibraryGame {
  libraryEntryId: number;
  gameId: number;
  gameName: string;
  imageUrl?: string;
  source: 'STEAM' | 'MANUAL' | 'EPIC' | 'GOG' | 'XBOX' | 'PLAYSTATION';
  steamAppId?: number;
  playtimeForever?: number;
  playtime2Weeks?: number;
  addedAt: string;
  isTagged: boolean;
  taggingSource?: 'MANUAL' | 'AI_GENERATED' | 'USER_ADJUSTED' | 'PENDING';
}

// AI Tagging Types
export interface TaggingResult {
  total: number;
  successCount: number;
  failedCount: number;
  taggedGames: TaggedGameInfo[];
  failedGames: Record<number, string>;
}

export interface TaggedGameInfo {
  id: number;
  name: string;
  steamAppId?: number;
  confidence?: number;
}

export interface GameStats {
  total: number;
  pending: number;
  manual: number;
  aiGenerated: number;
  userAdjusted: number;
  fullyTagged: number;
  aiConfigured: boolean;
}

// Helper to format playtime
export function formatPlaytime(minutes?: number): string {
  if (!minutes || minutes === 0) return 'Never played';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}
