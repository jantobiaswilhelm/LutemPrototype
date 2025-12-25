// Enums matching backend
export type EmotionalGoal = 
  | 'UNWIND'
  | 'RECHARGE'
  | 'LOCKING_IN'
  | 'CHALLENGE'
  | 'ADVENTURE_TIME'
  | 'PROGRESS_ORIENTED';

export type EnergyLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type Interruptibility = 'HIGH' | 'MEDIUM' | 'LOW';

export type TimeOfDay = 
  | 'MORNING'
  | 'MIDDAY'
  | 'AFTERNOON'
  | 'EVENING'
  | 'LATE_NIGHT'
  | 'ANY';

export type SocialPreference = 'SOLO' | 'COOP' | 'COMPETITIVE' | 'BOTH';

// Display data for enums
export const EMOTIONAL_GOALS: Record<EmotionalGoal, { displayName: string; emoji: string; description: string }> = {
  UNWIND: { displayName: 'Unwind and relax', emoji: '😌', description: 'Low stress, calming, meditative' },
  RECHARGE: { displayName: 'Recharge Energy', emoji: '🔋', description: 'Light engagement, mental break, refreshing' },
  LOCKING_IN: { displayName: 'Locking in', emoji: '🎯', description: 'Active focus, deep concentration, flow state' },
  CHALLENGE: { displayName: 'Challenge Myself', emoji: '⚡', description: 'High intensity, skill testing, competitive' },
  ADVENTURE_TIME: { displayName: 'Adventure Time', emoji: '🗺️', description: 'Discovery, exploration, trying new things' },
  PROGRESS_ORIENTED: { displayName: 'Progress Oriented', emoji: '🏆', description: 'Achievement-focused, building momentum, quick wins' },
};

export const ENERGY_LEVELS: Record<EnergyLevel, { displayName: string; description: string; emoji: string }> = {
  LOW: { displayName: 'Low', description: 'Exhausted - need something light', emoji: '🔋' },
  MEDIUM: { displayName: 'Medium', description: 'Normal - ready for moderate challenge', emoji: '🔋🔋' },
  HIGH: { displayName: 'High', description: 'Sharp - bring on complexity', emoji: '🔋🔋🔋' },
};

export const INTERRUPTIBILITY: Record<Interruptibility, { displayName: string; description: string; emoji: string }> = {
  HIGH: { displayName: 'Yes - Total flexibility', description: 'Can pause anytime, no progress loss', emoji: '✅' },
  MEDIUM: { displayName: 'Some pauses are fine', description: 'Can pause at save points', emoji: '⚠️' },
  LOW: { displayName: "No - I'm locked in", description: 'Cannot pause, requires full commitment', emoji: '❌' },
};

export const TIME_OF_DAY: Record<TimeOfDay, { displayName: string; timeRange: string; emoji: string }> = {
  MORNING: { displayName: 'Morning', timeRange: '6am - 12pm', emoji: '🌅' },
  MIDDAY: { displayName: 'Midday', timeRange: '12pm - 3pm', emoji: '☀️' },
  AFTERNOON: { displayName: 'Afternoon', timeRange: '3pm - 6pm', emoji: '🌤️' },
  EVENING: { displayName: 'Evening', timeRange: '6pm - 12am', emoji: '🌆' },
  LATE_NIGHT: { displayName: 'Late Night', timeRange: '12am - 6am', emoji: '🌙' },
  ANY: { displayName: 'Anytime', timeRange: 'Suitable for any time', emoji: '🕐' },
};

export const SOCIAL_PREFERENCES: Record<SocialPreference, { displayName: string; description: string; emoji: string }> = {
  SOLO: { displayName: 'Solo', description: 'Single-player experience', emoji: '🧍' },
  COOP: { displayName: 'Co-op', description: 'Play with friends cooperatively', emoji: '👥' },
  COMPETITIVE: { displayName: 'Competitive', description: 'Play against others', emoji: '⚔️' },
  BOTH: { displayName: 'Either', description: 'Supports both solo and multiplayer', emoji: '🎮' },
};

// Game type - matching backend Game entity
export interface Game {
  id: number;
  name: string;
  description?: string;
  minMinutes: number;
  maxMinutes: number;
  emotionalGoals: EmotionalGoal[];
  interruptibility: Interruptibility;
  energyRequired: EnergyLevel;
  bestTimeOfDay: TimeOfDay[];
  socialPreferences: SocialPreference[];
  genres: string[];
  imageUrl?: string;
  storeUrl?: string;
  userRating?: number;
  averageSatisfaction?: number;
  sessionCount?: number;
}


// Recommendation request - matching backend
export interface RecommendationRequest {
  availableMinutes: number;
  desiredEmotionalGoals: EmotionalGoal[];
  currentEnergyLevel: EnergyLevel;
  requiredInterruptibility: Interruptibility;
  socialPreference: SocialPreference;
  timeOfDay?: TimeOfDay;
  preferredGenres?: string[];
  userId?: string;
}

// Recommendation response - matching backend
export interface RecommendationResponse {
  topRecommendation: Game;
  alternatives: Game[];
  reason: string;
  alternativeReasons?: string[];
  topMatchPercentage?: number;
  alternativeMatchPercentages?: number[];
  sessionId?: number;
}

// Session feedback
export interface SessionFeedback {
  sessionId: number;
  satisfactionScore: number; // 1-5
  userId?: string;
  comment?: string;
}

// User types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoUrl?: string;
}

// Theme types
export type Theme = 'cafe' | 'lavender' | 'earth' | 'ocean';
export type ThemeMode = 'light' | 'dark';

// Re-export steam types
export * from './steam';
