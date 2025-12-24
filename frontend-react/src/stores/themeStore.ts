import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme, ThemeMode } from '@/types';

interface ThemeState {
  theme: Theme;
  mode: ThemeMode;
  setTheme: (theme: Theme) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'ocean',
      mode: 'dark',
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme, get().mode);
      },
      setMode: (mode) => {
        set({ mode });
        applyTheme(get().theme, mode);
      },
      toggleMode: () => {
        const newMode = get().mode === 'light' ? 'dark' : 'light';
        set({ mode: newMode });
        applyTheme(get().theme, newMode);
      },
    }),
    {
      name: 'lutem-theme',
      onRehydrateStorage: () => (state) => {
        // Apply theme after rehydration from localStorage
        if (state) {
          applyTheme(state.theme, state.mode);
        }
      },
    }
  )
);

// Apply theme to DOM
function applyTheme(theme: Theme, mode: ThemeMode) {
  const root = document.documentElement;
  
  // Set data-theme attribute for CSS selectors
  root.setAttribute('data-theme', theme);
  
  // Toggle dark class
  if (mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

// Initialize theme on app load
export function initializeTheme() {
  const stored = localStorage.getItem('lutem-theme');
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      applyTheme(state.theme || 'ocean', state.mode || 'dark');
    } catch {
      applyTheme('ocean', 'dark');
    }
  } else {
    applyTheme('ocean', 'dark');
  }
}
