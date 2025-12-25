import { create } from 'zustand';
import type { RecommendationResponse } from '@/types';

interface RecommendationState {
  // Current recommendation (NOT persisted - resets on reload)
  currentRecommendation: RecommendationResponse | null;
  
  // UI state
  showAlternatives: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setRecommendation: (rec: RecommendationResponse) => void;
  clearRecommendation: () => void;
  toggleAlternatives: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useRecommendationStore = create<RecommendationState>((set) => ({
  currentRecommendation: null,
  showAlternatives: false,
  isLoading: false,
  error: null,

  setRecommendation: (rec) => set({
    currentRecommendation: rec,
    error: null,
    showAlternatives: false,
  }),

  clearRecommendation: () => set({
    currentRecommendation: null,
    showAlternatives: false,
  }),

  toggleAlternatives: () => set((state) => ({
    showAlternatives: !state.showAlternatives,
  })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
}));
