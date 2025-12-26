import { useState, useEffect, useCallback } from 'react';
import type { ContentRating } from '@/types';

const STORAGE_KEY = 'lutem_content_preferences';

export interface ContentPreferences {
  maxContentRating: ContentRating;
  allowNsfw: boolean;
}

const defaultPreferences: ContentPreferences = {
  maxContentRating: 'MATURE',
  allowNsfw: false,
};

function loadPreferences(): ContentPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultPreferences;
}

function savePreferences(prefs: ContentPreferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

/**
 * Hook to access and manage content preferences (max content rating, NSFW filter)
 * Persists to localStorage and syncs across components
 */
export function useContentPreferences() {
  const [preferences, setPreferences] = useState<ContentPreferences>(loadPreferences);

  // Save to localStorage whenever preferences change
  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  const setMaxContentRating = useCallback((rating: ContentRating) => {
    setPreferences(prev => ({ ...prev, maxContentRating: rating }));
  }, []);

  const setAllowNsfw = useCallback((allow: boolean) => {
    setPreferences(prev => ({ ...prev, allowNsfw: allow }));
  }, []);

  const toggleNsfw = useCallback(() => {
    setPreferences(prev => ({ ...prev, allowNsfw: !prev.allowNsfw }));
  }, []);

  return {
    ...preferences,
    setMaxContentRating,
    setAllowNsfw,
    toggleNsfw,
  };
}

// Static helper for one-off reads (e.g., in API calls)
export function getContentPreferences(): ContentPreferences {
  return loadPreferences();
}
