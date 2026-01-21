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

// New attributes from AI tagging system
export type AudioDependency = 'REQUIRED' | 'HELPFUL' | 'OPTIONAL';
export type ContentRating = 'EVERYONE' | 'TEEN' | 'MATURE' | 'ADULT';
export type NsfwLevel = 'NONE' | 'SUGGESTIVE' | 'EXPLICIT';

// User's audio availability (for wizard - contextual per session)
export type AudioAvailability = 'full' | 'low' | 'muted';

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

// Display data for new attributes
export const AUDIO_DEPENDENCY: Record<AudioDependency, { displayName: string; emoji: string; description: string }> = {
  REQUIRED: { displayName: 'Sound Required', emoji: '🔊', description: 'Audio cues essential for gameplay' },
  HELPFUL: { displayName: 'Sound Helpful', emoji: '🔉', description: 'Better with sound but playable muted' },
  OPTIONAL: { displayName: 'Sound Optional', emoji: '🔇', description: 'Fully playable without sound' },
};

export const CONTENT_RATING: Record<ContentRating, { displayName: string; emoji: string; description: string }> = {
  EVERYONE: { displayName: 'Everyone', emoji: '👨‍👩‍👧‍👦', description: 'Suitable for all ages' },
  TEEN: { displayName: 'Teen', emoji: '🧑', description: 'Mild violence, some language' },
  MATURE: { displayName: 'Mature', emoji: '🔞', description: 'Violence, strong language, mature themes' },
  ADULT: { displayName: 'Adult Only', emoji: '⛔', description: 'Intense violence, explicit content' },
};

export const NSFW_LEVEL: Record<NsfwLevel, { displayName: string; emoji: string; description: string }> = {
  NONE: { displayName: 'None', emoji: '✅', description: 'No sexual content' },
  SUGGESTIVE: { displayName: 'Suggestive', emoji: '💋', description: 'Revealing outfits, innuendo' },
  EXPLICIT: { displayName: 'Explicit', emoji: '🔥', description: 'Sexual content' },
};

export const AUDIO_AVAILABILITY: Record<AudioAvailability, { displayName: string; emoji: string; description: string }> = {
  full: { displayName: 'Yes, full volume', emoji: '🔊', description: 'Can use headphones or speakers' },
  low: { displayName: 'Quiet only', emoji: '🔉', description: 'Low volume or background audio' },
  muted: { displayName: 'No sound', emoji: '🔇', description: 'Completely muted' },
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
  // Steam integration
  steamAppId?: number;
  taggingSource?: 'MANUAL' | 'AI_GENERATED' | 'USER_ADJUSTED' | 'PENDING';
  taggingConfidence?: number;
  rawgId?: number;
  // New AI tagging attributes
  audioDependency?: AudioDependency;
  contentRating?: ContentRating;
  nsfwLevel?: NsfwLevel;
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
  // New filter parameters
  audioAvailability?: AudioAvailability;
  maxContentRating?: ContentRating;
  allowNsfw?: boolean;
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

// Session history for the sessions page
export interface SessionHistory {
  id: number;
  gameId: number;
  gameName: string;
  gameImageUrl?: string;
  startedAt?: string; // ISO date string
  recommendedAt: string; // ISO date string
  satisfactionScore?: number; // 1-5, null if not rated
  feedbackAt?: string; // ISO date string
  desiredMood?: string;
  availableMinutes?: number;
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
