/**
 * Lutem - State Management Module
 * Global application state
 */

// Main application state
const state = {
    selectedGoals: [],
    selectedGenres: [],
    availableMinutes: 30,
    energyLevel: null,
    interruptibility: null,
    timeOfDay: null,
    socialPreference: null,
    guidedEnergy: null,
    guidedTime: 30,
    guidedGoals: [],
    guidedInterruptibility: null
};

// Session tracking for feedback
let currentSessionId = null;

// Theme state
let currentPalette = localStorage.getItem('palette') || 'cafe';
let currentMode = localStorage.getItem('theme') || 'light';
