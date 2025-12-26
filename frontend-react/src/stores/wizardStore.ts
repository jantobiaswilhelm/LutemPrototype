import { create } from 'zustand';
import type {
  EmotionalGoal,
  EnergyLevel,
  Interruptibility,
  SocialPreference,
  RecommendationResponse,
} from '@/types';

// Source determines where recommendations come from
export type RecommendationSource = 'library' | 'all' | 'steamLink';

export type WizardStep = 'source' | 'time' | 'mood' | 'energy' | 'interruption' | 'social' | 'result';

interface WizardState {
  // Current step
  currentStep: WizardStep;
  isOpen: boolean;

  // Source selection (new!)
  recommendationSource: RecommendationSource;
  steamProfileUrl: string; // For 'steamLink' source option

  // Form values
  availableMinutes: number;
  selectedMoods: EmotionalGoal[];
  energyLevel: EnergyLevel | null;
  interruptibility: Interruptibility | null;
  socialPreference: SocialPreference | null;

  // Result
  recommendation: RecommendationResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  openWizard: () => void;
  closeWizard: () => void;
  resetWizard: () => void;
  setStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Setters
  setRecommendationSource: (source: RecommendationSource) => void;
  setSteamProfileUrl: (url: string) => void;
  setAvailableMinutes: (minutes: number) => void;
  toggleMood: (mood: EmotionalGoal) => void;
  setEnergyLevel: (level: EnergyLevel) => void;
  setInterruptibility: (level: Interruptibility) => void;
  setSocialPreference: (pref: SocialPreference) => void;

  // Result actions
  setRecommendation: (rec: RecommendationResponse) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const STEP_ORDER: WizardStep[] = ['source', 'time', 'mood', 'energy', 'interruption', 'social', 'result'];

const initialState = {
  currentStep: 'source' as WizardStep,
  isOpen: false,
  recommendationSource: 'all' as RecommendationSource,
  steamProfileUrl: '',
  availableMinutes: 30,
  selectedMoods: [] as EmotionalGoal[],
  energyLevel: null,
  interruptibility: null,
  socialPreference: null,
  recommendation: null,
  isLoading: false,
  error: null,
};

export const useWizardStore = create<WizardState>((set, get) => ({
  ...initialState,

  openWizard: () => set({ isOpen: true }),
  closeWizard: () => set({ isOpen: false }),
  resetWizard: () => set({ ...initialState }),

  setStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep } = get();
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      set({ currentStep: STEP_ORDER[currentIndex + 1] });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex > 0) {
      set({ currentStep: STEP_ORDER[currentIndex - 1] });
    }
  },

  setRecommendationSource: (source) => set({ recommendationSource: source }),
  setSteamProfileUrl: (url) => set({ steamProfileUrl: url }),
  setAvailableMinutes: (minutes) => set({ availableMinutes: minutes }),

  toggleMood: (mood) => {
    const { selectedMoods } = get();
    if (selectedMoods.includes(mood)) {
      set({ selectedMoods: selectedMoods.filter((m) => m !== mood) });
    } else {
      set({ selectedMoods: [...selectedMoods, mood] });
    }
  },

  setEnergyLevel: (level) => set({ energyLevel: level }),
  setInterruptibility: (level) => set({ interruptibility: level }),
  setSocialPreference: (pref) => set({ socialPreference: pref }),

  setRecommendation: (rec) => set({ recommendation: rec }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
