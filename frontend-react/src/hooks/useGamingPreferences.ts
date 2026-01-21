import { useState, useEffect, useCallback } from 'react';
import type { SocialPreference, AudioAvailability } from '@/types';

const STORAGE_KEY = 'lutem_gaming_preferences';

export interface GamingPreferences {
  // Default time available (in minutes)
  defaultTimeAvailable: number;
  // Preferred social mode
  defaultSocialPreference: SocialPreference;
  // Audio availability default
  defaultAudioAvailability: AudioAvailability;
  // Preferred genres (stored as lowercase)
  preferredGenres: string[];
}

const defaultPreferences: GamingPreferences = {
  defaultTimeAvailable: 60,
  defaultSocialPreference: 'SOLO',
  defaultAudioAvailability: 'full',
  preferredGenres: [],
};

function loadPreferences(): GamingPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultPreferences, ...parsed };
    }
  } catch {}
  return defaultPreferences;
}

function savePreferences(prefs: GamingPreferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

/**
 * Hook to access and manage gaming preferences (default time, social preference, genres)
 * Persists to localStorage and syncs across components
 */
export function useGamingPreferences() {
  const [preferences, setPreferences] = useState<GamingPreferences>(loadPreferences);

  // Save to localStorage whenever preferences change
  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  const setDefaultTimeAvailable = useCallback((minutes: number) => {
    setPreferences(prev => ({ ...prev, defaultTimeAvailable: minutes }));
  }, []);

  const setDefaultSocialPreference = useCallback((social: SocialPreference) => {
    setPreferences(prev => ({ ...prev, defaultSocialPreference: social }));
  }, []);

  const setDefaultAudioAvailability = useCallback((audio: AudioAvailability) => {
    setPreferences(prev => ({ ...prev, defaultAudioAvailability: audio }));
  }, []);

  const setPreferredGenres = useCallback((genres: string[]) => {
    setPreferences(prev => ({ ...prev, preferredGenres: genres }));
  }, []);

  const toggleGenre = useCallback((genre: string) => {
    setPreferences(prev => {
      const normalized = genre.toLowerCase();
      const current = prev.preferredGenres;
      const exists = current.includes(normalized);
      return {
        ...prev,
        preferredGenres: exists
          ? current.filter(g => g !== normalized)
          : [...current, normalized],
      };
    });
  }, []);

  return {
    ...preferences,
    setDefaultTimeAvailable,
    setDefaultSocialPreference,
    setDefaultAudioAvailability,
    setPreferredGenres,
    toggleGenre,
  };
}

// Static helper for one-off reads
export function getGamingPreferences(): GamingPreferences {
  return loadPreferences();
}
